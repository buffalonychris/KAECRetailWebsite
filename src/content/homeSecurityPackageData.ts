export type HomeSecurityTierId = 'a1' | 'a2' | 'a3';

export type HomeSecurityHardwareSpec = {
  videoDoorbell: number;
  indoorCameras: number;
  outdoorPoECameras: number;
  doorWindowSensors: number;
  motionSensors: number;
  leakSmokeSensors: number;
  sirenChime: number;
  recordingLabel: string;
  nvrIncluded: boolean;
};

export type HomeSecurityPackageSpec = {
  id: HomeSecurityTierId;
  name: 'Bronze' | 'Silver' | 'Gold';
  coverage: string;
  entrances: string;
  cameras: string;
  hardware: HomeSecurityHardwareSpec;
  capabilities: string[];
};

export const HOME_SECURITY_CLARITY_FOOTER =
  'Equipment is owned by the customer. No monitoring subscription is sold by us. Optional third-party services connect directly to the customer. Optional remote viewing requires an active internet connection. Installation scope is finalized after site assessment.';

export const HOME_SECURITY_PACKAGE_SPECS: Record<HomeSecurityTierId, HomeSecurityPackageSpec> = {
  a1: {
    id: 'a1',
    name: 'Bronze',
    coverage: '~800–1,200 sq ft',
    entrances: '1 main entry + a couple of doors/windows',
    cameras: 'Video doorbell + 1 indoor camera',
    hardware: {
      videoDoorbell: 1,
      indoorCameras: 1,
      outdoorPoECameras: 0,
      doorWindowSensors: 2,
      motionSensors: 1,
      leakSmokeSensors: 1,
      sirenChime: 1,
      recordingLabel: 'Local recording host (package-sized)',
      nvrIncluded: false,
    },
    capabilities: [
      'Local-first control in Home Assistant with LAN reliability.',
      'Optional remote viewing with active internet access.',
      'Local recording host sized to the package (no NVR in Bronze).',
      'No subscriptions sold by us; equipment stays owned by you.',
    ],
  },
  a2: {
    id: 'a2',
    name: 'Silver',
    coverage: '~1,200–2,000 sq ft',
    entrances: 'Main + secondary entry points',
    cameras: 'Video doorbell + 2 indoor + 1 outdoor PoE',
    hardware: {
      videoDoorbell: 1,
      indoorCameras: 2,
      outdoorPoECameras: 1,
      doorWindowSensors: 4,
      motionSensors: 2,
      leakSmokeSensors: 2,
      sirenChime: 1,
      recordingLabel: 'NVR included (sized by tier)',
      nvrIncluded: true,
    },
    capabilities: [
      'Local-first control with expanded indoor + outdoor coverage.',
      'Optional remote viewing with active internet access.',
      'NVR included and sized to the Silver tier.',
      'No subscriptions sold by us; equipment stays owned by you.',
    ],
  },
  a3: {
    id: 'a3',
    name: 'Gold',
    coverage: '~2,000–3,500+ sq ft',
    entrances: 'Multiple exterior entries and interior zones',
    cameras: 'Video doorbell + 3 indoor + 2 outdoor PoE',
    hardware: {
      videoDoorbell: 1,
      indoorCameras: 3,
      outdoorPoECameras: 2,
      doorWindowSensors: 6,
      motionSensors: 3,
      leakSmokeSensors: 3,
      sirenChime: 1,
      recordingLabel: 'NVR included (sized by tier)',
      nvrIncluded: true,
    },
    capabilities: [
      'Local-first control with the highest camera and sensor coverage.',
      'Optional remote viewing with active internet access.',
      'NVR included and sized to the Gold tier.',
      'No subscriptions sold by us; equipment stays owned by you.',
    ],
  },
};

export const getHomeSecurityPackageSpec = (id: HomeSecurityTierId) => HOME_SECURITY_PACKAGE_SPECS[id];

export const getHomeSecurityHardwareList = (id: HomeSecurityTierId) => {
  const spec = HOME_SECURITY_PACKAGE_SPECS[id];
  return [
    'Control plane: Mini PC + Zigbee + Z-Wave',
    `Video doorbell (${spec.hardware.videoDoorbell})`,
    `Indoor cameras (${spec.hardware.indoorCameras})`,
    `Outdoor PoE cameras (${spec.hardware.outdoorPoECameras})`,
    `Door/window sensors (${spec.hardware.doorWindowSensors})`,
    `Motion sensors (${spec.hardware.motionSensors})`,
    `Leak/Smoke sensors (${spec.hardware.leakSmokeSensors})`,
    `Siren/chime (${spec.hardware.sirenChime})`,
    `Recording: ${spec.hardware.recordingLabel}`,
  ];
};
