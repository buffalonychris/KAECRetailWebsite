import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import PackageCard from '../components/PackageCard';
import ComparisonLadder from '../components/ComparisonLadder';
import OwnershipOfflineGuarantee from '../components/OwnershipOfflineGuarantee';
import { packages } from '../content/packages';
import { brandSite } from '../lib/brand';
import { loadRetailFlow, markFlowStep, updateRetailFlow } from '../lib/retailFlow';

const Packages = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [guidedMode, setGuidedMode] = useState<boolean>(() => loadRetailFlow().guidedMode ?? false);

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
          <h2 style={{ margin: 0 }}>Choose the {brandSite} package that fits</h2>
          <p style={{ maxWidth: 640 }}>
            Every tier is delivered with Home Assistant as the single control surface. Pricing is
            upfront—no subscriptions required for included capabilities.
          </p>
        </div>
        <div style={{ display: 'grid', gap: '0.35rem', justifyItems: 'end' }}>
          <Link className="btn btn-primary" to="/quote">
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
        {packages.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>

      <ComparisonLadder />
    </div>
  );
};

export default Packages;
