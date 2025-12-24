import { Contact, ConnectionStatus, AddOnOwnership } from '../types';

type ContactsStepProps = {
  title: string;
  intro: string;
  connectionLabel: string;
  connectionOptions: ConnectionStatus[];
  addOnsTitle: string;
  wristLabel: string;
  wallLabel: string;
  addContactLabel: string;
  contacts: Contact[];
  connectionStatus: ConnectionStatus;
  addOns: AddOnOwnership;
  onUpdateContact: (id: string, updates: Partial<Contact>) => void;
  onAddContact: () => void;
  onRemoveContact: (id: string) => void;
  onConnectionChange: (value: ConnectionStatus) => void;
  onAddOnChange: (updates: Partial<AddOnOwnership>) => void;
  showValidation: boolean;
};

const ContactsStep = ({
  title,
  intro,
  connectionLabel,
  connectionOptions,
  addOnsTitle,
  wristLabel,
  wallLabel,
  addContactLabel,
  contacts,
  connectionStatus,
  addOns,
  onUpdateContact,
  onAddContact,
  onRemoveContact,
  onConnectionChange,
  onAddOnChange,
  showValidation,
}: ContactsStepProps) => {
  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <header>
        <h3 style={{ marginTop: 0 }}>{title}</h3>
        <p style={{ marginBottom: 0 }}>{intro}</p>
      </header>

      <section style={{ display: 'grid', gap: '1rem' }}>
        <p style={{ fontWeight: 600, marginBottom: 0 }}>{connectionLabel}</p>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {connectionOptions.map((option) => (
            <label key={option} className="form-field" style={{ margin: 0 }}>
              <input
                type="radio"
                name="connection-status"
                checked={connectionStatus === option}
                onChange={() => onConnectionChange(option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </section>

      <section style={{ display: 'grid', gap: '1.5rem' }}>
        {contacts.map((contact, index) => {
          const hasMethod = Boolean(contact.phone || contact.email);
          return (
            <div key={contact.id} className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h4 style={{ margin: 0 }}>Contact {index + 1}</h4>
                {contacts.length > 1 && (
                  <button className="btn" type="button" onClick={() => onRemoveContact(contact.id)}>
                    Remove
                  </button>
                )}
              </div>
              <div className="form" style={{ marginTop: '1rem' }}>
                <div>
                  <label htmlFor={`contact-name-${contact.id}`}>Name</label>
                  <input
                    id={`contact-name-${contact.id}`}
                    type="text"
                    value={contact.name}
                    placeholder="Full name"
                    onChange={(event) => onUpdateContact(contact.id, { name: event.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor={`contact-relationship-${contact.id}`}>Relationship (optional)</label>
                  <input
                    id={`contact-relationship-${contact.id}`}
                    type="text"
                    value={contact.relationship}
                    placeholder="Daughter, neighbor, friend"
                    onChange={(event) => onUpdateContact(contact.id, { relationship: event.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor={`contact-phone-${contact.id}`}>Phone</label>
                  <input
                    id={`contact-phone-${contact.id}`}
                    type="tel"
                    value={contact.phone}
                    placeholder="(555) 555-5555"
                    onChange={(event) => onUpdateContact(contact.id, { phone: event.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor={`contact-email-${contact.id}`}>Email</label>
                  <input
                    id={`contact-email-${contact.id}`}
                    type="email"
                    value={contact.email}
                    placeholder="name@email.com"
                    onChange={(event) => onUpdateContact(contact.id, { email: event.target.value })}
                  />
                </div>
              </div>
              {showValidation && (!contact.name || !hasMethod) && (
                <p style={{ color: '#ffe3c2', marginBottom: 0 }}>
                  Add a name and at least one contact method (phone or email).
                </p>
              )}
            </div>
          );
        })}
        <button className="btn btn-primary" type="button" onClick={onAddContact}>
          {addContactLabel}
        </button>
      </section>

      <section style={{ display: 'grid', gap: '0.75rem' }}>
        <p style={{ fontWeight: 600, marginBottom: 0 }}>{addOnsTitle}</p>
        <label className="form-field" style={{ margin: 0 }}>
          <input
            type="checkbox"
            checked={addOns.wristWearable}
            onChange={(event) => onAddOnChange({ wristWearable: event.target.checked })}
          />
          <span>{wristLabel}</span>
        </label>
        <label className="form-field" style={{ margin: 0 }}>
          <input
            type="checkbox"
            checked={addOns.wallButton}
            onChange={(event) => onAddOnChange({ wallButton: event.target.checked })}
          />
          <span>{wallLabel}</span>
        </label>
      </section>
    </div>
  );
};

export default ContactsStep;
