import Lenis from 'lenis';

// Défilement fluide (Lenis, comme la v2). Le défilement reste celui de la page :
// les animations liées au scroll (framer-motion, bureau 3D) continuent de marcher.
let lenis: Lenis | null = null;

// Ancres : départ doux et arrivée amortie
const easeInOutQuart = (t: number) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2);

export function startSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  lenis = new Lenis({
    // Réglages des sites de référence (lenis.dev, darkroom.engineering, mesurés le 03/11/2026) :
    // ceux par défaut de Lenis, la page se pose en moins d'une seconde, 100 px par cran de molette
    lerp: 0.1,
    smoothWheel: true,
    wheelMultiplier: 1,
    syncTouch: false, // au doigt, on garde le défilement natif du téléphone
  });
  let id = 0;
  const raf = (time: number) => {
    lenis?.raf(time);
    id = requestAnimationFrame(raf);
  };
  id = requestAnimationFrame(raf);
  return () => {
    cancelAnimationFrame(id);
    lenis?.destroy();
    lenis = null;
  };
}

export function scrollToTop(immediate = false) {
  if (lenis) lenis.scrollTo(0, { immediate });
  else window.scrollTo({ top: 0, behavior: immediate ? 'instant' : 'smooth' });
}

export function scrollToElement(el: HTMLElement) {
  if (lenis) {
    // après un changement de page, Lenis garde la hauteur de l'ancienne : on la remesure avant de partir
    lenis.resize();
    lenis.scrollTo(el, { duration: 1.8, easing: easeInOutQuart });
  }
  else el.scrollIntoView({ behavior: 'smooth' });
}

// Défile jusqu'à une position précise (en px depuis le haut de la page)
export function scrollToY(top: number) {
  if (lenis) lenis.scrollTo(top, { duration: 1.2 });
  else window.scrollTo({ top, behavior: 'smooth' });
}

// Bloque le défilement de la page (menu ouvert, visionneuse photo)
export function lockScroll(locked: boolean) {
  document.body.style.overflow = locked ? 'hidden' : '';
  if (locked) lenis?.stop();
  else lenis?.start();
}
