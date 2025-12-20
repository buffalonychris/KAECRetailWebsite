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

          .halo-badge {
            height: clamp(180px, 33vh, 420px);
            width: clamp(180px, 33vh, 420px);
            border-radius: 50%;
            background: #ffffff;
            boxShadow: 0 12px 30px rgba(5, 5, 5, 0.18);
            display: grid;
            placeItems: center;
            position: relative;
            overflow: hidden;
          }

          .halo-logo {
            position: absolute;
            inset: 0;
            margin: auto;
            width: 72%;
            height: auto;
            opacity: 0;
            transition: opacity 0.6s ease-in-out;
          }

          .halo-logo.blue {
            animation: haloBlue 15s ease-in-out infinite;
          }

          .halo-logo.yellow {
            animation: haloYellow 15s ease-in-out infinite;
          }

          .halo-logo.green {
            animation: haloGreen 15s ease-in-out infinite;
          }

          .halo-logo.static {
            animation: none;
            opacity: 0;
          }

          .halo-logo.static.blue {
            opacity: 1;
          }

          @keyframes haloBlue {
            0% {
              opacity: 1;
            }
            26.666% {
              opacity: 1;
            }
            33.333% {
              opacity: 0;
            }
            93.333% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }

          @keyframes haloYellow {
            0% {
              opacity: 0;
            }
            26.666% {
              opacity: 0;
            }
            33.333% {
              opacity: 1;
            }
            60% {
              opacity: 1;
            }
            66.666% {
              opacity: 0;
            }
            100% {
              opacity: 0;
            }
          }

          @keyframes haloGreen {
            0% {
              opacity: 0;
            }
            60% {
              opacity: 0;
            }
            66.666% {
              opacity: 1;
            }
            93.333% {
              opacity: 1;
            }
            100% {
              opacity: 0;
            }
          }
        `}
      </style>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.65rem' }}>
        <div
          style={{
            display: 'grid',
            placeItems: 'center',
          }}
          aria-label="HALO brand mark"
          role="img"
        >
          <div className="halo-badge" aria-hidden="true">
            <img
              src="/halo/halo-blue.png"
              alt="HALO logo blue"
              className={`halo-logo blue ${reduceMotion ? 'static' : ''}`}
            />
            <img
              src="/halo/halo-yellow.png"
              alt="HALO logo yellow"
              className={`halo-logo yellow ${reduceMotion ? 'static' : ''}`}
            />
            <img
              src="/halo/halo-green.png"
              alt="HALO logo green"
              className={`halo-logo green ${reduceMotion ? 'static' : ''}`}
            />
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
