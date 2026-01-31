import { describe, expect, it } from 'vitest';
import { isWallAnchored } from '../deviceCatalog';
import { autoSnapToNearestWall, getPlacementRotation } from '../floorplanUtils';

describe('floorplan utils', () => {
  it('identifies wall-anchored devices', () => {
    expect(isWallAnchored('door_sensor')).toBe(true);
    expect(isWallAnchored('window_sensor')).toBe(true);
    expect(isWallAnchored('video_doorbell')).toBe(true);
    expect(isWallAnchored('outdoor_camera_poe')).toBe(true);
    expect(isWallAnchored('siren_chime')).toBe(true);
    expect(isWallAnchored('indoor_camera')).toBe(false);
    expect(isWallAnchored('motion_sensor')).toBe(false);
    expect(isWallAnchored('leak_sensor')).toBe(false);
  });

  it('auto-snaps to nearest wall with valid offset', () => {
    const roomRect = { x: 0, y: 0, w: 200, h: 100 };
    const snapTop = autoSnapToNearestWall(roomRect, { x: 50, y: 4 });
    expect(snapTop.wall).toBe('n');
    expect(snapTop.offset).toBeGreaterThanOrEqual(0);
    expect(snapTop.offset).toBeLessThanOrEqual(1);

    const snapRight = autoSnapToNearestWall(roomRect, { x: 300, y: 50 });
    expect(snapRight.wall).toBe('e');
    expect(snapRight.offset).toBeGreaterThanOrEqual(0);
    expect(snapRight.offset).toBeLessThanOrEqual(1);
  });

  it('defaults rotation to wall-facing direction when rotation is unset', () => {
    const rotationFromWall = getPlacementRotation({ rotation: undefined, wallSnap: { wall: 'w', offset: 0.5 } });
    expect(rotationFromWall).toBe(90);

    const explicitRotation = getPlacementRotation({ rotation: 45, wallSnap: { wall: 's', offset: 0.2 } });
    expect(explicitRotation).toBe(45);

    const defaultRotation = getPlacementRotation({ rotation: undefined, wallSnap: undefined });
    expect(defaultRotation).toBe(0);
  });
});
