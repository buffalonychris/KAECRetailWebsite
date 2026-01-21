import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import PackageCard from '../components/PackageCard';
import ComparisonLadder from '../components/ComparisonLadder';
import HomeSecurityComparisonTable from '../components/HomeSecurityComparisonTable';
import OwnershipOfflineGuarantee from '../components/OwnershipOfflineGuarantee';
import { getPackages } from '../content/packages';
import { getAddOns } from '../data/pricing';
import { brandSite } from '../lib/brand';
import { loadRetailFlow, markFlowStep, updateRetailFlow } from '../lib/retailFlow';
import { resolveVertical } from '../lib/verticals';

const Packages = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [guidedMode, setGuidedMode] = useState<boolean>(() => loadRetailFlow().guidedMode ?? false);
  const vertical = resolveVertical(searchParams.get('vertical'));
  const packageList = getPackages(vertical);
  const addOns = getAddOns(vertical);

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
    <div className="container section">
      {guidedMode && (
        <div
          className="hero-card"
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
      <h1 style={{ marginTop: 0 }}>Packages</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p className="badge" style={{ marginBottom: '0.5rem' }}>
            One-time pricing only
          </p>
          <h2 style={{ margin: 0 }}>
            {vertical === 'home-security' ? 'Choose a Home Security package' : `Choose the ${brandSite} package that fits`}
          </h2>
          <p style={{ maxWidth: 640 }}>
            {vertical === 'home-security'
              ? 'Home Security packages are local-first and wireless-first with Home Assistant as the primary dashboard. We do not sell subscriptions; optional third-party monitoring is contracted directly by the homeowner.'
              : 'Every tier is delivered with Home Assistant as the single control surface. Pricing is upfront—no subscriptions required for included capabilities.'}
          </p>
        </div>
        <div style={{ display: 'grid', gap: '0.35rem', justifyItems: 'end' }}>
          <Link
            className="btn btn-primary"
            to={vertical === 'home-security' ? '/quote?vertical=home-security' : '/quote'}
          >
            Build my quote
          </Link>
          <small style={{ color: '#c8c0aa' }}>Pro install, offline-first setup, transparent pricing.</small>
        </div>
      </div>
      <OwnershipOfflineGuarantee
        intro="Every package honors the Offline Dignity Rule and keeps ownership with the household."
        className="section"
      />
      <div className="card-grid">
        {packageList.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} vertical={vertical} />
        ))}
      </div>

      {vertical === 'home-security' && (
        <div className="section">
          <div className="card" style={{ marginBottom: '1rem' }}>
            <h2 style={{ marginTop: 0 }}>Compare Home Security tiers</h2>
            <p style={{ margin: 0, color: 'var(--kaec-muted)' }}>
              Local-first coverage tiers with a single dashboard. Remote access requires internet; local control stays available on LAN.
            </p>
          </div>
          <HomeSecurityComparisonTable />
        </div>
      )}

      {vertical !== 'home-security' && <ComparisonLadder />}

      {vertical === 'home-security' && (
        <div className="section">
          <div className="card" style={{ display: 'grid', gap: '0.75rem' }}>
            <div className="badge">Optional Add-Ons (Quoted Separately)</div>
            <h2 style={{ margin: 0 }}>Optional add-ons</h2>
            <p style={{ margin: 0, color: 'var(--kaec-muted)' }}>
              Add-ons extend coverage and are quoted separately based on layout and wiring. Local control remains available without internet.
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
    </div>
  );
};

export default Packages;
