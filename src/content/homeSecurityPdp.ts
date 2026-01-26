export type HomeSecurityPdpGroup = {
  title: string;
  items: string[];
};

export type HomeSecurityPdpContent = {
  heroOneLiner: string;
  keyOutcomes: string[];
  idealFor: string[];
  whatYouGet: HomeSecurityPdpGroup[];
  whatsIncluded: string[];
  typicalCoverage: {
    squareFootage: string;
    entrances: string;
    cameras: string;
  };
  capabilities: string[];
  limitations: string[];
  howItWorks: string[];
};

export const HOME_SECURITY_PDP_CONTENT: Record<'a1' | 'a2' | 'a3', HomeSecurityPdpContent> = {
  a1: {
    heroOneLiner: 'Starter coverage with local-first alerts, entry awareness, and essential cameras.',
    keyOutcomes: [
      'Know when doors/windows open and who approaches the main entry.',
      'Get indoor motion alerts with a local siren/chime response.',
      'Catch common leaks or smoke events early.',
      'Automations that still work even when the internet doesn’t.',
      'Single dashboard control in Home Assistant.',
    ],
    idealFor: [
      'Apartments and small homes (~800–1,200 sq ft).',
      'First-time security setups.',
      'Households that want local-first alerts without subscriptions.',
    ],
    whatYouGet: [
      {
        title: 'Core',
        items: [
          'Mini PC running Home Assistant (1)',
          'Zigbee USB radio (1)',
          'Z-Wave USB radio (1)',
          'CloudKey+ local recording host (1)',
        ],
      },
      {
        title: 'Cameras',
        items: ['Indoor camera (1)', 'Outdoor or doorbell camera (1)'],
      },
      {
        title: 'Sensors & Alerts',
        items: [
          'Door/window sensors (2–4)',
          'Motion sensor (1)',
          'Leak or smoke sensor (1)',
          'Local siren/chime (1)',
        ],
      },
    ],
    whatsIncluded: [
      'Mini PC running Home Assistant (control plane)',
      'Zigbee + Z-Wave USB radios',
      'CloudKey+ local recording host',
      '1 indoor camera',
      '1 outdoor or doorbell camera',
      '2–4 door/window sensors',
      '1 motion sensor',
      '1 leak or smoke sensor',
      'Local siren/chime',
    ],
    typicalCoverage: {
      squareFootage: '~800–1,200 sq ft',
      entrances: '1 main entry + 2–3 doors/windows',
      cameras: '1 indoor + 1 outdoor/doorbell',
    },
    capabilities: [
      'Local-first alerts for entry, motion, and leak/smoke events.',
      'Camera views and recordings stay on your LAN by default.',
      'Local automations inside Home Assistant.',
    ],
    limitations: [
      'Not a professionally monitored alarm unless you add a third-party service.',
      'Single outdoor/doorbell view versus expanded coverage in Silver/Gold.',
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
    heroOneLiner: 'Whole-home coverage with more sensors, more indoor views, and a PoE outdoor camera.',
    keyOutcomes: [
      'Balanced coverage for most homeowners.',
      'Expanded entry and motion coverage across main living areas.',
      'Two indoor views for faster verification.',
      'Local-first recording and control with optional remote access.',
      'Expandable foundation without subscriptions sold by us.',
    ],
    idealFor: [
      'Most homeowners (~1,200–2,000 sq ft).',
      'Homes with a main and secondary entry.',
      'Households that want reliable outdoor visibility.',
    ],
    whatYouGet: [
      {
        title: 'Core',
        items: [
          'Mini PC running Home Assistant (1)',
          'Zigbee USB radio (1)',
          'Z-Wave USB radio (1)',
          'CloudKey+ local recording host (1)',
        ],
      },
      {
        title: 'Cameras',
        items: ['Indoor cameras (2)', 'Outdoor PoE camera (1)', 'PoE adapter/injector (1)'],
      },
      {
        title: 'Sensors & Alerts',
        items: [
          'Door/window sensors (4–6)',
          'Motion sensors (2)',
          'Leak or smoke sensors (2)',
          'Local siren/chime (1)',
        ],
      },
    ],
    whatsIncluded: [
      'Mini PC running Home Assistant (control plane)',
      'Zigbee + Z-Wave USB radios',
      'CloudKey+ local recording host',
      '2 indoor cameras',
      '1 outdoor PoE camera',
      '4–6 door/window sensors',
      '2 motion sensors',
      '2 leak or smoke sensors',
      'Local siren/chime',
    ],
    typicalCoverage: {
      squareFootage: '~1,200–2,000 sq ft',
      entrances: 'Main + secondary entry',
      cameras: '2 indoor + 1 outdoor (PoE)',
    },
    capabilities: [
      'Indoor + outdoor PoE camera coverage.',
      'More sensors for entry + motion.',
      'Multiple leak/smoke detection zones.',
      'Automation scenes (night mode, away mode, etc.).',
    ],
    limitations: ['Dedicated NVR recording is only included in Gold.'],
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
      'Maximum coverage with dedicated local recording and the highest camera + sensor footprint.',
    keyOutcomes: [
      'Dedicated UNVR + drives for reliable local recording.',
      'Two PoE outdoor cameras for multi-angle visibility.',
      'Highest sensor coverage across doors/windows and motion zones.',
      'Fast local alerts + automations that keep working offline.',
      'Built to expand into whole-home automation later.',
    ],
    idealFor: [
      'Larger homes (~2,000–3,500+ sq ft).',
      'Homes with multiple exterior entries.',
      'Higher risk tolerance and maximum coverage needs.',
    ],
    whatYouGet: [
      {
        title: 'Core',
        items: [
          'Mini PC running Home Assistant (1)',
          'Zigbee USB radio (1)',
          'Z-Wave USB radio (1)',
          'Dedicated UNVR (1)',
          'Surveillance hard drives (2)',
        ],
      },
      {
        title: 'Cameras',
        items: ['Indoor cameras (2–3)', 'Outdoor PoE cameras (2)', 'PoE adapters/injectors (2)'],
      },
      {
        title: 'Sensors & Alerts',
        items: [
          'Door/window sensors (6–10)',
          'Motion sensors (3)',
          'Leak or smoke sensors (3)',
          'Local siren/chime (1)',
        ],
      },
    ],
    whatsIncluded: [
      'Mini PC running Home Assistant (control plane)',
      'Zigbee + Z-Wave USB radios',
      'Dedicated UNVR with surveillance drives',
      '2–3 indoor cameras',
      '2 outdoor PoE cameras',
      '6–10 door/window sensors',
      '3 motion sensors',
      '3 leak or smoke sensors',
      'Local siren/chime',
    ],
    typicalCoverage: {
      squareFootage: '~2,000–3,500+ sq ft',
      entrances: 'Multiple exterior entries',
      cameras: '2–3 indoor + 2 outdoor (PoE)',
    },
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
