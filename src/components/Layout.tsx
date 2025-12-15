import React, { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

type NavItem = {
  path: string;
  label: string;
};

type DropdownItem = {
  label: string;
  items: NavItem[];
};

const learnLinks: NavItem[] = [
  { path: '/faq', label: 'FAQ Library' },
  { path: '/privacy', label: 'Privacy' },
  { path: '/terms', label: 'Terms' },
];

const primaryLinks: (NavItem | DropdownItem)[] = [
  { path: '/packages', label: 'Packages' },
  { path: '/recommend', label: 'How It Works' },
  { label: 'Learn', items: learnLinks },
  { path: '/funding', label: 'Funding' },
  { path: '/comparison', label: 'Compare' },
  { path: '/faq', label: 'FAQ' },
  { path: '/reliability', label: 'Offline Reliability' },
  { path: '/contact', label: 'Contact' },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  const flowRoutes = useMemo(
    () => ['/quote', '/quoteReview', '/agreement', '/agreementReview', '/payment', '/schedule'],
    [],
  );
  const navMuted = useMemo(
    () => flowRoutes.some((path) => location.pathname.startsWith(path)),
    [flowRoutes, location.pathname],
  );

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setMobileOpen(false);
    }
  };

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setMobileOpen(false);
      setLearnOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setLearnOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setLearnOpen(false);
  }, [location.pathname]);

  const isLearnActive = useMemo(
    () => learnLinks.some((link) => location.pathname.startsWith(link.path)),
    [location.pathname]
  );

  const renderNavLink = (item: NavItem) => (
    <NavLink key={item.path} to={item.path} className={({ isActive }) => (isActive ? 'active' : undefined)}>
      {item.label}
    </NavLink>
  );

  return (
    <div>
      <header className={`hide-when-print ${navMuted ? 'flow-nav-muted' : ''}`}>
        <div className="container nav" ref={navRef}>
          <NavLink to="/" className="brand" aria-label="KickAss Elder Care home">
            <div className="brand-mark" aria-hidden="true">
              KA
            </div>
            <div>
              <div className="brand-name">KickAss Elder Care</div>
              <small className="brand-tagline">Local-first safety packages</small>
            </div>
          </NavLink>
          <div className="nav-actions">
            <button
              className="nav-toggle"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              <span />
              <span />
              <span />
            </button>
            <nav className="nav-links" aria-label="Main navigation">
              {primaryLinks.map((link) => {
                if ('items' in link) {
                  return (
                    <div key={link.label} className="dropdown">
                      <button
                        className={`dropdown-trigger ${isLearnActive || learnOpen ? 'active' : ''}`}
                        aria-expanded={learnOpen}
                        aria-haspopup="true"
                        onClick={() => setLearnOpen((prev) => !prev)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            setLearnOpen((prev) => !prev);
                          }
                        }}
                      >
                        {link.label}
                      </button>
                      {learnOpen && (
                        <div className="dropdown-menu" role="menu">
                          {link.items.map((item) => (
                            <NavLink key={item.path} to={item.path} role="menuitem">
                              {item.label}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                return renderNavLink(link);
              })}
            </nav>
            <div className="nav-cta">
              <NavLink to="/quote" className="btn btn-primary">
                Get a Quote
              </NavLink>
              <NavLink to="/resume-verify" className="resume-link">
                Resume / Verify
              </NavLink>
            </div>
          </div>
        </div>
        {mobileOpen && (
          <div
            className="mobile-menu"
            role="dialog"
            aria-label="Mobile navigation"
            onClick={handleOverlayClick}
          >
            <div className="mobile-menu-inner">
              <NavLink to="/quote" className="btn btn-primary mobile-quote">
                Get a Quote
              </NavLink>
              <NavLink to="/resume-verify" className="resume-link">
                Resume / Verify
              </NavLink>
              <div className="mobile-links" role="menu">
                {primaryLinks.map((link) => {
                  if ('items' in link) {
                    return (
                      <details key={link.label} open>
                        <summary>Learn</summary>
                        <div className="mobile-dropdown" role="group">
                          {link.items.map((item) => renderNavLink(item))}
                        </div>
                      </details>
                    );
                  }
                  return renderNavLink(link);
                })}
              </div>
            </div>
          </div>
        )}
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
          <small>This website is for informational purposes and does not provide medical advice.</small>
          <small>
            Features and availability may vary by property conditions and local code requirements.
          </small>
          <div className="footer-tools">
            <small>Tools:</small>
            <div className="footer-tool-links">
              <NavLink to="/uat">UAT</NavLink>
              <NavLink to="/certificate">Certificate</NavLink>
              <NavLink to="/payment-processing">Payment processing</NavLink>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
