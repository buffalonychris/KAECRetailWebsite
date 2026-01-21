import PortalTile from '../components/PortalTile';
import SectionHeader from '../components/operator/SectionHeader';

const activePortals = [
  {
    title: 'Home Security',
    status: 'ACTIVE' as const,
    category: 'SECURITY',
    description: 'Local-first protection workflows with sensors, deterrence, and resilience.',
    ctaLabel: 'Enter Home Security',
    to: '/home-security',
  },
  {
    title: 'Home Automation',
    status: 'ACTIVE' as const,
    category: 'AUTOMATION',
    description: 'Deterministic routines and scenes for comfort, efficiency, and reliability.',
    ctaLabel: 'Enter Home Automation',
    to: '/home-automation',
  },
  {
    title: 'Home Elder Tech Systems',
    status: 'ACTIVE' as const,
    category: 'ELDER TECH',
    description: 'Dignity-first in-home safety and awareness for aging-in-place.',
    ctaLabel: 'Enter Elder Tech Systems',
    to: '/elder-care-tech',
  },
  {
    title: 'HALO PERS',
    status: 'ACTIVE' as const,
    category: 'PERS',
    description: 'Personal safety signaling with clear response pathways.',
    ctaLabel: 'Enter HALO PERS',
    to: '/halo',
  },
  {
    title: 'SaaS Operator Platform',
    status: 'ACTIVE' as const,
    category: 'SAAS',
    description: 'Operator-grade scheduling, follow-up, and escalation workflows.',
    ctaLabel: 'Enter Operator Platform',
    to: '/operator',
  },
];

const futurePortals = [
  {
    title: 'ManCave Systems',
    status: 'COMING SOON' as const,
    category: 'LIFESTYLE',
    description: 'Specialized entertainment and environment control workflows.',
    ctaLabel: 'Coming Soon',
  },
  {
    title: 'Business Security',
    status: 'COMING SOON' as const,
    category: 'SECURITY',
    description: 'Commercial-grade protection and incident response workflows.',
    ctaLabel: 'Coming Soon',
  },
  {
    title: 'Business Automation',
    status: 'COMING SOON' as const,
    category: 'AUTOMATION',
    description: 'Operational routines and deterministic facility orchestration.',
    ctaLabel: 'Coming Soon',
  },
  {
    title: 'Property Management',
    status: 'COMING SOON' as const,
    category: 'OPS',
    description: 'Portfolio oversight, access coordination, and service workflows.',
    ctaLabel: 'Coming Soon',
  },
];

const RetailLanding = () => {
  return (
    <div className="space-shell hub-shell-bg">
      <div className="container section space-grid hub-shell hub-container">
        <div className="hub-hero">
          <SectionHeader
            kicker="PLATFORM HUB"
            title="KickAss Connected Systems Platform"
            subtitle="Choose your portal. Each tile opens a dedicated workspace with its own workflows, controls, and operating context."
          />
        </div>

        <section className="space-grid" aria-label="Active portals">
          <div className="portal-section-header">
            <span className="portal-section-kicker">Live Systems</span>
            <h2>Active Portals</h2>
            <p>Launch live workspaces with dedicated workflows and controls.</p>
            <span className="portal-section-divider" aria-hidden="true" />
          </div>
          <div className="space-grid portal-grid portal-grid-active">
            {activePortals.map((card) => (
              <PortalTile key={card.title} {...card} />
            ))}
          </div>
        </section>

        <section className="space-grid" aria-label="Future portals">
          <div className="portal-section-header">
            <span className="portal-section-kicker">Roadmap Queue</span>
            <h2>Future Portals</h2>
            <p>Roadmapped workspaces staged for upcoming launches.</p>
            <span className="portal-section-divider" aria-hidden="true" />
          </div>
          <div className="space-grid portal-grid portal-grid-future">
            {futurePortals.map((card) => (
              <PortalTile key={card.title} {...card} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default RetailLanding;
