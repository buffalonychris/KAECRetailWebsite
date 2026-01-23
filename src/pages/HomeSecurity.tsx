import { useEffect, useState } from 'react';
import ResponsivePublicImage from '../components/ResponsivePublicImage';
import VerticalLandingShell from '../components/VerticalLandingShell';
import SpaceFrame from '../components/operator/SpaceFrame';
import { useLayoutConfig } from '../components/LayoutConfig';
import { verticalContent } from '../content/systemRestoration';

const HomeSecurity = () => {
  const [isDiagramOpen, setIsDiagramOpen] = useState(false);

  useLayoutConfig({
    layoutVariant: 'funnel',
    showBreadcrumbs: true,
    breadcrumb: [{ label: 'Home Security', href: '/home-security' }],
  });

  useEffect(() => {
    if (!isDiagramOpen) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDiagramOpen(false);
      }
    };
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDiagramOpen]);

  const content = verticalContent.homeSecurity;
  const keyCapabilities = [
    'Who it is for: households that want ownership, privacy-first control, and wireless-first deployment.',
    'Outcomes: deterrence at entry points, awareness of breaches, and safer in-home response cues.',
    'Single dashboard promise: Home Assistant unifies arming, sensors, lights, siren, and alerts.',
    'Ownership: the homeowner owns the equipment, automations, and local data outright.',
    'No subscriptions promise: we do not sell monitoring plans; third-party monitoring is optional and contracted directly.',
    'Offline Dignity Rule: local control remains available for arming, sensors, lighting, and siren.',
    'Remote access is optional and requires internet; LAN control remains active when the connection drops.',
  ];
  return (
    <>
      <VerticalLandingShell
        verticalName="Home Security"
        badgeLabel="Local-first"
        heroHeadline="Home security that works even when the internet doesn’t"
        heroSubhead="A wireless home security system you control from one simple dashboard. No required subscriptions. No “cloud-only” lock-in. Your sensors and alarms still work inside your home even if the internet goes out. Remote access is optional when internet is available."
        heroBadges={['Offline-first', 'No subscriptions sold by us', 'Local control']}
        heroVariant="campaign"
        heroMedia={{
          alt: 'Local-first home security dashboard with calm lighting',
          src: '/images/home-security/hs_hero_home-security.png',
          sources: [
            {
              type: 'image/webp',
              srcSet: '/images/home-security/hs_hero_home-security.webp',
            },
          ],
        }}
        heroOverlayClassName="vertical-hero-overlay--muted"
        primaryCTA={{ label: 'Check Fit / Start Discovery', to: '/discovery?vertical=home-security' }}
        secondaryCTA={{ label: 'Explore Packages', to: '/packages?vertical=home-security' }}
        layoutVariant="explainer"
        containerClassName="hub-container"
        chartData={[
          { label: 'Mon', value: 18 },
          { label: 'Tue', value: 22 },
          { label: 'Wed', value: 19 },
          { label: 'Thu', value: 26 },
          { label: 'Fri', value: 23 },
        ]}
        keyCapabilities={keyCapabilities}
        valueBlocks={[
          {
            title: 'Know when doors or windows open — even during outages',
            description: 'Door and window sensors give you instant alerts and keep working on your home network if the internet drops.',
          },
          {
            title: 'Fast, reliable actions (no waiting on the cloud)',
            description:
              'When something happens, your system can turn on lights, sound a siren, or run deterrent routines right away — from inside your home.',
          },
          {
            title: 'Privacy-first by default',
            description:
              'Your data stays yours. You can enable remote access if you want, but nothing requires a third-party monitoring plan.',
          },
          {
            title: 'Pro-level reliability without monthly fees',
            description: 'You own the hardware and the setup. No required monthly monitoring just to make the system function.',
          },
        ]}
        afterValueBlocks={
          <>
            <div className="section-divider" aria-hidden="true" />
            <div className="space-grid two-column home-security-architecture motion-stagger">
              <SpaceFrame className="motion-fade-up">
                <div className="badge">Local-first architecture</div>
                <h2 style={{ marginTop: 0 }}>Local-first architecture</h2>
                <p style={{ marginBottom: 0 }}>
                  Your system keeps working on your home network, even when the internet drops. Local automations,
                  sensors, and alerts still run—and you stay in control.
                </p>
              </SpaceFrame>
              <div className="premium-media-card motion-fade-up">
                <ResponsivePublicImage
                  srcBase="/images/home-security/hs_diagram_local-first-architecture"
                  alt="Diagram showing local-first architecture with offline control"
                  className="premium-image home-security-architecture-image hover-lift"
                />
                <button type="button" className="btn btn-secondary btn-small" onClick={() => setIsDiagramOpen(true)}>
                  View full diagram
                </button>
              </div>
            </div>
          </>
        }
        accordionSections={[
          {
            title: 'How Home Security Works',
            description:
              'A simple start-to-finish process: we learn your layout, recommend a package, install it cleanly, and hand you a system you understand and control.',
            content: (
              <>
                <p>
                  A simple start-to-finish process: we learn your layout, recommend a package, install it cleanly, and
                  hand you a system you understand and control.
                </p>
                <ul className="operator-list">
                  {content.journeySteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </>
            ),
          },
          {
            title: 'What’s Included',
            description:
              'A clear overview of what comes with each package (Bronze / Silver / Gold) and what problems each one solves.',
            content: (
              <>
                <p>
                  A clear overview of what comes with each package (Bronze / Silver / Gold) and what problems each one
                  solves.
                </p>
                <ul className="operator-list">
                  {content.packageHighlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            ),
          },
          {
            title: 'Automation & Response Playbooks',
            description:
              'Smart “if-this-then-that” actions: lights-on deterrence, siren triggers, entry alerts, leak alerts, and more.',
            content: (
            <div className="card-grid" style={{ marginTop: '1rem' }}>
              {content.playbooks.map((playbook) => (
                <div className="card" key={playbook.title}>
                  <h3 style={{ marginTop: 0, color: '#fff7e6' }}>{playbook.title}</h3>
                  <p style={{ color: '#c8c0aa' }}>{playbook.purpose}</p>
                  <p style={{ margin: '0.5rem 0', color: '#c8c0aa' }}>
                    <strong>Trigger:</strong> {playbook.trigger}
                  </p>
                  <ul className="list">
                    {playbook.actions.map((action) => (
                      <li key={action}>
                        <span />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                  <p style={{ margin: '0.75rem 0 0', color: '#c8c0aa' }}>
                    <strong>Handoff:</strong> {playbook.handoff}
                  </p>
                </div>
              ))}
            </div>
            ),
          },
          {
            title: 'Privacy, Ownership & Reliability',
            description:
              'What runs locally, what needs internet, what you own, and how we avoid cloud lock-in and subscription traps.',
            content: (
              <>
                <p>
                  What runs locally, what needs internet, what you own, and how we avoid cloud lock-in and subscription
                  traps.
                </p>
                <ul className="operator-list">
                  {keyCapabilities.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            ),
          },
          {
            title: 'Agreements & What to Expect',
            description:
              'What happens before, during, and after install — timeline, what we need from you, and how support works.',
            content: (
              <>
                <p>
                  What happens before, during, and after install — timeline, what we need from you, and how support
                  works.
                </p>
                <ul className="operator-list">
                  {content.agreements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            ),
          },
        ]}
      reliabilityLink={{
        summary:
          'We build your system to be dependable and easy to maintain. We also include simple health signals so you can tell if anything needs attention.',
        label: 'Explore reliability details →',
        to: '/reliability?vertical=home-security',
      }}
      supportLink="/support?vertical=home-security"
      preCtaSections={
        <>
          <div className="section-divider" aria-hidden="true" />
          <div className="space-grid two-column home-security-coverage motion-stagger">
            <SpaceFrame className="motion-fade-up">
              <div className="badge">Coverage overview</div>
              <h2 style={{ marginTop: 0 }}>Typical coverage</h2>
              <p style={{ marginBottom: 0 }}>
                Get a sense of how each tier expands coverage across entry points, interior motion zones, and
                exterior visibility.
              </p>
            </SpaceFrame>
            <div className="premium-media-card motion-fade-up">
              <ResponsivePublicImage
                srcBase="/images/home-security/hs_graphic_typical-coverage-by-package"
                alt="Graphic showing typical coverage by package tier"
                className="premium-image premium-image--contain hover-lift"
              />
            </div>
          </div>
          <div className="section-divider" aria-hidden="true" />
          <div className="space-grid two-column home-security-trust motion-stagger">
            <SpaceFrame className="motion-fade-up">
              <div className="badge">Trust &amp; guarantees</div>
              <h2 style={{ marginTop: 0 }}>Trust &amp; Guarantees</h2>
              <p style={{ marginBottom: 0 }}>
                We prioritize ownership, offline continuity, and clear support expectations, so you know exactly
                what stays local and what stays optional.
              </p>
            </SpaceFrame>
            <div className="premium-media-card motion-fade-up">
              <ResponsivePublicImage
                srcBase="/images/home-security/hs_badges_trust-grid"
                alt="Trust and guarantees grid highlighting ownership and offline readiness"
                className="premium-image premium-image--contain hover-lift"
              />
            </div>
          </div>
        </>
      }
      bottomCTA={{
        heading: 'Ready to explore Home Security?',
        body: 'Start a quick guided intake and we’ll route you to the right next step.',
      }}
      journeySteps={content.journeySteps}
      agreementHighlights={content.agreements}
      packageHighlights={content.packageHighlights}
      playbooks={content.playbooks}
    />
      {isDiagramOpen ? (
        <div
          className="media-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Local-first architecture diagram"
          onClick={() => setIsDiagramOpen(false)}
        >
          <div className="media-modal__backdrop" />
          <div className="media-modal__dialog" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="btn btn-secondary btn-small media-modal__close"
              onClick={() => setIsDiagramOpen(false)}
            >
              Close
            </button>
            <ResponsivePublicImage
              srcBase="/images/home-security/hs_diagram_local-first-architecture"
              alt="Diagram showing local-first architecture with offline control"
              className="media-modal__image"
              priority
            />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default HomeSecurity;
