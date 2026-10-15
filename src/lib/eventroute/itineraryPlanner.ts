import {
  EventSession,
  UserItineraryPreferences,
  GeneratedItinerary,
  ItinerarySlot,
  VenueRoom,
} from '@/types/eventroute';
import { EVENT_SESSIONS, VENUE_ROOMS } from './seedData';
import { getTransitTimeBetweenVenues } from './pathfinding';

/**
 * Calculates a match score (0 - 100+) between a session and user preferences
 */
export function scoreSessionForUser(
  session: EventSession,
  preferences: UserItineraryPreferences
): number {
  let score = 0;

  // 1. Core Category Match (Dominant Factor)
  if (preferences.interests.includes(session.category)) {
    score += 50;
  }

  // 2. Secondary Tag Match
  const matchingTags = session.tags.filter((tag) =>
    preferences.interests.some((interest) =>
      tag.toLowerCase().includes(interest.toLowerCase()) ||
      interest.toLowerCase().includes(tag.toLowerCase())
    )
  );
  score += Math.min(20, matchingTags.length * 7);

  // 3. Experience Level Alignment
  if (
    preferences.experienceLevel === 'all' ||
    session.experienceLevel === 'all'
  ) {
    score += 15;
  } else if (preferences.experienceLevel === session.experienceLevel) {
    score += 20;
  } else {
    score += 5; // Slight mismatch but still viable
  }

  // 4. Popularity & Speaker Reputation
  score += Math.round((session.popularityScore / 100) * 15);

  // 5. Preferred Venue Affinity
  if (preferences.preferredVenues.includes(session.venueId)) {
    score += 10;
  }

  // 6. Explicitly User-Selected Bookmarks
  if (preferences.selectedEventIds?.includes(session.id)) {
    score += 100; // Prioritize explicitly favorited sessions
  }

  return score;
}

/**
 * Intelligent conflict-free itinerary generation algorithm
 */
export function generateSmartItinerary(
  preferences: UserItineraryPreferences,
  sessions: EventSession[] = EVENT_SESSIONS,
  rooms: VenueRoom[] = VENUE_ROOMS
): GeneratedItinerary {
  // 1. Filter sessions by time availability
  let candidateSessions = [...sessions];

  if (preferences.timeAvailability === 'morning') {
    // 09:00 AM (60m from 08:00) to 01:00 PM (300m)
    candidateSessions = candidateSessions.filter((s) => s.startMinutes < 300);
  } else if (preferences.timeAvailability === 'afternoon') {
    // 01:00 PM (300m) onwards
    candidateSessions = candidateSessions.filter((s) => s.startMinutes >= 270);
  }

  // 2. Score all candidate sessions
  const scoredSessions = candidateSessions
    .map((session) => ({
      session,
      score: scoreSessionForUser(session, preferences),
    }))
    .filter((item) => item.score > 25) // Filter out completely unrelated sessions
    .sort((a, b) => b.score - a.score);

  // 3. Greedy conflict-free scheduling with transit cushion
  const acceptedSessions: EventSession[] = [];
  let conflictsResolvedCount = 0;

  // Pace buffer configuration
  const minBufferMinutes =
    preferences.pace === 'relaxed' ? 30 : preferences.pace === 'balanced' ? 15 : 8;

  for (const { session } of scoredSessions) {
    // Check for collisions with already accepted sessions
    let hasConflict = false;

    for (const accepted of acceptedSessions) {
      // Overlap condition
      const directOverlap =
        session.startMinutes < accepted.endMinutes &&
        session.endMinutes > accepted.startMinutes;

      if (directOverlap) {
        hasConflict = true;
        break;
      }

      // Transition walk time check
      const transit = getTransitTimeBetweenVenues(accepted.venueId, session.venueId, rooms);
      const requiredCushion = Math.max(minBufferMinutes, transit.walkMinutes + 5);

      if (session.startMinutes >= accepted.endMinutes) {
        // session is after accepted
        const buffer = session.startMinutes - accepted.endMinutes;
        if (buffer < requiredCushion) {
          hasConflict = true;
          break;
        }
      } else if (session.endMinutes <= accepted.startMinutes) {
        // session is before accepted
        const buffer = accepted.startMinutes - session.endMinutes;
        if (buffer < requiredCushion) {
          hasConflict = true;
          break;
        }
      }
    }

    if (!hasConflict) {
      acceptedSessions.push(session);
    } else {
      conflictsResolvedCount++;
    }
  }

  // Sort accepted sessions chronologically
  acceptedSessions.sort((a, b) => a.startMinutes - b.startMinutes);

  // 4. Build timeline slots including transit cards and break recommendations
  const slots: ItinerarySlot[] = [];
  let totalWalkingMinutes = 0;
  let totalWalkingMeters = 0;
  let totalBreakMinutes = 0;

  for (let i = 0; i < acceptedSessions.length; i++) {
    const current = acceptedSessions[i];

    // Check if we need to insert a Lunch Break (around 12:30 - 01:30 PM, i.e. 270 - 330 mins)
    if (
      preferences.timeAvailability === 'full_day' &&
      i > 0 &&
      acceptedSessions[i - 1].endMinutes <= 285 &&
      current.startMinutes >= 330 &&
      !slots.some((s) => s.title.includes('Lunch'))
    ) {
      const lunchSlot: ItinerarySlot = {
        id: 'slot-lunch-break',
        type: 'break',
        title: '🍽️ Recommended Lunch & Informal Networking',
        startTime: '12:30 PM',
        endTime: '01:30 PM',
        startMinutes: 270,
        endMinutes: 330,
        venueName: 'Central Food Court & Lounge',
        venueId: 'food-court',
        notes: 'Enjoy artisan bites, recharge devices, and chat with fellow attendees.',
      };
      slots.push(lunchSlot);
      totalBreakMinutes += 60;
    }

    // Check gap between previous item and current
    if (i > 0) {
      const prev = acceptedSessions[i - 1];
      const gap = current.startMinutes - prev.endMinutes;
      const transit = getTransitTimeBetweenVenues(prev.venueId, current.venueId, rooms);

      totalWalkingMinutes += transit.walkMinutes;
      totalWalkingMeters += transit.distanceMeters;

      if (transit.walkMinutes > 0 && prev.venueId !== current.venueId) {
        slots.push({
          id: `transit-${prev.id}-${current.id}`,
          type: 'transition',
          title: `Walk to ${current.venueName}`,
          startTime: prev.endTime,
          endTime: current.startTime,
          startMinutes: prev.endMinutes,
          endMinutes: current.startMinutes,
          venueName: current.venueName,
          venueId: current.venueId,
          transitionTimeMinutes: transit.walkMinutes,
          distanceMeters: transit.distanceMeters,
          notes: `Shortest route: ~${transit.distanceMeters}m (${transit.walkMinutes} min walk). Follow East/West concourse markers.`,
        });
      }

      // If gap is large (> 40 mins) and not during lunch, suggest a coffee/expo exploration break
      if (gap > 45 && preferences.pace !== 'intensive') {
        const breakMins = gap - transit.walkMinutes;
        totalBreakMinutes += breakMins;
        slots.push({
          id: `break-${prev.id}`,
          type: 'break',
          title: '☕ Networking & Demo Alley Exploration',
          startTime: prev.endTime,
          endTime: current.startTime,
          startMinutes: prev.endMinutes + transit.walkMinutes,
          endMinutes: current.startMinutes,
          venueName: 'Demo Alley & Lounge D',
          venueId: 'demo-alley',
          notes: 'Explore hardware booths, investor tables, and grab espresso.',
        });
      }
    }

    // Add session slot
    slots.push({
      id: `slot-${current.id}`,
      type: 'session',
      session: current,
      title: current.title,
      startTime: current.startTime,
      endTime: current.endTime,
      startMinutes: current.startMinutes,
      endMinutes: current.endMinutes,
      venueName: current.venueName,
      venueId: current.venueId,
      notes: `${current.speaker.name} (${current.speaker.company}) • ${current.track}`,
    });
  }

  return {
    id: `itinerary-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    preferences,
    slots,
    totalSessions: acceptedSessions.length,
    totalBreakMinutes,
    totalWalkingMinutes,
    totalWalkingMeters,
    conflictsResolvedCount,
  };
}
