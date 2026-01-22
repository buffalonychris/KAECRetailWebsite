import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { getPackages } from '../content/packages';
import TierBadge from '../components/TierBadge';
import { PackageTierId } from '../data/pricing';
import { siteConfig } from '../config/site';
import { resolveVertical } from '../lib/verticals';
import AccordionSection from '../components/AccordionSection';
import { HOME_SECURITY_PDP_CONTENT } from '../content/homeSecurityPdp';
import { useLayoutConfig } from '../components/LayoutConfig';

const PackageDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const vertical = resolveVertical(searchParams.get('vertical'));
  const packageList = getPackages(vertical);
  const pkg = packageList.find((item) => item.id === id);
  const verticalQuery = vertical === 'home-security' ? '?vertical=home-security' : '';
  const isHomeSecurityPdp = vertical === 'home-security' && (id === 'a1' || id === 'a2' || id === 'a3');
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const packageContent = useMemo(
    () => (isHomeSecurityPdp && pkg ? HOME_SECURITY_PDP_CONTENT[pkg.id as 'a1' | 'a2' | 'a3'] : null),
    [isHomeSecurityPdp, pkg]
  );
  const quoteLink = pkg ? `/quote?vertical=home-security&package=${pkg.id}` : '/quote?vertical=home-security';
  const contactLink = vertical === 'home-security' ? '/contact?vertical=home-security' : '/contact';
  const tierLabel = pkg?.name ?? 'Package';

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
    if (!isHomeSecurityPdp) return;
    const heroElement = heroRef.current;
    if (!heroElement) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyCta(!entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: '-80px 0px 0px 0px' }
    );
    observer.observe(heroElement);
    return () => observer.disconnect();
  }, [isHomeSecurityPdp]);

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
        <Link to={`/packages${verticalQuery}`} className="btn btn-secondary pdp-back">
          Back to packages
        </Link>
        <section ref={heroRef} className="hero-card pdp-hero">
          <div className="pdp-hero-header">
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <TierBadge
                tierId={(pkg.id.toUpperCase() as PackageTierId) ?? 'A1'}
                labelOverride={pkg.badge ?? undefined}
                vertical={vertical}
              />
              <h1 className="pdp-title">{pkg.name}</h1>
              <p className="pdp-tagline">{packageContent.heroOneLiner}</p>
            </div>
            <div className="pdp-price">
              <div className="pdp-price-value">{pkg.price}</div>
              <small>One-time upfront cost</small>
            </div>
          </div>
          <div className="pdp-hero-actions">
            <Link className="btn btn-primary" to={contactLink}>
              Request install
            </Link>
            <Link className="btn btn-secondary" to={quoteLink}>
              Build a Quote
            </Link>
            <Link className="btn btn-link" to="/packages?vertical=home-security">
              Compare packages
            </Link>
          </div>
        </section>

        <section className="card pdp-what-you-get">
          <div className="pdp-section-header">
            <h2>What you get</h2>
            <p>Hardware included in this tier.</p>
          </div>
          <div className="pdp-what-grid">
            {packageContent.whatYouGet.map((group) => (
              <div key={group.title} className="pdp-what-card">
                <h3>{group.title}</h3>
                <ul className="list">
                  {group.items.map((item) => (
                    <li key={item}>
                      <span />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pdp-microcopy">
            <p>Equivalent models may be substituted based on availability—same or better specs.</p>
            <p>Final sensor counts may adjust slightly based on layout and entry points.</p>
          </div>
        </section>

        <div className="pdp-two-column">
          <section className="card">
            <h2>Key outcomes</h2>
            <ul className="list">
              {packageContent.keyOutcomes.map((item) => (
                <li key={item}>
                  <span />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="card">
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
          <div className="pdp-accordion-grid">
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

        <section className="card pdp-how">
          <h2>How it works</h2>
          <ol className="pdp-steps">
            {packageContent.howItWorks.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

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

        <div className="pdp-bottom-cta">
          <Link className="btn btn-primary" to={contactLink}>
            Request install
          </Link>
          <Link className="btn btn-secondary" to={quoteLink}>
            Build a Quote
          </Link>
          <Link className="btn btn-link" to="/packages?vertical=home-security">
            Compare packages
          </Link>
        </div>

        <div className={`pdp-sticky-cta ${showStickyCta ? 'is-visible' : ''}`} aria-hidden={!showStickyCta}>
          <div className="pdp-sticky-inner">
            <Link className="btn btn-primary" to={contactLink}>
              Request install
            </Link>
            <Link className="btn btn-secondary" to={quoteLink}>
              Build a Quote
            </Link>
            <Link className="btn btn-link" to="/packages?vertical=home-security">
              Compare packages
            </Link>
          </div>
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
