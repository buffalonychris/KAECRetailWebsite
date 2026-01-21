import VerticalLandingShell from '../components/VerticalLandingShell';
import { verticalContent } from '../content/systemRestoration';

const HomeSecurity = () => {
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
      heroHeadline="Residential security that stays local, private, and always usable"
      heroSubhead="Wireless-first Home Security built on Home Assistant as the single dashboard—no subscriptions sold, no cloud required for local control, and optional remote access when internet is available. The Offline Dignity Rule ensures core security actions stay available locally."
      primaryCTA={{ label: 'Check Fit / Start Discovery', to: '/support' }}
      secondaryCTA={{ label: 'Explore Packages', to: '/home-security/packages?vertical=home-security' }}
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
          title: 'Perimeter awareness without cloud dependency',
          description: 'Entry sensors and localized alerts keep you aware even when the internet drops.',
        },
        {
          title: 'Deterministic responses you can count on',
          description: 'Lighting cues, siren triggers, and deterrence routines fire on-site with no cloud lag.',
        },
        {
          title: 'Privacy-preserving monitoring',
          description: 'Local data ownership and optional remote access protect household privacy without sacrificing awareness.',
        },
        {
          title: 'Installer-grade reliability without subscriptions',
          description: 'Hardware, automations, and handoff are owned by the homeowner—no recurring monitoring plan required.',
        },
      ]}
      accordionSections={[
        {
          title: 'How Home Security Works',
          description: 'A clear intake-to-handoff journey built for local-first execution.',
          content: (
            <>
              <p>
                From consult to handoff, the journey is designed to stay predictable and easy to audit at every step.
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
          title: "What's Included",
          description: 'Package coverage and scope summaries by tier.',
          content: (
            <>
              <p>Each package scales coverage without changing the local-first ownership model.</p>
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
          description: 'Entry, perimeter, and environmental response playbooks.',
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
          description: 'Local execution guarantees, ownership, and subscription-free reliability.',
          content: (
            <>
              <p>
                Home Security is designed for local execution first, with clear ownership and privacy guardrails.
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
          description: 'Agreement checkpoints and install expectations.',
          content: (
            <>
              <p>Clear checkpoints keep expectations aligned before, during, and after install.</p>
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
        summary: 'See how system reliability and health are maintained.',
        label: 'Explore reliability details →',
        to: '/reliability?vertical=home-security',
      }}
      bottomCTA={{
        heading: 'Ready to explore Home Security?',
        body: 'Start a guided intake and we will route you to the right team for the next step.',
      }}
      journeySteps={content.journeySteps}
      agreementHighlights={content.agreements}
      packageHighlights={content.packageHighlights}
      playbooks={content.playbooks}
    />
  );
};

export default HomeSecurity;
