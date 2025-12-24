import Seo from '../components/Seo';
import Section from '../components/rechalo/Section';
import { rechaloContent } from '../lib/content';

const RechaloPrivacy = () => {
  const { privacy } = rechaloContent.pages;

  return (
    <>
      <Seo title={privacy.seo.title} description={privacy.seo.description} />
      <Section title={privacy.title}>
        <div className="rechalo-legal">
          {privacy.sections.map((section) => (
            <div key={section.title}>
              <h3>{section.title}</h3>
              <p>{section.body}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
};

export default RechaloPrivacy;
