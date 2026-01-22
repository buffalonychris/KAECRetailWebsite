import type { ReactNode } from 'react';

export type CampaignHeroMedia = {
  alt: string;
  src: string;
  srcSet?: string;
  sizes?: string;
  sources?: Array<{
    type: string;
    srcSet: string;
  }>;
  eager?: boolean;
};

type CampaignHeroProps = {
  kicker?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  background?: CampaignHeroMedia;
  microBadges?: string[];
  actions?: ReactNode;
  trustItems?: string[];
  sideContent?: ReactNode;
  className?: string;
  children?: ReactNode;
};

const CampaignHero = ({
  kicker,
  title,
  subtitle,
  background,
  microBadges,
  actions,
  trustItems,
  sideContent,
  className,
  children,
}: CampaignHeroProps) => {
  return (
    <section className={['campaign-hero', className].filter(Boolean).join(' ')}>
      {background ? (
        <div className="campaign-hero-media" aria-hidden="true">
          <picture>
            {background.sources?.map((source) => (
              <source key={source.type} type={source.type} srcSet={source.srcSet} />
            ))}
            <img
              src={background.src}
              srcSet={background.srcSet}
              sizes={background.sizes}
              alt={background.alt}
              loading={background.eager ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={background.eager ? 'high' : 'auto'}
            />
          </picture>
          <div className="campaign-hero-overlay" />
        </div>
      ) : null}
      <div className="campaign-hero-inner">
        <div className="campaign-hero-main">
          {kicker ? <div className="campaign-kicker">{kicker}</div> : null}
          <h1 className="campaign-hero-title">{title}</h1>
          {subtitle ? <p className="campaign-hero-subtitle">{subtitle}</p> : null}
          {microBadges && microBadges.length > 0 ? (
            <div className="campaign-hero-badges" aria-label="Key promises">
              {microBadges.map((badge) => (
                <span key={badge}>{badge}</span>
              ))}
            </div>
          ) : null}
          {actions ? <div className="campaign-hero-actions">{actions}</div> : null}
          {trustItems && trustItems.length > 0 ? (
            <div className="campaign-hero-trust" aria-label="Trust signals">
              {trustItems.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          ) : null}
          {children}
        </div>
        {sideContent ? <div className="campaign-hero-side">{sideContent}</div> : null}
      </div>
    </section>
  );
};

export default CampaignHero;
