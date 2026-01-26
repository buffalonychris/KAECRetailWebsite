import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AccordionSection from '../components/AccordionSection';
import HomeSecurityComparisonTable from '../components/HomeSecurityComparisonTable';
import PackageCard from '../components/PackageCard';
import ResponsivePublicImage from '../components/ResponsivePublicImage';
import { useLayoutConfig } from '../components/LayoutConfig';
import { getPackages } from '../content/packages';
import { verticalContent } from '../content/systemRestoration';
import { HomeSecurityPathChoice } from '../lib/homeSecurityFunnel';
import { loadRetailFlow, updateRetailFlow } from '../lib/retailFlow';

const monitoringCopy = (
  <>
    <strong>Professional monitoring is optional</strong> and, if selected, is provided directly through{' '}
    <strong>third-party</strong> monitoring services chosen by the customer.
  </>
);

const HomeSecurity = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const content = verticalContent.homeSecurity;
  const packages = useMemo(() => getPackages('home-security'), []);
  const [selectedPath, setSelectedPath] = useState<HomeSecurityPathChoice | null>(() => {
    return loadRetailFlow().homeSecurity?.selectedPath ?? null;
  });

  useLayoutConfig({
    layoutVariant: 'funnel',
    showBreadcrumbs: true,
    breadcrumb: [{ label: 'Home Security', href: '/home-security' }],
  });

  useEffect(() => {
    const pathParam = searchParams.get('path');
    if (pathParam === 'online' || pathParam === 'onsite') {
      setSelectedPath(pathParam);
      updateRetailFlow({ homeSecurity: { selectedPath: pathParam } });
    }
  }, [searchParams]);

  const handlePathSelect = (path: HomeSecurityPathChoice) => {
    setSelectedPath(path);
    updateRetailFlow({ homeSecurity: { selectedPath: path } });
    const params = new URLSearchParams(searchParams);
    params.set('path', path);
    setSearchParams(params, { replace: true });
  };

  const pathParam = selectedPath ? `&path=${selectedPath}` : '';
  const pathQuery = selectedPath ? `?path=${selectedPath}` : '';
  const quickLinks = [
    { id: 'packages', label: 'Packages' },
    { id: 'compare-coverage', label: 'Compare coverage' },
    { id: 'fit-check', label: 'Fit check' },
    { id: 'quote-payment-scheduling', label: 'What happens next' },
  ];

  return (
    <div className="container section home-security-page">
      <div className="card flow-guide" style={{ display: 'grid', gap: '0.75rem' }}>
        <div style={{ display: 'grid', gap: '0.35rem' }}>
          <div className="badge">Jump to</div>
          <strong style={{ color: '#fff7e6' }}>Explore the sections below.</strong>
        </div>
        <div className="flow-guide-steps" role="list">
          {quickLinks.map((link) => (
            <a key={link.id} href={`#${link.id}`} className="flow-guide-step" role="listitem">
              <span>{link.label}</span>
            </a>
          ))}
        </div>
      </div>

      <section className="vertical-hero vertical-hero--media vertical-hero--campaign">
        <div className="vertical-hero-media" aria-hidden="true">
          <picture>
            <source type="image/webp" srcSet="/images/home-security/hs_hero_home-security.webp" />
            <img
              src="/images/home-security/hs_hero_home-security.png"
              alt="Local-first home security dashboard with calm lighting"
              loading="eager"
            />
          </picture>
          <div className="vertical-hero-overlay vertical-hero-overlay--muted" />
        </div>
        <div className="vertical-hero-content">
          <div className="space-section-header">
            <div className="badge">Local-first</div>
            <h1>Home security that works even when the internet doesn’t</h1>
            <p>
              A wireless home security system you control from one simple dashboard. No required subscriptions. No “cloud-only” lock-in.
              Your sensors and alarms still work inside your home even if the internet goes out. Remote access is optional when internet is available.
            </p>
            <div className="space-section-actions">
              <Link className="btn btn-primary" to={`/packages?vertical=home-security${pathParam}`}>
                View Packages
              </Link>
              <Link className="btn btn-secondary" to={`/home-security${pathQuery}#how-it-works`}>
                See How It Works
              </Link>
            </div>
          </div>
          <div className="vertical-hero-badges" aria-label="Key promises">
            <span>Offline-first</span>
            <span>No subscriptions sold by us</span>
            <span>Local control</span>
          </div>
        </div>
      </section>

      <div className="section-divider" aria-hidden="true" />

      <section id="orientation" className="space-grid two-column">
        <div className="card">
          <div className="badge">Orientation</div>
          <h2 style={{ marginTop: 0 }}>What this is (and isn’t)</h2>
          <p style={{ color: 'var(--kaec-muted)' }}>
            <strong>Professionally installed</strong> home security with a local-first Home Assistant dashboard that stays reliable
            even when internet access drops.
          </p>
          <p style={{ color: 'var(--kaec-muted)' }}>{monitoringCopy}</p>
          <ul className="list">
            <li>
              <span />
              <span>You own the equipment, automations, and local data.</span>
            </li>
            <li>
              <span />
              <span>
                <strong>No subscriptions are sold by us.</strong>
              </span>
            </li>
            <li>
              <span />
              <span>Packages are expandable later as your needs change.</span>
            </li>
          </ul>
        </div>
        <div className="card">
          <div className="badge">Trust signals</div>
          <h3 style={{ marginTop: 0 }}>Local-first guarantees</h3>
          <ul className="operator-list">
            <li>Offline Dignity Rule: core functions run on your LAN.</li>
            <li>Optional monitoring contracts are between you and the provider.</li>
            <li>Support stays human and hands-on before and after install.</li>
          </ul>
        </div>
      </section>

      <div className="section-divider" aria-hidden="true" />

      <section id="packages" style={{ display: 'grid', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <div className="badge">Packages</div>
          <h2 style={{ margin: 0 }}>Choose a Home Security package</h2>
          <p style={{ margin: 0, color: 'var(--kaec-muted)' }}>
            Bronze, Silver (recommended), and Gold tiers are professionally installed and keep Home Assistant as your single dashboard.
          </p>
        </div>
        <p style={{ margin: 0, color: 'var(--kaec-muted)' }}>Choose a starting point. You can adjust later.</p>
        <div className="card-grid motion-stagger">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} vertical="home-security" />
          ))}
        </div>
        <p style={{ marginTop: 0, color: 'var(--kaec-muted)' }}>
          All packages are expandable later. You can add cameras, sensors, or coverage areas as your needs change.
        </p>
        <div id="compare-coverage">
          <AccordionSection title="Compare coverage" description="See typical coverage by tier after reviewing the package options.">
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
      </section>

      <div className="section-divider" aria-hidden="true" />

      <section id="how-you-can-proceed" className="space-grid two-column">
        <div className="card" style={{ display: 'grid', gap: '0.75rem' }}>
          <div className="badge">Option A</div>
          <small style={{ color: 'var(--kaec-muted)' }}>Most people start here</small>
          <h3 style={{ marginTop: 0 }}>Online-first (fastest)</h3>
          <p style={{ margin: 0, color: 'var(--kaec-muted)' }}>
            Start online, confirm a package, and generate a deterministic quote before scheduling.
          </p>
          <button type="button" className="btn btn-primary" onClick={() => handlePathSelect('online')}>
            Continue online-first
          </button>
        </div>
        <div className="card" style={{ display: 'grid', gap: '0.75rem' }}>
          <div className="badge">Option B</div>
          <h3 style={{ marginTop: 0 }}>On-site confirmation first</h3>
          <p style={{ margin: 0, color: 'var(--kaec-muted)' }}>
            Prefer a walkthrough before finalizing? Start with a confirmation visit and finalize the package after.
          </p>
          <Link
            className="btn btn-secondary"
            to={`/contact?vertical=home-security&intent=onsite-confirmation${pathParam}`}
            onClick={() => handlePathSelect('onsite')}
          >
            Request on-site confirmation
          </Link>
        </div>
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <h4 style={{ marginTop: 0 }}>Guidance</h4>
          <ul className="list">
            <li>
              <span />
              <span>Gold coverage typically benefits from on-site confirmation.</span>
            </li>
            <li>
              <span />
              <span>On-site confirmation is never required.</span>
            </li>
            <li>
              <span />
              <span>
                <strong>You may switch between paths at any time before installation.</strong>
              </span>
            </li>
          </ul>
        </div>
      </section>

      <div className="section-divider" aria-hidden="true" />

      <section id="how-it-works" className="space-grid two-column">
        <div className="card">
          <div className="badge">How it works</div>
          <h2 style={{ marginTop: 0 }}>A calm, professional install flow</h2>
          <p style={{ color: 'var(--kaec-muted)' }}>
            The goal is predictable coverage and a handoff you can control without subscription lock-in.
          </p>
        </div>
        <div className="card">
          <ol className="operator-list">
            {content.journeySteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </section>

      <div className="section-divider" aria-hidden="true" />

      <section id="fit-check" className="space-grid two-column">
        <div className="card">
          <div className="badge">Fit Check</div>
          <h2 style={{ marginTop: 0 }}>Confirm fit in minutes</h2>
          <p style={{ color: 'var(--kaec-muted)' }}>
            Answer a few questions about home size, entry points, outdoor coverage, and camera comfort to receive a recommendation.
          </p>
          <Link className="btn btn-primary" to={`/discovery?vertical=home-security${pathParam}`}>
            Start Fit Check
          </Link>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>What you’ll receive</h3>
          <ul className="operator-list">
            <li>Recommended tier with assumed coverage.</li>
            <li>Notes on how to adjust coverage later.</li>
            <li>Guidance for HOA or interior-only configurations.</li>
          </ul>
        </div>
      </section>

      <div className="section-divider" aria-hidden="true" />

      <section id="quote-payment-scheduling" className="space-grid two-column">
        <div className="card">
          <div className="badge">Quote → Deposit → Scheduling</div>
          <h2 style={{ marginTop: 0 }}>Lock in your quote, then pick a date</h2>
          <p style={{ color: 'var(--kaec-muted)' }}>
            The quote confirms your tier, the deposit reserves pricing and equipment availability, and scheduling only happens after you choose a date.
          </p>
          <Link className="btn btn-primary" to={`/quote?vertical=home-security${pathParam}`}>
            Generate Quote
          </Link>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>What happens next</h3>
          <ul className="list">
            <li>
              <span />
              <span>Deposit reserves system pricing and equipment availability for 30 days.</span>
            </li>
            <li>
              <span />
              <span>Installation is not scheduled until you select a date.</span>
            </li>
            <li>
              <span />
              <span>Final placement is confirmed before installation begins.</span>
            </li>
            <li>
              <span />
              <span>Remaining balance is due on the day of installation.</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default HomeSecurity;
