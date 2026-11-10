import { motion, useReducedMotion, useSpring } from 'framer-motion';
import { useEffect } from 'react';

type FloatingHeadProps = {
  src: string;
  alt: string;
  className?: string;
};

// Tête qui flotte doucement et s'incline en 3D vers la souris, avec une ombre portée qui respire
export default function FloatingHead({ src, alt, className = '' }: FloatingHeadProps) {
  const reduce = useReducedMotion();
  const spring = { stiffness: 80, damping: 15, mass: 0.6 };
  const rotateX = useSpring(0, spring);
  const rotateY = useSpring(0, spring);

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      rotateY.set(x * 14);
      rotateX.set(-y * 9);
    };
    const onLeave = () => {
      rotateX.set(0);
      rotateY.set(0);
    };
    window.addEventListener('pointermove', onMove);
    document.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [reduce, rotateX, rotateY]);

  const float = reduce
    ? {}
    : {
        animate: { y: [0, -14, 0], rotate: [-1.5, 1.5, -1.5] },
        transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' as const },
      };
  const shadow = reduce
    ? {}
    : {
        animate: { scaleX: [1, 0.8, 1], opacity: [0.45, 0.25, 0.45] },
        transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' as const },
      };

  return (
    <div className="relative flex flex-col items-center" style={{ perspective: 900 }}>
      <motion.div {...float}>
        <motion.img
          src={src}
          alt={alt}
          draggable={false}
          className={`select-none drop-shadow-[0_18px_30px_rgba(120,40,0,0.25)] ${className}`}
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        />
      </motion.div>
      <motion.div
        aria-hidden
        className="mt-4 h-4 w-[50%] rounded-[50%] bg-[#7a2e00] blur-md md:mt-6 md:h-6"
        {...shadow}
      />
    </div>
  );
}
