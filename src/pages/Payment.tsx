import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { siteConfig } from '../config/site';
import { QuoteContext } from '../lib/agreement';
import { loadRetailFlow, PaymentStatus, updateRetailFlow, AcceptanceRecord, markFlowStep } from '../lib/retailFlow';
import FlowGuidePanel from '../components/FlowGuidePanel';

const calculateDepositDue = (total: number) => {
  const { depositPolicy } = siteConfig;
  if (depositPolicy.type === 'flat') {
    return Math.min(total, depositPolicy.value);
  }
  return Math.min(total, Math.round(total * depositPolicy.value * 100) / 100);
};

const formatCurrency = (amount: number) => `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [quoteContext, setQuoteContext] = useState<QuoteContext | null>(null);
  const [depositStatus, setDepositStatus] = useState<PaymentStatus>('pending');
  const [acceptanceRecord, setAcceptanceRecord] = useState<AcceptanceRecord | null>(null);
  const [accessGranted, setAccessGranted] = useState(false);

  useEffect(() => {
    markFlowStep('payment');
  }, []);

  useEffect(() => {
    try {
      const flow = loadRetailFlow();
      const parsed = flow.agreementAcceptance;
      if (!parsed?.accepted) {
        navigate('/agreementReview', {
          state: {
            message: 'Please accept the combined agreement before payment.',
            quoteContext: (location.state as { quoteContext?: QuoteContext } | undefined)?.quoteContext,
          },
        });
        return;
      }
      setAcceptanceRecord(parsed);
      setAccessGranted(true);
    } catch (error) {
      console.error('Error loading acceptance state', error);
      navigate('/agreementReview', { state: { message: 'Please accept the combined agreement before payment.' } });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (!accessGranted) return;
    const flow = loadRetailFlow();
    if (flow.quote) {
      setQuoteContext(flow.quote);
    }

    if (flow.payment?.depositStatus) {
      setDepositStatus(flow.payment.depositStatus);
    }
  }, [accessGranted]);

  const total = quoteContext?.pricing.total ?? 0;
  const depositDue = useMemo(() => calculateDepositDue(total), [total]);
  const balanceDue = useMemo(() => Math.max(total - depositDue, 0), [depositDue, total]);

  const handleSimulate = (status: PaymentStatus) => {
    setDepositStatus(status);
    updateRetailFlow({ payment: { depositStatus: status } });
  };

  const handlePrint = () => {
    window.print();
  };

  const printStyles = `
    @media print {
      :root { background: #fff !important; color: #000 !important; }
      body { background: #fff !important; color: #000 !important; }
      .card, .hero-card { background: #fff !important; color: #000 !important; border-color: #000 !important; box-shadow: none !important; }
      .badge { background: #fff !important; color: #000 !important; border: 1px solid #000 !important; }
      .btn { color: #000 !important; border: 1px solid #000 !important; background: #fff !important; box-shadow: none !important; }
    }
  `;

  if (!accessGranted) {
    return null;
  }

  return (
    <div className="container" style={{ padding: '3rem 0', display: 'grid', gap: '2rem' }}>
      <style>{printStyles}</style>
      <div className="hero-card" style={{ display: 'grid', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <div className="badge">Retail payment gate</div>
            <h1 style={{ margin: 0, color: '#fff7e6' }}>Reserve with a deterministic deposit</h1>
            <p style={{ margin: 0, color: '#c8c0aa' }}>
              No monthly subscriptions required. This UI does not process payments; it shows how the deposit and balance would be captured after agreement.
            </p>
            <small style={{ color: '#c8c0aa' }}>
              Card data is never stored by KickAss; secure provider fields will be used once enabled.
            </small>
          </div>
          <button type="button" className="btn btn-primary" onClick={handlePrint}>
            Print / Save PDF
          </button>
        </div>
        <div style={{ display: 'grid', gap: '0.35rem' }}>
          <strong>Quote reference</strong>
          {quoteContext ? (
            <p style={{ margin: 0, color: '#c8c0aa' }}>
              Package {quoteContext.packageId} — Total {formatCurrency(total)} (add-ons: {quoteContext.selectedAddOns.length || 'none'})
            </p>
          ) : (
            <p style={{ margin: 0, color: '#c8c0aa' }}>
              Quote context not found. Return to the quote or agreement review to regenerate.
            </p>
          )}
          {acceptanceRecord?.fullName && (
            <small style={{ color: '#c8c0aa' }}>
              Accepted by {acceptanceRecord.fullName} on {acceptanceRecord.acceptanceDate ?? 'date not provided'}
            </small>
          )}
        </div>
      </div>

      <FlowGuidePanel
        currentStep="payment"
        nextDescription="Scheduling is next. Once the deposit is recorded, move forward to propose installation windows."
        ctaLabel="Continue to Scheduling"
        onCta={() => navigate('/schedule')}
      />

      <div className="card" style={{ display: 'grid', gap: '1rem' }}>
        <div style={{ display: 'grid', gap: '0.35rem' }}>
          <div className="badge">Payment breakdown</div>
          <h2 style={{ margin: '0.25rem 0' }}>Deposit and balance</h2>
          <p style={{ margin: 0, color: '#c8c0aa' }}>
            Deterministic calculation only—no live charging. Deposit policy: {siteConfig.depositPolicy.type === 'flat' ? `Flat ${formatCurrency(siteConfig.depositPolicy.value)}` : `${siteConfig.depositPolicy.value * 100}% of total`}.
          </p>
        </div>
        <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          <div className="card" style={{ border: '1px solid rgba(245,192,66,0.35)' }}>
            <strong>Total</strong>
            <p style={{ margin: '0.35rem 0', fontSize: '1.35rem' }}>{formatCurrency(total)}</p>
            <small style={{ color: '#c8c0aa' }}>One-time total based on deterministic quote.</small>
          </div>
          <div className="card" style={{ border: '1px solid rgba(245,192,66,0.35)' }}>
            <strong>Deposit due</strong>
            <p style={{ margin: '0.35rem 0', fontSize: '1.35rem' }}>{formatCurrency(depositDue)}</p>
            <small style={{ color: '#c8c0aa' }}>Status: {depositStatus}</small>
          </div>
          <div className="card" style={{ border: '1px solid rgba(245,192,66,0.35)' }}>
            <strong>Balance due</strong>
            <p style={{ margin: '0.35rem 0', fontSize: '1.35rem' }}>{formatCurrency(balanceDue)}</p>
            <small style={{ color: '#c8c0aa' }}>Status options: pending | completed | failed | refunded</small>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <a className="btn btn-secondary" href="/payment-processing">
            Proceed to secure payment (placeholder)
          </a>
          {siteConfig.enableMockPayments && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <strong style={{ color: '#c8c0aa' }}>Simulate payment success/failure:</strong>
              <button type="button" className="btn btn-primary" onClick={() => handleSimulate('completed')}>
                Simulate success
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => handleSimulate('failed')}>
                Simulate failure
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => handleSimulate('refunded')}>
                Mark refunded
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => handleSimulate('pending')}>
                Reset to pending
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ display: 'grid', gap: '0.75rem' }}>
        <div className="badge">Next steps</div>
        <p style={{ margin: 0, color: '#c8c0aa' }}>
          Deposit completion unlocks scheduling. No payment is collected in this mock flow, and no card details are handled here.
        </p>
        {depositStatus === 'completed' ? (
          <button type="button" className="btn btn-primary" onClick={() => navigate('/schedule')}>
            Proceed to Scheduling
          </button>
        ) : (
          <small style={{ color: '#c8c0aa' }}>
            Complete the deposit (simulated) to enable scheduling. Payment status is currently {depositStatus}.
          </small>
        )}
        <small style={{ color: '#c8c0aa' }}>
          We will show secure provider fields once the live processor is connected; this page keeps things retail-only and offline-friendly.
        </small>
      </div>
    </div>
  );
};

export default Payment;
