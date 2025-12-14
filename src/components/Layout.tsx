import { NavLink } from 'react-router-dom';
import React from 'react';

const links = [
  { path: '/', label: 'Home' },
  { path: '/recommend', label: 'Build my package' },
  { path: '/packages', label: 'Packages' },
  { path: '/comparison', label: 'Comparison' },
  { path: '/funding', label: 'Funding' },
  { path: '/reliability', label: 'Offline reliability' },
  { path: '/faq', label: 'FAQ' },
  { path: '/contact', label: 'Contact' },
  { path: '/quote', label: 'Quote' },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <header className="hide-when-print">
        <div className="container nav">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              aria-label="KickAss Elder Care logo"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #f5c042, #f2a100)',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 800,
                color: '#0c0b0b',
              }}
            >
              KA
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff7e6' }}>
                KickAss Elder Care
              </div>
              <small style={{ color: '#c8c0aa' }}>Local-first safety packages</small>
            </div>
          </div>
          <nav className="nav-links" aria-label="Main navigation">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
                style={({ isActive }) => ({
                  color: isActive ? 'var(--kaec-gold)' : 'var(--kaec-sand)',
                })}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="footer hide-when-print">
        <div className="container" style={{ display: 'grid', gap: '0.75rem' }}>
          <div style={{ fontWeight: 700, color: '#fff7e6' }}>Sitewide notices</div>
          <small>
            © 2025 KickAss Inc. All Rights Reserved. Unauthorized use is prohibited.
          </small>
          <small>
            “KickAss” and “KickAss Elder Care” are trademarks of KickAss Inc. (VERIFY)
          </small>
          <small>Home Assistant is a trademark of its respective owner.</small>
          <small>Reolink is a trademark of its respective owner.</small>
          <small>This website is for informational purposes and does not provide medical advice.</small>
          <small>
            Features and availability may vary by property conditions and local code requirements.
          </small>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
