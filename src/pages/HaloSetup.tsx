import { Link } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import Seo from '../components/Seo';
import WizardShell from '../components/haloSetup/WizardShell';
import ContactsStep from '../components/haloSetup/steps/ContactsStep';
import NotificationsStep from '../components/haloSetup/steps/NotificationsStep';
import ReviewStep from '../components/haloSetup/steps/ReviewStep';
import TestVerifiedStep from '../components/haloSetup/steps/TestVerifiedStep';
import TestSummaryStep from '../components/haloSetup/steps/TestSummaryStep';
import { haloContent } from '../lib/haloContent';
import { getHaloFeatureFlags } from '../lib/haloFlags';
import { buildSetupSummary } from '../components/haloSetup/summary';
import { buildTestItems, TestLabels } from '../components/haloSetup/testItems';
import { AddOnOwnership, ConnectionStatus, Contact, SetupState, TestResults } from '../components/haloSetup/types';

const STORAGE_KEY = 'rechalo_setup_v1';

const createEmptyContact = (): Contact => ({
  id: crypto.randomUUID(),
  name: '',
  relationship: '',
  phone: '',
  email: '',
  notificationPreferences: {
    sms: false,
    email: false,
    push: false,
  },
});

const defaultTestResults: TestResults = {
  baseUnit: { checked: false },
  pendant: { checked: false },
  sms: { checked: false },
  email: { checked: false },
  push: { checked: false },
  wristWearable: { checked: false },
  wallButton: { checked: false },
  twoWayVoice: { checked: false },
};

const defaultState: SetupState = {
  connectionStatus: 'Connected and ready',
  contacts: [createEmptyContact()],
  addOns: {
    wristWearable: false,
    wallButton: false,
  },
  testResults: defaultTestResults,
};

const loadStoredState = (): SetupState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return defaultState;
  }
  try {
    const parsed = JSON.parse(stored) as SetupState;
    return {
      ...defaultState,
      ...parsed,
      contacts: parsed.contacts?.length ? parsed.contacts : defaultState.contacts,
      testResults: {
        ...defaultTestResults,
        ...parsed.testResults,
      },
    };
  } catch {
    return defaultState;
  }
};

const HaloSetup = () => {
  const { setup } = haloContent;
  const { enableSms, enableEmail, enablePush, enableTwoWayVoiceClaim } = getHaloFeatureFlags();
  const wizardContent = setup.wizard;
  const [currentStep, setCurrentStep] = useState(0);
  const [showValidation, setShowValidation] = useState(false);
  const [state, setState] = useState<SetupState>(() => defaultState);

  useEffect(() => {
    setState(loadStoredState());
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const enabledNotifications = useMemo(
    () => ({
      sms: enableSms,
      email: enableEmail,
      push: enablePush,
    }),
    [enableSms, enableEmail, enablePush]
  );

  const testLabels = {
    baseUnit: wizardContent.steps.test_verified.base_unit,
    pendant: wizardContent.steps.test_verified.pendant,
    sms: wizardContent.steps.test_verified.sms,
    email: wizardContent.steps.test_verified.email,
    push: wizardContent.steps.test_verified.push,
    wristWearable: wizardContent.steps.test_verified.wrist,
    wallButton: wizardContent.steps.test_verified.wall,
    twoWayVoice: wizardContent.steps.test_verified.voice,
  } as const satisfies TestLabels;

  const summary = useMemo(
    () => buildSetupSummary(state, enabledNotifications, testLabels, state.addOns, enableTwoWayVoiceClaim),
    [state, enabledNotifications, testLabels, enableTwoWayVoiceClaim]
  );

  const steps = [
    { id: 'contacts', label: wizardContent.steps.contacts.title },
    { id: 'notifications', label: wizardContent.steps.notifications.title },
    { id: 'review', label: wizardContent.steps.review.title },
    { id: 'test', label: wizardContent.steps.test_verified.title },
    { id: 'summary', label: wizardContent.steps.summary.title },
  ];

  const handleUpdateContact = (id: string, updates: Partial<Contact>) => {
    setState((prev) => ({
      ...prev,
      contacts: prev.contacts.map((contact) =>
        contact.id === id
          ? {
              ...contact,
              ...updates,
            }
          : contact
      ),
    }));
  };

  const handleAddContact = () => {
    setState((prev) => ({
      ...prev,
      contacts: [...prev.contacts, createEmptyContact()],
    }));
  };

  const handleRemoveContact = (id: string) => {
    setState((prev) => ({
      ...prev,
      contacts: prev.contacts.filter((contact) => contact.id !== id),
    }));
  };

  const handleConnectionChange = (value: ConnectionStatus) => {
    setState((prev) => ({
      ...prev,
      connectionStatus: value,
    }));
  };

  const handleAddOnChange = (updates: Partial<AddOnOwnership>) => {
    setState((prev) => ({
      ...prev,
      addOns: {
        ...prev.addOns,
        ...updates,
      },
    }));
  };

  const handleToggleTest = (key: keyof TestResults) => {
    setState((prev) => ({
      ...prev,
      testResults: {
        ...prev.testResults,
        [key]: {
          checked: !prev.testResults[key].checked,
          timestamp: !prev.testResults[key].checked ? new Date().toLocaleString() : undefined,
        },
      },
    }));
  };

  const isContactValid = (contact: Contact) =>
    Boolean(contact.name.trim()) && Boolean(contact.phone.trim() || contact.email.trim());

  const canContinue = useMemo(() => {
    if (currentStep === 0) {
      return state.contacts.length > 0 && state.contacts.every(isContactValid);
    }
    if (currentStep === 3) {
      const requiredTests = buildTestItems({
        labels: testLabels,
        enabledNotifications,
        addOns: state.addOns,
        enableTwoWayVoice: enableTwoWayVoiceClaim,
      })
        .filter((test) => test.visible)
        .map((test) => test.key);

      return requiredTests.every((key) => state.testResults[key].checked);
    }
    return true;
  }, [
    currentStep,
    state.contacts,
    state.testResults,
    state.addOns,
    enableSms,
    enableEmail,
    enablePush,
    enableTwoWayVoiceClaim,
  ]);

  const handleNext = () => {
    if (!canContinue) {
      setShowValidation(true);
      return;
    }
    setShowValidation(false);
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setShowValidation(false);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleCopySummary = () => {
    const summaryText = JSON.stringify(summary, null, 2);
    void navigator.clipboard.writeText(summaryText);
  };

  const handleDownloadSummary = () => {
    const summaryText = JSON.stringify(summary, null, 2);
    const blob = new Blob([summaryText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'halo-test-summary.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const stepView = () => {
    if (currentStep === 0) {
      return (
        <ContactsStep
          title={wizardContent.steps.contacts.title}
          intro={wizardContent.steps.contacts.intro}
          connectionLabel={wizardContent.steps.contacts.connection_label}
          connectionOptions={wizardContent.steps.contacts.connection_options as ConnectionStatus[]}
          addOnsTitle={wizardContent.steps.contacts.addons_title}
          wristLabel={wizardContent.steps.contacts.addons_wrist}
          wallLabel={wizardContent.steps.contacts.addons_wall}
          addContactLabel={wizardContent.steps.contacts.add_contact_label}
          contacts={state.contacts}
          connectionStatus={state.connectionStatus}
          addOns={state.addOns}
          onUpdateContact={handleUpdateContact}
          onAddContact={handleAddContact}
          onRemoveContact={handleRemoveContact}
          onConnectionChange={handleConnectionChange}
          onAddOnChange={handleAddOnChange}
          showValidation={showValidation}
        />
      );
    }
    if (currentStep === 1) {
      return (
        <NotificationsStep
          title={wizardContent.steps.notifications.title}
          intro={wizardContent.steps.notifications.intro}
          emptyState={wizardContent.steps.notifications.empty_state}
          contacts={state.contacts}
          enabledMethods={enabledNotifications}
          onUpdateContact={handleUpdateContact}
        />
      );
    }
    if (currentStep === 2) {
      return (
        <ReviewStep
          title={wizardContent.steps.review.title}
          intro={wizardContent.steps.review.intro}
          connectionTitle={wizardContent.steps.review.connection_title}
          contactsTitle={wizardContent.steps.review.contacts_title}
          notificationsTitle={wizardContent.steps.review.notifications_title}
          connectionStatus={state.connectionStatus}
          contacts={state.contacts}
          addOns={state.addOns}
          enabledMethods={enabledNotifications}
        />
      );
    }
    if (currentStep === 3) {
      return (
        <TestVerifiedStep
          title={wizardContent.steps.test_verified.title}
          intro={wizardContent.steps.test_verified.intro}
          safetyCopy={wizardContent.steps.test_verified.safety_copy}
          labels={testLabels}
          enabledNotifications={enabledNotifications}
          addOns={state.addOns}
          enableTwoWayVoice={enableTwoWayVoiceClaim}
          testResults={state.testResults}
          onToggle={handleToggleTest}
        />
      );
    }
    return (
      <TestSummaryStep
        title={wizardContent.steps.summary.title}
        intro={wizardContent.steps.summary.intro}
        copyLabel={wizardContent.steps.summary.copy_cta}
        downloadLabel={wizardContent.steps.summary.download_cta}
        summary={summary}
        onCopy={handleCopySummary}
        onDownload={handleDownloadSummary}
      />
    );
  };
  return (
    <div className="container section">
      <Seo title={setup.seo.title} description={setup.seo.description} />
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <section style={{ textAlign: 'center' }}>
          <p className="badge" style={{ marginBottom: '0.5rem' }}>
            {setup.badge}
          </p>
          <h2 style={{ margin: 0 }}>{setup.title}</h2>
          <p style={{ maxWidth: 760, margin: '0.75rem auto 0' }}>
            {setup.intro}
          </p>
        </section>

        <section className="card" id="start">
          <h3 style={{ marginTop: 0, color: '#fff7e6' }}>{setup.checklist.title}</h3>
          <ul className="list">
            {setup.checklist.items.map((item) => (
              <li key={item}>
                <span />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <WizardShell
          title={wizardContent.title}
          progressLabel={wizardContent.progress_label}
          steps={steps}
          currentIndex={currentStep}
          onBack={currentStep > 0 ? handleBack : undefined}
          onNext={currentStep < steps.length - 1 ? handleNext : undefined}
          nextLabel={currentStep === 2 ? wizardContent.steps.review.cta : undefined}
          canContinue={canContinue}
          hideNext={currentStep === steps.length - 1}
        >
          {stepView()}
        </WizardShell>

        <section className="card">
          <h3 style={{ marginTop: 0, color: '#fff7e6' }}>{setup.after_setup.title}</h3>
          <p>{setup.after_setup.body}</p>
          <Link className="btn btn-primary" to={setup.after_setup.cta.href}>
            {setup.after_setup.cta.label}
          </Link>
        </section>
      </div>
    </div>
  );
};

export default HaloSetup;
