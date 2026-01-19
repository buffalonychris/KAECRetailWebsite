import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import SectionHeader from './operator/SectionHeader';
import SpaceFrame from './operator/SpaceFrame';
import { VerticalContent } from '../content/installedSystems';

type VerticalPageLayoutProps = {
  vertical: VerticalContent;
  title: string;
  subtitle?: string;
  children: ReactNode;
  showNav?: boolean;
};

const VerticalPageLayout = ({ vertical, title, subtitle, children, showNav = true }: VerticalPageLayoutProps) => {
  const navItems = [
    { label: 'Overview', to: vertical.paths.overview },
    { label: 'Packages', to: vertical.paths.packages },
    { label: 'Add-ons', to: vertical.paths.addons },
    { label: 'How it works', to: vertical.paths.howItWorks },
    { label: 'Support & FAQ', to: vertical.paths.faq },
  ];

  return (
    <div className="space-shell">
      <div className="container section space-grid">
        <SectionHeader
          kicker={vertical.badge}
          title={title}
          subtitle={subtitle}
          actions={
            <div className="space-section-actions">
              <Link className="btn btn-primary" to={vertical.ctas.primary.to}>
                {vertical.ctas.primary.label}
              </Link>
              <Link className="btn btn-secondary" to={vertical.ctas.secondary.to}>
                {vertical.ctas.secondary.label}
              </Link>
            </div>
          }
        />

        {showNav ? (
          <SpaceFrame as="nav" aria-label={`${vertical.name} navigation`} className="space-grid">
            <div className="card-grid" style={{ gap: '0.75rem' }}>
              {navItems.map((item) => (
                <Link key={item.label} className="btn btn-secondary" to={item.to}>
                  {item.label}
                </Link>
              ))}
            </div>
          </SpaceFrame>
        ) : null}

        {children}
      </div>
    </div>
  );
};

export default VerticalPageLayout;
