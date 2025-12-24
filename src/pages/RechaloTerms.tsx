import Seo from '../components/Seo';
import Section from '../components/rechalo/Section';
import { rechaloContent } from '../lib/content';

const RechaloTerms = () => {
  const { terms } = rechaloContent.pages;

  return (
    <>
      <Seo title={terms.seo.title} description={terms.seo.description} />
      <Section title={terms.title}>
        <div className="rechalo-legal">
          {terms.sections.map((section) => (
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

export default RechaloTerms;
