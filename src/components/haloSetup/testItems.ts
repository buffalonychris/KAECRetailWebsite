import { AddOnOwnership, TestResults } from './types';

export type EnabledNotifications = {
  sms: boolean;
  email: boolean;
  push: boolean;
};

export type TestLabels = Record<keyof TestResults, string>;

export type TestItem = {
  key: keyof TestResults;
  label: string;
  visible: boolean;
};

type BuildTestItemsOptions = {
  labels: TestLabels;
  enabledNotifications: EnabledNotifications;
  addOns: AddOnOwnership;
  enableTwoWayVoice: boolean;
};

export const buildTestItems = ({
  labels,
  enabledNotifications,
  addOns,
  enableTwoWayVoice,
}: BuildTestItemsOptions): TestItem[] =>
  [
    { key: 'baseUnit', label: labels.baseUnit, visible: true },
    { key: 'pendant', label: labels.pendant, visible: true },
    { key: 'sms', label: labels.sms, visible: enabledNotifications.sms },
    { key: 'email', label: labels.email, visible: enabledNotifications.email },
    { key: 'push', label: labels.push, visible: enabledNotifications.push },
    { key: 'wristWearable', label: labels.wristWearable, visible: addOns.wristWearable },
    { key: 'wallButton', label: labels.wallButton, visible: addOns.wallButton },
    { key: 'twoWayVoice', label: labels.twoWayVoice, visible: enableTwoWayVoice },
  ] as const satisfies readonly TestItem[];
