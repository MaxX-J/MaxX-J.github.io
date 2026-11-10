import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Button from '../components/Button';
import { ABOUT_TEXT, CONTACT, PROJECTS } from '../data/site';
import { scrollToY } from '../lib/smoothScroll';

// Le manifeste de la v2, épinglé, puis le badge </> qui s'ouvre comme une balise.
// Le manifeste suit le défilement ; l'ouverture, elle, est jouée d'un coup avec un ressort
// (le badge s'agrandit jusqu'à remplir l'écran, comme une carte qu'on ouvre), puis la présentation arrive en cascade.
// En remontant, tout se referme dans le badge.
const WORDS: { text: string; strong?: boolean }[] = [
  { text: '3 ans', strong: true },
  ...'de BUT MMI à concevoir des interfaces, coder des sites et créer des jeux qui tournent vraiment, jusqu\'en production.'
    .split(' ')
    .map((text) => ({ text })),
];

const STATS: [value: string, label: string][] = [
  [String(PROJECTS.length), 'Projets ici'],
  ['1', 'Site client en ligne'],
  ['12 sem.', 'De stage, dès février'],
];

// Repères du défilement (0 → 1 sur toute la section)
const T = {
  words: [0, 0.42],
  line: [0.05, 0.47],
  badge: 0.44, // le badge apparaît en bas
  open: 0.6, // le badge s'ouvre sur la présentation
  close: 0.55, // en remontant, il se referme un peu plus haut (évite les allers-retours)
} as const;

const BADGE = 76;
const BADGE_GLYPH = 24; // taille des signes dans le badge

type Phase = 'hidden' | 'badge' | 'open';

// ressort principal : rapide au départ, qui se pose sans rebond visible
const SPRING = { type: 'spring', stiffness: 170, damping: 26, mass: 1 } as const;
const EASE = [0.16, 1, 0.3, 1] as const;

function Word({ text, strong, progress, range }: { text: string; strong?: boolean; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span style={{ opacity }} className={strong ? 'font-semibold text-orange-accent' : undefined}>
      {text}{' '}
    </motion.span>
  );
}

function useViewport() {
  const [size, setSize] = useState({ w: 1440, h: 900 });
  useEffect(() => {
    const update = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return size;
}

// Élément de la présentation : monte et apparaît après l'ouverture, disparaît vite à la fermeture
function Reveal({ delay, className, children }: { delay: number; className?: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0, transition: { delay, duration: 0.6, ease: EASE } }}
      exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// La page « Moi, c'est Maxens » : portrait à gauche, texte, chiffres et boutons à droite
function Presentation() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* marge basse = chevauchement de la section suivante (-mt-10 / -mt-12 / -mt-14), pour que rien ne passe dessous */}
      <div className="mx-auto grid h-full max-w-[1200px] content-center items-center gap-[2vh] px-6 pb-14 pt-4 text-white sm:px-10 sm:pb-16 md:grid-cols-[1fr_1.15fr] md:gap-14 md:pb-20">
        <div className="flex items-center justify-center">
          <motion.img
            initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0, transition: { ...SPRING, delay: 0.2 } }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
            src="/images/tete-3d.webp"
            alt=""
            className="h-[16vh] w-auto object-contain md:h-[min(60vh,560px)]"
          />
        </div>

        <div className="max-w-[500px]">
          <Reveal delay={0.35}>
            <h2 className="font-display font-black leading-[0.95] md:whitespace-nowrap" style={{ fontSize: 'clamp(2rem, min(4.4vw, 7vh), 3.75rem)' }}>
              Moi, c'est Maxens
            </h2>
          </Reveal>
          <Reveal delay={0.4}>
            <p className="mt-3 text-sm font-medium leading-relaxed sm:text-[15px] md:text-base">{ABOUT_TEXT}</p>
          </Reveal>
          <Reveal delay={0.45}>
            <dl className="mt-[2.5vh] flex gap-x-6 sm:gap-x-10">
              {STATS.map(([value, label]) => (
                <div key={label}>
                  <dt className="font-display text-xl font-semibold sm:text-2xl md:text-3xl">{value}</dt>
                  <dd className="font-mono text-[10px] uppercase tracking-wider text-white/60">{label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={0.5} className="mt-[3vh] flex flex-wrap gap-3">
            <Button to="/#contact" className="md:!px-7">
              Me contacter
            </Button>
            <Button href={CONTACT.cv} variant="contour" className="md:!px-7">
              Mon CV
            </Button>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

export default function StatementSection() {
  const ref = useRef<HTMLElement>(null);
  const { w, h } = useViewport();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [phase, setPhase] = useState<Phase>('hidden');

  useMotionValueEvent(p, 'change', (v) => {
    setPhase((cur) => {
      if (v >= T.open || (cur === 'open' && v > T.close)) return 'open';
      return v >= T.badge ? 'badge' : 'hidden';
    });
  });

  // un clic sur le badge fait défiler jusqu'à l'ouverture
  const openFromBadge = () => {
    const el = ref.current;
    if (!el) return;
    const top = el.offsetTop + (el.offsetHeight - window.innerHeight) * (T.open + 0.04);
    scrollToY(top);
  };

  // --- Manifeste ---
  const [w0, w1] = T.words;
  const line = useTransform(p, [...T.line], [0, 1]);

  // --- Le badge : un panneau plein écran découpé (clip-path) à la taille du badge ---
  const cx = w / 2;
  const cy = h - Math.min(110, h * 0.1) - BADGE / 2; // centre du badge, en bas de l'écran
  const r = BADGE / 2;
  const clips: Record<Phase, string> = {
    hidden: `inset(${cy}px ${w - cx}px ${h - cy}px ${cx}px round 18px)`,
    badge: `inset(${cy - r}px ${w - cx - r}px ${h - cy - r}px ${cx - r}px round 18px)`,
    open: 'inset(0px 0px 0px 0px round 0px)',
  };
  const isOpen = phase === 'open';
  // à la fermeture, on laisse le contenu partir avant de rétrécir
  const closeDelay = isOpen ? 0 : 0.12;

  // --- Les trois signes < / > ---
  const glyph = Math.min(220, Math.max(84, w * 0.14)); // taille des signes une fois ouverts
  const small = BADGE_GLYPH / glyph;
  const edge = w / 2 - glyph * 0.8;
  const barH = glyph * 0.78;
  const chevronOpacity = isOpen ? 0 : 1;

  return (
    <section ref={ref} id="a-propos" aria-label="À propos" className="relative h-[240vh] bg-encre">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div
          animate={{ opacity: isOpen ? 0 : 1, scale: isOpen ? 0.96 : 1 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="absolute inset-0"
        >
          <span className="absolute left-0 top-1/2 h-px w-[12vw] bg-white/25" />
          <span className="absolute right-0 top-1/2 h-px w-[12vw] bg-white/25" />
          <div className="absolute inset-0 flex items-center justify-center px-5 pb-[12vh] sm:px-8">
            <p
              className="max-w-[1000px] text-center font-display font-medium uppercase leading-[1.05] tracking-tight text-white"
              style={{ fontSize: 'clamp(2rem, 1rem + 3.6vw, 4.5rem)' }}
            >
              {WORDS.map((word, i) => (
                <Word
                  key={i}
                  text={word.text}
                  strong={word.strong}
                  progress={p}
                  range={[w0 + ((w1 - w0) * i) / WORDS.length, w0 + ((w1 - w0) * (i + 1)) / WORDS.length]}
                />
              ))}
            </p>
          </div>
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
            <motion.path
              d="M0 520 C 260 520, 360 780, 620 700 S 820 540, 900 640 S 820 820, 720 800"
              fill="none"
              stroke="#F16524"
              strokeWidth={3}
              strokeLinecap="round"
              style={{ pathLength: line }}
            />
          </svg>
        </motion.div>

        {/* le badge qui devient le panneau de présentation */}
        <motion.div
          initial={false}
          animate={{ clipPath: clips[phase] }}
          transition={{ ...SPRING, delay: closeDelay }}
          onClick={phase === 'badge' ? openFromBadge : undefined}
          className={`bg-menu absolute inset-0 z-10 ${phase === 'badge' ? 'cursor-pointer' : ''}`}
        >
          <AnimatePresence>{isOpen && <Presentation key="presentation" />}</AnimatePresence>
        </motion.div>

        {/* les trois signes < / > : dans le badge, puis écartés aux bords une fois ouvert */}
        <motion.div
          aria-hidden="true"
          initial={false}
          animate={{
            y: isOpen ? h / 2 - glyph / 2 : cy - glyph / 2,
            scale: phase === 'hidden' ? 0 : isOpen ? 1 : small,
            rotate: isOpen ? 0 : -8,
          }}
          transition={{ ...SPRING, delay: closeDelay }}
          style={{ x: '-50%', fontSize: glyph, height: glyph }}
          className="pointer-events-none absolute left-1/2 top-0 z-30 flex items-center font-display font-semibold leading-none text-white"
        >
          <motion.span initial={false} animate={{ x: isOpen ? -edge : 0, opacity: chevronOpacity }} transition={{ ...SPRING, delay: closeDelay }}>
            &lt;
          </motion.span>
          <motion.span
            initial={false}
            animate={{ opacity: isOpen ? 0 : 1, scaleY: isOpen ? 2.5 : 1, rotate: isOpen ? 0 : 20 }}
            transition={{ duration: isOpen ? 0.3 : 0.4, ease: EASE, delay: isOpen ? 0 : 0.3 }}
            style={{ height: barH, width: glyph * 0.08 }}
            className="mx-[0.06em] block rounded-full bg-white"
          />
          <motion.span initial={false} animate={{ x: isOpen ? edge : 0, opacity: chevronOpacity }} transition={{ ...SPRING, delay: closeDelay }}>
            &gt;
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}
