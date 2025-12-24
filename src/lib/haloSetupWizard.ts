export type ContactEntry = {
  id: string;
  name: string;
  phone: string;
  email: string;
};

export type NotificationPreferences = {
  sms: boolean;
  email: boolean;
  push: boolean;
};

export type AddOnSelections = {
  wristWearable: boolean;
  wallButton: boolean;
};

export type TestStatus = 'unchecked' | 'pass' | 'fail';

export type TestResult = {
  status: TestStatus;
  timestamp?: string;
};

export type TestResults = {
  baseUnitHelp: TestResult;
  pendantHelp: TestResult;
  smsDelivery: TestResult;
  emailDelivery: TestResult;
  pushDelivery: TestResult;
  wristTrigger: TestResult;
  wallButton: TestResult;
  twoWayVoice: TestResult;
};
