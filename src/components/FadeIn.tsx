import { motion } from 'framer-motion';
import type { ElementType, ReactNode } from 'react';
import { useMemo } from 'react';
import { useIntro } from '../lib/intro';

type FadeInProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  // Joue l'animation dès le chargement (contenu visible sans défiler, comme le hero)
  immediate?: boolean;
};

export default function FadeIn({
  children,
  as = 'div',
  className,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  immediate = false,
}: FadeInProps) {
  const Component = useMemo(() => motion.create(as), [as]);
  const visible = { opacity: 1, x: 0, y: 0 };
  // Pendant l'intro du logo, le contenu « immédiat » attend que le logo parte vers la nav
  const { ready } = useIntro();

  return (
    <Component
      className={className}
      initial={{ opacity: 0, x, y }}
      {...(immediate
        ? { animate: ready ? visible : undefined }
        : { whileInView: visible, viewport: { once: true, margin: '50px', amount: 0 } })}
      transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </Component>
  );
}
