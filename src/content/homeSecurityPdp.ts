export type HomeSecurityPdpGroup = {
  title: string;
  items: string[];
};

export type HomeSecurityPdpContent = {
  heroOneLiner: string;
  keyOutcomes: string[];
  idealFor: string[];
  whatYouGet: HomeSecurityPdpGroup[];
  capabilities: string[];
  limitations: string[];
  howItWorks: string[];
};

export const HOME_SECURITY_PDP_CONTENT: Record<'a1' | 'a2' | 'a3', HomeSecurityPdpContent> = {
  a1: {
    heroOneLiner: 'Start strong: modern doorbell + core sensors + local-first alerts.',
    keyOutcomes: [
      'See who’s at the door and get instant entry alerts.',
      'Detect motion inside and get notified fast.',
      'Catch common water leaks early (under-sink / laundry / basement).',
      'Automations that still work even when the internet doesn’t.',
      'Single dashboard control in Home Assistant.',
    ],
    idealFor: [
      'Apartments and small homes.',
      'First-time security upgrade.',
      'People who want simple coverage done right.',
    ],
    whatYouGet: [
      {
        title: 'Core',
        items: ['Home Assistant Hub (1)', 'Zigbee/Thread Radio (1)', 'Z-Wave Radio (1)'],
      },
      {
        title: 'Video & Entry',
        items: ['Video Doorbell (1)', 'Smart Chime (1)', 'Doorbell Power Supply (1)'],
      },
      {
        title: 'Cameras',
        items: ['Indoor Camera (1)'],
      },
      {
        title: 'Sensors & Alerts',
        items: [
          'Door/Window Sensor (4)',
          'Motion Sensor (1)',
          'Water Leak Sensor (1)',
          'Smart Plug (2)',
          'Siren / Chime (1)',
        ],
      },
    ],
    capabilities: [
      'Doorbell video + chime alerts.',
      'Entry alerts (doors/windows) and indoor motion alerts.',
      'Water leak alerting.',
      'Local automations inside Home Assistant.',
    ],
    limitations: [
      'Not a professionally monitored alarm (unless user adds 3rd-party service).',
      'Outdoor camera coverage limited compared to Silver/Gold.',
    ],
    howItWorks: [
      'Quick discovery call: goals, layout, and priorities.',
      'Site-specific plan: sensor placement + camera angles.',
      'Install day: devices mounted, paired, tested.',
      'Automation setup: alerts + routines.',
      'Handoff: walkthrough + basic training.',
    ],
  },
  a2: {
    heroOneLiner: 'Balanced coverage: doorbell + indoor + outdoor camera, plus broader sensors.',
    keyOutcomes: [
      'Better perimeter visibility with an outdoor camera.',
      'More entry points covered (doors/windows) and more motion zones.',
      'Leak detection in multiple risk spots.',
      'Local recording/control-first approach (privacy-first by default).',
      'Expandable foundation without subscriptions sold by us.',
    ],
    idealFor: [
      'Most homes.',
      'Families who want stronger day-to-day awareness.',
      'Homes with multiple entrances and a driveway/front yard.',
    ],
    whatYouGet: [
      {
        title: 'Core',
        items: ['Home Assistant Hub (1)', 'Zigbee/Thread Radio (1)', 'Z-Wave Radio (1)'],
      },
      {
        title: 'Video & Entry',
        items: ['Video Doorbell (1)', 'Smart Chime (1)', 'Doorbell Power Supply (1)'],
      },
      {
        title: 'Cameras',
        items: ['Indoor Camera (2)', 'Outdoor PoE Camera (1)', 'PoE Adapter / Injector (1)'],
      },
      {
        title: 'Sensors & Alerts',
        items: [
          'Door/Window Sensor (6)',
          'Motion Sensor (2)',
          'Water Leak Sensor (2)',
          'Smart Plug (4)',
          'Siren / Chime (1)',
        ],
      },
    ],
    capabilities: [
      'Doorbell + indoor + outdoor camera coverage.',
      'More sensors for entry + motion.',
      'Multiple leak detection zones.',
      'Automation scenes (night mode, away mode, etc.).',
    ],
    limitations: ['Not a full NVR rack-style system like Gold (Gold has dedicated NVR + drives).'],
    howItWorks: [
      'Discovery: confirm entrances, camera goals, and notification style.',
      'Placement plan: optimize coverage for day + night.',
      'Install & pairing: cameras + sensors + siren tested.',
      'Automation tuning: reduce false alarms; refine alert rules.',
      'Handoff: training + support path.',
    ],
  },
  a3: {
    heroOneLiner:
      'Maximum coverage: dedicated local recording + strongest camera and sensor footprint.',
    keyOutcomes: [
      'Dedicated NVR + drives for local recording reliability.',
      'Outdoor visibility across more angles (more PoE cameras).',
      'Highest sensor coverage across doors/windows and motion zones.',
      'Fast local alerts + automations that keep working offline.',
      'Built to expand into whole-home automation later.',
    ],
    idealFor: [
      'Full-property coverage.',
      'Privacy-first households who want local recording.',
      'Homes needing maximum reliability and expandability.',
    ],
    whatYouGet: [
      {
        title: 'Core',
        items: [
          'Home Assistant Hub (1)',
          'Zigbee/Thread Radio (1)',
          'Z-Wave Radio (1)',
          'Network Video Recorder (1)',
          'Surveillance Hard Drive (2)',
        ],
      },
      {
        title: 'Video & Entry',
        items: ['Video Doorbell (1)', 'Smart Chime (1)', 'Doorbell Power Supply (1)'],
      },
      {
        title: 'Cameras',
        items: ['Indoor Camera (2)', 'Outdoor PoE Camera (2)', 'PoE Adapter / Injector (2)'],
      },
      {
        title: 'Sensors & Alerts',
        items: [
          'Door/Window Sensor (10)',
          'Motion Sensor (3)',
          'Water Leak Sensor (3)',
          'Smart Plug (6)',
          'Siren / Chime (1)',
        ],
      },
    ],
    capabilities: [
      'Dedicated local recording + expanded camera coverage.',
      'Highest sensor footprint for doors/windows/motion.',
      'Best foundation for layered routines (night/away/vacation).',
    ],
    limitations: ['Requires more install time and planning (more devices).'],
    howItWorks: [
      'Discovery: map property + threat/risk priorities.',
      'Coverage plan: camera angles + sensor placement.',
      'Install: NVR + cameras + sensors + siren, fully tested.',
      'Automation tuning + recording checks.',
      'Handoff: training + expansion roadmap.',
    ],
  },
};
