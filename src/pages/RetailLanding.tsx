import { Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import ChartCard from '../components/operator/ChartCard';
import KpiTile from '../components/operator/KpiTile';
import Pill from '../components/operator/Pill';
import SectionHeader from '../components/operator/SectionHeader';
import SpaceFrame from '../components/operator/SpaceFrame';

const trustChips = [
  'Works with iPhone & Android',
  'Google Calendar',
  'Apple Calendar',
  'Outlook / Office 365',
  'CRM-friendly (Jobber, ServiceTitan, Salesforce, HubSpot)',
];

const workSteps = [
  'Customer calls or texts',
  'Assistant answers immediately',
  'Asks only necessary questions',
  'Schedules estimate',
  'Appointment appears on calendar',
];

const captureTrend = [
  { day: 'Mon', captured: 14, booked: 9 },
  { day: 'Tue', captured: 18, booked: 12 },
  { day: 'Wed', captured: 16, booked: 11 },
  { day: 'Thu', captured: 22, booked: 15 },
  { day: 'Fri', captured: 19, booked: 13 },
  { day: 'Sat', captured: 11, booked: 6 },
  { day: 'Sun', captured: 9, booked: 5 },
];

const RetailLanding = () => {
  return (
    <div className="space-shell">
      <div className="container section space-grid">
        <SectionHeader
          kicker="Operator Console"
          title="Never Miss Another Estimate — Even After Hours"
          subtitle="A scheduling-only assistant that answers calls and texts, gathers the essentials, and books estimate appointments directly on your calendar."
          actions={
            <>
              <Link className="btn btn-primary" to="/demo">
                See a Live Demo
              </Link>
              <Link className="btn btn-secondary" to="/pricing">
                View Pricing
              </Link>
            </>
          }
        />

        <div className="space-grid two-column">
          <SpaceFrame>
            <h2>Operator-style scheduling overview</h2>
            <p>
              The Operator console tracks every request, every booking, and every escalation so your team stays in
              control without staffing a phone line.
            </p>
            <ul className="operator-list">
              <li>Instantly capture after-hours estimate requests.</li>
              <li>Auto-schedule only when the required details are collected.</li>
              <li>Escalate sensitive conversations back to your team.</li>
            </ul>
            <div className="space-section-actions">
              <Link className="btn" to="/never-miss-another-estimate">
                Visit the full product page
              </Link>
            </div>
          </SpaceFrame>

          <ChartCard
            title="After-hours calls captured"
            subtitle="7-day operator capture + booking trend"
          >
            <div className="chart-card-body">
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={captureTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="3 3" />
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(15, 23, 42, 0.95)',
                      borderColor: 'rgba(125, 211, 252, 0.35)',
                      color: '#e2e8f0',
                    }}
                  />
                  <Line type="monotone" dataKey="captured" stroke="#38bdf8" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="booked" stroke="#a3e635" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <div className="space-grid three-column">
          <KpiTile label="Calls handled today" value="38" trend="+12% vs. last week" footer="Example / demo data" />
          <KpiTile label="Estimates booked" value="21" trend="+6%" footer="Example / demo data" />
          <KpiTile label="Escalations" value="4" trend="Stable" footer="Example / demo data" />
        </div>

        <SpaceFrame>
          <h2>Works with your tools</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {trustChips.map((item) => (
              <Pill key={item}>{item}</Pill>
            ))}
          </div>
        </SpaceFrame>

        <SpaceFrame>
          <h2>How it works</h2>
          <ol className="operator-list">
            {workSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </SpaceFrame>

        <SpaceFrame>
          <h2>What it will NOT do</h2>
          <ul className="operator-list">
            <li>No pricing</li>
            <li>No guarantees</li>
            <li>No emergency diagnosis</li>
            <li>No staff replacement</li>
          </ul>
        </SpaceFrame>

        <SpaceFrame>
          <h2>Start a Free 5-Day Live Demo (We Pay for It)</h2>
          <p>
            See how the assistant books real estimate appointments while you stay in control of scheduling.
          </p>
          <div className="space-section-actions">
            <Link className="btn btn-primary" to="/5-day-demo">
              Start a Free 5-Day Live Demo (We Pay for It)
            </Link>
            <Link className="btn btn-secondary" to="/partners">
              Become a Partner
            </Link>
          </div>
        </SpaceFrame>
      </div>
    </div>
  );
};

export default RetailLanding;
