import React from 'react';

type HeroProps = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
};

const Hero = ({ eyebrow, title, subtitle, actions }: HeroProps) => {
  return (
    <section className="rechalo-hero">
      <div className="container rechalo-hero-inner">
        <div>
          {eyebrow && <p className="rechalo-eyebrow">{eyebrow}</p>}
          <h1>{title}</h1>
          <p className="rechalo-hero-subtitle">{subtitle}</p>
          {actions && <div className="rechalo-hero-actions">{actions}</div>}
        </div>
      </div>
    </section>
  );
};

export default Hero;
