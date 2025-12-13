export type FAQ = {
  question: string;
  answer: string;
};

export const faqs: FAQ[] = [
  {
    question: 'Do I need any monthly subscription to use these packages?',
    answer:
      'No. All packages are sold as one-time purchases. Core features, local recording, and automations run without required subscriptions.',
  },
  {
    question: 'What happens if the internet goes out?',
    answer:
      'Home Assistant keeps lights, locks, and automations running locally as long as the equipment has power. Remote access may pause, but on-site control and alerts designed for local delivery continue.',
  },
  {
    question: 'Which app do I use?',
    answer:
      'Home Assistant is the single control platform. We configure your dashboard so caregivers, family, and residents see one clear set of controls.',
  },
  {
    question: 'Can I add on to a package later?',
    answer:
      'Yes. We can extend lighting, cameras, sensors, and automations over time while keeping Home Assistant as the hub.',
  },
  {
    question: 'Do you support Reolink cameras?',
    answer:
      'Yes. Reolink is supported in the packages that include NVRs and PoE cameras, with local recording prioritized.',
  },
  {
    question: 'How do you secure remote access?',
    answer:
      'We enable secure remote access options that keep Home Assistant as the control plane. Details depend on property networking and caregiver needs.',
  },
];
