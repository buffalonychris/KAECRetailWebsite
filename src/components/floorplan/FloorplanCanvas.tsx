import { useState } from 'react';
import type { DragEvent } from 'react';
import type { DevicePlacement, FloorplanDeviceType, FloorplanFloor, FloorplanWall } from '../../lib/homeSecurityFunnel';
import { deviceCatalogMap } from './deviceCatalog';
import { FloorplanIconShell } from './icons';

const canvasStyles = {
  background: 'rgba(15, 19, 32, 0.6)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: '0.75rem',
  padding: '1rem',
} as const;

const viewportStyles = {
  position: 'relative' as const,
  borderRadius: '0.75rem',
  border: '1px dashed rgba(255, 255, 255, 0.18)',
  background: 'rgba(10, 12, 20, 0.75)',
  overflow: 'hidden',
} as const;

const surfaceStyles = {
  position: 'absolute' as const,
  inset: 0,
} as const;

type FloorplanCanvasProps = {
  floor: FloorplanFloor;
  floorIndex: number;
  devicePlacements: DevicePlacement[];
  selectedDeviceId?: string;
  selectedRoomId?: string;
  onSelectRoom: (id: string) => void;
  onUpdateRoomRect?: (id: string, rect: { x: number; y: number; w: number; h: number }) => void;
  onPlaceDevice: (placement: DevicePlacement) => void;
  onSelectDevice: (id?: string) => void;
  width?: number | string;
  height?: number;
};

const markerBaseStyles = {
  position: 'absolute' as const,
  transform: 'translate(-50%, -50%)',
  borderRadius: '999px',
} as const;

const gridBackground = {
  backgroundImage:
    'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
  backgroundSize: '32px 32px',
} as const;

const getMarkerPosition = (room: FloorplanFloor['rooms'][number], wall: 'n' | 's' | 'e' | 'w', offset: number) => {
  const clampedOffset = Math.min(Math.max(offset, 0), 1);
  switch (wall) {
    case 'n':
      return { x: room.rect.w * clampedOffset, y: 0 };
    case 's':
      return { x: room.rect.w * clampedOffset, y: room.rect.h };
    case 'e':
      return { x: room.rect.w, y: room.rect.h * clampedOffset };
    case 'w':
    default:
      return { x: 0, y: room.rect.h * clampedOffset };
  }
};

const findRoomForPoint = (floor: FloorplanFloor, x: number, y: number) => {
  return floor.rooms.find(
    (room) => x >= room.rect.x && x <= room.rect.x + room.rect.w && y >= room.rect.y && y <= room.rect.y + room.rect.h,
  );
};

const snapToWall = (
  room: FloorplanFloor['rooms'][number],
  x: number,
  y: number,
): { x: number; y: number; wall: FloorplanWall; offset: number } => {
  const distances = [
    { wall: 'n' as const, distance: Math.abs(y - room.rect.y) },
    { wall: 's' as const, distance: Math.abs(y - (room.rect.y + room.rect.h)) },
    { wall: 'w' as const, distance: Math.abs(x - room.rect.x) },
    { wall: 'e' as const, distance: Math.abs(x - (room.rect.x + room.rect.w)) },
  ];
  const closest = distances.sort((a, b) => a.distance - b.distance)[0];
  const clampedX = Math.min(Math.max(x, room.rect.x), room.rect.x + room.rect.w);
  const clampedY = Math.min(Math.max(y, room.rect.y), room.rect.y + room.rect.h);
  const offset =
    closest.wall === 'n' || closest.wall === 's'
      ? (clampedX - room.rect.x) / room.rect.w
      : (clampedY - room.rect.y) / room.rect.h;
  const snapped =
    closest.wall === 'n'
      ? { x: clampedX, y: room.rect.y }
      : closest.wall === 's'
        ? { x: clampedX, y: room.rect.y + room.rect.h }
        : closest.wall === 'w'
          ? { x: room.rect.x, y: clampedY }
          : { x: room.rect.x + room.rect.w, y: clampedY };
  return { ...snapped, wall: closest.wall, offset: Math.min(Math.max(offset, 0), 1) };
};

const snapToInterior = (
  room: FloorplanFloor['rooms'][number],
  x: number,
  y: number,
  padding = 12,
): { x: number; y: number } => {
  return {
    x: Math.min(Math.max(x, room.rect.x + padding), room.rect.x + room.rect.w - padding),
    y: Math.min(Math.max(y, room.rect.y + padding), room.rect.y + room.rect.h - padding),
  };
};

const snapToCorner = (room: FloorplanFloor['rooms'][number], x: number, y: number, padding = 12) => {
  const corners = [
    { x: room.rect.x + padding, y: room.rect.y + padding },
    { x: room.rect.x + room.rect.w - padding, y: room.rect.y + padding },
    { x: room.rect.x + padding, y: room.rect.y + room.rect.h - padding },
    { x: room.rect.x + room.rect.w - padding, y: room.rect.y + room.rect.h - padding },
  ];
  return corners.reduce((closest, corner) => {
    const currentDistance = Math.hypot(x - corner.x, y - corner.y);
    const closestDistance = Math.hypot(x - closest.x, y - closest.y);
    return currentDistance < closestDistance ? corner : closest;
  }, corners[0]);
};

const rotationForWall = (wall: FloorplanWall) => {
  switch (wall) {
    case 'n':
      return 180;
    case 's':
      return 0;
    case 'e':
      return 270;
    case 'w':
    default:
      return 90;
  }
};

const isPlacementValid = (placement: DevicePlacement, floor: FloorplanFloor) => {
  const entry = deviceCatalogMap.get(placement.type);
  if (!entry) return false;
  const room = floor.rooms.find((item) => item.id === placement.roomId);
  if (!room) return false;
  if (entry.placement === 'wall') {
    if (!placement.wallId) return false;
    if (placement.type === 'doorbell') {
      const wall = placement.wallId.split('-').slice(-1)[0] as FloorplanWall;
      const hasExterior = room.doors.some((door) => door.exterior && door.wall === wall);
      return hasExterior;
    }
  }
  return true;
};

const FloorplanCanvas = ({
  floor,
  floorIndex,
  devicePlacements,
  selectedDeviceId,
  selectedRoomId,
  onSelectRoom,
  onUpdateRoomRect,
  onPlaceDevice,
  onSelectDevice,
  width = '100%',
  height = 320,
}: FloorplanCanvasProps) => {
  const selectedRoom = floor.rooms.find((room) => room.id === selectedRoomId);

  const [hoveredDeviceId, setHoveredDeviceId] = useState<string | undefined>();

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const data = event.dataTransfer.getData('application/json');
    if (!data) return;
    const parsed = JSON.parse(data) as { type?: FloorplanDeviceType; placementId?: string };
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const room = findRoomForPoint(floor, x, y);
    if (!room) return;
    const existingPlacement = parsed.placementId
      ? devicePlacements.find((placement) => placement.id === parsed.placementId)
      : undefined;
    const entry = deviceCatalogMap.get(existingPlacement?.type ?? parsed.type);
    if (!entry) return;
    let nextPosition = { x, y };
    let wallId: string | undefined;
    let rotation: number | undefined;
    if (entry.placement === 'wall') {
      const snapped = snapToWall(room, x, y);
      nextPosition = { x: snapped.x, y: snapped.y };
      wallId = `${room.id}-${snapped.wall}`;
      rotation = rotationForWall(snapped.wall);
    } else if (entry.placement === 'corner') {
      nextPosition = snapToCorner(room, x, y);
    } else {
      nextPosition = snapToInterior(room, x, y);
    }
    onPlaceDevice({
      id: existingPlacement?.id ?? `device-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      type: existingPlacement?.type ?? parsed.type ?? 'motion',
      floor: floorIndex + 1,
      roomId: room.id,
      wallId,
      x: nextPosition.x,
      y: nextPosition.y,
      rotation: rotation ?? existingPlacement?.rotation,
    });
  };

  return (
    <div style={canvasStyles}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
        <strong>{floor.label} map</strong>
        <span style={{ color: 'rgba(214, 233, 248, 0.75)' }}>
          Selected room: {selectedRoom ? selectedRoom.name : 'None'}
        </span>
      </div>
      <div
        style={{ marginTop: '0.75rem', ...viewportStyles, height, width, ...gridBackground }}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
      >
        <div
          style={surfaceStyles}
          onClick={() => {
            onSelectDevice(undefined);
            setHoveredDeviceId(undefined);
          }}
        >
          {floor.rooms.map((room) => {
            const isSelected = room.id === selectedRoomId;
            const roomStyles = {
              position: 'absolute' as const,
              left: room.rect.x,
              top: room.rect.y,
              width: room.rect.w,
              height: room.rect.h,
              borderRadius: '0.5rem',
              border: isSelected ? '2px solid #6cf6ff' : '1px solid rgba(255, 255, 255, 0.18)',
              background: isSelected ? 'rgba(108, 246, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)',
              color: '#f2f7ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              overflow: 'visible',
            } as const;

            return (
              <button
                key={room.id}
                type="button"
                onClick={() => onSelectRoom(room.id)}
                onDoubleClick={() => onUpdateRoomRect?.(room.id, room.rect)}
                style={roomStyles}
              >
                {room.name}
                {room.doors.map((door) => {
                  const position = getMarkerPosition(room, door.wall, door.offset);
                  const isHorizontal = door.wall === 'n' || door.wall === 's';
                  return (
                    <span
                      key={door.id}
                      style={{
                        ...markerBaseStyles,
                        left: position.x,
                        top: position.y,
                        width: isHorizontal ? 18 : 6,
                        height: isHorizontal ? 6 : 18,
                        background: '#6cf6ff',
                        boxShadow: '0 0 6px rgba(108, 246, 255, 0.6)',
                      }}
                    />
                  );
                })}
                {room.windows.map((window) => {
                  const position = getMarkerPosition(room, window.wall, window.offset);
                  const isHorizontal = window.wall === 'n' || window.wall === 's';
                  return (
                    <span
                      key={window.id}
                      style={{
                        ...markerBaseStyles,
                        left: position.x,
                        top: position.y,
                        width: isHorizontal ? 16 : 2,
                        height: isHorizontal ? 2 : 16,
                        background: 'rgba(255, 255, 255, 0.9)',
                      }}
                    />
                  );
                })}
              </button>
            );
          })}
          {devicePlacements.map((placement) => {
            const entry = deviceCatalogMap.get(placement.type);
            if (!entry) return null;
            const Icon = entry.icon;
            const isSelected = placement.id === selectedDeviceId;
            const isHovered = placement.id === hoveredDeviceId;
            const isValid = isPlacementValid(placement, floor);
            const label = entry.label;
            const showCameraCone = placement.type === 'indoorCamera' || placement.type === 'outdoorCamera';
            const showLabel = isSelected || isHovered;
            return (
              <div
                key={placement.id}
                style={{
                  position: 'absolute',
                  left: placement.x,
                  top: placement.y,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 2,
                }}
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.setData('application/json', JSON.stringify({ placementId: placement.id }));
                }}
                onMouseEnter={() => setHoveredDeviceId(placement.id)}
                onMouseLeave={() => setHoveredDeviceId(undefined)}
                onClick={(event) => {
                  event.stopPropagation();
                  onSelectDevice(placement.id);
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <FloorplanIconShell>
                      <Icon size={18} />
                    </FloorplanIconShell>
                    {showCameraCone ? (
                      <span
                        style={{
                          position: 'absolute',
                          left: '50%',
                          top: '50%',
                          width: 0,
                          height: 0,
                          borderLeft: '6px solid transparent',
                          borderRight: '6px solid transparent',
                          borderTop: '12px solid rgba(108, 246, 255, 0.45)',
                          transform: `translate(-50%, -50%) rotate(${placement.rotation ?? 0}deg)`,
                          transformOrigin: 'center',
                        }}
                      />
                    ) : null}
                    <span
                      style={{
                        position: 'absolute',
                        inset: -4,
                        borderRadius: '0.8rem',
                        border: isValid
                          ? isSelected || isHovered
                            ? '2px solid #6cf6ff'
                            : '1px solid rgba(108, 246, 255, 0.45)'
                          : '1px solid rgba(255, 107, 107, 0.7)',
                        boxShadow:
                          isSelected || isHovered ? '0 0 10px rgba(108, 246, 255, 0.6)' : undefined,
                        pointerEvents: 'none',
                      }}
                    />
                  </div>
                  {showLabel ? (
                    <span
                      style={{
                        fontSize: '0.7rem',
                        color: isValid ? 'rgba(214, 233, 248, 0.85)' : 'rgba(255, 142, 142, 0.9)',
                        background: 'rgba(8, 12, 22, 0.85)',
                        padding: '0.15rem 0.4rem',
                        borderRadius: '0.4rem',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        whiteSpace: 'nowrap',
                        opacity: isSelected ? 1 : 0.8,
                      }}
                    >
                      {label}
                      {!isValid ? ' — invalid placement' : ''}
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FloorplanCanvas;
