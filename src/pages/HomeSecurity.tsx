import VerticalLandingShell from '../components/VerticalLandingShell';
import { verticalContent } from '../content/systemRestoration';

const HomeSecurity = () => {
  const content = verticalContent.homeSecurity;
  return (
    <VerticalLandingShell
      verticalName="Home Security"
      badgeLabel="Local-first"
      heroHeadline="Residential security that stays local, private, and always usable"
      heroSubhead="Built for homeowners who want deterrence, awareness, and safety outcomes with Home Assistant as the single dashboard—no subscriptions sold and no cloud required for local control."
      primaryCTA={{ label: 'Request a Security Consult', to: '/support' }}
      chartData={[
        { label: 'Mon', value: 18 },
        { label: 'Tue', value: 22 },
        { label: 'Wed', value: 19 },
        { label: 'Thu', value: 26 },
        { label: 'Fri', value: 23 },
      ]}
      keyCapabilities={[
        'Who it is for: households that want ownership, privacy-first control, and wireless-first deployment.',
        'Outcomes: deterrence at entry points, awareness of breaches, and safer in-home response cues.',
        'Single dashboard promise: Home Assistant unifies arming, sensors, lights, siren, and alerts.',
        'No subscriptions promise: we do not sell monitoring plans; third-party monitoring is optional.',
        'Offline Dignity Rule: local control remains available for arming, sensors, lighting, and siren.',
      ]}
      journeySteps={content.journeySteps}
      agreementHighlights={content.agreements}
      packageHighlights={content.packageHighlights}
      playbooks={content.playbooks}
    />
  );
};

export default HomeSecurity;
