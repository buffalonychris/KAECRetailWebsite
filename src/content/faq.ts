export type FAQ = {
  question: string;
  answer: string;
};

export const faqs: FAQ[] = [
  {
    question: 'Do you sell subscriptions or monitoring plans?',
    answer:
      'No. Packages are one-time purchases. Optional third-party monitoring can be integrated directly by the customer.',
  },
  {
    question: 'What happens if the internet goes out?',
    answer:
      'Home Assistant keeps arming, sensors, lights, and siren control running locally as long as equipment has power. Remote access may pause, but on-site controls and local alerts remain.',
  },
  {
    question: 'Which app do I use?',
    answer:
      'Home Assistant is the single control platform. We configure one dashboard for the household and the roles you authorize.',
  },
  {
    question: 'Who owns the equipment and data?',
    answer:
      'You do. The hardware, automations, and local data belong to the customer, and access is controlled by the homeowner.',
  },
  {
    question: 'Can I add on to a package later?',
    answer:
      'Yes. You can extend lighting, cameras, sensors, and automations over time while keeping Home Assistant as the hub.',
  },
  {
    question: 'How do you keep the system privacy-first?',
    answer:
      'Core functions stay local. Video and sensor data can be stored on-site, and cloud services are optional rather than required.',
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
