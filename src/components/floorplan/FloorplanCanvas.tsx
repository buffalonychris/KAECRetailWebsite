import { useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { DEVICE_CATALOG } from './deviceCatalog';
import type { FloorplanFloor, FloorplanPlacement, FloorplanWall } from '../../lib/homeSecurityFunnel';
import {
  autoSnapToNearestWall,
  clampPointToRect,
  findRoomAtPoint,
  getPlacementRotation,
  getWallInsetPosition,
  snapToGrid,
} from './floorplanUtils';

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
  placements?: FloorplanPlacement[];
  suggestedPlacements?: FloorplanPlacement[];
  selectedRoomId?: string;
  selectedPlacementId?: string | null;
  onSelectRoom: (id: string) => void;
  onSelectPlacement?: (id: string) => void;
  onCanvasClick?: (point: { x: number; y: number }) => void;
  onUpdatePlacement?: (placementId: string, updates: Partial<FloorplanPlacement>) => void;
  onUpdateRoomRect?: (id: string, rect: { x: number; y: number; w: number; h: number }) => void;
  width?: number | string;
  height?: number;
};

const markerBaseStyles = {
  position: 'absolute' as const,
  transform: 'translate(-50%, -50%)',
  borderRadius: '999px',
} as const;

const getMarkerPosition = (room: FloorplanFloor['rooms'][number], wall: FloorplanWall, offset: number) => {
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

const DRAG_THRESHOLD = 4;

const FloorplanCanvas = ({
  floor,
  placements = [],
  suggestedPlacements = [],
  selectedRoomId,
  selectedPlacementId,
  onSelectRoom,
  onSelectPlacement,
  onCanvasClick,
  onUpdatePlacement,
  onUpdateRoomRect,
  width = '100%',
  height = 320,
}: FloorplanCanvasProps) => {
  const selectedRoom = floor.rooms.find((room) => room.id === selectedRoomId);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [hoveredPlacementId, setHoveredPlacementId] = useState<string | null>(null);
  const dragStateRef = useRef<{
    placementId: string;
    pointerId: number;
    origin: { x: number; y: number };
    isDragging: boolean;
  } | null>(null);
  const justDraggedRef = useRef(false);

  const handleSurfaceClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!onCanvasClick) return;
    if (justDraggedRef.current) {
      justDraggedRef.current = false;
      return;
    }
    const viewport = viewportRef.current;
    if (!viewport) return;
    const rect = viewport.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    onCanvasClick({ x, y });
  };

  return (
    <div style={canvasStyles}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
        <strong>{floor.label} map</strong>
        <span style={{ color: 'rgba(214, 233, 248, 0.75)' }}>
          Selected room: {selectedRoom ? selectedRoom.name : 'None'}
        </span>
      </div>
      <div style={{ marginTop: '0.75rem', ...viewportStyles, height, width }}>
        <div ref={viewportRef} style={surfaceStyles} onClick={handleSurfaceClick}>
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
          {suggestedPlacements.map((placement) => {
            const item = DEVICE_CATALOG[placement.deviceKey];
            const Icon = item.icon;
            const rotation = getPlacementRotation(placement);
            return (
              <div
                key={placement.id}
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: placement.position.x,
                  top: placement.position.y,
                  transform: 'translate(-50%, -50%)',
                  borderRadius: '0.75rem',
                  padding: '0.35rem',
                  border: '1px dashed rgba(108, 246, 255, 0.65)',
                  background: 'rgba(108, 246, 255, 0.12)',
                  color: 'rgba(214, 233, 248, 0.9)',
                  opacity: 0.7,
                  pointerEvents: 'none',
                }}
              >
                {item.showsCone ? (
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: 50,
                      height: 50,
                      background: 'rgba(108, 246, 255, 0.2)',
                      clipPath: 'polygon(50% 10%, 0% 100%, 100% 100%)',
                      transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                      transformOrigin: '50% 50%',
                      pointerEvents: 'none',
                      filter: 'blur(0.5px)',
                    }}
                  />
                ) : null}
                <Icon width={24} height={24} />
              </div>
            );
          })}
          {placements.map((placement) => {
            const item = DEVICE_CATALOG[placement.deviceKey];
            const Icon = item.icon;
            const invalid = item.wallAnchored && !placement.wallSnap;
            const isSelected = placement.id === selectedPlacementId;
            const isHovered = placement.id === hoveredPlacementId;
            const rotation = getPlacementRotation(placement);
            return (
              <button
                key={placement.id}
                type="button"
                onClick={(event) => {
                  if (justDraggedRef.current) {
                    justDraggedRef.current = false;
                    return;
                  }
                  event.stopPropagation();
                  onSelectPlacement?.(placement.id);
                }}
                onPointerDown={(event) => {
                  event.stopPropagation();
                  onSelectPlacement?.(placement.id);
                  if (!onUpdatePlacement) return;
                  const viewport = viewportRef.current;
                  if (!viewport) return;
                  event.currentTarget.setPointerCapture(event.pointerId);
                  dragStateRef.current = {
                    placementId: placement.id,
                    pointerId: event.pointerId,
                    origin: { x: event.clientX, y: event.clientY },
                    isDragging: false,
                  };
                }}
                onPointerMove={(event) => {
                  if (!onUpdatePlacement) return;
                  const dragState = dragStateRef.current;
                  if (!dragState || dragState.placementId !== placement.id || dragState.pointerId !== event.pointerId) {
                    return;
                  }
                  const deltaX = event.clientX - dragState.origin.x;
                  const deltaY = event.clientY - dragState.origin.y;
                  if (!dragState.isDragging) {
                    if (Math.hypot(deltaX, deltaY) < DRAG_THRESHOLD) {
                      return;
                    }
                    dragState.isDragging = true;
                  }
                  const viewport = viewportRef.current;
                  if (!viewport) return;
                  const rect = viewport.getBoundingClientRect();
                  const clampedPoint = clampPointToRect(
                    { x: event.clientX - rect.left, y: event.clientY - rect.top },
                    { x: 0, y: 0, w: rect.width, h: rect.height },
                  );
                  const snappedPoint = { x: snapToGrid(clampedPoint.x), y: snapToGrid(clampedPoint.y) };
                  const targetRoom = findRoomAtPoint(floor, snappedPoint);
                  if (item.wallAnchored && targetRoom) {
                    const wallSnap = autoSnapToNearestWall(targetRoom.rect, snappedPoint);
                    const position = getWallInsetPosition(targetRoom.rect, wallSnap);
                    onUpdatePlacement(placement.id, { position, wallSnap, roomId: targetRoom.id });
                  } else {
                    onUpdatePlacement(placement.id, {
                      position: snappedPoint,
                      wallSnap: item.wallAnchored ? undefined : undefined,
                      roomId: targetRoom?.id,
                    });
                  }
                  justDraggedRef.current = true;
                }}
                onPointerUp={(event) => {
                  const dragState = dragStateRef.current;
                  if (!dragState || dragState.placementId !== placement.id || dragState.pointerId !== event.pointerId) {
                    return;
                  }
                  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                    event.currentTarget.releasePointerCapture(event.pointerId);
                  }
                  dragStateRef.current = null;
                  if (!dragState.isDragging) {
                    justDraggedRef.current = false;
                  }
                }}
                onPointerCancel={(event) => {
                  const dragState = dragStateRef.current;
                  if (!dragState || dragState.placementId !== placement.id || dragState.pointerId !== event.pointerId) {
                    return;
                  }
                  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                    event.currentTarget.releasePointerCapture(event.pointerId);
                  }
                  dragStateRef.current = null;
                  justDraggedRef.current = false;
                }}
                onMouseEnter={() => setHoveredPlacementId(placement.id)}
                onMouseLeave={() => setHoveredPlacementId((prev) => (prev === placement.id ? null : prev))}
                title={invalid ? 'Place on a wall.' : item.label}
                style={{
                  position: 'absolute',
                  left: placement.position.x,
                  top: placement.position.y,
                  transform: 'translate(-50%, -50%)',
                  borderRadius: '0.75rem',
                  padding: '0.35rem',
                  border: invalid
                    ? '1px solid rgba(255, 107, 107, 0.85)'
                    : isSelected
                      ? '1px solid #6cf6ff'
                      : '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(15, 19, 32, 0.85)',
                  color: invalid ? 'rgba(255, 107, 107, 0.95)' : '#d8f5ff',
                  boxShadow: isSelected
                    ? '0 0 12px rgba(108, 246, 255, 0.6)'
                    : isHovered
                      ? '0 0 10px rgba(108, 246, 255, 0.35)'
                      : 'none',
                  cursor: 'pointer',
                }}
              >
                {item.showsCone ? (
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: 50,
                      height: 50,
                      background: 'rgba(108, 246, 255, 0.18)',
                      clipPath: 'polygon(50% 10%, 0% 100%, 100% 100%)',
                      transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                      transformOrigin: '50% 50%',
                      pointerEvents: 'none',
                      filter: 'blur(0.5px)',
                    }}
                  />
                ) : null}
                <Icon width={24} height={24} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FloorplanCanvas;
