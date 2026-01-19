import { Link } from 'react-router-dom';

import SpaceFrame from '../components/operator/SpaceFrame';
import VerticalPageLayout from '../components/VerticalPageLayout';
import { VerticalContent, verticals } from '../content/installedSystems';

type VerticalHowItWorksPageProps = {
  verticalId: VerticalContent['id'];
};

const VerticalHowItWorksPage = ({ verticalId }: VerticalHowItWorksPageProps) => {
  const content = verticals[verticalId];

  return (
    <VerticalPageLayout
      vertical={content}
      title={`${content.name} — how it works`}
      subtitle="A clear, privacy-first process designed for installed systems."
    >
      <SpaceFrame>
        <div className="badge">Delivery process</div>
        <h2>What to expect</h2>
        <div className="card-grid">
          {content.howItWorks.map((step) => (
            <div className="card" key={step.title}>
              <h3 style={{ marginTop: 0, color: '#fff7e6' }}>{step.title}</h3>
              <p style={{ color: '#c8c0aa' }}>{step.description}</p>
            </div>
          ))}
        </div>
      </SpaceFrame>

      <SpaceFrame>
        <div className="badge">Local-first promise</div>
        <h2>Offline dignity and ownership</h2>
        <p>{content.privacyCallout}</p>
        <p>{content.ownershipCallout}</p>
        <div className="space-section-actions">
          <Link className="btn btn-primary" to={content.paths.packages}>
            Compare packages
          </Link>
          <Link className="btn btn-secondary" to={content.paths.addons}>
            Explore add-ons
          </Link>
        </div>
      </SpaceFrame>
    </VerticalPageLayout>
  );
};

export default VerticalHowItWorksPage;
