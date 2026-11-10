import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { useRef } from 'react';

// Logos monochromes (Simple Icons / Devicon) : on retire leurs couleurs pour les teinter en orange
const RAW = import.meta.glob('../assets/logos/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const LOGOS = Object.fromEntries(
  Object.entries(RAW).map(([path, svg]) => [
    path.split('/').pop()!.replace('.svg', ''),
    svg
      .replace(/<title>.*?<\/title>/g, '')
      .replace(/\s(fill|style|class)="[^"]*"/g, '')
      .replace('<svg', '<svg fill="currentColor" aria-hidden="true"'),
  ]),
);

// [nom affiché, logo] ; sans logo disponible, on affiche un monogramme
type Tool = [string, string];
const ROW_1: Tool[] = [
  ['Figma', 'figma'], ['HTML', 'html5'], ['CSS', 'css'], ['JavaScript', 'javascript'], ['TypeScript', 'typescript'],
  ['React', 'react'], ['Next.js', 'nextdotjs'], ['Node.js', 'nodedotjs'], ['Socket.IO', 'socketdotio'],
  ['PHP', 'php'], ['Laravel', 'laravel'], ['MySQL', 'mysql'],
];
const ROW_2: Tool[] = [
  ['WordPress', 'wordpress'], ['Supabase', 'supabase'], ['Unity', 'unity'], ['C#', 'csharp'], ['Three.js', 'threedotjs'],
  ['Phaser', 'Ph'], ['Blender', 'blender'], ['After Effects', 'aftereffects'], ['Animate', 'An'],
  ['Illustrator', 'illustrator'], ['InDesign', 'Id'],
];

function Pill({ name, logo }: { name: string; logo: string }) {
  const svg = LOGOS[logo];
  return (
    <span className="flex shrink-0 items-center gap-3 rounded-full border-[1.5px] border-orange-accent/30 bg-orange-accent/[0.07] py-3 pl-4 pr-6 text-orange-accent sm:gap-4 sm:py-4 sm:pl-5 sm:pr-8">
      {svg ? (
        <span className="block h-6 w-6 sm:h-8 sm:w-8 [&>svg]:h-full [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: svg }} />
      ) : (
        <span className="grid h-6 w-6 place-items-center rounded-md border-2 border-current font-display text-[11px] font-bold leading-none sm:h-8 sm:w-8 sm:text-sm">
          {logo}
        </span>
      )}
      <span className="whitespace-nowrap font-display text-lg font-medium sm:text-2xl">{name}</span>
    </span>
  );
}

function Row({ tools, x }: { tools: Tool[]; x: MotionValue<number> }) {
  return (
    <motion.div className="flex gap-3 sm:gap-4" style={{ x, willChange: 'transform' }}>
      {[...tools, ...tools, ...tools].map(([name, logo], i) => (
        <Pill key={i} name={name} logo={logo} />
      ))}
    </motion.div>
  );
}

// Deux rangées de logiciels qui défilent en sens opposé au scroll, comme le bandeau d'images sous le hero
export default function ToolsMarqueeSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  // valeurs toujours négatives : pas de trou en début de rangée
  const x1 = useTransform(smooth, [0, 1], [-700, -200]);
  const x2 = useTransform(smooth, [0, 1], [-200, -700]);

  return (
    <section ref={ref} aria-label="Logiciels et langages" className="relative z-10 overflow-hidden bg-white pb-24 pt-6 sm:pb-28 md:pb-36">
      <p className="sr-only">
        {[...ROW_1, ...ROW_2].map(([name]) => name).join(', ')}
      </p>
      <div className="flex flex-col gap-3 sm:gap-4" aria-hidden>
        <Row tools={ROW_1} x={x1} />
        <Row tools={ROW_2} x={x2} />
      </div>
    </section>
  );
}
