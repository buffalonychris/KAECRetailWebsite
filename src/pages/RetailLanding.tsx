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
  { week: 'W1', requests: 18 },
  { week: 'W2', requests: 26 },
  { week: 'W3', requests: 22 },
  { week: 'W4', requests: 30 },
  { week: 'W5', requests: 28 },
];

const RetailLanding = () => {
  return (
    <div className="space-shell">
      <div className="container section space-grid">
        <SectionHeader
          kicker="Reliable Elder Care Platform"
          title="A brand hub for safer homes, automated living, and operator-grade service"
          subtitle={`${brandSite} connects home security, automation, and caregiver-grade monitoring in a single, local-first ecosystem. Explore the product lines below to find the right fit.`}
          actions={
            <>
              <Link className="btn btn-primary" to="/demo">
                See the Demo Flow
              </Link>
              <Link className="btn btn-secondary" to="/operator">
                View Operator SaaS
              </Link>
            </>
          }
        />

        <div className="space-grid two-column">
          <SpaceFrame>
            <h2>{brandSite} platform overview</h2>
            <p>
              Build a safer home stack with resilient sensing, automation, and communication that stays useful
              through outages. Every product line below can run locally, with clear handoff paths for caregivers
              and operators.
            </p>
            <ul className="operator-list">
              <li>Local-first security and automations designed for real-world homes.</li>
              <li>Caregiver and family visibility without intrusive monitoring.</li>
              <li>Operator-grade service layers when you need scheduling or escalations.</li>
            </ul>
          </SpaceFrame>

          <ChartCard
            title="Household safety signals"
            subtitle="Requests captured per week (example / demo data)"
          >
            <div className="chart-card-body">
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
            </div>
          </ChartCard>
        </div>

        <div className="space-grid three-column">
          <SpaceFrame>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
              <h3 style={{ margin: 0 }}>Home Security</h3>
              <Pill>Local-first</Pill>
            </div>
            <p>
              Always-on protection with sensors, cameras, and local storage that keep working when the cloud is
              down.
            </p>
            <Link className="btn" to="/home-security">
              Explore Home Security
            </Link>
          </SpaceFrame>

          <SpaceFrame>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
              <h3 style={{ margin: 0 }}>Home Automation</h3>
              <Pill>Automation</Pill>
            </div>
            <p>
              Lighting, climate, and routines that are deterministic, privacy-first, and built for daily living.
            </p>
            <Link className="btn" to="/home-automation">
              Explore Home Automation
            </Link>
          </SpaceFrame>

          <SpaceFrame>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
              <h3 style={{ margin: 0 }}>Operator</h3>
              <Pill>SaaS</Pill>
            </div>
            <p>
              The Operator SaaS console adds scheduling and escalation workflows to high-volume service teams.
            </p>
            <div className="space-section-actions">
              <Link className="btn btn-primary" to="/operator">
                Visit Operator
              </Link>
            </div>
          </SpaceFrame>
        </div>

        <div className="space-grid three-column">
          <KpiTile label="Automation scenes" value="42" trend="Example / demo data" footer="Local-first workflows" />
          <KpiTile label="Caregiver alerts" value="128" trend="Example / demo data" footer="Notifications routed" />
          <KpiTile label="Operator escalations" value="9" trend="Example / demo data" footer="Example / demo data" />
        </div>

        <div className="space-grid two-column">
          <SpaceFrame>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
              <h3 style={{ margin: 0 }}>Elderly Care</h3>
              <Pill>Reliable</Pill>
            </div>
            <p>
              Caregiver-friendly monitoring, alerts, and automation that prioritize dignity while keeping loved
              ones safe.
            </p>
            <Link className="btn" to="/elder-care">
              Explore Elderly Care
            </Link>
          </SpaceFrame>

          <SpaceFrame>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
              <h3 style={{ margin: 0 }}>HALO</h3>
              <Pill>Signal layer</Pill>
            </div>
            <p>
              A connected safety layer that unifies alerts, signals, and resilience for larger homes or campuses.
            </p>
            <Link className="btn" to="/halo">
              Explore HALO
            </Link>
          </SpaceFrame>
        </div>

        <SpaceFrame>
          <h2>Start with a guided demo</h2>
          <p>
            Walk through the intake questions and explore the Operator-style dashboard with example data. No
            pricing, guarantees, or promises are given by the assistant.
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
