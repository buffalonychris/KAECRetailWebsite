import VerticalLandingShell from '../components/VerticalLandingShell';

const HomeAutomation = () => {
  return (
    <VerticalLandingShell
      verticalName="Home Automation"
      badgeLabel="Automation"
      heroHeadline="Home Automation that keeps every routine on schedule"
      heroSubhead="Deterministic scenes, privacy-first controls, and local automation logic designed for daily living."
      primaryCTA={{ label: 'Explore Automations', to: '/support' }}
      chartData={[
        { label: 'Mon', value: 14 },
        { label: 'Tue', value: 20 },
        { label: 'Wed', value: 17 },
        { label: 'Thu', value: 24 },
        { label: 'Fri', value: 21 },
      ]}
      keyCapabilities={[
        'Room-by-room automation plans with predictable schedules and overrides.',
        'Energy-aware routines for lighting, climate, and comfort systems.',
        'Integration roadmaps that prioritize reliability over novelty.',
      ]}
    />
  );
};

export default HomeAutomation;
