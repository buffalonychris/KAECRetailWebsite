import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import PackageCard from '../components/PackageCard';
import ComparisonLadder from '../components/ComparisonLadder';
import HomeSecurityComparisonTable from '../components/HomeSecurityComparisonTable';
import OwnershipOfflineGuarantee from '../components/OwnershipOfflineGuarantee';
import AccordionSection from '../components/AccordionSection';
import { getPackages } from '../content/packages';
import { brandSite } from '../lib/brand';
import { loadRetailFlow, markFlowStep, updateRetailFlow } from '../lib/retailFlow';
import { resolveVertical } from '../lib/verticals';
import { useLayoutConfig } from '../components/LayoutConfig';
import HomeSecurityFunnelSteps from '../components/HomeSecurityFunnelSteps';

const Packages = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [guidedMode, setGuidedMode] = useState<boolean>(() => loadRetailFlow().guidedMode ?? false);
  const vertical = resolveVertical(searchParams.get('vertical'));
  const packageList = getPackages(vertical);
  const isHomeSecurity = vertical === 'home-security';
  const homeSecurityTierCaptions = isHomeSecurity
    ? {
        a1: 'Essential indoor visibility',
        a2: 'Balanced indoor + outdoor',
        a3: 'Maximum coverage + deterrence',
      }
    : null;
  const homeSecurityTierImages = isHomeSecurity
    ? {
        a1: {
          alt: 'Apartment entry with discreet doorbell and indoor camera',
          src: '/images/home-security/tier-bronze-960w.png',
          srcSet:
            '/images/home-security/tier-bronze-512w.png 512w, /images/home-security/tier-bronze-640w.png 640w, /images/home-security/tier-bronze-960w.png 960w',
          sizes: '(max-width: 720px) 100vw, 360px',
          sources: [
            {
              type: 'image/webp',
              srcSet:
                '/images/home-security/tier-bronze-512w.webp 512w, /images/home-security/tier-bronze-640w.webp 640w, /images/home-security/tier-bronze-960w.webp 960w',
            },
          ],
        },
        a2: {
          alt: 'Suburban home exterior with outdoor camera coverage',
          src: '/images/home-security/tier-silver-960w.png',
          srcSet:
            '/images/home-security/tier-silver-512w.png 512w, /images/home-security/tier-silver-640w.png 640w, /images/home-security/tier-silver-960w.png 960w',
          sizes: '(max-width: 720px) 100vw, 360px',
          sources: [
            {
              type: 'image/webp',
              srcSet:
                '/images/home-security/tier-silver-512w.webp 512w, /images/home-security/tier-silver-640w.webp 640w, /images/home-security/tier-silver-960w.webp 960w',
            },
          ],
        },
        a3: {
          alt: 'Large home exterior with multi-angle camera coverage',
          src: '/images/home-security/tier-gold-960w.png',
          srcSet:
            '/images/home-security/tier-gold-512w.png 512w, /images/home-security/tier-gold-640w.png 640w, /images/home-security/tier-gold-960w.png 960w',
          sizes: '(max-width: 720px) 100vw, 360px',
          sources: [
            {
              type: 'image/webp',
              srcSet:
                '/images/home-security/tier-gold-512w.webp 512w, /images/home-security/tier-gold-640w.webp 640w, /images/home-security/tier-gold-960w.webp 960w',
            },
          ],
        },
      }
    : null;

  useLayoutConfig({
    layoutVariant: isHomeSecurity ? 'funnel' : 'sitewide',
    showBreadcrumbs: isHomeSecurity,
    breadcrumb: isHomeSecurity
      ? [
          { label: 'Home Security', href: '/home-security' },
          { label: 'Packages', href: '/packages?vertical=home-security' },
        ]
      : [],
  });

  useEffect(() => {
    const guidedParam = searchParams.get('guided') === '1';
    const pathParam = searchParams.get('path');
    if (pathParam === 'online' || pathParam === 'onsite') {
      updateRetailFlow({ homeSecurity: { selectedPath: pathParam } });
    }
    if (guidedParam) {
      setGuidedMode(true);
      updateRetailFlow({ guidedMode: true, currentStep: 'select' });
      return;
    }
    markFlowStep('select');
    const stored = loadRetailFlow().guidedMode;
    if (stored) setGuidedMode(true);
  }, [searchParams]);

  const exitGuidedMode = () => {
    setGuidedMode(false);
    updateRetailFlow({ guidedMode: false });
    navigate('/');
  };

  return (
    <div className={`container section ${isHomeSecurity ? 'hub-container' : ''}`}>
      {isHomeSecurity && <HomeSecurityFunnelSteps currentStep="packages" />}
      {isHomeSecurity && (
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Link className="btn btn-link" to="/home-security">
            Back to overview
          </Link>
        </div>
      )}
      {guidedMode && !isHomeSecurity && (
        <div
          className="hero-card motion-fade-up"
          role="status"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}
        >
          <div>
            <strong style={{ color: '#fff7e6' }}>Guided setup</strong>
            <p style={{ margin: '0.25rem 0 0', color: '#e6ddc7' }}>
              You are browsing packages inside guided setup. We will keep steering you toward a quote.
            </p>
          </div>
          <button type="button" className="btn btn-secondary" onClick={exitGuidedMode}>
            Exit guided setup
          </button>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <h1 style={{ margin: 0 }}>
            {vertical === 'home-security' ? 'Choose a Home Security package' : `Choose the ${brandSite} package that fits`}
          </h1>
          <p style={{ margin: 0, color: 'var(--kaec-muted)', maxWidth: 560 }}>
            {vertical === 'home-security'
              ? 'One-time pricing, local-first control, and optional pro install.'
              : 'One-time pricing, delivered with Home Assistant as your single control surface.'}
          </p>
        </div>
        {!isHomeSecurity && (
          <div style={{ display: 'grid', gap: '0.35rem', justifyItems: 'start' }}>
            <Link className="btn btn-primary" to="/quote">
              Continue to Fit Check
            </Link>
            <small style={{ color: '#c8c0aa' }}>
              Clear pricing with pro install, ready for offline resilience.
            </small>
          </div>
        )}
      </div>
      <div className="card-grid motion-stagger">
        {packageList.map((pkg) => (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            vertical={vertical}
            imageCaption={
              homeSecurityTierCaptions ? homeSecurityTierCaptions[pkg.id as keyof typeof homeSecurityTierCaptions] : undefined
            }
            image={homeSecurityTierImages ? homeSecurityTierImages[pkg.id as keyof typeof homeSecurityTierImages] : undefined}
          />
        ))}
      </div>
      {vertical === 'home-security' && (
        <p style={{ marginTop: '1rem', color: 'var(--kaec-muted)' }}>
          All packages are expandable later. You can add cameras, sensors, or coverage areas as your needs change.
        </p>
      )}

      {vertical === 'home-security' && (
        <div className="section">
          <AccordionSection
            title="Compare Home Security tiers"
            description="One dashboard for everything. Remote access needs internet, but local control still works on your home network."
            defaultOpen={false}
          >
            <HomeSecurityComparisonTable />
          </AccordionSection>
        </div>
      )}

      {vertical !== 'home-security' && <ComparisonLadder />}

      {!isHomeSecurity && (
        <OwnershipOfflineGuarantee
          intro="Every package honors the Offline Dignity Rule and keeps ownership with the household."
          className="section motion-fade-up"
        />
      )}
    </div>
  );
};

export default Packages;
