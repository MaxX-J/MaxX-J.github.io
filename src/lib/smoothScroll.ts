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

// Arrivée d'un long trajet : la page part déjà lancée (après le saut) et se pose en douceur
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

export function scrollToElement(el: HTMLElement) {
  const current = lenis ? lenis.scroll : window.scrollY;
  const target = el.getBoundingClientRect().top + window.scrollY;
  const distance = target - current;
  // Loin (plus de 2 écrans) : on saute à un écran de la cible puis on glisse le dernier écran,
  // pour ne pas traverser en accéléré le bureau 3D, le manifeste et les cartes projets
  const far = Math.abs(distance) > window.innerHeight * 2;
  const jumpTo = target - Math.sign(distance) * window.innerHeight;

  if (lenis) {
    // après un changement de page, Lenis garde la hauteur de l'ancienne : on la remesure avant de partir
    lenis.resize();
    if (far) {
      lenis.scrollTo(jumpTo, { immediate: true, force: true });
      lenis.scrollTo(el, { duration: 1.1, easing: easeOutCubic, force: true });
    } else {
      lenis.scrollTo(el, { duration: 1.8, easing: easeInOutQuart });
    }
    return;
  }
  if (far) window.scrollTo({ top: jumpTo, behavior: 'instant' });
  el.scrollIntoView({ behavior: 'smooth' });
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
