import { NextResponse } from 'next/server';
import { CrowdDensityUpdate, CongestionStatus } from '@/types/eventroute';
import { VENUE_ROOMS } from '@/lib/eventroute/seedData';

// Mutable in-memory density state map
const densityStore = new Map<string, CrowdDensityUpdate>();

function initDensityStore() {
  if (densityStore.size === 0) {
    VENUE_ROOMS.forEach((r) => {
      const pct = Math.round((r.currentOccupancy / r.capacity) * 100);
      densityStore.set(r.id, {
        venueId: r.id,
        currentOccupancy: r.currentOccupancy,
        capacity: r.capacity,
        occupancyPercentage: pct,
        congestionStatus: r.congestionStatus,
        trend: 'steady',
        lastUpdated: new Date().toISOString(),
      });
    });
  }
}

export async function GET() {
  initDensityStore();
  const densityList = Array.from(densityStore.values());
  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    densities: densityList,
  });
}

export async function POST(request: Request) {
  try {
    initDensityStore();
    const body = await request.json();

    // If body specifies a simulated fluctuation
    if (body.simulateRandom) {
      densityStore.forEach((val, venueId) => {
        const delta = Math.floor(Math.random() * 41) - 20; // -20 to +20
        const newOcc = Math.max(20, Math.min(val.capacity, val.currentOccupancy + delta));
        const pct = Math.round((newOcc / val.capacity) * 100);

        let status: CongestionStatus = 'low';
        if (pct >= 80) status = 'congested';
        else if (pct >= 45) status = 'moderate';

        const trend = delta > 5 ? 'rising' : delta < -5 ? 'dropping' : 'steady';

        densityStore.set(venueId, {
          ...val,
          currentOccupancy: newOcc,
          occupancyPercentage: pct,
          congestionStatus: status,
          trend,
          lastUpdated: new Date().toISOString(),
        });
      });

      return NextResponse.json({
        success: true,
        message: 'Crowd density successfully simulated across all venues',
        densities: Array.from(densityStore.values()),
      });
    }

    // Specific room update
    const { venueId, occupancy } = body;
    if (!venueId || typeof occupancy !== 'number') {
      return NextResponse.json(
        { error: 'venueId and numeric occupancy are required' },
        { status: 400 }
      );
    }

    const current = densityStore.get(venueId);
    if (!current) {
      return NextResponse.json({ error: `Venue '${venueId}' not found` }, { status: 404 });
    }

    const newOcc = Math.max(0, Math.min(current.capacity, occupancy));
    const pct = Math.round((newOcc / current.capacity) * 100);

    let status: CongestionStatus = 'low';
    if (pct >= 80) status = 'congested';
    else if (pct >= 45) status = 'moderate';

    const updated: CrowdDensityUpdate = {
      ...current,
      currentOccupancy: newOcc,
      occupancyPercentage: pct,
      congestionStatus: status,
      trend: newOcc > current.currentOccupancy ? 'rising' : 'dropping',
      lastUpdated: new Date().toISOString(),
    };

    densityStore.set(venueId, updated);

    return NextResponse.json({
      success: true,
      message: `Crowd density updated for ${venueId}`,
      density: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update crowd density', details: String(error) },
      { status: 500 }
    );
  }
}
