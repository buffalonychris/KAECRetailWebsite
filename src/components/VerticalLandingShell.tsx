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

import ChartCard from './operator/ChartCard';
import SectionHeader from './operator/SectionHeader';
import SpaceFrame from './operator/SpaceFrame';

export type VerticalLandingShellProps = {
  verticalName: string;
  badgeLabel: string;
  heroHeadline: string;
  heroSubhead: string;
  primaryCTA: {
    label: string;
    to: string;
  };
  chartData: Array<{ label: string; value: number }>;
  keyCapabilities: string[];
};

const VerticalLandingShell = ({
  verticalName,
  badgeLabel,
  heroHeadline,
  heroSubhead,
  primaryCTA,
  chartData,
  keyCapabilities,
}: VerticalLandingShellProps) => {
  return (
    <div className="space-shell">
      <div className="container section space-grid">
        <SectionHeader
          kicker={badgeLabel}
          title={heroHeadline}
          subtitle={heroSubhead}
          actions={
            <Link className="btn btn-primary" to={primaryCTA.to}>
              {primaryCTA.label}
            </Link>
          }
        />

        <div className="space-grid two-column">
          <SpaceFrame>
            <h2>{verticalName} key capabilities</h2>
            <p>
              A focused business line built to deliver predictable operations, reliable integrations, and
              clear visibility for teams.
            </p>
            <ul className="operator-list">
              {keyCapabilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </SpaceFrame>

          <ChartCard title={`${verticalName} activity`} subtitle="Example / demo data">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="3 3" />
                <XAxis dataKey="label" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15, 23, 42, 0.95)',
                    borderColor: 'rgba(125, 211, 252, 0.35)',
                    color: '#e2e8f0',
                  }}
                />
                <Area type="monotone" dataKey="value" stroke="#38bdf8" fill="rgba(56, 189, 248, 0.25)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <SpaceFrame className="vertical-cta">
          <h2>Ready to explore {verticalName}?</h2>
          <p>Start a guided intake and we will route you to the right team for the next step.</p>
          <div className="space-section-actions">
            <Link className="btn btn-primary" to={primaryCTA.to}>
              {primaryCTA.label}
            </Link>
            <Link className="btn btn-secondary" to="/support">
              Explore solutions
            </Link>
          </div>
        </SpaceFrame>
      </div>
    </div>
  );
};

export default VerticalLandingShell;
