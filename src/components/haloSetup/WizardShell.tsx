import { ReactNode } from 'react';

type WizardStep = {
  id: string;
  label: string;
};

type WizardShellProps = {
  title: string;
  progressLabel: string;
  steps: WizardStep[];
  currentIndex: number;
  children: ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  backLabel?: string;
  canContinue?: boolean;
  hideNext?: boolean;
};

const WizardShell = ({
  title,
  progressLabel,
  steps,
  currentIndex,
  children,
  onBack,
  onNext,
  nextLabel = 'Continue',
  backLabel = 'Back',
  canContinue = true,
  hideNext = false,
}: WizardShellProps) => {
  const currentStepNumber = currentIndex + 1;
  return (
    <section className="card" style={{ display: 'grid', gap: '1.5rem' }}>
      <header style={{ display: 'grid', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <p className="badge" style={{ margin: 0 }}>
            {progressLabel} {currentStepNumber} / {steps.length}
          </p>
          <p style={{ margin: 0, color: '#fff7e6' }}>{title}</p>
        </div>
        <nav aria-label={progressLabel}>
          <ol
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'grid',
              gap: '0.5rem',
            }}
          >
            {steps.map((step, index) => (
              <li
                key={step.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                  color: index === currentIndex ? '#fff7e6' : 'rgba(255, 255, 255, 0.72)',
                  fontWeight: index === currentIndex ? 600 : 400,
                }}
              >
                <span>
                  Step {index + 1}: {step.label}
                </span>
                {index < currentIndex && <span aria-hidden="true">✓</span>}
              </li>
            ))}
          </ol>
        </nav>
      </header>

      <div>{children}</div>

      <footer style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <button className="btn" type="button" onClick={onBack} disabled={!onBack}>
          {backLabel}
        </button>
        {!hideNext && (
          <button className="btn btn-primary" type="button" onClick={onNext} disabled={!canContinue}>
            {nextLabel}
          </button>
        )}
      </footer>
    </section>
  );
};

export default WizardShell;
