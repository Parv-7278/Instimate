import { NextResponse } from 'next/server';
import { UserItineraryPreferences } from '@/types/eventroute';

// In-memory persistent cache for server session
let savedPreferences: UserItineraryPreferences = {
  interests: ['coding', 'workshops'],
  experienceLevel: 'intermediate',
  pace: 'balanced',
  timeAvailability: 'full_day',
  preferredVenues: ['hall-a', 'hall-b'],
  avoidCrowds: false,
};

export async function GET() {
  return NextResponse.json({
    success: true,
    preferences: savedPreferences,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || !Array.isArray(body.interests)) {
      return NextResponse.json(
        { error: 'Invalid preferences payload: interests array is required' },
        { status: 400 }
      );
    }

    savedPreferences = {
      interests: body.interests,
      experienceLevel: body.experienceLevel || 'all',
      pace: body.pace || 'balanced',
      timeAvailability: body.timeAvailability || 'full_day',
      preferredVenues: body.preferredVenues || [],
      avoidCrowds: Boolean(body.avoidCrowds),
      selectedEventIds: body.selectedEventIds || [],
    };

    return NextResponse.json({
      success: true,
      message: 'Preferences saved successfully',
      preferences: savedPreferences,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update preferences', details: String(error) },
      { status: 500 }
    );
  }
}
