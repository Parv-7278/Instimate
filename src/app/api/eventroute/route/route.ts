import { NextResponse } from 'next/server';
import { findShortestPath } from '@/lib/eventroute/pathfinding';
import { VENUE_ROOMS } from '@/lib/eventroute/seedData';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { originId, destinationId, avoidCongestion = false } = body;

    if (!originId || !destinationId) {
      return NextResponse.json(
        { error: 'originId and destinationId are required' },
        { status: 400 }
      );
    }

    const routePlan = findShortestPath(originId, destinationId, {
      avoidCongestion: Boolean(avoidCongestion),
      venueRooms: VENUE_ROOMS,
    });

    if (!routePlan) {
      return NextResponse.json(
        { error: 'No indoor path found between the specified locations' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      route: routePlan,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to compute shortest route', details: String(error) },
      { status: 500 }
    );
  }
}
