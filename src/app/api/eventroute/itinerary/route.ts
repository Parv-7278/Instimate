import { NextResponse } from 'next/server';
import { UserItineraryPreferences } from '@/types/eventroute';
import { generateSmartItinerary } from '@/lib/eventroute/itineraryPlanner';
import { EVENT_SESSIONS, VENUE_ROOMS } from '@/lib/eventroute/seedData';

export async function POST(request: Request) {
  try {
    const preferences: UserItineraryPreferences = await request.json();

    if (!preferences || !Array.isArray(preferences.interests)) {
      return NextResponse.json(
        { error: 'Valid user preferences with an interests array are required' },
        { status: 400 }
      );
    }

    const itinerary = generateSmartItinerary(preferences, EVENT_SESSIONS, VENUE_ROOMS);

    return NextResponse.json({
      success: true,
      itinerary,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate itinerary schedule', details: String(error) },
      { status: 500 }
    );
  }
}
