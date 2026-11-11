import { motion, useAnimate } from 'framer-motion';
import { useEffect, useState } from 'react';
import { INTRO_PLAYS, markIntroLanded, markIntroReady } from '../lib/intro';
import { lockScroll } from '../lib/smoothScroll';
import { CLICK_POINT, CURSOR_PATH, LOGO_VIEWBOX, M_PATH, RAY_PATHS } from './LogoMark';

const ORANGE = '#F16524';
const wait = (s: number) => new Promise((r) => window.setTimeout(r, s * 1000));

// Position finale du logo de la nav, sans le décalage de son apparition (FadeIn y: -20)
function targetRect() {
  const el = document.querySelector<HTMLElement>('[data-intro-target]');
  if (!el) return null;
  const r = el.getBoundingClientRect();
  let dx = 0;
  let dy = 0;
  for (let p = el.parentElement; p; p = p.parentElement) {
    const t = getComputedStyle(p).transform;
    if (t && t !== 'none') {
      const m = new DOMMatrix(t);
      dx += m.m41;
      dy += m.m42;
    }
  }
  return { left: r.left - dx, top: r.top - dy, width: r.width };
}

// Ouverture du site : le M se dessine, le curseur arrive et clique, le M se remplit,
// puis le logo file se poser à la place de celui de la nav pendant que le site apparaît.
export default function IntroAnimation() {
  const [done, setDone] = useState(!INTRO_PLAYS);
  const [scope, animate] = useAnimate();
  const [size] = useState(() => Math.min(window.innerWidth * 0.6, window.innerHeight * 0.55, 440));

  useEffect(() => {
    if (done) return;
    let cancelled = false;
    lockScroll(true);

    const run = async () => {
      // 1. le contour du M se dessine
      animate('.intro-outline', { pathLength: [0, 1], opacity: [0, 1] }, { duration: 0.9, ease: [0.65, 0, 0.35, 1] });
      await wait(0.45);
      // 2. le curseur entre par le bas à droite et vient sur la pointe du M
      await animate(
        '.intro-cursor',
        { x: [260, 0], y: [200, 0], opacity: [0, 1] },
        { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
      );
      if (cancelled) return;
      // 3. clic : le curseur s'enfonce, le M se remplit depuis le point du clic, les traits jaillissent
      animate('.intro-cursor', { scale: [1, 0.8, 1] }, { duration: 0.28, ease: 'easeInOut' });
      await wait(0.1);
      animate('.intro-fill', { r: [0, 190] }, { duration: 0.6, ease: [0.33, 1, 0.68, 1] });
      animate('.intro-outline', { opacity: 0 }, { duration: 0.4, delay: 0.3 });
      RAY_PATHS.forEach((_, i) =>
        animate(`.intro-ray-${i}`, { pathLength: [0, 1], opacity: [0, 1] }, { duration: 0.3, delay: 0.05 + i * 0.06, ease: 'easeOut' }),
      );
      await wait(0.95);
      if (cancelled) return;

      // 4. le logo part se poser dans la nav, le site apparaît en même temps
      const target = targetRect();
      markIntroReady();
      lockScroll(false);
      animate('.intro-bg', { opacity: 0 }, { duration: 0.8, delay: 0.1, ease: 'easeOut' });
      if (target) {
        const startLeft = (window.innerWidth - size) / 2;
        const startTop = (window.innerHeight - (size * 164) / 166) / 2;
        await animate(
          '.intro-mark',
          { x: target.left - startLeft, y: target.top - startTop, scale: target.width / size, color: '#ffffff' },
          { duration: 0.95, ease: [0.76, 0, 0.24, 1] },
        );
      } else {
        await animate('.intro-mark', { opacity: 0 }, { duration: 0.4 });
      }
      if (cancelled) return;
      markIntroLanded();
      setDone(true);
    };
    run();

    return () => {
      cancelled = true;
      lockScroll(false);
    };
  }, [animate, done, size]);

  if (done) return null;

  // Un clic passe l'intro
  const skip = () => {
    lockScroll(false);
    markIntroLanded();
    setDone(true);
  };

  return (
    <div ref={scope} className="fixed inset-0 z-[100] cursor-pointer" onClick={skip} aria-hidden="true">
      <div className="intro-bg absolute inset-0 bg-white" />
      <motion.div
        className="intro-mark absolute"
        style={{
          width: size,
          left: (window.innerWidth - size) / 2,
          top: (window.innerHeight - (size * 164) / 166) / 2,
          color: ORANGE,
          originX: 0,
          originY: 0,
        }}
      >
        <svg viewBox={LOGO_VIEWBOX} className="block h-auto w-full overflow-visible">
          <defs>
            <clipPath id="intro-fill-clip">
              <circle className="intro-fill" cx={CLICK_POINT.x} cy={CLICK_POINT.y} r={0} />
            </clipPath>
          </defs>
          <path className="intro-outline" d={M_PATH} fill="none" stroke="currentColor" strokeWidth={3} strokeLinejoin="round" opacity={0} />
          <path d={M_PATH} fill="currentColor" clipPath="url(#intro-fill-clip)" />
          <g stroke="currentColor" strokeWidth={5} strokeLinecap="round" fill="none">
            {RAY_PATHS.map((d, i) => (
              <path key={d} className={`intro-ray-${i}`} d={d} opacity={0} />
            ))}
          </g>
          {/* origine en haut à gauche = pointe du curseur, pour que le clic s'enfonce depuis la pointe */}
          <motion.path className="intro-cursor" d={CURSOR_PATH} fill="currentColor" style={{ opacity: 0, originX: 0, originY: 0 }} />
        </svg>
      </motion.div>
    </div>
  );
}
