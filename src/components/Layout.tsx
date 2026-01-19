import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Seo from './Seo';
import { captureUtmParams } from '../lib/utm';
import { brandLegal, brandSite } from '../lib/brand';
import BusinessMenu from './nav/BusinessMenu';
import Pill from './operator/Pill';

type NavItem = {
  path: string;
  label: string;
};

const businessLinks = [
  { path: '/home-security', label: 'Home Security' },
  { path: '/home-automation', label: 'Home Automation' },
  { path: '/elder-care-tech', label: 'Elder Care Tech' },
  { path: '/halo', label: 'HALO PERS' },
  { path: '/operator', label: 'Operator', badge: 'SaaS' },
];

const secondaryLinks: NavItem[] = [
  { path: '/pricing', label: 'Pricing' },
  { path: '/partners', label: 'Partners' },
  { path: '/support', label: 'Support' },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setMobileOpen(false);
    }
  };

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setMobileOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    captureUtmParams({ search: location.search, pathname: location.pathname });
  }, [location.pathname, location.search]);

  const businessesActive = businessLinks.some((item) => location.pathname.startsWith(item.path));

  return (
    <div>
      <Seo />
      <header className="hide-when-print">
        <div className="container nav">
          <NavLink to="/" className="brand" aria-label={`${brandSite} home`}>
            <div className="brand-mark" aria-hidden="true">
              RE
            </div>
            <div>
              <div className="brand-name">{brandSite}</div>
              <small className="brand-tagline">Business portals for connected care</small>
            </div>
          </NavLink>
          <div className="nav-center">
            <details className="dropdown">
              <summary className={`dropdown-trigger${businessesActive ? ' active' : ''}`}>
                Businesses
                <Pill className="pill-inline">5</Pill>
              </summary>
              <div className="dropdown-menu dropdown-menu-wide">
                <BusinessMenu items={businessLinks} />
              </div>
            </details>
          </div>
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
            <nav className="nav-links" aria-label="Secondary navigation">
              {secondaryLinks.map((item) => (
                <NavLink key={item.path} to={item.path} className={({ isActive }) => (isActive ? 'active' : undefined)}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <NavLink className="btn btn-primary nav-cta" to="/demo">
              See a Live Demo
            </NavLink>
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
                <details>
                  <summary>Businesses</summary>
                  <div className="mobile-dropdown">
                    <BusinessMenu items={businessLinks} />
                  </div>
                </details>
                {secondaryLinks.map((item) => (
                  <NavLink key={item.path} to={item.path} role="menuitem">
                    {item.label}
                  </NavLink>
                ))}
                <NavLink className="btn btn-primary" to="/demo">
                  See a Live Demo
                </NavLink>
              </div>
            </div>
          </div>
        )}
      </header>
      <div className="sitewide-notice" role="status">
        No pricing, guarantees, or promises are given by the assistant.
      </div>
      <main>{children}</main>
      <footer className="footer hide-when-print">
        <div className="container footer-grid">
          <div>
            <div className="footer-heading">Product</div>
            <div className="footer-links">
              <NavLink to="/operator">Operator</NavLink>
              <NavLink to="/never-miss-another-estimate">Never Miss Another Estimate</NavLink>
              <NavLink to="/demo">Request Demo</NavLink>
              <NavLink to="/pricing">View Pricing</NavLink>
              <NavLink to="/5-day-demo">Start Free 5-Day Demo</NavLink>
              <NavLink to="/partners">Become a Partner</NavLink>
            </div>
          </div>
          <div>
            <div className="footer-heading">Actions</div>
            <div className="footer-links">
              <NavLink to="/pricing">Purchase / Start Plan</NavLink>
              <NavLink to="/demo#mailing-list">Join Mailing List</NavLink>
              <NavLink to="/support">Contact Support</NavLink>
            </div>
          </div>
          <div>
            <div className="footer-heading">Legal</div>
            <div className="footer-links">
              <NavLink to="/privacy">Privacy Policy</NavLink>
              <NavLink to="/terms">Terms &amp; Conditions</NavLink>
              <NavLink to="/support">Support</NavLink>
            </div>
            <small className="footer-note">
              No pricing, guarantees, or promises are given by the assistant.
            </small>
          </div>
        </div>
        <div className="container footer-meta">
          <small>© 2025 {brandSite} · {brandLegal}. All Rights Reserved.</small>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
