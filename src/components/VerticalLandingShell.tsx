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
  journeySteps?: string[];
  agreementHighlights?: string[];
  packageHighlights?: string[];
  playbooks?: Array<{
    title: string;
    purpose: string;
    trigger: string;
    actions: string[];
    handoff: string;
  }>;
};

const VerticalLandingShell = ({
  verticalName,
  badgeLabel,
  heroHeadline,
  heroSubhead,
  primaryCTA,
  chartData,
  keyCapabilities,
  journeySteps,
  agreementHighlights,
  packageHighlights,
  playbooks,
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

        {(journeySteps || agreementHighlights) && (
          <div className="space-grid two-column">
            {journeySteps && (
              <SpaceFrame>
                <div className="badge">Intake journey</div>
                <h2>{verticalName} journey steps</h2>
                <ul className="operator-list">
                  {journeySteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </SpaceFrame>
            )}
            {agreementHighlights && (
              <SpaceFrame>
                <div className="badge">Agreements</div>
                <h2>Agreement checkpoints</h2>
                <ul className="operator-list">
                  {agreementHighlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </SpaceFrame>
            )}
          </div>
        )}

        {packageHighlights && (
          <SpaceFrame>
            <div className="badge">Package intelligence</div>
            <h2>Restored package coverage</h2>
            <ul className="operator-list">
              {packageHighlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </SpaceFrame>
        )}

        {playbooks && (
          <SpaceFrame>
            <div className="badge">Automation playbooks</div>
            <h2>Structured automation playbooks</h2>
            <div className="card-grid" style={{ marginTop: '1rem' }}>
              {playbooks.map((playbook) => (
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
          </SpaceFrame>
        )}

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
