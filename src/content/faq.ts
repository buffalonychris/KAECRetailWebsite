export type FAQ = {
  question: string;
  answer: string;
};

export const faqs: FAQ[] = [
  {
    question: 'Do you sell subscriptions or monitoring plans?',
    answer:
      'No. Packages are one-time purchases. Optional third-party services can be added directly by the customer.',
  },
  {
    question: 'What happens if the internet goes out?',
    answer:
      'Offline Dignity Rule: lighting, scenes, and climate automations continue locally as long as equipment has power. Remote access may pause, but on-site control remains.',
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
    question: 'Can I edit my automations later?',
    answer:
      'Yes. You own the system outright and can modify automations directly inside Home Assistant or ask us to tune them.',
  },
  {
    question: 'Can I add on to a package later?',
    answer:
      'Yes. You can extend lighting, cameras, sensors, and automations over time while keeping Home Assistant as the hub.',
  },
  {
    question: 'How do you keep the system privacy-first?',
    answer:
      'Core functions stay local. Automation logic runs on-site, and cloud services are optional rather than required.',
  },
  {
    question: 'Do you support wireless-first devices?',
    answer:
      'Yes. Our automation tiers prioritize wireless-first switches, sensors, and controllers that stay local and integrate with Home Assistant.',
  },
  {
    question: 'How do you secure remote access?',
    answer:
      'We enable secure remote access options that keep Home Assistant as the control plane. Details depend on property networking and caregiver needs.',
  },
];
