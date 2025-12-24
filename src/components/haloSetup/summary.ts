import { SetupState } from './types';

type EnabledNotifications = {
  sms: boolean;
  email: boolean;
  push: boolean;
};

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
  testLabels: Record<string, string>
): SetupSummary => {
  const enabledMethods = Object.entries(enabledNotifications)
    .filter(([, enabled]) => enabled)
    .map(([key]) => key.toUpperCase());

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
    tests: Object.entries(state.testResults).map(([key, value]) => ({
      label: testLabels[key] ?? formatMethod(key),
      confirmed: value.checked,
      timestamp: value.timestamp,
    })),
  };
};
