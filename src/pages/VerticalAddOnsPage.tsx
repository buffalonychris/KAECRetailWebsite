import { Link } from 'react-router-dom';

import SpaceFrame from '../components/operator/SpaceFrame';
import VerticalPageLayout from '../components/VerticalPageLayout';
import { VerticalContent, verticals } from '../content/installedSystems';

type VerticalAddOnsPageProps = {
  verticalId: VerticalContent['id'];
};

const VerticalAddOnsPage = ({ verticalId }: VerticalAddOnsPageProps) => {
  const content = verticals[verticalId];

  return (
    <VerticalPageLayout
      vertical={content}
      title={`${content.name} add-ons`}
      subtitle="From quick wins to advanced enhancements, all designed for local-first control."
    >
      <SpaceFrame>
        <div className="badge">Add-on spectrum</div>
        <h2>Layer enhancements at your pace</h2>
        <div className="card-grid">
          {content.addOnTiers.map((tier) => (
            <div className="card" key={tier.title}>
              <h3 style={{ marginTop: 0, color: '#fff7e6' }}>{tier.title}</h3>
              <p style={{ color: '#c8c0aa' }}>{tier.description}</p>
              <ul className="list">
                {tier.items.map((item) => (
                  <li key={item}>
                    <span />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SpaceFrame>

      <SpaceFrame>
        <div className="badge">Ownership</div>
        <h2>Local-first, no lock-in</h2>
        <p>{content.ownershipCallout}</p>
        <p>{content.privacyCallout}</p>
        <div className="space-section-actions">
          <Link className="btn btn-primary" to={content.paths.packages}>
            Compare packages
          </Link>
          <Link className="btn btn-secondary" to={content.paths.faq}>
            Support &amp; FAQ
          </Link>
        </div>
      </SpaceFrame>
    </VerticalPageLayout>
  );
};

export default VerticalAddOnsPage;
