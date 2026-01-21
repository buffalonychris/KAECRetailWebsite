import React, { useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import Seo from './Seo';
import { captureUtmParams } from '../lib/utm';
import { brandLegal, brandSite } from '../lib/brand';

const Layout = () => {
  const location = useLocation();

  useEffect(() => {
    captureUtmParams({ search: location.search, pathname: location.pathname });
  }, [location.pathname, location.search]);

  const isHub = location.pathname === '/';

  return (
    <div>
      <Seo />
      <Outlet />
      <footer className={`footer hide-when-print${isHub ? ' footer-hub' : ''}`}>
        {isHub ? (
          <div className="container footer-hub-inner">
            <div className="footer-hub-links">
              <NavLink to="/privacy">Privacy Policy</NavLink>
              <NavLink to="/terms">Terms &amp; Conditions</NavLink>
              <NavLink to="/support">Support</NavLink>
            </div>
            <small className="hub-disclaimer">No pricing, guarantees, or promises are given by the assistant.</small>
            <small className="footer-hub-meta">
              © 2025 {brandSite} · {brandLegal}. All Rights Reserved.
            </small>
          </div>
        ) : (
          <>
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
          </>
        )}
      </footer>
    </div>
  );
};

export default Layout;
