import { Link } from 'react-router-dom';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import ChartCard from '../components/operator/ChartCard';
import KpiTile from '../components/operator/KpiTile';
import Pill from '../components/operator/Pill';
import SectionHeader from '../components/operator/SectionHeader';
import SpaceFrame from '../components/operator/SpaceFrame';
import { brandSite } from '../lib/brand';

const signalTrend = [
  { week: 'W1', requests: 28 },
  { week: 'W2', requests: 36 },
  { week: 'W3', requests: 31 },
  { week: 'W4', requests: 39 },
  { week: 'W5', requests: 35 },
];

const portalCards = [
  {
    title: 'Home Security',
    badge: 'Local-first',
    description: 'Protection workflows with sensors, deterrence, and local-first resilience.',
    primaryLabel: 'Enter Home Security',
    to: '/home-security',
  },
  {
    title: 'Home Automation',
    badge: 'Automation',
    description: 'Daily routines and deterministic scenes built for comfort and efficiency.',
    primaryLabel: 'Enter Home Automation',
    to: '/home-automation',
  },
  {
    title: 'Operator (SaaS)',
    badge: 'SaaS',
    description: 'Operator-grade scheduling, follow-up, and escalation workflows.',
    primaryLabel: 'Enter Operator',
    to: '/operator',
    emphasis: true,
  },
  {
    title: 'Elder Care Tech',
    badge: 'Caregiver-grade',
    description: 'Caregiver visibility and supportive monitoring for aging-in-place.',
    primaryLabel: 'Enter Elder Care Tech',
    to: '/elder-care-tech',
  },
  {
    title: 'HALO PERS',
    badge: 'PERS',
    description: 'Personal safety signaling with clear response pathways.',
    primaryLabel: 'Enter HALO',
    to: '/halo',
  },
];

const RetailLanding = () => {
  return (
    <div className="space-shell">
      <div className="container section space-grid">
        <SectionHeader
          kicker="Holding Company Hub"
          title={`${brandSite} business portals`}
          subtitle="Choose a vertical business below. Each portal leads to a dedicated subsite with its own hero, capabilities, and demo data."
          actions={
            <>
              <Link className="btn btn-primary" to="/demo">
                View Demo Intake
              </Link>
              <Link className="btn btn-secondary" to="/operator">
                Visit Operator SaaS
              </Link>
            </>
          }
        />

        <div className="space-grid three-column portal-grid" aria-label="Business portals">
          {portalCards.map((card) => (
            <SpaceFrame
              key={card.title}
              className={`portal-card${card.emphasis ? ' portal-card-emphasis' : ''}`}
              as="article"
            >
              <div className="portal-card-header">
                <div>
                  <p className="portal-label">Business Portal</p>
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

        <div className="space-grid two-column">
          <SpaceFrame>
            <h2>Shared operator-grade foundation</h2>
            <p>
              Every vertical runs on a consistent operating system: local-first reliability, structured
              handoffs, and a clear compliance posture with no pricing or guarantee language.
            </p>
            <ul className="operator-list">
              <li>Unified navigation across the holding company and vertical subsites.</li>
              <li>Demo dashboards and KPI cards to illustrate example performance.</li>
              <li>Structured intake paths that route to the right specialist team.</li>
            </ul>
          </SpaceFrame>

          <ChartCard title="Inbound signal trend" subtitle="Example / demo data">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={signalTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="3 3" />
                <XAxis dataKey="week" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15, 23, 42, 0.95)',
                    borderColor: 'rgba(125, 211, 252, 0.35)',
                    color: '#e2e8f0',
                  }}
                />
                <Area type="monotone" dataKey="requests" stroke="#38bdf8" fill="rgba(56, 189, 248, 0.25)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="space-grid three-column">
          <KpiTile label="Portal handoffs" value="52" trend="Example / demo data" footer="Hubs routed" />
          <KpiTile label="Local-first automations" value="87" trend="Example / demo data" footer="Workflow count" />
          <KpiTile label="Operator escalations" value="9" trend="Example / demo data" footer="Example / demo data" />
        </div>

        <SpaceFrame>
          <h2>Start with a guided demo</h2>
          <p>
            Walk through the intake questions and explore the Operator-style dashboard with example data.
            No pricing, guarantees, or promises are given by the assistant.
          </p>
          <div className="space-section-actions">
            <Link className="btn btn-primary" to="/demo">
              View Demo Intake
            </Link>
            <Link className="btn btn-secondary" to="/5-day-demo">
              Start a 5-Day Demo
            </Link>
          </div>
        </SpaceFrame>
      </div>
    </div>
  );
};

export default RetailLanding;
