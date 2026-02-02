import type { FloorplanFloor, FloorplanPlacement, FloorplanRoom, FloorplanWall } from '../../lib/homeSecurityFunnel';

export type WindowStylePreset = 'standard' | 'basement' | 'glassBlock';

export type FloorplanWindowMarker = FloorplanRoom['windows'][number] & {
  isGroundLevel?: boolean;
  windowStyle?: WindowStylePreset;
};

export type WindowMarkerVisual = {
  thickness: number;
  length: number;
  background: string;
  border?: string;
  boxShadow?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  borderRadius?: string;
  badge?: {
    label: string;
    background: string;
    color: string;
    border: string;
  };
};

export const GRID_SIZE = 10;

export const snapToGrid = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE;

export const clampUnit = (value: number) => Math.min(Math.max(value, 0), 1);

export const clampToRange = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const getDefaultWindowGroundLevel = (floorIndex: number) => floorIndex === 0;

export const clampPointToRect = (
  point: { x: number; y: number },
  rect: { x: number; y: number; w: number; h: number },
) => ({
  x: clampToRange(point.x, rect.x, rect.x + rect.w),
  y: clampToRange(point.y, rect.y, rect.y + rect.h),
});

export const findRoomAtPoint = (floor: FloorplanFloor | undefined, point: { x: number; y: number }) => {
  if (!floor) return undefined;
  return floor.rooms.find(
    (room) =>
      point.x >= room.rect.x &&
      point.x <= room.rect.x + room.rect.w &&
      point.y >= room.rect.y &&
      point.y <= room.rect.y + room.rect.h,
  );
};

export const autoSnapToNearestWall = (
  roomRect: FloorplanRoom['rect'],
  point: { x: number; y: number },
): { wall: FloorplanWall; offset: number } => {
  const clampedPoint = clampPointToRect(point, roomRect);
  const distances: Record<FloorplanWall, number> = {
    n: Math.abs(clampedPoint.y - roomRect.y),
    s: Math.abs(roomRect.y + roomRect.h - clampedPoint.y),
    w: Math.abs(clampedPoint.x - roomRect.x),
    e: Math.abs(roomRect.x + roomRect.w - clampedPoint.x),
  };
  const nearestWall = (Object.keys(distances) as FloorplanWall[]).reduce((closest, wall) =>
    distances[wall] < distances[closest] ? wall : closest,
  );
  const offset =
    nearestWall === 'n' || nearestWall === 's'
      ? clampUnit((clampedPoint.x - roomRect.x) / roomRect.w)
      : clampUnit((clampedPoint.y - roomRect.y) / roomRect.h);
  return { wall: nearestWall, offset };
};

export const getWallRotation = (wall: FloorplanWall) => {
  switch (wall) {
    case 'n':
      return 180;
    case 'e':
      return 270;
    case 'w':
      return 90;
    case 's':
    default:
      return 0;
  }
};

export const getPlacementRotation = (placement: Pick<FloorplanPlacement, 'rotation' | 'wallSnap'>) => {
  if (placement.rotation !== undefined && placement.rotation !== null) {
    return placement.rotation;
  }
  return placement.wallSnap ? getWallRotation(placement.wallSnap.wall) : 0;
};

export const getWallInsetPosition = (
  roomRect: FloorplanRoom['rect'],
  wallSnap: { wall: FloorplanWall; offset: number },
  inset = 12,
) => {
  const offset = clampUnit(wallSnap.offset);
  const safeInset = Math.min(inset, roomRect.w / 2, roomRect.h / 2);
  switch (wallSnap.wall) {
    case 'n':
      return { x: roomRect.x + roomRect.w * offset, y: roomRect.y + safeInset };
    case 's':
      return { x: roomRect.x + roomRect.w * offset, y: roomRect.y + roomRect.h - safeInset };
    case 'e':
      return { x: roomRect.x + roomRect.w - safeInset, y: roomRect.y + roomRect.h * offset };
    case 'w':
    default:
      return { x: roomRect.x + safeInset, y: roomRect.y + roomRect.h * offset };
  }
};

export const getWindowMarkerVisual = ({
  wall,
  isGroundLevel = false,
  windowStyle = 'standard',
}: {
  wall: FloorplanWall;
  isGroundLevel?: boolean;
  windowStyle?: WindowStylePreset;
}): WindowMarkerVisual => {
  const isHorizontal = wall === 'n' || wall === 's';
  const length = windowStyle === 'standard' ? 16 : 12;
  const baseThickness = windowStyle === 'glassBlock' ? 4 : windowStyle === 'basement' ? 3 : 2;
  const thickness = baseThickness + (isGroundLevel ? 2 : 0);
  const background = isGroundLevel ? 'rgba(255, 236, 196, 0.95)' : 'rgba(255, 255, 255, 0.9)';
  const border = isGroundLevel ? '1px solid rgba(255, 255, 255, 0.8)' : 'none';
  const boxShadow = isGroundLevel ? '0 0 8px rgba(255, 214, 140, 0.7)' : 'none';
  const backgroundImage =
    windowStyle === 'glassBlock'
      ? `repeating-linear-gradient(${isHorizontal ? '90deg' : '0deg'}, rgba(255, 255, 255, 0.65) 0, rgba(255, 255, 255, 0.65) 2px, rgba(255, 255, 255, 0.2) 2px, rgba(255, 255, 255, 0.2) 4px)`
      : undefined;
  const backgroundSize = windowStyle === 'glassBlock' ? (isHorizontal ? '6px 100%' : '100% 6px') : undefined;
  const borderRadius = windowStyle === 'glassBlock' ? '3px' : '999px';
  const badge = isGroundLevel
    ? {
        label: 'LOW',
        background: 'rgba(255, 192, 130, 0.85)',
        color: '#2a1b0f',
        border: '1px solid rgba(255, 236, 196, 0.9)',
      }
    : undefined;

  return {
    thickness,
    length,
    background,
    border,
    boxShadow,
    backgroundImage,
    backgroundSize,
    borderRadius,
    badge,
  };
};

export const getHallwaySurfaceStyle = () => ({
  backgroundColor: 'rgba(12, 15, 26, 0.72)',
  backgroundImage:
    'radial-gradient(circle at 1px 1px, rgba(160, 182, 210, 0.08) 0, rgba(160, 182, 210, 0.08) 1px, transparent 1.2px)',
  backgroundSize: '12px 12px',
});
