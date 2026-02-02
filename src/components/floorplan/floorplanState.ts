import type { HomeSecurityFloorplan } from '../../lib/homeSecurityFunnel';

export type FloorplanStairDirection = 'up' | 'down';

export type FloorplanStair = {
  id: string;
  floorId: string;
  floorIndex: number;
  position: { x: number; y: number };
  direction: FloorplanStairDirection;
};

export type HomeSecurityFloorplanWithStairs = HomeSecurityFloorplan & {
  stairs: FloorplanStair[];
};

const createStairId = () => `stairs-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

export const ensureFloorplanStairs = (floorplan: HomeSecurityFloorplan): HomeSecurityFloorplanWithStairs => {
  const stairs = 'stairs' in floorplan && Array.isArray((floorplan as HomeSecurityFloorplanWithStairs).stairs)
    ? (floorplan as HomeSecurityFloorplanWithStairs).stairs
    : [];
  return { ...floorplan, stairs };
};

export const removePlacementById = <T extends HomeSecurityFloorplan>(floorplan: T, placementId: string): T => ({
  ...floorplan,
  placements: floorplan.placements.filter((placement) => placement.id !== placementId),
});

export const removeRoomById = <T extends HomeSecurityFloorplan>(
  floorplan: T,
  floorId: string,
  roomId: string,
): T => ({
  ...floorplan,
  floors: floorplan.floors.map((floor) =>
    floor.id === floorId ? { ...floor, rooms: floor.rooms.filter((room) => room.id !== roomId) } : floor,
  ),
  placements: floorplan.placements.filter((placement) => placement.roomId !== roomId),
});

export const addStairs = (
  floorplan: HomeSecurityFloorplanWithStairs,
  input: Omit<FloorplanStair, 'id'> & { id?: string },
): HomeSecurityFloorplanWithStairs => ({
  ...floorplan,
  stairs: [
    ...floorplan.stairs,
    {
      id: input.id ?? createStairId(),
      ...input,
    },
  ],
});

export const removeStairsById = (
  floorplan: HomeSecurityFloorplanWithStairs,
  stairId: string,
): HomeSecurityFloorplanWithStairs => ({
  ...floorplan,
  stairs: floorplan.stairs.filter((stair) => stair.id !== stairId),
});
