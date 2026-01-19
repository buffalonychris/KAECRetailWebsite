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
import Pill from '../components/operator/Pill';
import SectionHeader from '../components/operator/SectionHeader';
import SpaceFrame from '../components/operator/SpaceFrame';
import DeviceFrame from '../components/ui/DeviceFrame';
import { brandSite } from '../lib/brand';
import { legacyMappings, systemInventory } from '../content/systemRestoration';

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
  {
    title: 'Operator (SaaS)',
    badge: 'SaaS',
    description: 'Operator-grade scheduling, follow-up, and escalation workflows.',
    primaryLabel: 'Enter Operator',
    to: '/operator',
    emphasis: true,
  },
];

const RetailLanding = () => {
  return (
    <div className="space-shell">
      <div className="container section space-grid">
        <SectionHeader
          kicker="Holding Company Hub"
          title={`${brandSite} business portals`}
          subtitle="Choose a vertical business below. Each portal leads to a dedicated subsite with its own capabilities, intake, and demo data."
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

        <DeviceFrame>
          <ChartCard
            title="Inbound signal trend"
            subtitle="Platform-level signal activity"
            helperText="Example / demo data for illustration only."
          >
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
        </DeviceFrame>

        <div className="space-grid two-column">
          <SpaceFrame>
            <div className="badge">System inventory</div>
            <h2>Restored pages, agreements, and logic</h2>
            <ul className="operator-list">
              {systemInventory.pages.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <ul className="operator-list" style={{ marginTop: '1rem' }}>
              {systemInventory.agreements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <ul className="operator-list" style={{ marginTop: '1rem' }}>
              {systemInventory.systemLogic.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </SpaceFrame>
          <SpaceFrame>
            <div className="badge">Legacy mapping</div>
            <h2>Legacy content mapped to current architecture</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {legacyMappings.map((mapping) => (
                <div className="card" key={mapping.legacyItem}>
                  <h3 style={{ marginTop: 0, color: '#fff7e6' }}>{mapping.legacyItem}</h3>
                  <p style={{ margin: '0.35rem 0', color: '#c8c0aa' }}>{mapping.currentLocation}</p>
                  <small style={{ color: '#c8c0aa' }}>{mapping.notes}</small>
                </div>
              ))}
            </div>
          </SpaceFrame>
        </div>

        <SpaceFrame>
          <div className="badge">Intake journeys</div>
          <h2>End-to-end journeys restored</h2>
          <ul className="operator-list">
            {systemInventory.intakeJourneys.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </SpaceFrame>
      </div>
    </div>
  );
};

export default RetailLanding;
