import { Link } from 'react-router-dom';

import SpaceFrame from '../components/operator/SpaceFrame';
import VerticalPageLayout from '../components/VerticalPageLayout';
import { verticals } from '../content/installedSystems';

const HomeSecurity = () => {
  const content = verticals.security;
  return (
    <VerticalPageLayout
      vertical={content}
      title={content.heroHeadline}
      subtitle={content.heroSubhead}
    >
      <div className="space-grid two-column">
        <SpaceFrame>
          <div className="badge">Who it&apos;s for</div>
          <h2>Security built for residential needs</h2>
          <ul className="operator-list">
            {content.audience.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </SpaceFrame>
        <SpaceFrame>
          <div className="badge">Outcomes</div>
          <h2>What it delivers</h2>
          <ul className="operator-list">
            {content.outcomes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </SpaceFrame>
      </div>

      <SpaceFrame>
        <div className="badge">Privacy &amp; ownership</div>
        <h2>Local-first by design</h2>
        <p>{content.privacyCallout}</p>
        <p>{content.ownershipCallout}</p>
      </SpaceFrame>

      <SpaceFrame>
        <div className="badge">Packages</div>
        <h2>Security packages at a glance</h2>
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
        <div className="space-section-actions" style={{ marginTop: '1rem' }}>
          <Link className="btn btn-secondary" to={content.paths.packages}>
            Full package details
          </Link>
        </div>
      </SpaceFrame>

      <SpaceFrame>
        <div className="badge">Add-ons</div>
        <h2>Add-on spectrum</h2>
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
        <div className="space-section-actions" style={{ marginTop: '1rem' }}>
          <Link className="btn btn-secondary" to={content.paths.addons}>
            View all add-ons
          </Link>
        </div>
      </SpaceFrame>

      <SpaceFrame>
        <div className="badge">How it works</div>
        <h2>Security-specific delivery</h2>
        <div className="card-grid">
          {content.howItWorks.map((step) => (
            <div className="card" key={step.title}>
              <h3 style={{ marginTop: 0, color: '#fff7e6' }}>{step.title}</h3>
              <p style={{ color: '#c8c0aa' }}>{step.description}</p>
            </div>
          ))}
        </div>
        <div className="space-section-actions" style={{ marginTop: '1rem' }}>
          <Link className="btn btn-secondary" to={content.paths.howItWorks}>
            See the full process
          </Link>
        </div>
      </SpaceFrame>

      <SpaceFrame>
        <div className="badge">Support &amp; FAQ</div>
        <h2>Questions about security?</h2>
        <div className="card-grid">
          {content.faqs.slice(0, 3).map((faq) => (
            <div className="card" key={faq.question}>
              <h3 style={{ marginTop: 0, color: '#fff7e6' }}>{faq.question}</h3>
              <p style={{ color: '#c8c0aa' }}>{faq.answer}</p>
            </div>
          ))}
        </div>
        <div className="space-section-actions" style={{ marginTop: '1rem' }}>
          <Link className="btn btn-secondary" to={content.paths.faq}>
            View all security FAQs
          </Link>
        </div>
      </SpaceFrame>

      <SpaceFrame>
        <div className="badge">Business</div>
        <h2>Need commercial coverage?</h2>
        <p>{content.businessNote}</p>
        <div className="space-section-actions">
          <Link className="btn btn-secondary" to="/contact">
            Talk with the team
          </Link>
        </div>
      </SpaceFrame>

      <SpaceFrame className="vertical-cta">
        <h2>Ready to plan your security stack?</h2>
        <p>Start with packages or review the full add-on catalog for your home.</p>
        <div className="space-section-actions">
          <Link className="btn btn-primary" to={content.paths.packages}>
            Compare security packages
          </Link>
          <Link className="btn btn-secondary" to={content.paths.addons}>
            Explore add-ons
          </Link>
        </div>
      </SpaceFrame>
    </VerticalPageLayout>
  );
};

export default HomeSecurity;
