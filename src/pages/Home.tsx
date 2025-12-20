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
  );
};

export default Home;
