import { Link } from 'react-router-dom';

import Pill from '../components/operator/Pill';
import SectionHeader from '../components/operator/SectionHeader';
import SpaceFrame from '../components/operator/SpaceFrame';

const activePortals = [
  {
    title: 'Home Security',
    badge: 'Active',
    description: 'Local-first protection workflows with sensors, deterrence, and resilience.',
    primaryLabel: 'Enter Home Security',
    to: '/home-security',
  },
  {
    title: 'Home Automation',
    badge: 'Active',
    description: 'Deterministic routines and scenes for comfort, efficiency, and reliability.',
    primaryLabel: 'Enter Home Automation',
    to: '/home-automation',
  },
  {
    title: 'Home Elder Tech Systems',
    badge: 'Active',
    description: 'Dignity-first in-home safety and awareness for aging-in-place.',
    primaryLabel: 'Enter Home Elder Tech Systems',
    to: '/elder-care-tech',
  },
  {
    title: 'HALO PERS',
    badge: 'Active',
    description: 'Personal safety signaling with clear response pathways.',
    primaryLabel: 'Enter HALO',
    to: '/halo',
  },
  {
    title: 'SaaS Operator Platform',
    badge: 'Never Miss an Estimate',
    description: 'Operator-grade scheduling, follow-up, and escalation workflows.',
    primaryLabel: 'Enter SaaS Operator Platform',
    to: '/operator',
    emphasis: true,
  },
];

const futurePortals = [
  {
    title: 'ManCave Systems',
    description: 'Specialized entertainment and environment control workflows.',
  },
  {
    title: 'Business Security',
    description: 'Commercial-grade protection and incident response workflows.',
  },
  {
    title: 'Business Automation',
    description: 'Operational routines and deterministic facility orchestration.',
  },
  {
    title: 'Property Management',
    description: 'Portfolio oversight, access coordination, and service workflows.',
  },
];

const RetailLanding = () => {
  return (
    <div className="space-shell">
      <div className="container section space-grid">
        <SectionHeader
          kicker="Platform hub"
          title="KickAss Connected Systems Platform"
          subtitle="Choose your portal. Each tile opens a dedicated workspace with its own workflows, controls, and operating context."
        />

        <div className="space-grid three-column portal-grid" aria-label="Active portals">
          {activePortals.map((card) => (
            <SpaceFrame
              key={card.title}
              className={`portal-card${card.emphasis ? ' portal-card-emphasis' : ''}`}
              as="article"
            >
              <div className="portal-card-header">
                <div>
                  <p className="portal-label">Active portal</p>
                  <h3>{card.title}</h3>
                </div>
                <Pill>{card.badge}</Pill>
              </div>
              <p>{card.description}</p>
              <div className="portal-actions">
                <Link className="btn btn-primary" to={card.to}>
                  {card.primaryLabel}
                </Link>
                <Link className="btn btn-secondary" to={card.to}>
                  Explore solutions
                </Link>
              </div>
            </SpaceFrame>
          ))}
        </div>

        <div className="space-grid three-column portal-grid" aria-label="Future portals">
          {futurePortals.map((card) => (
            <SpaceFrame key={card.title} className="portal-card portal-card-disabled" as="article">
              <div className="portal-card-header">
                <div>
                  <p className="portal-label">Future portal</p>
                  <h3>{card.title}</h3>
                </div>
                <Pill>Coming Soon</Pill>
              </div>
              <p>{card.description}</p>
              <div className="portal-actions">
                <span className="btn btn-secondary disabled" aria-disabled="true">
                  Coming Soon
                </span>
              </div>
            </SpaceFrame>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RetailLanding;
