import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Seo from './Seo';
import { captureUtmParams } from '../lib/utm';

type NavItem = {
  path: string;
  label: string;
};

const solutionLinks: NavItem[] = [
  { path: '/operator', label: 'Operator' },
  { path: '/never-miss-another-estimate', label: 'Never Miss Another Estimate' },
];

const navLinks: NavItem[] = [
  { path: '/demo', label: 'Live Demo' },
  { path: '/pricing', label: 'Pricing' },
  { path: '/5-day-demo', label: '5-Day Demo' },
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

  const solutionsActive = solutionLinks.some((item) => location.pathname.startsWith(item.path));

  return (
    <div>
      <Seo />
      <header className="hide-when-print">
        <div className="container nav">
          <NavLink to="/" className="brand" aria-label="Never Miss Another Estimate home">
            <div className="brand-mark" aria-hidden="true">
              NM
            </div>
            <div>
              <div className="brand-name">Never Miss Another Estimate</div>
              <small className="brand-tagline">24/7 Estimate Scheduling Assistant</small>
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
              <details className="dropdown">
                <summary className={`dropdown-trigger${solutionsActive ? ' active' : ''}`}>
                  Solutions
                </summary>
                <div className="dropdown-menu">
                  {solutionLinks.map((item) => (
                    <NavLink key={item.path} to={item.path}>
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </details>
              {navLinks.map((item) => (
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
                  <summary>Solutions</summary>
                  <div className="mobile-dropdown">
                    {solutionLinks.map((item) => (
                      <NavLink key={item.path} to={item.path} role="menuitem">
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                </details>
                {navLinks.map((item) => (
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
          <small>© 2025 KickAss Inc. All Rights Reserved.</small>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
