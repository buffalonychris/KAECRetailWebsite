import { describe, expect, it } from 'vitest';
import { isWallAnchored } from '../deviceCatalog';
import {
  autoSnapToNearestWall,
  clampPointToRect,
  computeSnappedRectFromHandleDrag,
  getDefaultWindowGroundLevel,
  getHallwaySurfaceStyle,
  getPlacementRotation,
  getWindowMarkerVisual,
  MIN_ROOM_SIZE,
  RESIZE_GRID_STEP,
  updateAnchoredMarkerAfterResize,
} from '../floorplanUtils';

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

  it('defaults ground-level windows to the lowest floor', () => {
    expect(getDefaultWindowGroundLevel(0)).toBe(true);
    expect(getDefaultWindowGroundLevel(1)).toBe(false);
    expect(getDefaultWindowGroundLevel(2)).toBe(false);
  });

  it('returns distinct visual tokens for ground-level windows', () => {
    const standard = getWindowMarkerVisual({ wall: 'n', isGroundLevel: false, windowStyle: 'standard' });
    const groundLevel = getWindowMarkerVisual({ wall: 'n', isGroundLevel: true, windowStyle: 'standard' });
    const glassBlock = getWindowMarkerVisual({ wall: 'e', isGroundLevel: true, windowStyle: 'glassBlock' });

    expect(groundLevel.thickness).toBeGreaterThan(standard.thickness);
    expect(groundLevel.boxShadow).not.toBe(standard.boxShadow);
    expect(glassBlock.backgroundImage).toContain('repeating-linear-gradient');
  });

  it('builds a muted hallway surface style', () => {
    const style = getHallwaySurfaceStyle();
    expect(style.backgroundColor).toContain('rgba');
    expect(style.backgroundImage).toContain('radial-gradient');
    expect(style.backgroundSize).toBe('12px 12px');
  });

  it('snaps resize drags to the resize grid step', () => {
    const rect = { x: 0, y: 0, w: 120, h: 100 };
    const updated = computeSnappedRectFromHandleDrag(rect, 'e', RESIZE_GRID_STEP + 1, 0);
    expect(updated.w).toBe(rect.w + RESIZE_GRID_STEP);
    expect(updated.x).toBe(rect.x);
  });

  it('enforces minimum room size during resize', () => {
    const rect = { x: 0, y: 0, w: 60, h: 80 };
    const updated = computeSnappedRectFromHandleDrag(rect, 'w', 40, 0);
    expect(updated.w).toBe(MIN_ROOM_SIZE);
    expect(updated.x).toBe(rect.x + rect.w - MIN_ROOM_SIZE);
  });

  it('clamps placements into the updated room bounds', () => {
    const rect = { x: 10, y: 20, w: 100, h: 60 };
    const point = clampPointToRect({ x: 200, y: -10 }, rect);
    expect(point.x).toBe(rect.x + rect.w);
    expect(point.y).toBe(rect.y);
  });

  it('keeps anchored markers within wall bounds after resize', () => {
    const marker = updateAnchoredMarkerAfterResize({ wall: 'n', offset: 1.4 }, { x: 0, y: 0, w: 80, h: 80 }, { x: 0, y: 0, w: 40, h: 40 });
    expect(marker.offset).toBe(1);
  });
});
