import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import AccordionSection from '../components/AccordionSection';
import FitCheck from '../components/FitCheck';
import ResponsivePublicImage from '../components/ResponsivePublicImage';
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
  const isHomeSecurity = resolvedVertical === 'home-security';
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
      {isHomeSecurity ? (
        <div className="container discovery-layout">
          <div className="discovery-main">
            <FitCheck config={config} layout="embedded" />
          </div>
          <aside className="discovery-aside">
            <div className="discovery-sticky-panel">
              <ResponsivePublicImage
                srcBase="/images/home-security/hs_badges_trust-grid"
                alt="Trust and guarantees summary"
                className="premium-image premium-image--contain"
              />
              <ResponsivePublicImage
                srcBase="/images/home-security/hs_diagram_local-first-architecture"
                alt="Local-first architecture diagram"
                className="premium-image premium-image--contain"
              />
            </div>
            <div className="discovery-mobile-accordion">
              <AccordionSection title="Why local-first matters" description="Ownership, offline continuity, and no lock-in.">
                <ResponsivePublicImage
                  srcBase="/images/home-security/hs_badges_trust-grid"
                  alt="Trust and guarantees summary"
                  className="premium-image premium-image--contain"
                />
              </AccordionSection>
            </div>
          </aside>
        </div>
      ) : (
        <FitCheck config={config} />
      )}
    </section>
  );
};

export default Discovery;
