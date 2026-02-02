import type { HomeSecurityFloorplan } from '../../lib/homeSecurityFunnel';

export const removePlacementById = (floorplan: HomeSecurityFloorplan, placementId: string): HomeSecurityFloorplan => ({
  ...floorplan,
  placements: floorplan.placements.filter((placement) => placement.id !== placementId),
});

export const removeRoomById = (
  floorplan: HomeSecurityFloorplan,
  floorId: string,
  roomId: string,
): HomeSecurityFloorplan => ({
  ...floorplan,
  floors: floorplan.floors.map((floor) =>
    floor.id === floorId ? { ...floor, rooms: floor.rooms.filter((room) => room.id !== roomId) } : floor,
  ),
  placements: floorplan.placements.filter((placement) => placement.roomId !== roomId),
});
