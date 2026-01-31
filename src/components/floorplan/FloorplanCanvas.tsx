import { useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { DEVICE_CATALOG } from './deviceCatalog';
import type { FloorplanFloor, FloorplanPlacement, FloorplanWall } from '../../lib/homeSecurityFunnel';

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
  selectedRoomId?: string;
  selectedPlacementId?: string | null;
  onSelectRoom: (id: string) => void;
  onSelectPlacement?: (id: string) => void;
  onCanvasClick?: (point: { x: number; y: number }) => void;
  onUpdateRoomRect?: (id: string, rect: { x: number; y: number; w: number; h: number }) => void;
  width?: number | string;
  height?: number;
};

const markerBaseStyles = {
  position: 'absolute' as const,
  transform: 'translate(-50%, -50%)',
  borderRadius: '999px',
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

const getWallRotation = (wall: FloorplanWall) => {
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

const FloorplanCanvas = ({
  floor,
  placements = [],
  selectedRoomId,
  selectedPlacementId,
  onSelectRoom,
  onSelectPlacement,
  onCanvasClick,
  onUpdateRoomRect,
  width = '100%',
  height = 320,
}: FloorplanCanvasProps) => {
  const selectedRoom = floor.rooms.find((room) => room.id === selectedRoomId);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [hoveredPlacementId, setHoveredPlacementId] = useState<string | null>(null);

  const handleSurfaceClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!onCanvasClick) return;
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
          {placements.map((placement) => {
            const item = DEVICE_CATALOG[placement.deviceKey];
            const Icon = item.icon;
            const invalid = item.wallAnchored && !placement.wallSnap;
            const isSelected = placement.id === selectedPlacementId;
            const isHovered = placement.id === hoveredPlacementId;
            const rotation =
              placement.rotation ?? (placement.wallSnap ? getWallRotation(placement.wallSnap.wall) : 0);
            return (
              <button
                key={placement.id}
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onSelectPlacement?.(placement.id);
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
