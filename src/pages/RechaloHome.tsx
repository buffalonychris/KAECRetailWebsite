import { NavLink } from 'react-router-dom';
import Hero from '../components/rechalo/Hero';
import Section from '../components/rechalo/Section';
import CardGrid from '../components/rechalo/CardGrid';
import FAQ from '../components/rechalo/FAQ';
import Seo from '../components/Seo';
import { rechaloContent } from '../lib/content';
import { rechaloFlags } from '../lib/flags';

const RechaloHome = () => {
  const { home } = rechaloContent.pages;
  const { brand } = rechaloContent.site;
  const enabledCapabilities = home.capabilities.items.filter(
    (item) => !item.flag || rechaloFlags[item.flag],
  );

  return (
    <>
      <Seo title={home.seo.title} description={home.seo.description} />
      <Hero
        eyebrow={brand}
        title={home.hero.title}
        subtitle={home.hero.subtitle}
        actions={
          <div className="rechalo-button-row">
            <NavLink className="rechalo-button" to="/halo">
              {home.hero.primary_cta}
            </NavLink>
            <NavLink className="rechalo-button secondary" to="/setup">
              {home.hero.secondary_cta}
            </NavLink>
          </div>
        }
      />
      <Section title={home.highlights.title}>
        <CardGrid items={home.highlights.items} />
      </Section>
      <Section title={home.capabilities.title} subtitle={home.capabilities.intro}>
        {enabledCapabilities.length > 0 ? (
          <CardGrid items={enabledCapabilities} />
        ) : (
          <p className="rechalo-muted">{home.capabilities.empty_state}</p>
        )}
      </Section>
      <Section title={home.faq.title}>
        <FAQ items={home.faq.items} />
      </Section>
    </>
  );
};

export default RechaloHome;
