import { Link } from 'react-router-dom';

import SpaceFrame from '../components/operator/SpaceFrame';
import VerticalPageLayout from '../components/VerticalPageLayout';
import { VerticalContent, verticals } from '../content/installedSystems';

type VerticalSupportPageProps = {
  verticalId: VerticalContent['id'];
};

const VerticalSupportPage = ({ verticalId }: VerticalSupportPageProps) => {
  const content = verticals[verticalId];

  return (
    <VerticalPageLayout
      vertical={content}
      title={`${content.name} support & FAQ`}
      subtitle="Privacy-first guidance, offline operation, and ownership clarity."
    >
      <SpaceFrame>
        <div className="badge">Support</div>
        <h2>Common questions</h2>
        <div className="card-grid">
          {content.faqs.map((faq) => (
            <div className="card" key={faq.question}>
              <h3 style={{ marginTop: 0, color: '#fff7e6' }}>{faq.question}</h3>
              <p style={{ color: '#c8c0aa' }}>{faq.answer}</p>
            </div>
          ))}
        </div>
      </SpaceFrame>

      <SpaceFrame>
        <div className="badge">Need help?</div>
        <h2>Talk with a specialist</h2>
        <p>
          We can review your property, answer privacy or offline questions, and outline next steps for your
          installed system.
        </p>
        <div className="space-section-actions">
          <Link className="btn btn-primary" to="/support">
            Contact support
          </Link>
          <Link className="btn btn-secondary" to={content.paths.packages}>
            Review packages
          </Link>
        </div>
      </SpaceFrame>
    </VerticalPageLayout>
  );
};

export default VerticalSupportPage;
