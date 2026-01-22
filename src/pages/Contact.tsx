import { useSearchParams } from 'react-router-dom';
import { useLayoutConfig } from '../components/LayoutConfig';
import { brandSite } from '../lib/brand';
import { resolveVertical } from '../lib/verticals';

const Contact = () => {
  const [searchParams] = useSearchParams();
  const vertical = resolveVertical(searchParams.get('vertical'));
  const isHomeSecurity = vertical === 'home-security';

  useLayoutConfig({
    layoutVariant: isHomeSecurity ? 'funnel' : 'sitewide',
    showBreadcrumbs: isHomeSecurity,
    breadcrumb: isHomeSecurity
      ? [
          { label: 'Home Security', href: '/home-security' },
          { label: 'Request install' },
        ]
      : [],
  });

  return (
    <div className="container section">
      <h2 style={{ marginTop: 0 }}>Talk with {brandSite}</h2>
      <p style={{ maxWidth: 640 }}>
        Share how many rooms or units you need covered, and which package tiers you want to discuss.
        We respond with a simple, one-time quote—no subscriptions.
      </p>
      <form className="form" aria-label="Contact form">
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" placeholder="Your name" required />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" placeholder="you@example.com" required />
        </div>
        <div>
          <label htmlFor="package">Package interest</label>
          <select id="package" name="package">
            <option value="a1">Bronze</option>
            <option value="a2">Silver</option>
            <option value="a3">Gold</option>
            <option value="custom">Custom mix</option>
          </select>
        </div>
        <div>
          <label htmlFor="message">Project notes</label>
          <textarea
            id="message"
            name="message"
            rows={4}
            placeholder="Tell us about rooms, entry points, or special needs."
          />
        </div>
        <button className="btn btn-primary" type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Contact;
