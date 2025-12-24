import React from 'react';

type SectionProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

const Section = ({ title, subtitle, children }: SectionProps) => {
  return (
    <section className="rechalo-section">
      <div className="container rechalo-section-inner">
        <div className="rechalo-section-header">
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  );
};

export default Section;
