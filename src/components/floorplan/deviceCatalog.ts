import type { FC, SVGProps } from 'react';
import {
  DoorSensorIcon,
  GlassBreakSensorIcon,
  IndoorCameraIcon,
  LeakSensorIcon,
  MotionSensorIcon,
  OutdoorCameraPoeIcon,
  RecordingHostIcon,
  SecurityHubIcon,
  SirenChimeIcon,
  VideoDoorbellIcon,
  WindowSensorIcon,
} from './icons';

export type FloorplanDeviceType =
  | 'door_sensor'
  | 'window_sensor'
  | 'glass_break_sensor'
  | 'motion_sensor'
  | 'indoor_camera'
  | 'video_doorbell'
  | 'outdoor_camera_poe'
  | 'leak_sensor'
  | 'siren_chime'
  | 'security_hub'
  | 'recording_host';

export type FloorplanDeviceCategory = 'entry' | 'interior' | 'video' | 'safety' | 'infrastructure';

export type FloorplanCatalogItem = {
  type: FloorplanDeviceType;
  label: string;
  category: FloorplanDeviceCategory;
  icon: FC<SVGProps<SVGSVGElement>>;
  wallAnchored: boolean;
  showsCone?: boolean;
};

export const DEVICE_KEYS = [
  'door_sensor',
  'window_sensor',
  'glass_break_sensor',
  'motion_sensor',
  'indoor_camera',
  'video_doorbell',
  'outdoor_camera_poe',
  'leak_sensor',
  'siren_chime',
  'security_hub',
  'recording_host',
] as const satisfies readonly FloorplanDeviceType[];

export const DEVICE_CATALOG: Record<FloorplanDeviceType, FloorplanCatalogItem> = {
  door_sensor: {
    type: 'door_sensor',
    label: 'Door Sensor',
    category: 'entry',
    icon: DoorSensorIcon,
    wallAnchored: true,
  },
  window_sensor: {
    type: 'window_sensor',
    label: 'Window Sensor',
    category: 'entry',
    icon: WindowSensorIcon,
    wallAnchored: true,
  },
  glass_break_sensor: {
    type: 'glass_break_sensor',
    label: 'Glass Break Sensor',
    category: 'interior',
    icon: GlassBreakSensorIcon,
    wallAnchored: false,
  },
  motion_sensor: {
    type: 'motion_sensor',
    label: 'Motion Sensor',
    category: 'interior',
    icon: MotionSensorIcon,
    wallAnchored: false,
  },
  indoor_camera: {
    type: 'indoor_camera',
    label: 'Indoor Camera',
    category: 'video',
    icon: IndoorCameraIcon,
    wallAnchored: false,
    showsCone: true,
  },
  video_doorbell: {
    type: 'video_doorbell',
    label: 'Video Doorbell',
    category: 'video',
    icon: VideoDoorbellIcon,
    wallAnchored: true,
    showsCone: true,
  },
  outdoor_camera_poe: {
    type: 'outdoor_camera_poe',
    label: 'Outdoor Camera (PoE)',
    category: 'video',
    icon: OutdoorCameraPoeIcon,
    wallAnchored: false,
    showsCone: true,
  },
  leak_sensor: {
    type: 'leak_sensor',
    label: 'Leak Sensor',
    category: 'safety',
    icon: LeakSensorIcon,
    wallAnchored: false,
  },
  siren_chime: {
    type: 'siren_chime',
    label: 'Siren / Chime',
    category: 'safety',
    icon: SirenChimeIcon,
    wallAnchored: false,
  },
  security_hub: {
    type: 'security_hub',
    label: 'Security Hub',
    category: 'infrastructure',
    icon: SecurityHubIcon,
    wallAnchored: false,
  },
  recording_host: {
    type: 'recording_host',
    label: 'Recording Host',
    category: 'infrastructure',
    icon: RecordingHostIcon,
    wallAnchored: false,
  },
};

export const isFloorplanDeviceType = (value: string): value is FloorplanDeviceType => {
  return (DEVICE_KEYS as readonly string[]).includes(value);
};
