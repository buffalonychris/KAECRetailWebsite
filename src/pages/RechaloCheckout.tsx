import Seo from '../components/Seo';
import Hero from '../components/rechalo/Hero';
import Section from '../components/rechalo/Section';
import { rechaloContent } from '../lib/content';
import { rechaloFlags } from '../lib/flags';

const RechaloCheckout = () => {
  const { checkout } = rechaloContent.pages;
  const { brand } = rechaloContent.site;
  const paymentsEnabled = rechaloFlags.RECHALO_ENABLE_PAYMENTS;

  return (
    <>
      <Seo title={checkout.seo.title} description={checkout.seo.description} />
      <Hero eyebrow={brand} title={checkout.hero.title} subtitle={checkout.hero.subtitle} />
      <Section title={checkout.form.title}>
        <form className="rechalo-form" aria-label={checkout.form.title}>
          <label>
            {checkout.form.fields.full_name}
            <input type="text" name="fullName" autoComplete="name" />
          </label>
          <label>
            {checkout.form.fields.email}
            <input type="email" name="email" autoComplete="email" />
          </label>
          <label>
            {checkout.form.fields.phone}
            <input type="tel" name="phone" autoComplete="tel" />
          </label>
          <label>
            {checkout.form.fields.address}
            <input type="text" name="address" autoComplete="street-address" />
          </label>
          <div className="rechalo-form-row">
            <label>
              {checkout.form.fields.city}
              <input type="text" name="city" autoComplete="address-level2" />
            </label>
            <label>
              {checkout.form.fields.state}
              <input type="text" name="state" autoComplete="address-level1" />
            </label>
            <label>
              {checkout.form.fields.postal}
              <input type="text" name="postal" autoComplete="postal-code" />
            </label>
          </div>
        </form>
      </Section>
      <Section title={checkout.addons.title}>
        <div className="rechalo-card-grid">
          {checkout.addons.items.map((item) => (
            <label key={item.label} className="rechalo-addon">
              <input type="checkbox" name={item.label} />
              <div>
                <strong>{item.label}</strong>
                <p>{item.description}</p>
              </div>
            </label>
          ))}
        </div>
      </Section>
      <Section title={checkout.payment.title}>
        <div className={`rechalo-payment ${paymentsEnabled ? 'enabled' : 'disabled'}`}>
          {paymentsEnabled ? (
            <p>{checkout.payment.placeholder}</p>
          ) : (
            <p>{checkout.payment.disabled_note}</p>
          )}
        </div>
      </Section>
    </>
  );
};

export default RechaloCheckout;
