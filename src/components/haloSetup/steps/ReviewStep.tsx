import { AddOnOwnership, Contact, ConnectionStatus } from '../types';

type NotificationMethod = 'sms' | 'email' | 'push';

type ReviewStepProps = {
  title: string;
  intro: string;
  connectionTitle: string;
  contactsTitle: string;
  notificationsTitle: string;
  connectionStatus: ConnectionStatus;
  contacts: Contact[];
  addOns: AddOnOwnership;
  enabledMethods: Record<NotificationMethod, boolean>;
};

const methodLabels: Record<NotificationMethod, string> = {
  sms: 'SMS',
  email: 'Email',
  push: 'App notification',
};

const ReviewStep = ({
  title,
  intro,
  connectionTitle,
  contactsTitle,
  notificationsTitle,
  connectionStatus,
  contacts,
  addOns,
  enabledMethods,
}: ReviewStepProps) => {
  const methods = (Object.keys(enabledMethods) as NotificationMethod[]).filter(
    (method) => enabledMethods[method]
  );

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <header>
        <h3 style={{ marginTop: 0 }}>{title}</h3>
        <p style={{ marginBottom: 0 }}>{intro}</p>
      </header>

      <section>
        <h4 style={{ marginBottom: '0.5rem' }}>{connectionTitle}</h4>
        <p style={{ marginTop: 0 }}>{connectionStatus}</p>
        <p style={{ marginTop: 0 }}>
          Add-ons: {addOns.wristWearable ? 'Wrist wearable' : 'No wrist wearable'} ·{' '}
          {addOns.wallButton ? 'Wall button' : 'No wall button'}
        </p>
      </section>

      <section>
        <h4 style={{ marginBottom: '0.5rem' }}>{contactsTitle}</h4>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {contacts.map((contact) => (
            <div key={contact.id} className="card" style={{ padding: '1.25rem' }}>
              <p style={{ marginTop: 0, fontWeight: 600 }}>{contact.name}</p>
              {contact.relationship && <p style={{ marginTop: 0 }}>{contact.relationship}</p>}
              <p style={{ marginTop: 0 }}>
                {contact.phone || 'No phone'} · {contact.email || 'No email'}
              </p>
              {methods.length > 0 && (
                <p style={{ marginTop: 0 }}>
                  {notificationsTitle}:{' '}
                  {methods
                    .filter((method) => contact.notificationPreferences[method])
                    .map((method) => methodLabels[method])
                    .join(', ') || 'None selected'}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ReviewStep;
