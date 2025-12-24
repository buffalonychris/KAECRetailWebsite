import { Contact } from '../types';

type NotificationMethod = 'sms' | 'email' | 'push';

type NotificationsStepProps = {
  title: string;
  intro: string;
  emptyState: string;
  contacts: Contact[];
  enabledMethods: Record<NotificationMethod, boolean>;
  onUpdateContact: (id: string, updates: Partial<Contact>) => void;
};

const methodLabels: Record<NotificationMethod, string> = {
  sms: 'SMS',
  email: 'Email',
  push: 'App notification',
};

const NotificationsStep = ({
  title,
  intro,
  emptyState,
  contacts,
  enabledMethods,
  onUpdateContact,
}: NotificationsStepProps) => {
  const methods = (Object.keys(enabledMethods) as NotificationMethod[]).filter(
    (method) => enabledMethods[method]
  );

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <header>
        <h3 style={{ marginTop: 0 }}>{title}</h3>
        <p style={{ marginBottom: 0 }}>{intro}</p>
      </header>

      {methods.length === 0 ? (
        <p>{emptyState}</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {contacts.map((contact) => (
            <div key={contact.id} className="card" style={{ padding: '1.25rem' }}>
              <h4 style={{ marginTop: 0 }}>{contact.name || 'Contact'}</h4>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {methods.map((method) => (
                  <label key={method} className="form-field" style={{ margin: 0 }}>
                    <input
                      type="checkbox"
                      checked={contact.notificationPreferences[method]}
                      onChange={(event) =>
                        onUpdateContact(contact.id, {
                          notificationPreferences: {
                            ...contact.notificationPreferences,
                            [method]: event.target.checked,
                          },
                        })
                      }
                    />
                    <span>{methodLabels[method]}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsStep;
