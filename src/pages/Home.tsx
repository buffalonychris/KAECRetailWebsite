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

          .halo-rings.animate circle {
            animation: haloGlow 14s ease-in-out infinite;
          }

          .halo-rings.static circle {
            stroke: #e7f1ff;
            filter: drop-shadow(0 0 8px rgba(185, 219, 245, 0.35));
          }

          @keyframes haloGlow {
            0% {
              stroke: #f8f8f8;
              filter: drop-shadow(0 0 0 rgba(248, 248, 248, 0));
            }
            25% {
              stroke: #f1d8a6;
              filter: drop-shadow(0 0 10px rgba(241, 216, 166, 0.4));
            }
            50% {
              stroke: #bfe7c1;
              filter: drop-shadow(0 0 10px rgba(191, 231, 193, 0.42));
            }
            75% {
              stroke: #b9dbf5;
              filter: drop-shadow(0 0 10px rgba(185, 219, 245, 0.42));
            }
            100% {
              stroke: #f8f8f8;
              filter: drop-shadow(0 0 0 rgba(248, 248, 248, 0));
            }
          }
        `}
      </style>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.65rem' }}>
        <div
          style={{
            width: 'clamp(64px, 10vw, 96px)',
            height: 'clamp(64px, 10vw, 96px)',
            borderRadius: '50%',
            background: '#ffffff',
            boxShadow: '0 10px 28px rgba(5, 5, 5, 0.25)',
            display: 'grid',
            placeItems: 'center',
          }}
          aria-label="HALO brand mark"
          role="img"
        >
          <svg
            viewBox="0 0 100 100"
            width="70%"
            height="70%"
            className={`halo-rings ${reduceMotion ? 'static' : 'animate'}`}
            aria-hidden="true"
          >
            <circle cx="50" cy="50" r="28" fill="none" stroke="#f8f8f8" strokeWidth="6" />
            <circle cx="50" cy="50" r="16" fill="none" stroke="#f8f8f8" strokeWidth="6" />
          </svg>
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
