import { useEffect, useState } from 'react';

const Home = () => {
  const messages = [
    'Do you have HALO yet?',
    'HALO is the truth.',
    'HALO restores privacy.',
    'Technology designed to help you — not slow you down.',
    'A real alternative to monthly subscriptions.',
    'A one-time purchase. No monthly fees.',
    'Less middle-layer. More direct.',
    'Built for real homes.',
    'On a mission to change the industry.',
    'HALO looks out for you — not big corporations.',
    'HALO is here to stay.',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [logoIndex, setLogoIndex] = useState(0);
  const logoSources = ['/halo/halo-blue.png', '/halo/halo-yellow.png', '/halo/halo-green.png'];

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (event: MediaQueryListEvent) => {
      setReduceMotion(event.matches);
    };
    setReduceMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-home-hero', 'true');
    return () => {
      document.body.removeAttribute('data-home-hero');
    };
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const holdDuration = 2600;
    const fadeDuration = 900;
    const fadeOutTimeout = window.setTimeout(() => setOpacity(0), holdDuration);
    const nextTimeout = window.setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
      setOpacity(1);
    }, holdDuration + fadeDuration);
    return () => {
      window.clearTimeout(fadeOutTimeout);
      window.clearTimeout(nextTimeout);
    };
  }, [currentIndex, messages.length, reduceMotion]);

  useEffect(() => {
    if (reduceMotion) {
      setLogoIndex(0);
      return;
    }
    const interval = window.setInterval(() => {
      setLogoIndex((prev) => (prev + 1) % logoSources.length);
    }, 7000);
    return () => window.clearInterval(interval);
  }, [logoSources.length, reduceMotion]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        textAlign: 'center',
        padding: '0 1.5rem',
      }}
    >
      <style>
        {`
          body[data-home-hero='true'] header .brand {
            display: none;
          }

          .halo-logo-stack {
            height: clamp(180px, 33vmin, 420px);
            width: clamp(180px, 33vmin, 420px);
            position: relative;
          }

          .halo-logo {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: contain;
            opacity: 0;
            transition: opacity 1200ms ease-in-out;
          }

          .halo-logo.visible {
            opacity: 1;
          }

          .halo-logo.reduce-motion {
            transition: none;
          }
        `}
      </style>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.65rem' }}>
        <div
          style={{
            display: 'grid',
            placeItems: 'center',
          }}
          aria-label="HALO logo"
          role="img"
        >
          <div className="halo-logo-stack" aria-hidden="true">
            {reduceMotion ? (
              <img
                src="/halo/halo-blue.png"
                alt=""
                className="halo-logo visible reduce-motion"
              />
            ) : (
              logoSources.map((source, index) => (
                <img
                  key={source}
                  src={source}
                  alt=""
                  className={`halo-logo ${index === logoIndex ? 'visible' : ''}`}
                />
              ))
            )}
          </div>
        </div>
        <div
          style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.75rem)',
            fontWeight: 600,
            color: '#fff7e6',
            letterSpacing: '0.01em',
            opacity: reduceMotion ? 1 : opacity,
            transition: reduceMotion ? 'none' : 'opacity 900ms ease-in-out',
          }}
        >
          {reduceMotion ? messages[0] : messages[currentIndex]}
        </div>
      </div>
    </div>
  );
};

export default Home;
