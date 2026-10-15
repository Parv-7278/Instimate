'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  EventSession,
  VenueRoom,
  UserItineraryPreferences,
  GeneratedItinerary,
  RoutePlan,
  ProactiveAlert,
  CrowdDensityUpdate,
} from '@/types/eventroute';
import { EVENT_SESSIONS, VENUE_ROOMS, PATHFINDING_GRAPH } from './seedData';
import { generateSmartItinerary } from './itineraryPlanner';
import { findShortestPath, getTransitTimeBetweenVenues } from './pathfinding';

interface EventRouteContextType {
  // Event Catalog & Bookmarks
  sessions: EventSession[];
  bookmarkedSessionIds: string[];
  toggleBookmark: (sessionId: string) => void;

  // Venues & Crowd Density
  venueRooms: VenueRoom[];
  refreshCrowdDensity: (simulateRandom?: boolean) => Promise<void>;
  updateRoomOccupancy: (venueId: string, occupancy: number) => Promise<void>;
  isLoadingDensity: boolean;

  // Onboarding & Preferences
  preferences: UserItineraryPreferences;
  updatePreferences: (newPrefs: Partial<UserItineraryPreferences>) => void;
  isPlannerModalOpen: boolean;
  setIsPlannerModalOpen: (open: boolean) => void;

  // Itinerary
  itinerary: GeneratedItinerary | null;
  isGeneratingItinerary: boolean;
  generateItinerary: (customPrefs?: UserItineraryPreferences) => Promise<void>;
  removeItinerarySlot: (slotId: string) => void;

  // Pathfinding & User Location
  userLocation: string; // venueId or nodeId
  setUserLocation: (locationId: string) => void;
  activeRoute: RoutePlan | null;
  calculateRoute: (
    originId: string,
    destinationId: string,
    avoidCongestion?: boolean
  ) => RoutePlan | null;
  clearRoute: () => void;
  selectedDestination: string | null;
  setSelectedDestination: (destinationId: string | null) => void;

  // Proactive Alerts & Notification Center
  alerts: ProactiveAlert[];
  dismissAlert: (alertId: string) => void;
  markAlertRead: (alertId: string) => void;
  isAlertsDrawerOpen: boolean;
  setIsAlertsDrawerOpen: (open: boolean) => void;
  unreadAlertsCount: number;
  triggerQuickNavigation: (targetVenueId: string) => void;
}

const EventRouteContext = createContext<EventRouteContextType | undefined>(undefined);

const DEFAULT_PREFERENCES: UserItineraryPreferences = {
  interests: ['coding', 'workshops', 'gaming'],
  experienceLevel: 'intermediate',
  pace: 'balanced',
  timeAvailability: 'full_day',
  preferredVenues: ['hall-a', 'hall-b', 'arena-c'],
  avoidCrowds: false,
};

export const EventRouteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<EventSession[]>(EVENT_SESSIONS);
  const [bookmarkedSessionIds, setBookmarkedSessionIds] = useState<string[]>([]);
  const [venueRooms, setVenueRooms] = useState<VenueRoom[]>(VENUE_ROOMS);
  const [isLoadingDensity, setIsLoadingDensity] = useState(false);

  const [preferences, setPreferences] = useState<UserItineraryPreferences>(DEFAULT_PREFERENCES);
  const [isPlannerModalOpen, setIsPlannerModalOpen] = useState(false);

  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [isGeneratingItinerary, setIsGeneratingItinerary] = useState(false);

  // Default initial location: Grand Atrium Entrance
  const [userLocation, setUserLocation] = useState<string>('atrium-reg');
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [activeRoute, setActiveRoute] = useState<RoutePlan | null>(null);

  const [alerts, setAlerts] = useState<ProactiveAlert[]>([]);
  const [isAlertsDrawerOpen, setIsAlertsDrawerOpen] = useState(false);

  // Load persisted state from localStorage on initial render
  useEffect(() => {
    try {
      const savedPrefs = localStorage.getItem('eventroute_preferences');
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
      }

      const savedBookmarks = localStorage.getItem('eventroute_bookmarks');
      if (savedBookmarks) {
        setBookmarkedSessionIds(JSON.parse(savedBookmarks));
      }

      const savedItinerary = localStorage.getItem('eventroute_itinerary');
      if (savedItinerary) {
        setItinerary(JSON.parse(savedItinerary));
      } else {
        // Auto-generate initial demo itinerary for instant wow factor
        const initial = generateSmartItinerary(DEFAULT_PREFERENCES, EVENT_SESSIONS, VENUE_ROOMS);
        setItinerary(initial);
      }

      const savedLoc = localStorage.getItem('eventroute_user_loc');
      if (savedLoc) {
        setUserLocation(savedLoc);
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
  }, []);

  // Update bookmarks helper
  const toggleBookmark = (sessionId: string) => {
    setBookmarkedSessionIds((prev) => {
      const next = prev.includes(sessionId)
        ? prev.filter((id) => id !== sessionId)
        : [...prev, sessionId];
      try {
        localStorage.setItem('eventroute_bookmarks', JSON.stringify(next));
      } catch (e) {
        // ignore
      }
      return next;
    });
  };

  // Preference updates with sync
  const updatePreferences = (newPrefs: Partial<UserItineraryPreferences>) => {
    setPreferences((prev) => {
      const updated = { ...prev, ...newPrefs };
      try {
        localStorage.setItem('eventroute_preferences', JSON.stringify(updated));
        // Async background sync with API
        fetch('/api/eventroute/preferences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        }).catch(() => {});
      } catch (e) {
        // ignore
      }
      return updated;
    });
  };

  // Generate Itinerary
  const generateItinerary = async (customPrefs?: UserItineraryPreferences) => {
    const prefsToUse = customPrefs || preferences;
    setIsGeneratingItinerary(true);

    try {
      // First try API route
      const res = await fetch('/api/eventroute/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...prefsToUse,
          selectedEventIds: bookmarkedSessionIds,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.itinerary) {
          setItinerary(data.itinerary);
          localStorage.setItem('eventroute_itinerary', JSON.stringify(data.itinerary));
          setIsGeneratingItinerary(false);
          return;
        }
      }
    } catch {
      // Fallback directly to client-side engine
    }

    // Client-side fallback computation
    const newItinerary = generateSmartItinerary(
      { ...prefsToUse, selectedEventIds: bookmarkedSessionIds },
      sessions,
      venueRooms
    );
    setItinerary(newItinerary);
    try {
      localStorage.setItem('eventroute_itinerary', JSON.stringify(newItinerary));
    } catch (e) {
      // ignore
    }
    setIsGeneratingItinerary(false);
  };

  // Remove individual slot from itinerary
  const removeItinerarySlot = (slotId: string) => {
    if (!itinerary) return;
    const updatedSlots = itinerary.slots.filter((s) => s.id !== slotId);
    const updatedItinerary: GeneratedItinerary = {
      ...itinerary,
      slots: updatedSlots,
      totalSessions: updatedSlots.filter((s) => s.type === 'session').length,
    };
    setItinerary(updatedItinerary);
    try {
      localStorage.setItem('eventroute_itinerary', JSON.stringify(updatedItinerary));
    } catch (e) {
      // ignore
    }
  };

  // Crowd density refresh / simulation
  const refreshCrowdDensity = async (simulateRandom = false) => {
    setIsLoadingDensity(true);
    try {
      const res = await fetch('/api/eventroute/density', {
        method: simulateRandom ? 'POST' : 'GET',
        headers: { 'Content-Type': 'application/json' },
        ...(simulateRandom ? { body: JSON.stringify({ simulateRandom: true }) } : {}),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.densities) {
          const densityMap = new Map<string, CrowdDensityUpdate>();
          data.densities.forEach((d: CrowdDensityUpdate) => densityMap.set(d.venueId, d));

          setVenueRooms((prev) =>
            prev.map((room) => {
              const update = densityMap.get(room.id);
              if (update) {
                return {
                  ...room,
                  currentOccupancy: update.currentOccupancy,
                  congestionStatus: update.congestionStatus,
                };
              }
              return room;
            })
          );
        }
      }
    } catch (err) {
      console.warn('Failed to fetch density from API, using client simulation', err);
      if (simulateRandom) {
        setVenueRooms((prev) =>
          prev.map((room) => {
            const delta = Math.floor(Math.random() * 41) - 20;
            const newOcc = Math.max(20, Math.min(room.capacity, room.currentOccupancy + delta));
            const pct = (newOcc / room.capacity) * 100;
            return {
              ...room,
              currentOccupancy: newOcc,
              congestionStatus: pct >= 80 ? 'congested' : pct >= 45 ? 'moderate' : 'low',
            };
          })
        );
      }
    } finally {
      setIsLoadingDensity(false);
    }
  };

  const updateRoomOccupancy = async (venueId: string, occupancy: number) => {
    try {
      await fetch('/api/eventroute/density', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ venueId, occupancy }),
      });
    } catch {
      // ignore
    }

    setVenueRooms((prev) =>
      prev.map((r) => {
        if (r.id === venueId) {
          const pct = (occupancy / r.capacity) * 100;
          return {
            ...r,
            currentOccupancy: occupancy,
            congestionStatus: pct >= 80 ? 'congested' : pct >= 45 ? 'moderate' : 'low',
          };
        }
        return r;
      })
    );
  };

  // Route calculation
  const calculateRoute = useCallback(
    (originId: string, destinationId: string, avoidCongestion?: boolean) => {
      const plan = findShortestPath(originId, destinationId, {
        avoidCongestion: avoidCongestion ?? preferences.avoidCrowds,
        venueRooms,
      });
      setActiveRoute(plan);
      setSelectedDestination(destinationId);
      return plan;
    },
    [venueRooms, preferences.avoidCrowds]
  );

  const clearRoute = () => {
    setActiveRoute(null);
    setSelectedDestination(null);
  };

  // Update user location
  const handleSetUserLocation = (locId: string) => {
    setUserLocation(locId);
    try {
      localStorage.setItem('eventroute_user_loc', locId);
    } catch (e) {
      // ignore
    }
    // If a destination is currently picked, re-calculate the route immediately
    if (selectedDestination && selectedDestination !== locId) {
      calculateRoute(locId, selectedDestination);
    }
  };

  // Trigger quick navigation from alert or session card
  const triggerQuickNavigation = (targetVenueId: string) => {
    setSelectedDestination(targetVenueId);
    calculateRoute(userLocation, targetVenueId);
  };

  // Proactive Alerts generation based on itinerary schedule & current location
  useEffect(() => {
    if (!itinerary) return;

    const newAlerts: ProactiveAlert[] = [];
    const sessionSlots = itinerary.slots.filter((s) => s.type === 'session' && s.session);

    // Pick upcoming session for realistic interactive notification demo
    if (sessionSlots.length > 0) {
      const firstSession = sessionSlots[0].session!;
      const transit = getTransitTimeBetweenVenues(userLocation, firstSession.venueId, venueRooms);

      // Alert 1: Urgent departure warning
      newAlerts.push({
        id: `alert-depart-${firstSession.id}`,
        type: 'leave_now',
        title: `Departure Alert: ${firstSession.title}`,
        message: `Session begins in 12 mins. You are ~${transit.distanceMeters}m away at ${
          venueRooms.find((r) => r.id === userLocation)?.name || 'current location'
        }. Walk time is ${transit.walkMinutes} mins. Start heading over!`,
        sessionId: firstSession.id,
        sessionTitle: firstSession.title,
        venueId: firstSession.venueId,
        venueName: firstSession.venueName,
        startsInMinutes: 12,
        estimatedWalkMinutes: transit.walkMinutes,
        distanceMeters: transit.distanceMeters,
        createdAt: 'Just now',
        read: false,
        dismissed: false,
      });

      // Alert 2: Crowd warning if destination or current is congested
      const targetRoom = venueRooms.find((r) => r.id === firstSession.venueId);
      if (targetRoom && targetRoom.congestionStatus === 'congested') {
        newAlerts.push({
          id: `alert-crowd-${targetRoom.id}`,
          type: 'crowd_warning',
          title: `High Congestion Detected at ${targetRoom.name}`,
          message: `${targetRoom.name} is at ${Math.round(
            (targetRoom.currentOccupancy / targetRoom.capacity) * 100
          )}% capacity. Consider entering via the North Promenade portal to avoid the main concourse bottleneck.`,
          venueId: targetRoom.id,
          venueName: targetRoom.name,
          startsInMinutes: 20,
          estimatedWalkMinutes: transit.walkMinutes + 2,
          distanceMeters: transit.distanceMeters + 25,
          createdAt: '3m ago',
          read: false,
          dismissed: false,
        });
      }
    }

    setAlerts(newAlerts);
  }, [itinerary, userLocation, venueRooms]);

  const dismissAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  const markAlertRead = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, read: true } : a))
    );
  };

  const unreadAlertsCount = useMemo(
    () => alerts.filter((a) => !a.read && !a.dismissed).length,
    [alerts]
  );

  return (
    <EventRouteContext.Provider
      value={{
        sessions,
        bookmarkedSessionIds,
        toggleBookmark,
        venueRooms,
        refreshCrowdDensity,
        updateRoomOccupancy,
        isLoadingDensity,
        preferences,
        updatePreferences,
        isPlannerModalOpen,
        setIsPlannerModalOpen,
        itinerary,
        isGeneratingItinerary,
        generateItinerary,
        removeItinerarySlot,
        userLocation,
        setUserLocation: handleSetUserLocation,
        activeRoute,
        calculateRoute,
        clearRoute,
        selectedDestination,
        setSelectedDestination,
        alerts,
        dismissAlert,
        markAlertRead,
        isAlertsDrawerOpen,
        setIsAlertsDrawerOpen,
        unreadAlertsCount,
        triggerQuickNavigation,
      }}
    >
      {children}
    </EventRouteContext.Provider>
  );
};

export const useEventRoute = () => {
  const context = useContext(EventRouteContext);
  if (!context) {
    throw new Error('useEventRoute must be used within an EventRouteProvider');
  }
  return context;
};
