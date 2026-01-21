import VerticalLandingShell from '../components/VerticalLandingShell';
import { verticalContent } from '../content/systemRestoration';

const HomeSecurity = () => {
  const content = verticalContent.homeSecurity;
  return (
    <VerticalLandingShell
      verticalName="Home Security"
      badgeLabel="Local-first"
      heroHeadline="Residential security that stays local, private, and always usable"
      heroSubhead="Wireless-first Home Security built on Home Assistant as the single dashboard—no subscriptions sold, no cloud required for local control, and optional remote access when internet is available."
      primaryCTA={{ label: 'Request a Security Consult', to: '/support' }}
      journeyLinks={[
        { label: 'Packages', to: '/home-security/packages?vertical=home-security' },
        { label: 'Add-ons', to: '/home-security/add-ons?vertical=home-security' },
        { label: 'How it Works', to: '/home-security/how-it-works?vertical=home-security' },
        { label: 'FAQ & Support', to: '/support' },
      ]}
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
        'Ownership: the homeowner owns the equipment, automations, and local data outright.',
        'No subscriptions promise: we do not sell monitoring plans; third-party monitoring is optional and contracted directly.',
        'Offline Dignity Rule: local control remains available for arming, sensors, lighting, and siren.',
        'Remote access is optional and requires internet; LAN control remains active when the connection drops.',
      ]}
      journeySteps={content.journeySteps}
      agreementHighlights={content.agreements}
      packageHighlights={content.packageHighlights}
      playbooks={content.playbooks}
    />
  );
};

export default HomeSecurity;
