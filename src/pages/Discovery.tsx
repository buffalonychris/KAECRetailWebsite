import { useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AccordionSection from '../components/AccordionSection';
import FitCheck from '../components/FitCheck';
import ResponsivePublicImage from '../components/ResponsivePublicImage';
import { useLayoutConfig } from '../components/LayoutConfig';
import { fitCheckConfigs } from '../content/fitCheckConfigs';
import HomeSecurityFunnelSteps from '../components/HomeSecurityFunnelSteps';
import { updateRetailFlow } from '../lib/retailFlow';

const Discovery = () => {
  const [searchParams] = useSearchParams();
  const requestedVertical = searchParams.get('vertical') ?? 'home-security';
  const pathParam = searchParams.get('path');

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

  useEffect(() => {
    if (isHomeSecurity && (pathParam === 'online' || pathParam === 'onsite')) {
      updateRetailFlow({ homeSecurity: { selectedPath: pathParam } });
    }
  }, [isHomeSecurity, pathParam]);

  return (
    <section className="section">
      {isHomeSecurity && <HomeSecurityFunnelSteps currentStep="fit-check" />}
      {isHomeSecurity && (
        <div className="container" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link className="btn btn-secondary" to="/packages?vertical=home-security">
            Back to Packages
          </Link>
          <Link className="btn btn-link" to="/home-security#how-you-can-proceed">
            Edit how you proceed
          </Link>
        </div>
      )}
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
                className="premium-image premium-image--contain hover-lift motion-fade-up"
              />
              <figure className="motion-fade-up" style={{ display: 'grid', gap: '0.5rem', margin: 0 }}>
                <ResponsivePublicImage
                  srcBase="/images/home-security/hs_diagram_local-first-architecture"
                  alt="Local-first architecture diagram with a local recording host and a single Home Assistant dashboard"
                  className="premium-image premium-image--contain hover-lift"
                />
                <figcaption style={{ color: 'var(--kaec-muted)', fontSize: '0.95rem' }}>
                  <strong>Local Recording Host (CloudKey+ or NVR by package)</strong>
                  <br />
                  Single Home Assistant dashboard for sensors &amp; automations
                </figcaption>
              </figure>
            </div>
            <div className="discovery-mobile-accordion">
              <AccordionSection title="Why local-first matters" description="Ownership, offline continuity, and no lock-in.">
                <ResponsivePublicImage
                  srcBase="/images/home-security/hs_badges_trust-grid"
                  alt="Trust and guarantees summary"
                  className="premium-image premium-image--contain hover-lift motion-fade-up"
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
