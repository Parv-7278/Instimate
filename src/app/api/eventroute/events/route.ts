import { NextResponse } from 'next/server';
import { EVENT_SESSIONS, VENUE_ROOMS } from '@/lib/eventroute/seedData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const venueId = searchParams.get('venueId');

    let filtered = [...EVENT_SESSIONS];

    if (category && category !== 'all') {
      filtered = filtered.filter((s) => s.category === category);
    }

    if (venueId) {
      filtered = filtered.filter((s) => s.venueId === venueId);
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.speaker.name.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({
      success: true,
      total: filtered.length,
      events: filtered,
      venues: VENUE_ROOMS,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to retrieve event catalogue', details: String(error) },
      { status: 500 }
    );
  }
}
