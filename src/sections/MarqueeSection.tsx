import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { useRef } from 'react';
import { MARQUEE_IMAGES } from '../data/site';

const half = Math.ceil(MARQUEE_IMAGES.length / 2);
const ROW_1 = MARQUEE_IMAGES.slice(0, half);
const ROW_2 = MARQUEE_IMAGES.slice(half);

function Row({ images, x }: { images: string[]; x: MotionValue<number> }) {
  return (
    <motion.div className="flex gap-3" style={{ x, willChange: 'transform' }}>
      {[...images, ...images, ...images].map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          width={420}
          height={270}
          loading="lazy"
          decoding="async"
          className="h-[168px] w-[260px] shrink-0 rounded-2xl object-cover sm:h-[270px] sm:w-[420px]"
        />
      ))}
    </motion.div>
  );
}

// Deux lignes d'images qui défilent en sens opposé au scroll.
// Le mouvement passe par des motion values (pas de re-rendu React) et un ressort qui lisse les à-coups de la molette.
export default function MarqueeSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  // valeurs toujours négatives : la ligne déborde à gauche, sans trou en début de bandeau
  const x1 = useTransform(smooth, [0, 1], [-900, -400]);
  const x2 = useTransform(smooth, [0, 1], [-400, -900]);

  return (
    <section ref={ref} className="flex flex-col gap-3 overflow-hidden bg-orange-300 pb-20 pt-16 sm:pb-24 sm:pt-24 md:pt-32">
      <Row images={ROW_1} x={x1} />
      <Row images={ROW_2} x={x2} />
    </section>
  );
}
