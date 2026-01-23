import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import PackageCard from '../components/PackageCard';
import ComparisonLadder from '../components/ComparisonLadder';
import HomeSecurityComparisonTable from '../components/HomeSecurityComparisonTable';
import OwnershipOfflineGuarantee from '../components/OwnershipOfflineGuarantee';
import ResponsivePublicImage from '../components/ResponsivePublicImage';
import AccordionSection from '../components/AccordionSection';
import { getPackages } from '../content/packages';
import { getAddOns } from '../data/pricing';
import { brandSite } from '../lib/brand';
import { loadRetailFlow, markFlowStep, updateRetailFlow } from '../lib/retailFlow';
import { resolveVertical } from '../lib/verticals';
import { useLayoutConfig } from '../components/LayoutConfig';

const Packages = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [guidedMode, setGuidedMode] = useState<boolean>(() => loadRetailFlow().guidedMode ?? false);
  const vertical = resolveVertical(searchParams.get('vertical'));
  const packageList = getPackages(vertical);
  const addOns = getAddOns(vertical);
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
      {guidedMode && (
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
        <div style={{ display: 'grid', gap: '0.35rem', justifyItems: 'start' }}>
          <Link
            className="btn btn-primary"
            to={vertical === 'home-security' ? '/quote?vertical=home-security' : '/quote'}
          >
            Build my quote
          </Link>
          <small style={{ color: '#c8c0aa' }}>
            Clear pricing with pro install, ready for offline resilience.
          </small>
        </div>
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
        <div className="section">
          <AccordionSection
            title="Compare Home Security tiers"
            description="One dashboard for everything. Remote access needs internet, but local control still works on your home network."
          >
            <div className="compare-stack">
              <ResponsivePublicImage
                srcBase="/images/home-security/hs_graphic_typical-coverage-by-package"
                alt="Typical coverage by package tier"
                className="premium-image premium-image--contain motion-fade-up"
              />
              <HomeSecurityComparisonTable />
            </div>
          </AccordionSection>
        </div>
      )}

      {vertical !== 'home-security' && <ComparisonLadder />}

      {vertical === 'home-security' && (
        <div className="section">
          <div className="card" style={{ display: 'grid', gap: '0.75rem' }}>
            <div className="badge">Optional add-ons</div>
            <h2 style={{ margin: 0 }}>Optional add-ons</h2>
            <p style={{ margin: 0, color: 'var(--kaec-muted)' }}>
              Add-ons expand coverage and are quoted separately based on your layout and wiring. Core local control still works without
              internet.
            </p>
            <ul className="list">
              {addOns.map((addOn) => (
                <li key={addOn.id}>
                  <span />
                  <span>
                    <strong>{addOn.label}</strong> — {addOn.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <OwnershipOfflineGuarantee
        intro={
          vertical === 'home-security'
            ? 'Local-first control and ownership stay with your household.'
            : 'Every package honors the Offline Dignity Rule and keeps ownership with the household.'
        }
        items={
          vertical === 'home-security'
            ? [
                'You own the equipment, automations, and data.',
                'Core functions still work on your home network if the internet is down.',
                'Optional third-party services are contracted directly by you.',
              ]
            : undefined
        }
        className={isHomeSecurity ? 'section motion-fade-up' : 'section motion-fade-up'}
      />
    </div>
  );
};

export default Packages;
