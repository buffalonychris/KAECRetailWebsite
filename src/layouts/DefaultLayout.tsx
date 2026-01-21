import { Outlet, useLocation } from 'react-router-dom';

const DefaultLayout = () => {
  const location = useLocation();
  const isHub = location.pathname === '/';

  return (
    <>
      {!isHub && (
        <div className="sitewide-notice" role="status">
          No pricing, guarantees, or promises are given by the assistant.
        </div>
      )}
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default DefaultLayout;
