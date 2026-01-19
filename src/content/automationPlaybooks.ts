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
      title: 'Entry breach verification',
      purpose: 'Confirm a door/entry event and route a calm response without promising emergency services.',
      trigger: 'Door contact + motion sensor event outside of expected hours.',
      actions: [
        'Record the event locally and timestamp it in the Home Assistant log.',
        'Trigger interior lighting scene to increase visibility.',
        'Notify caregiver contacts with entry location and time.',
      ],
      handoff: 'Escalate to caregiver phone tree for follow-up and note outcome in the console.',
    },
    {
      title: 'Perimeter deterrence loop',
      purpose: 'Use deterministic lighting cues to discourage repeat entry attempts.',
      trigger: 'Multiple door or motion events within a 10-minute window.',
      actions: [
        'Pulse exterior lights on a timed loop.',
        'Send a second alert to the primary caregiver contact.',
        'Store a local clip or snapshot if video is available.',
      ],
      handoff: 'Document the event in the operator log for next-day review.',
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
