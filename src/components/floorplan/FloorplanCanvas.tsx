import type { FloorplanFloor } from '../../lib/homeSecurityFunnel';

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
  selectedRoomId?: string;
  onSelectRoom: (id: string) => void;
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

const FloorplanCanvas = ({
  floor,
  selectedRoomId,
  onSelectRoom,
  onUpdateRoomRect,
  width = '100%',
  height = 320,
}: FloorplanCanvasProps) => {
  const selectedRoom = floor.rooms.find((room) => room.id === selectedRoomId);

  return (
    <div style={canvasStyles}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
        <strong>{floor.label} map</strong>
        <span style={{ color: 'rgba(214, 233, 248, 0.75)' }}>
          Selected room: {selectedRoom ? selectedRoom.name : 'None'}
        </span>
      </div>
      <div style={{ marginTop: '0.75rem', ...viewportStyles, height, width }}>
        <div style={surfaceStyles}>
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
        </div>
      </div>
    </div>
  );
};

export default FloorplanCanvas;
