import { describe, expect, it } from 'vitest';
import type { HomeSecurityFloorplan } from '../../../lib/homeSecurityFunnel';
import { removePlacementById, removeRoomById } from '../floorplanState';

const baseFloorplan: HomeSecurityFloorplan = {
  version: 'v1',
  floors: [
    {
      id: 'floor-1',
      label: 'Floor 1',
      rooms: [
        {
          id: 'room-1',
          name: 'Living',
          rect: { x: 0, y: 0, w: 120, h: 80 },
          doors: [],
          windows: [],
        },
      ],
    },
  ],
  placements: [
    {
      id: 'placement-1',
      deviceKey: 'motion_sensor',
      label: 'Motion Sensor',
      floorId: 'floor-1',
      roomId: 'room-1',
      position: { x: 40, y: 40 },
      required: false,
      source: 'user_added',
    },
    {
      id: 'placement-2',
      deviceKey: 'leak_sensor',
      label: 'Leak Sensor',
      floorId: 'floor-1',
      position: { x: 90, y: 30 },
      required: false,
      source: 'user_added',
    },
  ],
};

describe('floorplan state', () => {
  it('removes a placement by id', () => {
    const updated = removePlacementById(baseFloorplan, 'placement-2');
    expect(updated.placements).toHaveLength(1);
    expect(updated.placements[0]?.id).toBe('placement-1');
  });

  it('removes a room and dependent placements', () => {
    const updated = removeRoomById(baseFloorplan, 'floor-1', 'room-1');
    expect(updated.floors[0]?.rooms).toHaveLength(0);
    expect(updated.placements).toHaveLength(1);
    expect(updated.placements[0]?.id).toBe('placement-2');
  });
});
