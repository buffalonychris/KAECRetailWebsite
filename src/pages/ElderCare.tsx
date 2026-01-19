import VerticalLandingShell from '../components/VerticalLandingShell';

const ElderCare = () => {
  return (
    <VerticalLandingShell
      verticalName="Elder Care Tech"
      badgeLabel="Caregiver-grade"
      heroHeadline="Elder Care Tech that supports dignified, connected living"
      heroSubhead="Caregiver-friendly monitoring, safety cues, and clear handoffs that respect privacy while keeping teams informed."
      primaryCTA={{ label: 'Talk to a Care Specialist', to: '/support' }}
      chartData={[
        { label: 'Mon', value: 9 },
        { label: 'Tue', value: 12 },
        { label: 'Wed', value: 11 },
        { label: 'Thu', value: 15 },
        { label: 'Fri', value: 13 },
      ]}
      keyCapabilities={[
        'Caregiver visibility dashboards with clear notification routing.',
        'Daily living signals that focus on support, not surveillance.',
        'Configurable check-in workflows for families and care teams.',
      ]}
    />
  );
};

export default ElderCare;
