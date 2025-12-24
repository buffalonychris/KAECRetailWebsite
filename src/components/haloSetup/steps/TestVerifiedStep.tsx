import { AddOnOwnership, TestResults } from '../types';
import { buildTestItems, EnabledNotifications, TestLabels } from '../testItems';

type TestVerifiedStepProps = {
  title: string;
  intro: string;
  safetyCopy: string;
  labels: TestLabels;
  enabledNotifications: EnabledNotifications;
  addOns: AddOnOwnership;
  enableTwoWayVoice: boolean;
  testResults: TestResults;
  onToggle: (key: keyof TestResults) => void;
};

const TestVerifiedStep = ({
  title,
  intro,
  safetyCopy,
  labels,
  enabledNotifications,
  addOns,
  enableTwoWayVoice,
  testResults,
  onToggle,
}: TestVerifiedStepProps) => {
  const items = buildTestItems({
    labels,
    enabledNotifications,
    addOns,
    enableTwoWayVoice,
  });

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <header>
        <h3 style={{ marginTop: 0 }}>{title}</h3>
        <p style={{ marginBottom: 0 }}>{intro}</p>
      </header>

      <p className="badge" style={{ margin: 0 }}>
        {safetyCopy}
      </p>

      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {items
          .filter((item) => item.visible)
          .map((item) => (
            <label key={item.key} className="form-field" style={{ margin: 0, alignItems: 'flex-start' }}>
              <input type="checkbox" checked={testResults[item.key].checked} onChange={() => onToggle(item.key)} />
              <span>
                {item.label}
                {testResults[item.key].timestamp && (
                  <span style={{ display: 'block', color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem' }}>
                    Confirmed at {testResults[item.key].timestamp}
                  </span>
                )}
              </span>
            </label>
          ))}
      </div>
    </div>
  );
};

export default TestVerifiedStep;
