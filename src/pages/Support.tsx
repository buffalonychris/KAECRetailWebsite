import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import ChartCard from '../components/operator/ChartCard';
import SectionHeader from '../components/operator/SectionHeader';
import SpaceFrame from '../components/operator/SpaceFrame';

const ticketData = [
  { type: 'Routing', count: 18 },
  { type: 'Calendar', count: 12 },
  { type: 'Escalations', count: 6 },
  { type: 'Billing', count: 4 },
];

const Support = () => (
  <div className="space-shell">
    <div className="container section space-grid">
      <SectionHeader
        kicker="Support"
        title="How to reach support"
        subtitle="We respond to scheduling assistant questions and demo requests in the order received."
      />

      <ChartCard title="Example ticket categories" subtitle="Routing + onboarding mix">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={ticketData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="3 3" />
            <XAxis dataKey="type" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                background: 'rgba(15, 23, 42, 0.95)',
                borderColor: 'rgba(125, 211, 252, 0.35)',
                color: '#e2e8f0',
              }}
            />
            <Bar dataKey="count" fill="#38bdf8" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <SpaceFrame>
        <h2>Email</h2>
        <p>Use the placeholder email below until your team provides a dedicated inbox.</p>
        <p>
          <strong>support@example.com</strong>
        </p>
      </SpaceFrame>

      <SpaceFrame>
        <h2>Response expectations</h2>
        <p>
          We aim to respond within 1-2 business days. If your request is urgent, note that in the subject line so
          we can prioritize scheduling-related questions.
        </p>
      </SpaceFrame>
    </div>
  </div>
);

export default Support;
