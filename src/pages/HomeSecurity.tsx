import { Link } from 'react-router-dom';
import VerticalLandingShell from '../components/VerticalLandingShell';
import { useLayoutConfig } from '../components/LayoutConfig';
import { verticalContent } from '../content/systemRestoration';

const HomeSecurity = () => {
  useLayoutConfig({
    layoutVariant: 'funnel',
    showBreadcrumbs: true,
    breadcrumb: [{ label: 'Home Security', href: '/home-security' }],
  });

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
    <VerticalLandingShell
      verticalName="Home Security"
      badgeLabel="Local-first"
      heroHeadline="Home security that works even when the internet doesn’t"
      heroSubhead="A wireless home security system you control from one simple dashboard. No required subscriptions. No “cloud-only” lock-in. Your sensors and alarms still work inside your home even if the internet goes out. Remote access is optional when internet is available."
      primaryCTA={{ label: 'Check Fit / Start Discovery', to: '/support?vertical=home-security' }}
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
          title: 'Works during outages',
          description: 'Door and window sensors give you instant alerts and keep working on your home network if the internet drops.',
        },
        {
          title: 'Fast reliable alerts (no waiting)',
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
      accordionSections={[
        {
          title: 'How Home Security works',
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
          title: 'What’s included',
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
          title: 'Automations & response playbooks',
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
          title: 'Privacy, ownership & reliability',
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
              <p>
                We build your system to be dependable and easy to maintain. We also include simple health signals so
                you can tell if anything needs attention.{' '}
                <Link to="/reliability?vertical=home-security">Explore reliability details →</Link>
              </p>
            </>
          ),
        },
        {
          title: 'Agreements & what to expect',
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
      midCTA={{
        heading: 'Ready to explore Home Security?',
        body: 'Start a quick guided intake and we’ll route you to the right next step.',
        primaryCTA: { label: 'Explore packages', to: '/packages?vertical=home-security' },
        secondaryCTA: { label: 'Check fit / start discovery', to: '/support?vertical=home-security' },
      }}
      supportLink="/support?vertical=home-security"
      showBottomCTA={false}
      journeySteps={content.journeySteps}
      agreementHighlights={content.agreements}
      packageHighlights={content.packageHighlights}
      playbooks={content.playbooks}
    />
  );
};

export default HomeSecurity;
