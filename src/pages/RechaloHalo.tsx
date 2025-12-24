import { NavLink } from 'react-router-dom';
import Hero from '../components/rechalo/Hero';
import Section from '../components/rechalo/Section';
import CardGrid from '../components/rechalo/CardGrid';
import Seo from '../components/Seo';
import { rechaloContent } from '../lib/content';
import { rechaloFlags } from '../lib/flags';

const RechaloHalo = () => {
  const { halo } = rechaloContent.pages;
  const { brand } = rechaloContent.site;
  const enabledCapabilities = halo.capability_claims.items.filter(
    (item) => !item.flag || rechaloFlags[item.flag],
  );

  return (
    <>
      <Seo title={halo.seo.title} description={halo.seo.description} />
      <Hero
        eyebrow={brand}
        title={halo.hero.title}
        subtitle={halo.hero.subtitle}
        actions={
          <NavLink className="rechalo-button" to="/checkout">
            {halo.hero.primary_cta}
          </NavLink>
        }
      />
      <Section title={halo.what_you_get.title}>
        <CardGrid items={halo.what_you_get.items} />
      </Section>
      <Section title={halo.capability_claims.title} subtitle={halo.capability_claims.intro}>
        {enabledCapabilities.length > 0 ? (
          <CardGrid items={enabledCapabilities} />
        ) : (
          <p className="rechalo-muted">{halo.capability_claims.empty_state}</p>
        )}
      </Section>
      <Section title={halo.who_its_for.title}>
        <CardGrid items={halo.who_its_for.items} />
      </Section>
      <Section title={halo.pricing.title}>
        <div className="rechalo-pricing">
          <div>
            <h3>{halo.pricing.price}</h3>
            <p>{halo.pricing.note}</p>
          </div>
          <NavLink className="rechalo-button" to="/checkout">
            {halo.hero.primary_cta}
          </NavLink>
        </div>
      </Section>
    </>
  );
};

export default RechaloHalo;
