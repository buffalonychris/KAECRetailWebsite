export type AutomationPlaybook = {
  title: string;
  purpose: string;
  trigger: string;
  actions: string[];
  handoff: string;
};

export const automationPlaybooks: Record<string, AutomationPlaybook[]> = {
  homeSecurity: [
    {
      title: 'Entry lighting assurance',
      purpose: 'Provide immediate visibility and deterrence without relying on cloud services.',
      trigger: 'Door contact opens after-hours or when the home is armed.',
      actions: [
        'Turn on entry and hallway lights locally.',
        'Log the event in Home Assistant with timestamp and zone.',
        'Notify household contacts with entry location and time.',
      ],
      handoff: 'Household reviews the alert and confirms status in the dashboard.',
    },
    {
      title: 'Perimeter breach response',
      purpose: 'Coordinate lights, siren, and camera capture for verified entry events.',
      trigger: 'Door contact + motion verified within a short window.',
      actions: [
        'Activate exterior lighting and local siren on a timed loop.',
        'Store a local clip or snapshot if video is available.',
        'Notify household contacts with the verified zone.',
      ],
      handoff: 'Household decides next steps; optional third-party monitoring can be engaged directly.',
    },
    {
      title: 'Environmental hazard response',
      purpose: 'Detect leaks or smoke/CO and respond locally for faster awareness.',
      trigger: 'Leak sensor, smoke/CO listener, or temperature threshold alert.',
      actions: [
        'Trigger local siren and interior lighting for visibility.',
        'Notify household contacts with location details.',
        'Log the event to Home Assistant for review.',
      ],
      handoff: 'Household confirms resolution and documents the outcome in the dashboard.',
    },
    {
      title: 'System health assurance',
      purpose: 'Verify that sensors, cameras, and power backups stay online.',
      trigger: 'Daily scheduled health check or device heartbeat failure.',
      actions: [
        'Run device heartbeat checks locally.',
        'Notify household contacts if a device is offline.',
        'Queue a service reminder when repeated failures occur.',
      ],
      handoff: 'Schedule service or replace hardware based on the local health report.',
    },
  ],
  homeAutomation: [
    {
      title: 'Morning routine bundle',
      purpose: 'Deliver consistent wake-up cues without relying on cloud services.',
      trigger: 'Scheduled weekday routine or manual button tap.',
      actions: [
        'Gradually raise lighting levels in bedroom and hallways.',
        'Set thermostat comfort mode and verify temperature range.',
        'Send a gentle check-in notification to caregivers if needed.',
      ],
      handoff: 'Allow resident or caregiver to acknowledge completion in the dashboard.',
    },
    {
      title: 'Evening safety sweep',
      purpose: 'Reduce nighttime risks with predictable shutdown routines.',
      trigger: 'Manual bedtime scene or scheduled time window.',
      actions: [
        'Lock entry doors and confirm lock state locally.',
        'Activate night-path lighting for hallways and bathrooms.',
        'Lower thermostat and secure unattended lighting circuits.',
      ],
      handoff: 'Record the routine in the event log for caregiver review.',
    },
  ],
  elderCare: [
    {
      title: 'Daily check-in ladder',
      purpose: 'Provide a gentle, multi-step check-in cadence for caregivers.',
      trigger: 'No motion detected during expected awake hours.',
      actions: [
        'Issue a voice check-in prompt within the home.',
        'Send a notification to primary caregiver contacts.',
        'Escalate to secondary contacts if unacknowledged.',
      ],
      handoff: 'Caregiver confirms status and logs outcome in the Home Assistant history.',
    },
    {
      title: 'Bathroom safety alert',
      purpose: 'Highlight prolonged bathroom stays without overpromising response.',
      trigger: 'Extended occupancy detected beyond configured threshold.',
      actions: [
        'Send a discreet notification to caregivers.',
        'Activate gentle hallway lighting for visibility.',
        'Log event for caregiver review and pattern detection.',
      ],
      handoff: 'Caregiver decides whether to call or visit; no automatic emergency dispatch.',
    },
  ],
};
