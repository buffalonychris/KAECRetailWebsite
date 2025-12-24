export type NotificationPreferences = {
  sms: boolean;
  email: boolean;
  push: boolean;
};

export type Contact = {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  notificationPreferences: NotificationPreferences;
};

export type ConnectionStatus = 'Connected and ready' | 'Needs help' | 'Not sure yet';

export type AddOnOwnership = {
  wristWearable: boolean;
  wallButton: boolean;
};

export type TestResult = {
  checked: boolean;
  timestamp?: string;
};

export type TestResults = {
  baseUnit: TestResult;
  pendant: TestResult;
  sms: TestResult;
  email: TestResult;
  push: TestResult;
  wristWearable: TestResult;
  wallButton: TestResult;
  twoWayVoice: TestResult;
};

export type SetupState = {
  connectionStatus: ConnectionStatus;
  contacts: Contact[];
  addOns: AddOnOwnership;
  testResults: TestResults;
};
