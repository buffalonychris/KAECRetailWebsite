import React, { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Seo from './Seo';
import { captureUtmParams } from '../lib/utm';

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
  { path: '/contact', label: 'Contact' },
  { path: '/reliability', label: 'Offline Reliability' },
  { path: '/vendors', label: 'Vendors' },
];

const haloLinks: NavItem[] = [
  { path: '/halo', label: 'HALO Launch' },
  { path: '/halo/checkout', label: 'HALO Checkout' },
  { path: '/halo-pushbutton', label: 'HALO Pushbutton' },
  { path: '/halo-package', label: 'HALO Package' },
];

const primaryLinks: (NavItem | DropdownItem)[] = [
  { label: 'HALO', items: haloLinks },
  { label: 'Learn', items: learnLinks },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);
  const [haloOpen, setHaloOpen] = useState(false);
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

  const navLinks = primaryLinks;

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setMobileOpen(false);
    }
  };

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setMobileOpen(false);
      setLearnOpen(false);
      setHaloOpen(false);
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
        setHaloOpen(false);
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
    setHaloOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    captureUtmParams({ search: location.search, pathname: location.pathname });
  }, [location.pathname, location.search]);

  const isLearnActive = useMemo(
    () => learnLinks.some((link) => location.pathname.startsWith(link.path)),
    [location.pathname]
  );
  const isHaloActive = useMemo(
    () => haloLinks.some((link) => location.pathname.startsWith(link.path)),
    [location.pathname]
  );

  const renderNavLink = (item: NavItem) => (
    <NavLink key={item.path} to={item.path} className={({ isActive }) => (isActive ? 'active' : undefined)}>
      {item.label}
    </NavLink>
  );

  return (
    <div>
      <Seo />
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
              {navLinks.map((link) => {
                if ('items' in link) {
                  const isHalo = link.label === 'HALO';
                  const isOpen = isHalo ? haloOpen : learnOpen;
                  const isActive = isHalo ? isHaloActive : isLearnActive;
                  const setOpen = isHalo ? setHaloOpen : setLearnOpen;
                  return (
                    <div key={link.label} className="dropdown">
                      <button
                        className={`dropdown-trigger ${isActive || isOpen ? 'active' : ''}`}
                        aria-expanded={isOpen}
                        aria-haspopup="true"
                        onClick={() => setOpen((prev) => !prev)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            setOpen((prev) => !prev);
                          }
                        }}
                      >
                        {link.label}
                      </button>
                      {isOpen && (
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
              <div className="mobile-links" role="menu">
                {navLinks.map((link) => {
                  if ('items' in link) {
                    return (
                      <details key={link.label} open>
                        <summary>{link.label}</summary>
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
          {import.meta.env.DEV && (
            <div className="footer-tools">
              <small>Tools:</small>
              <div className="footer-tool-links">
                <NavLink to="/uat">UAT</NavLink>
                <NavLink to="/launchUat">Launch UAT</NavLink>
                <NavLink to="/certificate">Certificate</NavLink>
                <NavLink to="/payment-processing">Payment processing</NavLink>
              </div>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default Layout;
