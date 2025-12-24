import { NavLink, Outlet } from 'react-router-dom';
import Seo from './Seo';
import { rechaloContent } from '../lib/content';

const RechaloLayout = ({ children }: { children?: React.ReactNode }) => {
  const { site } = rechaloContent;

  return (
    <div className="rechalo-shell">
      <Seo />
      <header className="rechalo-header">
        <div className="container rechalo-nav">
          <NavLink to="/" className="rechalo-brand">
            {site.brand}
          </NavLink>
          <nav className="rechalo-nav-links" aria-label="Primary">
            <NavLink to="/halo">HALO</NavLink>
            <NavLink to="/support">Support</NavLink>
            <NavLink to="/privacy">Privacy</NavLink>
          </nav>
        </div>
      </header>
      <main>{children ?? <Outlet />}</main>
      <footer className="rechalo-footer">
        <div className="container">
          {site.footer_notice}
        </div>
      </footer>
    </div>
  );
};

export default RechaloLayout;
