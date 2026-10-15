export type EventCategory =
  | 'coding'
  | 'gaming'
  | 'music'
  | 'entrepreneurship'
  | 'workshops'
  | 'security'
  | 'design'
  | 'robotics';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'all';

export type PacePreference = 'relaxed' | 'balanced' | 'intensive';

export type TimeAvailability = 'full_day' | 'morning' | 'afternoon';

export type CongestionStatus = 'low' | 'moderate' | 'congested';

export interface UserItineraryPreferences {
  interests: EventCategory[];
  experienceLevel: ExperienceLevel;
  pace: PacePreference;
  timeAvailability: TimeAvailability;
  preferredVenues: string[];
  avoidCrowds: boolean;
  selectedEventIds?: string[];
}

export interface Speaker {
  name: string;
  role: string;
  company: string;
  avatarUrl?: string;
  bio?: string;
}

export interface VenueRoom {
  id: string;
  name: string;
  code: string;
  building: string;
  floor: number;
  capacity: number;
  currentOccupancy: number;
  congestionStatus: CongestionStatus;
  coordinates: { x: number; y: number };
  width?: number;
  height?: number;
  colorTheme?: string;
  description: string;
  facilities: string[];
}

export interface EventSession {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  track: string;
  speaker: Speaker;
  venueId: string;
  venueName: string;
  startTime: string; // e.g. "10:00 AM"
  endTime: string;   // e.g. "11:15 AM"
  startMinutes: number; // minutes from 08:00 (e.g. 120 = 10:00 AM)
  endMinutes: number;   // minutes from 08:00 (e.g. 195 = 11:15 AM)
  durationMinutes: number;
  experienceLevel: ExperienceLevel;
  capacity: number;
  registeredCount: number;
  popularityScore: number; // 0 - 100
  tags: string[];
  isBookmarked?: boolean;
}

export interface ItinerarySlot {
  id: string;
  type: 'session' | 'break' | 'transition';
  session?: EventSession;
  title: string;
  startTime: string;
  endTime: string;
  startMinutes: number;
  endMinutes: number;
  venueName?: string;
  venueId?: string;
  transitionTimeMinutes?: number;
  distanceMeters?: number;
  notes?: string;
  isCustom?: boolean;
}

export interface GeneratedItinerary {
  id: string;
  generatedAt: string;
  preferences: UserItineraryPreferences;
  slots: ItinerarySlot[];
  totalSessions: number;
  totalBreakMinutes: number;
  totalWalkingMinutes: number;
  totalWalkingMeters: number;
  conflictsResolvedCount: number;
}

export interface CrowdDensityUpdate {
  venueId: string;
  currentOccupancy: number;
  capacity: number;
  occupancyPercentage: number;
  congestionStatus: CongestionStatus;
  trend: 'rising' | 'steady' | 'dropping';
  lastUpdated: string;
}

export interface PathfindingNode {
  id: string;
  label: string;
  x: number;
  y: number;
  isVenue?: boolean;
  venueId?: string;
  neighbors: {
    targetId: string;
    distanceMeters: number;
  }[];
}

export interface RouteNavigationStep {
  stepNumber: number;
  instruction: string;
  distanceMeters: number;
  waypointName: string;
  direction: 'straight' | 'left' | 'right' | 'arrive';
}

export interface RoutePlan {
  originId: string;
  originName: string;
  destinationId: string;
  destinationName: string;
  pathNodeIds: string[];
  pathCoordinates: { x: number; y: number }[];
  totalDistanceMeters: number;
  estimatedWalkingMinutes: number;
  steps: RouteNavigationStep[];
  passesCongestedZone: boolean;
  alternativeAvailable: boolean;
}

export interface ProactiveAlert {
  id: string;
  type: 'starting_soon' | 'leave_now' | 'crowd_warning' | 'session_update';
  title: string;
  message: string;
  sessionId?: string;
  sessionTitle?: string;
  venueId: string;
  venueName: string;
  startsInMinutes: number;
  estimatedWalkMinutes: number;
  distanceMeters: number;
  createdAt: string;
  read: boolean;
  dismissed: boolean;
}
