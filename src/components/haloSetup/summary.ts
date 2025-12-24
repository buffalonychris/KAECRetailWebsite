import { AddOnOwnership, SetupState } from './types';
import { buildTestItems, EnabledNotifications, TestLabels } from './testItems';

export type SetupSummary = {
  generatedAt: string;
  connectionStatus: string;
  contactCount: number;
  enabledNotificationMethods: string[];
  contacts: Array<{
    name: string;
    relationship: string;
    phone: string;
    email: string;
    notificationPreferences: string[];
  }>;
  tests: Array<{
    label: string;
    confirmed: boolean;
    timestamp?: string;
  }>;
};

const formatMethod = (method: string) => method.replace(/([a-z])([A-Z])/g, '$1 $2');

export const buildSetupSummary = (
  state: SetupState,
  enabledNotifications: EnabledNotifications,
  testLabels: TestLabels,
  addOns: AddOnOwnership,
  enableTwoWayVoice: boolean
): SetupSummary => {
  const enabledMethods = Object.entries(enabledNotifications)
    .filter(([, enabled]) => enabled)
    .map(([key]) => key.toUpperCase());

  const visibleTests = buildTestItems({
    labels: testLabels,
    enabledNotifications,
    addOns,
    enableTwoWayVoice,
  }).filter((test) => test.visible);

  return {
    generatedAt: new Date().toLocaleString(),
    connectionStatus: state.connectionStatus,
    contactCount: state.contacts.length,
    enabledNotificationMethods: enabledMethods,
    contacts: state.contacts.map((contact) => ({
      name: contact.name,
      relationship: contact.relationship,
      phone: contact.phone,
      email: contact.email,
      notificationPreferences: Object.entries(contact.notificationPreferences)
        .filter(([key, enabled]) => enabledNotifications[key as keyof EnabledNotifications] && enabled)
        .map(([key]) => key.toUpperCase()),
    })),
    tests: visibleTests.map((test) => ({
      label: test.label ?? formatMethod(test.key),
      confirmed: state.testResults[test.key].checked,
      timestamp: state.testResults[test.key].timestamp,
    })),
  };
};
