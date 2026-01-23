import { useSearchParams } from 'react-router-dom';
import FitCheck from '../components/FitCheck';
import { useLayoutConfig } from '../components/LayoutConfig';
import { getFitCheckConfig } from '../content/fitCheckConfigs';
import { resolveVertical } from '../lib/verticals';

const Discovery = () => {
  const [searchParams] = useSearchParams();
  const vertical = resolveVertical(searchParams.get('vertical'));
  const config = getFitCheckConfig(vertical);

  useLayoutConfig({
    layoutVariant: 'funnel',
    showBreadcrumbs: Boolean(config),
    breadcrumb: config?.breadcrumb ?? [],
  });

  if (!config) {
    return (
      <section className="section">
        <div className="container">
          <div className="card" style={{ display: 'grid', gap: '0.75rem' }}>
            <div className="badge">Fit Check</div>
            <h2 style={{ margin: 0 }}>We couldn’t find that discovery flow.</h2>
            <p style={{ margin: 0, color: '#c8c0aa' }}>Choose a supported vertical to continue.</p>
            <a className="btn" href="/home-security">
              Go to Home Security
            </a>
          </div>
        </div>
      </section>
    );
  }

  return <FitCheck config={config} />;
};

export default Discovery;
