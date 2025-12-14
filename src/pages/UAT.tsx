import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FLOW_STORAGE_KEY, loadRetailFlow, RetailFlowState } from '../lib/retailFlow';

const UAT = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<RetailFlowState>({});

  useEffect(() => {
    setState(loadRetailFlow());
  }, []);

  const stateJson = useMemo(() => JSON.stringify(state, null, 2), [state]);

  const resetFlow = () => {
    localStorage.removeItem(FLOW_STORAGE_KEY);
    window.location.reload();
  };

  const openPath = (path: string) => {
    window.open(path, '_blank', 'noopener');
  };

  const copyJson = async () => {
    await navigator.clipboard.writeText(stateJson);
  };

  const gateBadges = [
    { label: 'Quote present', active: Boolean(state.quote) },
    { label: 'Agreement accepted', active: Boolean(state.agreementAcceptance?.accepted) },
    { label: 'Deposit completed', active: state.payment?.depositStatus === 'completed' },
    { label: 'Schedule submitted', active: Boolean(state.scheduleRequest) },
  ];

  const printShortcuts = [
    { label: 'Go to Quote to print', path: '/quote' },
    { label: 'Go to Agreement to print', path: '/agreement' },
    { label: 'Go to Payment to print', path: '/payment' },
    { label: 'Go to Schedule to print', path: '/schedule' },
  ];

  return (
    <div className="container" style={{ padding: '3rem 0', display: 'grid', gap: '1.5rem' }}>
      <div className="hero-card" style={{ display: 'grid', gap: '0.75rem' }}>
        <div className="badge">Internal UAT harness</div>
        <h1 style={{ margin: 0, color: '#fff7e6' }}>Retail flow test console</h1>
        <p style={{ margin: 0, color: '#e6ddc7' }}>
          Quickly jump between retail flow steps, reset local data, and inspect the local storage
          payload without hitting backend services.
        </p>
      </div>

      <div className="card" style={{ display: 'grid', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-primary" onClick={resetFlow}>
            Reset Retail Flow
          </button>
          <button type="button" className="btn" onClick={() => openPath('/quote')}>
            Open Quote
          </button>
          <button type="button" className="btn" onClick={() => openPath('/agreement')}>
            Open Agreement
          </button>
          <button type="button" className="btn" onClick={() => openPath('/payment')}>
            Open Payment
          </button>
          <button type="button" className="btn" onClick={() => openPath('/schedule')}>
            Open Schedule
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {gateBadges.map((gate) => (
            <div
              key={gate.label}
              className="badge"
              style={{
                background: gate.active ? 'var(--kaec-green)' : 'var(--kaec-charcoal)',
                color: gate.active ? '#0c0b0b' : '#e6ddc7',
                border: gate.active ? '1px solid transparent' : '1px solid var(--kaec-sand)',
              }}
            >
              {gate.label}
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ display: 'grid', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div className="badge">State viewer</div>
            <small style={{ color: '#c8c0aa' }}>LocalStorage key: {FLOW_STORAGE_KEY}</small>
          </div>
          <button type="button" className="btn" onClick={copyJson}>
            Copy JSON
          </button>
        </div>
        <pre
          style={{
            background: '#0f0f0f',
            color: '#e6ddc7',
            padding: '1rem',
            borderRadius: '10px',
            border: '1px solid var(--kaec-ink)',
            margin: 0,
            overflowX: 'auto',
            minHeight: '180px',
          }}
        >
          {stateJson}
        </pre>
      </div>

      <div className="card" style={{ display: 'grid', gap: '0.75rem' }}>
        <div className="badge">Print shortcuts</div>
        <small style={{ color: '#c8c0aa' }}>
          Navigate to the desired step and use your browser&rsquo;s print or save-as-PDF to capture the
          current screen.
        </small>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {printShortcuts.map((shortcut) => (
            <button
              key={shortcut.path}
              type="button"
              className="btn"
              onClick={() => navigate(shortcut.path)}
            >
              {shortcut.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UAT;
