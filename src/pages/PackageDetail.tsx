import { useEffect, useMemo, type MouseEvent } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { getPackages } from '../content/packages';
import TierBadge from '../components/TierBadge';
import { PackageTierId } from '../data/pricing';
import { siteConfig } from '../config/site';
import { resolveVertical } from '../lib/verticals';
import AccordionSection from '../components/AccordionSection';
import { HOME_SECURITY_PDP_CONTENT } from '../content/homeSecurityPdp';
import { useLayoutConfig } from '../components/LayoutConfig';
import ResponsivePublicImage from '../components/ResponsivePublicImage';
import { updateRetailFlow } from '../lib/retailFlow';
import HomeSecurityFunnelSteps from '../components/HomeSecurityFunnelSteps';

const PackageDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const vertical = resolveVertical(searchParams.get('vertical'));
  const packageList = getPackages(vertical);
  const pkg = packageList.find((item) => item.id === id);
  const verticalQuery = vertical === 'home-security' ? '?vertical=home-security' : '';
  const isHomeSecurityPdp = vertical === 'home-security' && (id === 'a1' || id === 'a2' || id === 'a3');
  const isMostPopular = isHomeSecurityPdp && id === 'a2';
  const homeSecurityTierStrip = isHomeSecurityPdp
    ? {
        a1: '/images/home-security/tier-bronze-960w.png',
        a2: '/images/home-security/tier-silver-960w.png',
        a3: '/images/home-security/tier-gold-960w.png',
      }
    : null;
  const packageContent = useMemo(
    () => (isHomeSecurityPdp && pkg ? HOME_SECURITY_PDP_CONTENT[pkg.id as 'a1' | 'a2' | 'a3'] : null),
    [isHomeSecurityPdp, pkg]
  );
  const quoteLink = pkg ? `/quote?vertical=home-security&package=${pkg.id}` : '/quote?vertical=home-security';
  const contactLink =
    vertical === 'home-security'
      ? pkg
        ? `/contact?vertical=home-security&package=${pkg.id}`
        : '/contact?vertical=home-security'
      : '/contact';
  const primaryActionLabel = isHomeSecurityPdp ? 'Continue to Fit Check' : 'Request install';
  const primaryActionLink = isHomeSecurityPdp ? '/discovery?vertical=home-security' : contactLink;
  const tierLabel = pkg?.name ?? 'Package';
  const selectedTierId = pkg ? (pkg.id.toUpperCase() as PackageTierId) : undefined;
  const handleJump = (targetId: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `#${targetId}`);
    }
  };

  useLayoutConfig({
    layoutVariant: isHomeSecurityPdp ? 'funnel' : 'sitewide',
    showBreadcrumbs: isHomeSecurityPdp,
    breadcrumb: isHomeSecurityPdp
      ? [
          { label: 'Home Security', href: '/home-security' },
          { label: 'Packages', href: '/packages?vertical=home-security' },
          { label: tierLabel },
        ]
      : [],
  });

  useEffect(() => {
    if (isHomeSecurityPdp && selectedTierId) {
      updateRetailFlow({ homeSecurity: { selectedPackageId: selectedTierId } });
    }
  }, [isHomeSecurityPdp, selectedTierId]);

  if (!pkg) {
    return (
      <div className="container section">
        <h2>Package not found</h2>
        <p>Please return to the packages page.</p>
        <Link className="btn btn-primary" to={`/packages${verticalQuery}`}>
          Back to packages
        </Link>
      </div>
    );
  }

  if (isHomeSecurityPdp && packageContent) {
    const heroStripImage = pkg ? homeSecurityTierStrip?.[pkg.id as keyof typeof homeSecurityTierStrip] : null;
    const isGoldTier = pkg.id === 'a3';
    const showTrustGrid = pkg.id === 'a1' || pkg.id === 'a2';
    const atGlanceItems = [
      pkg.typicalCoverage ? `Coverage: ${pkg.typicalCoverage}` : null,
      packageContent.keyOutcomes[0] ?? null,
      packageContent.keyOutcomes[1] ?? null,
    ].filter((item): item is string => Boolean(item));
    const whatYouGetCards = packageContent.whatYouGet.map((group) => {
      const summary =
        group.items.length > 2
          ? `${group.items[0]} · ${group.items[1]} +${group.items.length - 2} more`
          : group.items.join(' · ');
      return {
        title: group.title,
        summary,
      };
    });
    const whatYouGetIcons: Record<string, string> = {
      Core: '◎',
      'Video & Entry': '◉',
      Cameras: '◌',
      'Sensors & Alerts': '◈',
    };
    const goldCardImages = [
      {
        title: 'Core platform',
        srcBase: '/images/home-security/hs_card_core-platform',
        alt: 'Gold package card showing the core platform bundle',
      },
      {
        title: 'Video & entry',
        srcBase: '/images/home-security/hs_card_video-door-chime',
        alt: 'Gold package card showing video door chime coverage',
      },
      {
        title: 'Cameras',
        srcBase: '/images/home-security/hs_card_indoor-outdoor-coverage',
        alt: 'Gold package card showing indoor and outdoor camera coverage',
      },
      {
        title: 'Sensors & alerts',
        srcBase: '/images/home-security/hs_card_sensors-alerts',
        alt: 'Gold package card showing sensors and alerts coverage',
      },
    ];
    const trustPolicies = [
      'You own the equipment, automations, and data.',
      'Optional third-party services connect directly to you; we do not sell subscriptions.',
      'Core functions work without internet for safety and daily routines.',
      'Clear support path for troubleshooting and expansions.',
      ...pkg.agreements.map((item) =>
        item
          .replace(/confirmation/gi, '')
          .replace(/acknowledgement/gi, '')
          .replace(/acknowledgment/gi, '')
          .replace(/record/gi, '')
          .replace(/summary/gi, '')
          .replace(/\s+/g, ' ')
          .trim()
      ),
      `Deposit policy: ${
        siteConfig.depositPolicy.type === 'flat'
          ? `Flat $${siteConfig.depositPolicy.value}`
          : `${siteConfig.depositPolicy.value * 100}% of the deterministic total`
      }`,
    ];

    return (
      <div className="container section pdp-shell">
        <HomeSecurityFunnelSteps currentStep="packages" />
        <Link to={`/packages${verticalQuery}`} className="btn btn-secondary pdp-back">
          Back to packages
        </Link>
        <section className="hero-card pdp-hero motion-fade-up">
          {heroStripImage ? (
            <div className="pdp-hero-strip" style={{ backgroundImage: `url(${heroStripImage})` }} aria-hidden="true" />
          ) : null}
          <div className="pdp-hero-header">
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <div className="pdp-hero-badges">
                <TierBadge
                  tierId={(pkg.id.toUpperCase() as PackageTierId) ?? 'A1'}
                  labelOverride={pkg.badge ?? undefined}
                  vertical={vertical}
                />
                {isMostPopular && <span className="popular-pill">Recommended</span>}
              </div>
              <h1 className="pdp-title">{pkg.name}</h1>
              <p className="pdp-tagline">{packageContent.heroOneLiner}</p>
            </div>
            <div className="pdp-price">
              <div className="pdp-price-value">{pkg.price}</div>
              <small>One-time upfront cost</small>
            </div>
          </div>
          <div className="pdp-hero-actions">
            <Link className="btn btn-primary" to={primaryActionLink}>
              {primaryActionLabel}
            </Link>
            <Link className="btn btn-secondary" to={quoteLink}>
              Build a Quote
            </Link>
            <Link className="btn btn-link" to="/packages?vertical=home-security">
              Compare packages
            </Link>
          </div>
          {atGlanceItems.length > 0 && (
            <div className="pdp-at-glance" aria-label="At a glance">
              {atGlanceItems.map((item) => (
                <span key={item} className="pdp-at-glance-chip">
                  {item}
                </span>
              ))}
            </div>
          )}
          <div className="pdp-jump-links" aria-label="Jump to">
            <span>Jump to:</span>
            <a href="#what-you-get" onClick={handleJump('what-you-get')}>
              What you get
            </a>
            <a href="#key-outcomes" onClick={handleJump('key-outcomes')}>
              Key outcomes
            </a>
            <a href="#how-it-works" onClick={handleJump('how-it-works')}>
              How it works
            </a>
            <a href="#trust-policies" onClick={handleJump('trust-policies')}>
              Trust &amp; policies
            </a>
          </div>
        </section>

        <div className="pdp-sticky-cta" aria-label="Quick actions">
          <div className="pdp-sticky-inner">
            <Link className="btn btn-primary" to={primaryActionLink}>
              {primaryActionLabel}
            </Link>
            <Link className="btn btn-secondary" to={quoteLink}>
              Build a Quote
            </Link>
          </div>
        </div>

        <section id="what-you-get" className="card pdp-what-you-get pdp-section motion-fade-up">
          <div className="pdp-section-header">
            <h2>What you get</h2>
            <p>Hardware included in this tier.</p>
          </div>
          {isGoldTier ? (
            <div className="pdp-what-grid pdp-what-grid--media motion-stagger">
              {goldCardImages.map((card) => (
                <ResponsivePublicImage
                  key={card.title}
                  srcBase={card.srcBase}
                  alt={card.alt}
                  className="premium-image premium-image--card hover-lift"
                />
              ))}
            </div>
          ) : (
            <div className="pdp-what-grid motion-stagger">
              {whatYouGetCards.map((card) => (
                <div key={card.title} className="pdp-what-card pdp-what-card--icon">
                  <span className="pdp-what-icon" aria-hidden="true">
                    {whatYouGetIcons[card.title] ?? '◍'}
                  </span>
                  <div>
                    <h3>{card.title}</h3>
                    <p className="pdp-what-summary">{card.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="pdp-microcopy">
            <p>Equivalent models may be substituted based on availability—same or better specs.</p>
            <p>Final sensor counts may adjust slightly based on layout and entry points.</p>
          </div>
        </section>

        <div className="pdp-inline-cta">
          <Link className="btn btn-primary" to={primaryActionLink}>
            {primaryActionLabel}
          </Link>
          <Link className="btn btn-secondary" to={quoteLink}>
            Build a Quote
          </Link>
        </div>

        <div className="pdp-two-column motion-stagger">
          <section id="key-outcomes" className="card pdp-section motion-fade-up">
            <h2>Key outcomes</h2>
            <ul className="list">
              {packageContent.keyOutcomes.map((item) => (
                <li key={item}>
                  <span />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {showTrustGrid && (
              <div className="pdp-trust-grid">
                <ResponsivePublicImage
                  srcBase="/images/home-security/hs_badges_trust-grid"
                  alt="Trust and guarantees grid"
                  className="premium-image premium-image--contain hover-lift"
                />
              </div>
            )}
          </section>
          <section className="card motion-fade-up">
            <h2>Ideal for</h2>
            <ul className="list">
              {packageContent.idealFor.map((item) => (
                <li key={item}>
                  <span />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <AccordionSection title="Capabilities & limitations" defaultOpen>
          <div className="pdp-accordion-grid motion-stagger">
            <div>
              <h3>Capabilities</h3>
              <ul className="list">
                {packageContent.capabilities.map((item) => (
                  <li key={item}>
                    <span />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Limitations</h3>
              <ul className="list">
                {packageContent.limitations.map((item) => (
                  <li key={item}>
                    <span />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </AccordionSection>

        <section id="how-it-works" className="card pdp-how pdp-section motion-fade-up">
          <h2>How it works</h2>
          <ol className="pdp-steps">
            {packageContent.howItWorks.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <div id="trust-policies" className="pdp-section motion-fade-up">
          <AccordionSection title="Trust & policies" defaultOpen={false}>
            <ul className="list">
              {trustPolicies.map((item) => (
                <li key={item}>
                  <span />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </AccordionSection>
        </div>

        <div className="pdp-bottom-cta motion-fade-up">
          <Link className="btn btn-primary" to={primaryActionLink}>
            {primaryActionLabel}
          </Link>
          <Link className="btn btn-secondary" to={quoteLink}>
            Build a Quote
          </Link>
          <Link className="btn btn-link" to="/packages?vertical=home-security">
            Compare packages
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container section">
      <Link to={`/packages${verticalQuery}`} className="btn btn-secondary" style={{ marginBottom: '1.5rem' }}>
        Back to packages
      </Link>
      <div className="card" aria-label={`${pkg.name} details`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <TierBadge
              tierId={(pkg.id.toUpperCase() as PackageTierId) ?? 'A1'}
              labelOverride={pkg.badge ?? undefined}
              vertical={vertical}
            />
            <h2 style={{ margin: 0 }}>{pkg.name}</h2>
            <p style={{ margin: 0, color: '#c8c0aa' }}>{pkg.tagline}</p>
            <p style={{ maxWidth: 720 }}>{pkg.oneLiner}</p>
            <p style={{ fontWeight: 700, color: '#fff7e6' }}>
              {vertical === 'home-security' ? 'Who it is for' : 'Ideal for'}: {pkg.idealFor}
            </p>
            {pkg.typicalCoverage && (
              <p style={{ fontWeight: 700, color: '#fff7e6' }}>
                Typical coverage: {pkg.typicalCoverage}
              </p>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--kaec-gold)' }}>{pkg.price}</div>
            <small style={{ color: 'var(--kaec-muted)' }}>One-time upfront cost</small>
          </div>
        </div>
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <h3 style={{ marginTop: 0, color: '#fff7e6' }}>Package bio</h3>
          <p style={{ margin: 0, color: '#c8c0aa' }}>{pkg.bio}</p>
        </div>
        <div className="card" style={{ marginTop: '1rem' }}>
          <h3 style={{ marginTop: 0, color: '#fff7e6' }}>
            {vertical === 'home-security' ? "What's included (plain-English)" : 'Included equipment + setup'}
          </h3>
          <ul className="list">
            {pkg.includes.map((item) => (
              <li key={item}>
                <span />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        {vertical !== 'home-security' && (
          <div className="card" style={{ marginTop: '1rem' }}>
            <h3 style={{ marginTop: 0, color: '#fff7e6' }}>Bill of materials (BOM)</h3>
            <ul className="list">
              {pkg.billOfMaterials.map((item) => (
                <li key={item}>
                  <span />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="card" style={{ marginTop: '1rem' }}>
          <h3 style={{ marginTop: 0, color: '#fff7e6' }}>Differentiators</h3>
          <ul className="list">
            {pkg.differentiators.map((item) => (
              <li key={item}>
                <span />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card" style={{ marginTop: '1rem' }}>
          <h3 style={{ marginTop: 0, color: '#fff7e6' }}>
            {vertical === 'home-security' ? 'What your system can and will do' : 'Automation flows'}
          </h3>
          <ul className="list">
            {pkg.automationFlows.map((item) => (
              <li key={item}>
                <span />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card" style={{ marginTop: '1rem' }}>
          <h3 style={{ marginTop: 0, color: '#fff7e6' }}>Intake → delivery journey</h3>
          <ul className="list">
            {pkg.journeyFlow.map((item) => (
              <li key={item}>
                <span />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card" style={{ marginTop: '1rem' }}>
          <h3 style={{ marginTop: 0, color: '#fff7e6' }}>Agreement + deposit checkpoints</h3>
          <ul className="list">
            {pkg.agreements.map((item) => (
              <li key={item}>
                <span />
                <span>{item}</span>
              </li>
            ))}
            <li>
              <span />
              <span>
                Deposit policy:{' '}
                {siteConfig.depositPolicy.type === 'flat'
                  ? `Flat $${siteConfig.depositPolicy.value}`
                  : `${siteConfig.depositPolicy.value * 100}% of the deterministic total`}
              </span>
            </li>
          </ul>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <Link className="btn btn-primary" to={contactLink}>
            Ask about this package
          </Link>
          <Link
            className="btn btn-secondary"
            to={vertical === 'home-security' ? '/reliability?vertical=home-security' : '/reliability'}
          >
            Learn about offline readiness
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;
