export type PackageTier = {
  name: string;
  tagline: string;
  whatYouGet: string[];
  whatItDoes: string[];
  offlineNote: string;
  ownershipNote: string;
};

export type AddOnTier = {
  title: string;
  description: string;
  items: string[];
};

export type HowItWorksStep = {
  title: string;
  description: string;
};

export type VerticalFAQ = {
  question: string;
  answer: string;
};

export type VerticalContent = {
  id: 'security' | 'automation' | 'elder';
  name: string;
  shortName: string;
  badge: string;
  heroHeadline: string;
  heroSubhead: string;
  audience: string[];
  outcomes: string[];
  privacyCallout: string;
  ownershipCallout: string;
  businessNote: string;
  ctas: {
    primary: { label: string; to: string };
    secondary: { label: string; to: string };
  };
  paths: {
    overview: string;
    packages: string;
    addons: string;
    howItWorks: string;
    faq: string;
  };
  packageTiers: PackageTier[];
  addOnTiers: AddOnTier[];
  howItWorks: HowItWorksStep[];
  faqs: VerticalFAQ[];
};

export const verticals: Record<VerticalContent['id'], VerticalContent> = {
  security: {
    id: 'security',
    name: 'Home Security',
    shortName: 'Security',
    badge: 'Local-first security',
    heroHeadline: 'Security that keeps working when the cloud does not',
    heroSubhead:
      'Layered sensors, verified alerts, and clear handoffs—built on Home Assistant so your protection stays local, private, and fully owned.',
    audience: [
      'Homeowners who want dependable, local-first protection without vendor lock-in.',
      'Families who need caregiver visibility without noisy, subscription-based monitoring.',
      'Homes with spotty internet or power where reliability matters most.',
    ],
    outcomes: [
      'Know when doors, windows, and critical zones are opened or breached.',
      'Trigger deterministic lighting and deterrence cues to reduce risk.',
      'Receive clear, verified alerts with documented handoffs to family or responders.',
    ],
    privacyCallout:
      'Home Assistant is the single control surface—no fragmented apps, no forced cloud accounts.',
    ownershipCallout:
      'You own the system and data. Local execution keeps control in the home, not in a vendor cloud.',
    businessNote: 'Business security tracks are being scoped now. Contact us if you need commercial coverage.',
    ctas: {
      primary: { label: 'View Security Packages', to: '/home-security/packages' },
      secondary: { label: 'Explore Security Add-ons', to: '/home-security/add-ons' },
    },
    paths: {
      overview: '/home-security',
      packages: '/home-security/packages',
      addons: '/home-security/add-ons',
      howItWorks: '/home-security/how-it-works',
      faq: '/home-security/support',
    },
    packageTiers: [
      {
        name: 'Basic',
        tagline: 'Essential perimeter coverage with local-first alerts.',
        whatYouGet: [
          'Home Assistant hub with a unified dashboard for sensors and alerts.',
          'Door/window contacts and motion sensors for key entry points.',
          'Local siren + lighting triggers for immediate deterrence.',
          'Secure, privacy-first notification routing to caregivers.',
        ],
        whatItDoes: [
          'Detects entry events and logs them locally with timestamps.',
          'Turns on safety lighting when a breach occurs.',
          'Sends verified alerts without claiming emergency dispatch.',
        ],
        offlineNote: 'Works without internet for local control, alerts, and automations.',
        ownershipNote: 'No subscription required—hardware and local automations are yours.',
      },
      {
        name: 'Plus',
        tagline: 'Expanded coverage with verified views and smart access.',
        whatYouGet: [
          'Everything in Basic, plus smart locks and keypad entry.',
          'Video doorbell and exterior camera coverage with local recording options.',
          'Glass-break and perimeter sensors for broader awareness.',
          'Structured alert routing for multi-person households.',
        ],
        whatItDoes: [
          'Adds visual verification while keeping recordings local.',
          'Supports secure entry routines for trusted visitors.',
          'Reduces false alarms with multi-sensor confirmation logic.',
        ],
        offlineNote: 'Local control and recording remain available when the internet drops.',
        ownershipNote: 'No monthly plans; optional third-party monitoring is your choice.',
      },
      {
        name: 'Pro',
        tagline: 'Whole-property security with redundancy and resilience.',
        whatYouGet: [
          'Everything in Plus, plus expanded camera coverage and local NVR.',
          'Driveway or perimeter detection with advanced lighting deterrence.',
          'Battery backup for hub/network to sustain local operation.',
          'Optional cellular notification fallback (no required subscription).',
        ],
        whatItDoes: [
          'Maintains security visibility across larger properties.',
          'Adds redundant alert paths for critical events.',
          'Keeps local control intact during connectivity disruptions.',
        ],
        offlineNote: 'Local control persists even during internet outages.',
        ownershipNote: 'Ownership-first: no required subscriptions or vendor lock-ins.',
      },
    ],
    addOnTiers: [
      {
        title: 'Easy wins',
        description: 'Quick upgrades that improve entry awareness and deterrence.',
        items: [
          'Video doorbells with local storage options',
          'Smart locks with local keypad control',
          'Glass-break sensors for vulnerable windows',
          'Driveway or gate sensors',
        ],
      },
      {
        title: 'Expanded coverage',
        description: 'Broader exterior and safety coverage with local recording.',
        items: [
          'Outdoor cameras paired with local NVR storage',
          'Floodlight cameras and perimeter lighting scenes',
          'Smoke/CO detectors integrated into Home Assistant',
          'Leak detection for basements and utility rooms',
        ],
      },
      {
        title: 'Advanced resilience',
        description: 'Redundant alerting and hardened infrastructure.',
        items: [
          'UPS battery backup for hub and networking gear',
          'Cellular notification failover (optional)',
          'Perimeter beams or radar sensors',
          'Secure keypads and access control expansion',
        ],
      },
    ],
    howItWorks: [
      {
        title: 'Security discovery',
        description: 'We map entry points, risk zones, and daily routines to define the right coverage plan.',
      },
      {
        title: 'Local-first system design',
        description: 'We design the Home Assistant system so core protections run locally without cloud dependency.',
      },
      {
        title: 'Install and verification',
        description: 'Hardware is installed, tested, and verified with deterministic alert behavior.',
      },
      {
        title: 'Caregiver handoff',
        description: 'We document alert routing and provide simple escalation playbooks.',
      },
      {
        title: 'Support and tuning',
        description: 'We adjust zones, scenes, and alert timing as your needs change.',
      },
    ],
    faqs: [
      {
        question: 'Do you sell monitoring subscriptions?',
        answer:
          'No. We do not sell monthly monitoring plans. If you want professional monitoring, we can integrate a third-party provider that you contract with directly.',
      },
      {
        question: 'Does security work without internet?',
        answer:
          'Yes. Local control, lighting scenes, and sensor automation run on Home Assistant without internet access.',
      },
      {
        question: 'Is cloud required for cameras?',
        answer:
          'No. We prioritize local recording and storage. Cloud access is optional and never required for local control.',
      },
      {
        question: 'Can I expand later?',
        answer:
          'Absolutely. We can add sensors, cameras, and automations over time without changing your core platform.',
      },
    ],
  },
  automation: {
    id: 'automation',
    name: 'Home Automation',
    shortName: 'Automation',
    badge: 'Local-first automation',
    heroHeadline: 'Automation that keeps routines reliable and predictable',
    heroSubhead:
      'Deterministic scenes, local execution, and a single Home Assistant dashboard—built for comfort without app sprawl.',
    audience: [
      'Busy households that want reliable routines instead of gadget chaos.',
      'Energy-conscious homeowners looking for smarter comfort control.',
      'Caregivers who need simple, consistent home behavior.',
    ],
    outcomes: [
      'Consistent daily routines for lighting, comfort, and safety.',
      'Reduced energy waste with local scheduling and sensor-driven logic.',
      'One dashboard for every room—no vendor lock-in or app juggling.',
    ],
    privacyCallout:
      'Automation runs locally on Home Assistant so your routines stay private and responsive.',
    ownershipCallout:
      'No subscription required for core automation. You own the rules, devices, and data.',
    businessNote: 'Business automation tracks are in development. Reach out for commercial timelines.',
    ctas: {
      primary: { label: 'View Automation Packages', to: '/home-automation/packages' },
      secondary: { label: 'Explore Automation Add-ons', to: '/home-automation/add-ons' },
    },
    paths: {
      overview: '/home-automation',
      packages: '/home-automation/packages',
      addons: '/home-automation/add-ons',
      howItWorks: '/home-automation/how-it-works',
      faq: '/home-automation/support',
    },
    packageTiers: [
      {
        name: 'Basic',
        tagline: 'Room-by-room routines with reliable local control.',
        whatYouGet: [
          'Home Assistant hub with a unified automation dashboard.',
          'Smart lighting control in key rooms with physical overrides.',
          'Occupancy and ambient sensors for context-aware scenes.',
          'Simple scene buttons for quick manual control.',
        ],
        whatItDoes: [
          'Runs morning, evening, and away scenes locally.',
          'Keeps lights and routines responsive even during outages.',
          'Simplifies daily living with consistent automation.',
        ],
        offlineNote: 'Core automations run locally without internet access.',
        ownershipNote: 'No subscription required—automation logic is fully owned.',
      },
      {
        name: 'Plus',
        tagline: 'Whole-home comfort and energy awareness.',
        whatYouGet: [
          'Everything in Basic plus smart thermostat and zoning support.',
          'Leak and temperature sensors for preventative alerts.',
          'Shade or fan automation for comfort and privacy.',
          'Energy-aware schedules with local dashboards.',
        ],
        whatItDoes: [
          'Optimizes comfort while reducing energy waste.',
          'Alerts you to environmental issues early.',
          'Keeps routines consistent without cloud dependence.',
        ],
        offlineNote: 'Local controls stay active even if the internet drops.',
        ownershipNote: 'No monthly plans or locked platforms required.',
      },
      {
        name: 'Pro',
        tagline: 'Advanced automation with resilience and expansion.',
        whatYouGet: [
          'Everything in Plus, plus whole-home energy monitoring.',
          'Smart water shutoff and critical system automations.',
          'Multi-zone audio or advanced scene control options.',
          'Backup power support for hub/network stability.',
        ],
        whatItDoes: [
          'Delivers whole-home automation with advanced safety layers.',
          'Adds resilience for essential routines.',
          'Scales with new rooms, devices, and workflows.',
        ],
        offlineNote: 'Local control remains available during connectivity loss.',
        ownershipNote: 'Ownership-first with no required subscriptions.',
      },
    ],
    addOnTiers: [
      {
        title: 'Easy wins',
        description: 'Quick upgrades to improve comfort and ease-of-use.',
        items: [
          'Smart dimmers and scene keypads',
          'Voice control options with local processing support',
          'Smart plugs for lamps and appliances',
          'Bathroom night lighting',
        ],
      },
      {
        title: 'Expanded comfort',
        description: 'Automation that improves efficiency and environmental control.',
        items: [
          'Smart shades and blind control',
          'Indoor air quality monitoring',
          'Leak detection with local alerts',
          'Energy monitoring dashboards',
        ],
      },
      {
        title: 'Advanced automation',
        description: 'Deeper infrastructure and resilience upgrades.',
        items: [
          'Whole-home audio integration',
          'Water shutoff automation',
          'EV charging scheduling',
          'Battery backup for automation hub and networking',
        ],
      },
    ],
    howItWorks: [
      {
        title: 'Routine discovery',
        description: 'We document daily patterns, comfort preferences, and pain points.',
      },
      {
        title: 'Automation blueprint',
        description: 'We design Home Assistant scenes and schedules that stay local and reliable.',
      },
      {
        title: 'Installation',
        description: 'Devices are installed with clean wiring, labeling, and dashboards.',
      },
      {
        title: 'Programming and testing',
        description: 'We test every routine with the household to ensure predictable behavior.',
      },
      {
        title: 'Ongoing tuning',
        description: 'We refine automation timing and coverage as needs evolve.',
      },
    ],
    faqs: [
      {
        question: 'Do automations keep working without internet?',
        answer:
          'Yes. Home Assistant runs automations locally, so lighting and comfort controls continue to work.',
      },
      {
        question: 'Will I need multiple apps?',
        answer:
          'No. Home Assistant is the single dashboard. We avoid app fragmentation and vendor lock-in.',
      },
      {
        question: 'Is voice control required?',
        answer:
          'No. Voice control is optional. Physical switches and local dashboards remain primary.',
      },
      {
        question: 'Can I expand the system later?',
        answer:
          'Yes. Add-ons and new automations can be layered on without changing the core platform.',
      },
    ],
  },
  elder: {
    id: 'elder',
    name: 'Elder Tech',
    shortName: 'Elder Tech',
    badge: 'Dignity-first care tech',
    heroHeadline: 'Elder Tech that respects dignity and keeps families connected',
    heroSubhead:
      'Non-medical, privacy-first support built on Home Assistant with local control and clear caregiver handoffs.',
    audience: [
      'Older adults who want to age in place with confidence.',
      'Families and caregivers who need gentle, reliable check-ins.',
      'Homes that require privacy-first support without surveillance.',
    ],
    outcomes: [
      'Gentle check-ins and safety cues that respect independence.',
      'Clear alerts when routines break or assistance may be needed.',
      'Reliable, local-first support without vendor lock-in.',
    ],
    privacyCallout:
      'No surveillance by default—privacy is preserved through local processing and consent-led visibility.',
    ownershipCallout:
      'You own the system and data. No subscriptions required for core safety workflows.',
    businessNote: 'Elder Tech business deployments are planned. Contact us for future program updates.',
    ctas: {
      primary: { label: 'View Elder Tech Packages', to: '/elder-care-tech/packages' },
      secondary: { label: 'Explore Elder Tech Add-ons', to: '/elder-care-tech/add-ons' },
    },
    paths: {
      overview: '/elder-care-tech',
      packages: '/elder-care-tech/packages',
      addons: '/elder-care-tech/add-ons',
      howItWorks: '/elder-care-tech/how-it-works',
      faq: '/elder-care-tech/support',
    },
    packageTiers: [
      {
        name: 'Basic',
        tagline: 'Low-friction reassurance for daily routines.',
        whatYouGet: [
          'Home Assistant hub with a caregiver-friendly dashboard.',
          'Motion and door sensors for activity awareness (no cameras by default).',
          'Night-path lighting and safety scene controls.',
          'Caregiver alerts for unusual inactivity.',
        ],
        whatItDoes: [
          'Notices when routines shift and prompts a gentle check-in.',
          'Improves nighttime safety with predictable lighting.',
          'Keeps families informed without constant monitoring.',
        ],
        offlineNote: 'Local alerts and controls work without internet access.',
        ownershipNote: 'No subscription required for core safety coverage.',
      },
      {
        name: 'Plus',
        tagline: 'Expanded caregiver visibility with environmental safety.',
        whatYouGet: [
          'Everything in Basic, plus bed or chair occupancy sensing options.',
          'Leak and temperature sensors for environmental safety.',
          'Smart locks with controlled caregiver access.',
          'Structured alert routing with escalation notes.',
        ],
        whatItDoes: [
          'Adds more context to daily living patterns.',
          'Flags environmental risks early.',
          'Supports trusted caregiver access without surveillance.',
        ],
        offlineNote: 'Local control continues even if the internet drops.',
        ownershipNote: 'Ownership-first—no monthly plans required.',
      },
      {
        name: 'Pro',
        tagline: 'Aging-in-place enablement with advanced safety layers.',
        whatYouGet: [
          'Everything in Plus, plus stove or appliance safety shutoff options.',
          'Bathroom occupancy alerts for extended stays.',
          'Optional wearable or call-button integrations (third-party).',
          'Backup power and redundant alert paths.',
        ],
        whatItDoes: [
          'Strengthens safety coverage for higher-support needs.',
          'Provides dignity-first alerts without default surveillance.',
          'Enables optional integrations with external care services.',
        ],
        offlineNote: 'Local controls stay active without internet.',
        ownershipNote: 'No required subscriptions; third-party services are optional.',
      },
    ],
    addOnTiers: [
      {
        title: 'Entry-level reassurance',
        description: 'Low-friction upgrades that build confidence.',
        items: [
          'Night-path lighting expansions',
          'Door exit alerts for wander prevention',
          'Smart plug timers for lamps or appliances',
          'Daily reminder cues via local speakers',
        ],
      },
      {
        title: 'Caregiver visibility',
        description: 'Tools that help families stay informed without surveillance.',
        items: [
          'Bed or chair occupancy sensors',
          'Bathroom humidity and occupancy alerts',
          'Medication cabinet access alerts',
          'Smart lock access logs for caregivers',
        ],
      },
      {
        title: 'Advanced aging-in-place',
        description: 'Higher-support options and optional external integrations.',
        items: [
          'Stove and appliance safety shutoff',
          'Whole-home water shutoff and leak response',
          'Wearable call buttons (third-party optional)',
          'Optional professional monitoring integrations',
        ],
      },
    ],
    howItWorks: [
      {
        title: 'Dignity-first discovery',
        description: 'We learn daily routines, caregiver roles, and privacy preferences.',
      },
      {
        title: 'Support plan design',
        description: 'We build a Home Assistant plan that focuses on safety cues, not surveillance.',
      },
      {
        title: 'Install and calibration',
        description: 'Sensors and safety scenes are installed and tested with the family.',
      },
      {
        title: 'Caregiver training',
        description: 'We document alert routing and provide easy-to-read caregiver guidance.',
      },
      {
        title: 'Ongoing support',
        description: 'We refine thresholds and alerts as needs evolve.',
      },
    ],
    faqs: [
      {
        question: 'Is this medical monitoring?',
        answer:
          'No. Elder Tech is non-medical, dignity-first support. It provides safety cues and caregiver alerts, not clinical monitoring.',
      },
      {
        question: 'Do you use cameras by default?',
        answer:
          'No. Cameras are optional and never required. We prioritize privacy-first sensors.',
      },
      {
        question: 'Do you sell subscriptions or monthly plans?',
        answer:
          'No. There are no required subscriptions. Optional third-party services are contracted directly by the customer.',
      },
      {
        question: 'Will it work without internet?',
        answer:
          'Yes. Local alerts and automations run on Home Assistant without internet access.',
      },
    ],
  },
};
