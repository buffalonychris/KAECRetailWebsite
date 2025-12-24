import contentModel from '../../content/Step022_RECHALO_ContentModel.json';

export type FeatureFlagKey =
  | 'RECHALO_ENABLE_ETHERNET_IP'
  | 'RECHALO_ENABLE_LTE'
  | 'RECHALO_ENABLE_SMS'
  | 'RECHALO_ENABLE_EMAIL'
  | 'RECHALO_ENABLE_PUSH'
  | 'RECHALO_ENABLE_TWO_WAY_VOICE_CLAIM'
  | 'RECHALO_ENABLE_PAYMENTS';

export type FeatureFlags = Record<FeatureFlagKey, boolean>;

export type FlaggedItem = {
  label: string;
  description: string;
  flag?: FeatureFlagKey;
};

export type ContentModel = {
  site: {
    brand: string;
    product: string;
    short_description: string;
    footer_notice: string;
  };
  feature_flags: FeatureFlags;
  pages: {
    home: {
      seo: { title: string; description: string };
      hero: { title: string; subtitle: string; primary_cta: string; secondary_cta: string };
      highlights: {
        title: string;
        items: { title: string; description: string }[];
      };
      capabilities: {
        title: string;
        intro: string;
        empty_state: string;
        items: FlaggedItem[];
      };
      faq: {
        title: string;
        items: { question: string; answer: string }[];
      };
    };
    halo: {
      seo: { title: string; description: string };
      hero: { title: string; subtitle: string; primary_cta: string };
      what_you_get: { title: string; items: { title: string; description: string }[] };
      capability_claims: { title: string; intro: string; empty_state: string; items: FlaggedItem[] };
      who_its_for: { title: string; items: { title: string; description: string }[] };
      pricing: { title: string; price: string; note: string };
    };
    checkout: {
      seo: { title: string; description: string };
      hero: { title: string; subtitle: string };
      form: {
        title: string;
        fields: {
          full_name: string;
          email: string;
          phone: string;
          address: string;
          city: string;
          state: string;
          postal: string;
        };
      };
      addons: {
        title: string;
        items: { label: string; description: string }[];
      };
      payment: {
        title: string;
        disabled_note: string;
        placeholder: string;
      };
    };
    setup: {
      seo: { title: string; description: string };
      hero: { title: string; subtitle: string };
      steps: { start_button: string; helper_mode: string; safety_note: string };
    };
    support: {
      seo: { title: string; description: string };
      hero: { title: string; subtitle: string };
      tiles: { title: string; description: string }[];
      troubleshooting: { title: string; note: string; topics: string[] };
    };
    privacy: {
      seo: { title: string; description: string };
      title: string;
      sections: { title: string; body: string }[];
    };
    terms: {
      seo: { title: string; description: string };
      title: string;
      sections: { title: string; body: string }[];
    };
  };
};

export const rechaloContent = contentModel as ContentModel;
