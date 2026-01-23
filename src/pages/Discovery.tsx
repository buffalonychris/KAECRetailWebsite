import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import FitCheck from '../components/FitCheck';
import { useLayoutConfig } from '../components/LayoutConfig';
import { fitCheckConfigs } from '../content/fitCheckConfigs';

const Discovery = () => {
  const [searchParams] = useSearchParams();
  const requestedVertical = searchParams.get('vertical') ?? 'home-security';

  const resolvedVertical = useMemo(() => {
    if (fitCheckConfigs[requestedVertical]) {
      return requestedVertical;
    }
    return 'home-security';
  }, [requestedVertical]);

  useLayoutConfig({
    layoutVariant: 'funnel',
    showBreadcrumbs: true,
    breadcrumb: [
      { label: 'Discovery', href: `/discovery?vertical=${resolvedVertical}` },
      { label: 'Fit Check' },
    ],
  });

  const config = fitCheckConfigs[resolvedVertical];
  const showUnknownNote = requestedVertical !== resolvedVertical;

  return (
    <section className="section">
      {showUnknownNote ? (
        <div className="container" style={{ marginBottom: '1rem' }}>
          <p style={{ margin: 0, color: 'rgba(165, 216, 247, 0.8)' }}>
            We couldn’t find that discovery vertical, so we loaded Home Security instead.
          </p>
        </div>
      ) : null}
      <FitCheck config={config} />
    </section>
  );
};

export default Discovery;
