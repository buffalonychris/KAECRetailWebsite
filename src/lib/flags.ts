import { FeatureFlagKey, FeatureFlags, rechaloContent } from './content';

const truthyValues = new Set(['1', 'true', 'yes', 'on']);

const readEnvFlag = (key: FeatureFlagKey): boolean | undefined => {
  const env = import.meta.env as Record<string, string | boolean | undefined>;
  const raw = env[key] ?? env[`VITE_${key}`];
  if (raw === undefined) return undefined;
  if (typeof raw === 'boolean') return raw;
  return truthyValues.has(String(raw).toLowerCase());
};

export const resolveFlags = (): FeatureFlags => {
  const modelFlags = rechaloContent.feature_flags;
  return (Object.keys(modelFlags) as FeatureFlagKey[]).reduce<FeatureFlags>((acc, key) => {
    const envValue = readEnvFlag(key);
    acc[key] = envValue ?? modelFlags[key] ?? false;
    return acc;
  }, { ...modelFlags });
};

export const rechaloFlags = resolveFlags();
