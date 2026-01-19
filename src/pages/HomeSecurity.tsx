import VerticalLandingShell from '../components/VerticalLandingShell';
import { verticalContent } from '../content/systemRestoration';

const HomeSecurity = () => {
  const content = verticalContent.homeSecurity;
  return (
    <VerticalLandingShell
      verticalName="Home Security"
      badgeLabel="Local-first"
      heroHeadline="Home Security built for resilient, always-on protection"
      heroSubhead="Layered sensors, verified alerts, and operator-grade reporting designed for residential safety without overpromising outcomes."
      primaryCTA={{ label: 'Request a Security Consult', to: '/support' }}
      chartData={[
        { label: 'Mon', value: 18 },
        { label: 'Tue', value: 22 },
        { label: 'Wed', value: 19 },
        { label: 'Thu', value: 26 },
        { label: 'Fri', value: 23 },
      ]}
      keyCapabilities={[
        'Sensor coverage plans tailored to entry points and high-risk zones.',
        'Local-first alert routing that keeps core protections working during outages.',
        'Clear installation scopes and maintenance check-ins aligned with property needs.',
      ]}
      journeySteps={content.journeySteps}
      agreementHighlights={content.agreements}
      packageHighlights={content.packageHighlights}
      playbooks={content.playbooks}
    />
  );
};

export default HomeSecurity;
