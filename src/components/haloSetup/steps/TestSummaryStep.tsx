import { SetupSummary } from '../summary';

type TestSummaryStepProps = {
  title: string;
  intro: string;
  copyLabel: string;
  downloadLabel: string;
  summary: SetupSummary;
  onCopy: () => void;
  onDownload: () => void;
};

const TestSummaryStep = ({
  title,
  intro,
  copyLabel,
  downloadLabel,
  summary,
  onCopy,
  onDownload,
}: TestSummaryStepProps) => {
  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <header>
        <h3 style={{ marginTop: 0 }}>{title}</h3>
        <p style={{ marginBottom: 0 }}>{intro}</p>
      </header>

      <section className="card" style={{ padding: '1.25rem' }}>
        <h4 style={{ marginTop: 0 }}>Test Summary</h4>
        <p style={{ marginTop: 0 }}>Date/time: {summary.generatedAt}</p>
        <p style={{ marginTop: 0 }}>Connection: {summary.connectionStatus}</p>
        <p style={{ marginTop: 0 }}>Contacts: {summary.contactCount}</p>
        <p style={{ marginTop: 0 }}>
          Enabled notifications:{' '}
          {summary.enabledNotificationMethods.length > 0 ? summary.enabledNotificationMethods.join(', ') : 'None'}
        </p>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {summary.tests.map((test) => (
            <div key={test.label}>
              <p style={{ margin: 0, fontWeight: 600 }}>{test.label}</p>
              <p style={{ marginTop: '0.25rem', marginBottom: 0 }}>
                {test.confirmed ? 'Confirmed' : 'Not confirmed'}
                {test.timestamp && ` · ${test.timestamp}`}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button className="btn" type="button" onClick={onCopy}>
          {copyLabel}
        </button>
        <button className="btn btn-primary" type="button" onClick={onDownload}>
          {downloadLabel}
        </button>
      </div>
    </div>
  );
};

export default TestSummaryStep;
