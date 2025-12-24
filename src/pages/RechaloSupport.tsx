import Seo from '../components/Seo';
import Hero from '../components/rechalo/Hero';
import Section from '../components/rechalo/Section';
import SupportTiles from '../components/rechalo/SupportTiles';
import { rechaloContent } from '../lib/content';

const RechaloSupport = () => {
  const { support } = rechaloContent.pages;
  const { brand } = rechaloContent.site;

  return (
    <>
      <Seo title={support.seo.title} description={support.seo.description} />
      <Hero eyebrow={brand} title={support.hero.title} subtitle={support.hero.subtitle} />
      <Section title={support.hero.title}>
        <SupportTiles items={support.tiles} />
      </Section>
      <Section title={support.troubleshooting.title}>
        <div className="rechalo-troubleshooting">
          <p className="rechalo-muted">{support.troubleshooting.note}</p>
          <ul>
            {support.troubleshooting.topics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
};

export default RechaloSupport;
