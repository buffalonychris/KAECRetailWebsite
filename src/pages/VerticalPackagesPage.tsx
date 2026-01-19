import { Link } from 'react-router-dom';

import SpaceFrame from '../components/operator/SpaceFrame';
import VerticalPageLayout from '../components/VerticalPageLayout';
import { VerticalContent, verticals } from '../content/installedSystems';

type VerticalPackagesPageProps = {
  verticalId: VerticalContent['id'];
};

const VerticalPackagesPage = ({ verticalId }: VerticalPackagesPageProps) => {
  const content = verticals[verticalId];

  return (
    <VerticalPageLayout
      vertical={content}
      title={`${content.name} packages`}
      subtitle="Compare Basic, Plus, and Pro tiers grounded in local-first delivery."
    >
      <SpaceFrame>
        <div className="badge">Package tiers</div>
        <h2>Choose the right fit</h2>
        <div className="card-grid">
          {content.packageTiers.map((tier) => (
            <div className="card" key={tier.name}>
              <h3 style={{ marginTop: 0, color: '#fff7e6' }}>{tier.name}</h3>
              <p style={{ color: '#c8c0aa' }}>{tier.tagline}</p>
              <strong>What you get</strong>
              <ul className="list">
                {tier.whatYouGet.map((item) => (
                  <li key={item}>
                    <span />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <strong>What it does</strong>
              <ul className="list">
                {tier.whatItDoes.map((item) => (
                  <li key={item}>
                    <span />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p>
                <strong>Offline dignity:</strong> {tier.offlineNote}
              </p>
              <p>
                <strong>Ownership:</strong> {tier.ownershipNote}
              </p>
            </div>
          ))}
        </div>
      </SpaceFrame>

      <SpaceFrame>
        <div className="badge">Next steps</div>
        <h2>Build your system</h2>
        <p>
          Every package uses Home Assistant as the canonical platform. Add-ons can be layered later without
          changing your core system.
        </p>
        <div className="space-section-actions">
          <Link className="btn btn-primary" to={content.paths.addons}>
            Explore add-ons
          </Link>
          <Link className="btn btn-secondary" to={content.paths.faq}>
            View support &amp; FAQ
          </Link>
        </div>
      </SpaceFrame>
    </VerticalPageLayout>
  );
};

export default VerticalPackagesPage;
