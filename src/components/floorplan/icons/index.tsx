import type { CSSProperties } from 'react';

const baseIconStyle: CSSProperties = {
  display: 'block',
};

const baseStroke = {
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  fill: 'none',
} as const;

type IconProps = {
  size?: number;
  className?: string;
};

export const DoorSensorIcon = ({ size = 24, className }: IconProps) => (
  <svg
    style={baseIconStyle}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    aria-hidden
    className={className}
  >
    <rect x="5" y="4" width="6" height="16" rx="2" {...baseStroke} />
    <rect x="13" y="7" width="6" height="10" rx="2" {...baseStroke} />
    <line x1="11" y1="12" x2="13" y2="12" {...baseStroke} />
  </svg>
);

export const WindowSensorIcon = ({ size = 24, className }: IconProps) => (
  <svg
    style={baseIconStyle}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    aria-hidden
    className={className}
  >
    <rect x="4" y="5" width="16" height="14" rx="2" {...baseStroke} />
    <line x1="12" y1="5" x2="12" y2="19" {...baseStroke} />
    <line x1="4" y1="12" x2="20" y2="12" {...baseStroke} />
  </svg>
);

export const GlassBreakIcon = ({ size = 24, className }: IconProps) => (
  <svg
    style={baseIconStyle}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    aria-hidden
    className={className}
  >
    <circle cx="12" cy="12" r="8" {...baseStroke} />
    <path d="M12 6l-2 4 3 2-2 4 3 2" {...baseStroke} />
  </svg>
);

export const MotionSensorIcon = ({ size = 24, className }: IconProps) => (
  <svg
    style={baseIconStyle}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    aria-hidden
    className={className}
  >
    <path d="M8 6c-1.8 1.8-1.8 4.7 0 6.5" {...baseStroke} />
    <path d="M12 4c-2.9 2.9-2.9 7.6 0 10.5" {...baseStroke} />
    <path d="M16 6c-1.8 1.8-1.8 4.7 0 6.5" {...baseStroke} />
    <circle cx="12" cy="17" r="2" {...baseStroke} />
  </svg>
);

export const IndoorCameraIcon = ({ size = 24, className }: IconProps) => (
  <svg
    style={baseIconStyle}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    aria-hidden
    className={className}
  >
    <rect x="6" y="6" width="12" height="9" rx="2" {...baseStroke} />
    <circle cx="12" cy="10.5" r="2.5" {...baseStroke} />
    <path d="M9 18h6" {...baseStroke} />
  </svg>
);

export const DoorbellIcon = ({ size = 24, className }: IconProps) => (
  <svg
    style={baseIconStyle}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    aria-hidden
    className={className}
  >
    <rect x="8" y="3" width="8" height="18" rx="3" {...baseStroke} />
    <circle cx="12" cy="9" r="2" {...baseStroke} />
    <circle cx="12" cy="15" r="1.5" {...baseStroke} />
  </svg>
);

export const OutdoorCameraIcon = ({ size = 24, className }: IconProps) => (
  <svg
    style={baseIconStyle}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    aria-hidden
    className={className}
  >
    <rect x="4" y="8" width="12" height="7" rx="2" {...baseStroke} />
    <circle cx="10" cy="11.5" r="2.5" {...baseStroke} />
    <path d="M16 11l4 2" {...baseStroke} />
    <path d="M8 17h6" {...baseStroke} />
  </svg>
);

export const LeakSensorIcon = ({ size = 24, className }: IconProps) => (
  <svg
    style={baseIconStyle}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    aria-hidden
    className={className}
  >
    <path d="M12 3c3 4 5 6.4 5 9a5 5 0 0 1-10 0c0-2.6 2-5 5-9Z" {...baseStroke} />
    <path d="M9.5 14.5c.5 1 1.4 1.5 2.5 1.5" {...baseStroke} />
  </svg>
);

export const SirenIcon = ({ size = 24, className }: IconProps) => (
  <svg
    style={baseIconStyle}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    aria-hidden
    className={className}
  >
    <path d="M6 13a6 6 0 0 1 12 0" {...baseStroke} />
    <path d="M5 17h14" {...baseStroke} />
    <path d="M12 7v3" {...baseStroke} />
  </svg>
);

export const SecurityHubIcon = ({ size = 24, className }: IconProps) => (
  <svg
    style={baseIconStyle}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    aria-hidden
    className={className}
  >
    <rect x="6" y="6" width="12" height="12" rx="3" {...baseStroke} />
    <circle cx="12" cy="12" r="2" {...baseStroke} />
    <path d="M8 8l2 2" {...baseStroke} />
    <path d="M16 8l-2 2" {...baseStroke} />
  </svg>
);

export const RecordingHostIcon = ({ size = 24, className }: IconProps) => (
  <svg
    style={baseIconStyle}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    aria-hidden
    className={className}
  >
    <rect x="4" y="6" width="16" height="12" rx="2" {...baseStroke} />
    <circle cx="8" cy="12" r="1" {...baseStroke} />
    <circle cx="12" cy="12" r="1" {...baseStroke} />
    <circle cx="16" cy="12" r="1" {...baseStroke} />
  </svg>
);

export const FloorplanIconShell = ({ children, size = 28 }: { children: React.ReactNode; size?: number }) => (
  <span
    style={{
      width: size,
      height: size,
      borderRadius: '0.65rem',
      background: 'rgba(15, 24, 40, 0.6)',
      border: '1px solid rgba(108, 246, 255, 0.35)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#d9e6f5',
    }}
  >
    {children}
  </span>
);
