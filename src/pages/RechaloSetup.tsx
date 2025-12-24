import Seo from '../components/Seo';
import Hero from '../components/rechalo/Hero';
import Section from '../components/rechalo/Section';
import { rechaloContent } from '../lib/content';

const RechaloSetup = () => {
  const { setup } = rechaloContent.pages;
  const { brand } = rechaloContent.site;

  return (
    <>
      <Seo title={setup.seo.title} description={setup.seo.description} />
      <Hero eyebrow={brand} title={setup.hero.title} subtitle={setup.hero.subtitle} />
      <Section title={setup.hero.title}>
        <div className="rechalo-setup">
          <button className="rechalo-button">{setup.steps.start_button}</button>
          <div className="rechalo-setup-notes">
            <p>{setup.steps.helper_mode}</p>
            <p className="rechalo-muted">{setup.steps.safety_note}</p>
          </div>
        </div>
      </Section>
    </>
  );
};

export default RechaloSetup;
