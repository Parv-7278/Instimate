import {
  PathfindingNode,
  RoutePlan,
  RouteNavigationStep,
  VenueRoom,
} from '@/types/eventroute';
import { PATHFINDING_GRAPH, VENUE_ROOMS } from './seedData';

// Average walking speed indoors: ~1.2 meters per second => ~72 meters per minute
const WALKING_METERS_PER_MINUTE = 70;

interface NodeDistances {
  [nodeId: string]: {
    distance: number;
    previous: string | null;
  };
}

/**
 * Calculates Euclidean distance between two nodes in map coordinate units
 */
export function getEuclideanDistance(
  a: { x: number; y: number },
  b: { x: number; y: number }
): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Finds shortest path using A* search with crowd congestion weight penalties
 */
export function findShortestPath(
  originId: string,
  destinationId: string,
  options?: {
    avoidCongestion?: boolean;
    venueRooms?: VenueRoom[];
    graph?: PathfindingNode[];
  }
): RoutePlan | null {
  const graph = options?.graph || PATHFINDING_GRAPH;
  const rooms = options?.venueRooms || VENUE_ROOMS;
  const avoidCongestion = options?.avoidCongestion ?? false;

  const nodeMap = new Map<string, PathfindingNode>();
  graph.forEach((node) => nodeMap.set(node.id, node));

  const startNode = nodeMap.get(originId);
  const endNode = nodeMap.get(destinationId);

  if (!startNode || !endNode) {
    return null;
  }

  // Pre-calculate room congestion map for penalties
  const congestionMap = new Map<string, number>();
  rooms.forEach((r) => {
    if (r.congestionStatus === 'congested') {
      congestionMap.set(r.id, 2.8); // 2.8x penalty for congested areas
    } else if (r.congestionStatus === 'moderate') {
      congestionMap.set(r.id, 1.3);
    } else {
      congestionMap.set(r.id, 1.0);
    }
  });

  const openSet = new Set<string>([originId]);
  const cameFrom = new Map<string, string>();

  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();

  graph.forEach((n) => {
    gScore.set(n.id, Infinity);
    fScore.set(n.id, Infinity);
  });

  gScore.set(originId, 0);
  fScore.set(
    originId,
    getEuclideanDistance(startNode, endNode)
  );

  while (openSet.size > 0) {
    // Find node with lowest fScore
    let currentId: string | null = null;
    let lowestF = Infinity;

    for (const nodeId of openSet) {
      const score = fScore.get(nodeId) ?? Infinity;
      if (score < lowestF) {
        lowestF = score;
        currentId = nodeId;
      }
    }

    if (!currentId) break;

    // Goal reached
    if (currentId === destinationId) {
      return reconstructRoutePlan(
        originId,
        destinationId,
        cameFrom,
        nodeMap,
        rooms,
        avoidCongestion
      );
    }

    openSet.delete(currentId);
    const currentNode = nodeMap.get(currentId)!;

    for (const neighborEdge of currentNode.neighbors) {
      const neighborNode = nodeMap.get(neighborEdge.targetId);
      if (!neighborNode) continue;

      let edgeWeight = neighborEdge.distanceMeters;

      // Apply congestion penalty if requested
      if (avoidCongestion && neighborNode.venueId) {
        const penalty = congestionMap.get(neighborNode.venueId) || 1.0;
        edgeWeight = edgeWeight * penalty;
      }

      const tentativeGScore = (gScore.get(currentId) ?? Infinity) + edgeWeight;

      if (tentativeGScore < (gScore.get(neighborNode.id) ?? Infinity)) {
        cameFrom.set(neighborNode.id, currentId);
        gScore.set(neighborNode.id, tentativeGScore);

        const h = getEuclideanDistance(neighborNode, endNode);
        fScore.set(neighborNode.id, tentativeGScore + h);

        openSet.add(neighborNode.id);
      }
    }
  }

  // Fallback direct path if no graph connection found
  return null;
}

/**
 * Reconstructs the complete route plan and computes turn-by-turn guidance
 */
function reconstructRoutePlan(
  originId: string,
  destinationId: string,
  cameFrom: Map<string, string>,
  nodeMap: Map<string, PathfindingNode>,
  rooms: VenueRoom[],
  avoidCongestion: boolean
): RoutePlan {
  const pathNodeIds: string[] = [destinationId];
  let curr = destinationId;

  while (cameFrom.has(curr)) {
    curr = cameFrom.get(curr)!;
    pathNodeIds.unshift(curr);
  }

  const pathCoordinates = pathNodeIds.map((id) => {
    const node = nodeMap.get(id)!;
    return { x: node.x, y: node.y };
  });

  // Calculate actual distance along path
  let totalDistanceMeters = 0;
  for (let i = 0; i < pathNodeIds.length - 1; i++) {
    const a = nodeMap.get(pathNodeIds[i])!;
    const bId = pathNodeIds[i + 1];
    const edge = a.neighbors.find((n) => n.targetId === bId);
    if (edge) {
      totalDistanceMeters += edge.distanceMeters;
    } else {
      totalDistanceMeters += Math.round(getEuclideanDistance(a, nodeMap.get(bId)!));
    }
  }

  const originRoom = rooms.find((r) => r.id === originId);
  const destRoom = rooms.find((r) => r.id === destinationId);

  const originName = originRoom?.name || nodeMap.get(originId)?.label || originId;
  const destinationName = destRoom?.name || nodeMap.get(destinationId)?.label || destinationId;

  const estimatedWalkingMinutes = Math.max(1, Math.round(totalDistanceMeters / WALKING_METERS_PER_MINUTE));

  // Generate step-by-step navigation instructions
  const steps: RouteNavigationStep[] = [];
  let passesCongestedZone = false;

  for (let i = 0; i < pathNodeIds.length; i++) {
    const currentNode = nodeMap.get(pathNodeIds[i])!;
    const room = rooms.find((r) => r.id === currentNode.venueId);

    if (room && room.congestionStatus === 'congested') {
      passesCongestedZone = true;
    }

    if (i === 0) {
      steps.push({
        stepNumber: 1,
        instruction: `Depart from ${currentNode.label}. Head towards ${nodeMap.get(pathNodeIds[1])?.label || 'concourse'}.`,
        distanceMeters: 0,
        waypointName: currentNode.label,
        direction: 'straight',
      });
    } else if (i === pathNodeIds.length - 1) {
      steps.push({
        stepNumber: steps.length + 1,
        instruction: `Arrive at destination: ${destinationName}. Look for entry portal and registration screen.`,
        distanceMeters: Math.round(totalDistanceMeters / steps.length || 15),
        waypointName: destinationName,
        direction: 'arrive',
      });
    } else {
      const prevNode = nodeMap.get(pathNodeIds[i - 1])!;
      const nextNode = nodeMap.get(pathNodeIds[i + 1])!;

      // Determine turning direction using cross product
      const dx1 = currentNode.x - prevNode.x;
      const dy1 = currentNode.y - prevNode.y;
      const dx2 = nextNode.x - currentNode.x;
      const dy2 = nextNode.y - currentNode.y;

      const crossProduct = dx1 * dy2 - dy1 * dx2;
      let direction: 'straight' | 'left' | 'right' = 'straight';

      if (crossProduct > 1500) {
        direction = 'right';
      } else if (crossProduct < -1500) {
        direction = 'left';
      }

      const turnLabel = direction === 'straight' ? 'Continue straight through' : `Turn ${direction} at`;

      steps.push({
        stepNumber: steps.length + 1,
        instruction: `${turnLabel} ${currentNode.label} towards ${nextNode.label}.`,
        distanceMeters: Math.round(getEuclideanDistance(currentNode, nextNode)),
        waypointName: currentNode.label,
        direction,
      });
    }
  }

  return {
    originId,
    originName,
    destinationId,
    destinationName,
    pathNodeIds,
    pathCoordinates,
    totalDistanceMeters,
    estimatedWalkingMinutes,
    steps,
    passesCongestedZone,
    alternativeAvailable: passesCongestedZone && !avoidCongestion,
  };
}

/**
 * Calculates transition distance and estimated walking time between any two rooms
 */
export function getTransitTimeBetweenVenues(
  venueAId: string,
  venueBId: string,
  rooms?: VenueRoom[]
): { distanceMeters: number; walkMinutes: number } {
  if (venueAId === venueBId) {
    return { distanceMeters: 0, walkMinutes: 0 };
  }

  const route = findShortestPath(venueAId, venueBId, { venueRooms: rooms });
  if (route) {
    return {
      distanceMeters: route.totalDistanceMeters,
      walkMinutes: route.estimatedWalkingMinutes,
    };
  }

  // Fallback heuristic estimation
  return { distanceMeters: 120, walkMinutes: 2 };
}
