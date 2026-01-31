import type { FloorplanDeviceType } from '../../lib/homeSecurityFunnel';
import {
  DoorSensorIcon,
  DoorbellIcon,
  GlassBreakIcon,
  IndoorCameraIcon,
  LeakSensorIcon,
  MotionSensorIcon,
  OutdoorCameraIcon,
  RecordingHostIcon,
  SecurityHubIcon,
  SirenIcon,
  WindowSensorIcon,
} from './icons';

export type DeviceCatalogEntry = {
  type: FloorplanDeviceType;
  label: string;
  category:
    | 'entry'
    | 'interior'
    | 'exterior'
    | 'safety'
    | 'infrastructure';
  placement: 'wall' | 'interior' | 'corner';
  icon: typeof DoorSensorIcon;
  subtle?: boolean;
};

export const deviceCatalog: DeviceCatalogEntry[] = [
  {
    type: 'doorSensor',
    label: 'Door Sensor',
    category: 'entry',
    placement: 'wall',
    icon: DoorSensorIcon,
  },
  {
    type: 'windowSensor',
    label: 'Window Sensor',
    category: 'entry',
    placement: 'wall',
    icon: WindowSensorIcon,
  },
  {
    type: 'glassBreak',
    label: 'Glass Break Sensor',
    category: 'entry',
    placement: 'interior',
    icon: GlassBreakIcon,
  },
  {
    type: 'motion',
    label: 'Motion Sensor',
    category: 'interior',
    placement: 'corner',
    icon: MotionSensorIcon,
  },
  {
    type: 'indoorCamera',
    label: 'Indoor Camera',
    category: 'interior',
    placement: 'wall',
    icon: IndoorCameraIcon,
  },
  {
    type: 'doorbell',
    label: 'Video Doorbell',
    category: 'exterior',
    placement: 'wall',
    icon: DoorbellIcon,
  },
  {
    type: 'outdoorCamera',
    label: 'Outdoor Camera (PoE)',
    category: 'exterior',
    placement: 'wall',
    icon: OutdoorCameraIcon,
  },
  {
    type: 'leak',
    label: 'Leak Sensor',
    category: 'safety',
    placement: 'interior',
    icon: LeakSensorIcon,
  },
  {
    type: 'siren',
    label: 'Siren / Chime',
    category: 'safety',
    placement: 'interior',
    icon: SirenIcon,
  },
  {
    type: 'securityHub',
    label: 'Security Hub',
    category: 'infrastructure',
    placement: 'interior',
    icon: SecurityHubIcon,
    subtle: true,
  },
  {
    type: 'recordingHost',
    label: 'Recording Host',
    category: 'infrastructure',
    placement: 'interior',
    icon: RecordingHostIcon,
    subtle: true,
  },
];

export const deviceCatalogMap = new Map(deviceCatalog.map((entry) => [entry.type, entry]));
