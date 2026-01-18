import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

type QuizState = {
  trade: string;
  calendar: string;
  crm: string;
  missedCalls: string;
  estimatesPerMonth: string;
  averageJobValue: string;
};

const missedCallFactor: Record<string, number> = {
  '0-5': 0.05,
  '6-15': 0.1,
  '16-30': 0.2,
  '31+': 0.3,
};

const Demo = () => {
  const [quiz, setQuiz] = useState<QuizState>({
    trade: '',
    calendar: '',
    crm: '',
    missedCalls: '',
    estimatesPerMonth: '',
    averageJobValue: '',
  });
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const estimateMetrics = useMemo(() => {
    const estimates = Number(quiz.estimatesPerMonth || 0);
    const avgValue = Number(quiz.averageJobValue || 0);
    const factor = missedCallFactor[quiz.missedCalls] ?? 0.1;
    const roi = estimates * avgValue * factor;
    const roiRange = roi > 0 ? `$${Math.round(roi * 0.8).toLocaleString()} - $${Math.round(roi * 1.2).toLocaleString()}` : 'Complete the quiz to see an estimate.';
    const level = roi >= 5000 ? 'high' : 'low';
    return {
      roiRange,
      level,
      bookedToday: estimates > 0 ? Math.max(1, Math.round(estimates / 30)) : 0,
      bookedYesterday: estimates > 0 ? Math.max(1, Math.round(estimates / 28)) : 0,
      afterHoursCaptured: estimates > 0 ? Math.max(1, Math.round(estimates * factor)) : 0,
      escalations: estimates > 0 ? Math.max(1, Math.round(estimates * 0.05)) : 0,
    };
  }, [quiz]);

  const handleChange = (field: keyof QuizState) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setQuiz((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleMailingListSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="container section" style={{ display: 'grid', gap: '2rem' }}>
      <section style={{ display: 'grid', gap: '0.75rem' }}>
        <div className="badge">Interactive Demo</div>
        <h1 style={{ margin: 0, color: '#fff7e6' }}>QuickFit Quiz (30–60 seconds)</h1>
        <p style={{ margin: 0, color: '#c8c0aa' }}>
          Tell us a little about your estimate flow and see a personalized preview of the assistant in action.
        </p>
      </section>

      <section className="card" style={{ display: 'grid', gap: '1rem' }}>
        <div className="form">
          <label>
            Trade
            <select value={quiz.trade} onChange={handleChange('trade')}>
              <option value="">Select your trade</option>
              <option value="plumbing">Plumbing</option>
              <option value="hvac">HVAC</option>
              <option value="electrical">Electrical</option>
              <option value="remodeling">Remodeling</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label>
            Calendar type
            <select value={quiz.calendar} onChange={handleChange('calendar')}>
              <option value="">Select a calendar</option>
              <option value="google">Google Calendar</option>
              <option value="apple">Apple Calendar</option>
              <option value="outlook">Outlook / Office 365</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label>
            CRM (optional)
            <select value={quiz.crm} onChange={handleChange('crm')}>
              <option value="">None / Not sure</option>
              <option value="jobber">Jobber</option>
              <option value="servicetitan">ServiceTitan</option>
              <option value="salesforce">Salesforce</option>
              <option value="hubspot">HubSpot</option>
            </select>
          </label>
          <label>
            Missed call frequency
            <select value={quiz.missedCalls} onChange={handleChange('missedCalls')}>
              <option value="">Select range</option>
              <option value="0-5">0-5 per week</option>
              <option value="6-15">6-15 per week</option>
              <option value="16-30">16-30 per week</option>
              <option value="31+">31+ per week</option>
            </select>
          </label>
          <label>
            Estimates per month
            <input
              type="number"
              min="0"
              value={quiz.estimatesPerMonth}
              onChange={handleChange('estimatesPerMonth')}
              placeholder="e.g. 40"
            />
          </label>
          <label>
            Average job value
            <input
              type="number"
              min="0"
              value={quiz.averageJobValue}
              onChange={handleChange('averageJobValue')}
              placeholder="e.g. 2500"
            />
          </label>
        </div>
      </section>

      <section className="card" style={{ display: 'grid', gap: '1rem' }}>
        <h2 style={{ marginTop: 0 }}>Personalized Owner Dashboard Preview</h2>
        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          <div className="card" style={{ padding: '1rem' }}>
            <strong>Estimates booked (today)</strong>
            <div style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>{estimateMetrics.bookedToday}</div>
          </div>
          <div className="card" style={{ padding: '1rem' }}>
            <strong>Estimates booked (yesterday)</strong>
            <div style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>{estimateMetrics.bookedYesterday}</div>
          </div>
          <div className="card" style={{ padding: '1rem' }}>
            <strong>After-hours calls captured</strong>
            <div style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>{estimateMetrics.afterHoursCaptured}</div>
          </div>
          <div className="card" style={{ padding: '1rem' }}>
            <strong>Escalations</strong>
            <div style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>{estimateMetrics.escalations}</div>
          </div>
          <div className="card" style={{ padding: '1rem' }}>
            <strong>Estimated ROI range</strong>
            <div style={{ fontSize: '1.1rem', marginTop: '0.5rem' }}>{estimateMetrics.roiRange}</div>
          </div>
        </div>
      </section>

      <section className="card" style={{ display: 'grid', gap: '0.75rem' }}>
        <h2 style={{ marginTop: 0 }}>Next steps</h2>
        {estimateMetrics.level === 'high' ? (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <p style={{ margin: 0, color: '#c8c0aa' }}>
              Your inputs indicate a strong fit. Book a demo or start a pilot to see the assistant live.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              <Link className="btn btn-primary" to="/5-day-demo">
                Book Demo / Start Pilot
              </Link>
              <Link className="btn btn-secondary" to="/pricing">
                View Pricing
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <p style={{ margin: 0, color: '#c8c0aa' }}>
              Your inputs suggest a lighter ROI right now. Review pricing or stay in the loop as you grow.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              <Link className="btn btn-primary" to="/pricing">
                See Pricing
              </Link>
              <a className="btn btn-secondary" href="#mailing-list">
                Join Mailing List
              </a>
            </div>
          </div>
        )}
      </section>

      <section id="mailing-list" className="card" style={{ display: 'grid', gap: '0.75rem' }}>
        <h2 style={{ marginTop: 0 }}>Join the mailing list</h2>
        <p style={{ margin: 0, color: '#c8c0aa' }}>
          Get product updates, demo availability, and launch notes. No spam, and you can opt out anytime.
        </p>
        <form onSubmit={handleMailingListSubmit} className="form" style={{ maxWidth: '420px' }}>
          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setSubmitted(false);
              }}
              placeholder="you@company.com"
              required
            />
          </label>
          <small style={{ color: '#c8c0aa' }}>
            By submitting, you agree to receive emails about the estimate scheduling assistant. We do not auto-
            enroll you in paid plans.
          </small>
          <button className="btn btn-primary" type="submit">
            Join Mailing List
          </button>
          {submitted && <small style={{ color: '#7dd3fc' }}>Thanks — you are on the list.</small>}
        </form>
      </section>
    </div>
  );
};

export default Demo;
