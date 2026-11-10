import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../data/site';

// Section de l'accueil en cours de lecture : la dernière dont le haut a passé les 40 % de l'écran.
// Hors de l'accueil, les pages de projets allument « Projets ».
export function useActiveSection() {
  const { pathname } = useLocation();
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (pathname !== '/') {
      setActive(pathname.startsWith('/projets') ? 'projets' : null);
      return;
    }
    const update = () => {
      let current: string | null = null;
      for (const { id } of NAV_LINKS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) current = id;
      }
      setActive(current);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [pathname]);

  return active;
}

// Barre flottante : visible quand on remonte, cachée quand on descend ou qu'on est encore en haut de page
export function useFloatingNav(threshold = 500) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - last;
      if (Math.abs(delta) < 6) return;
      setVisible(y > threshold && delta < 0);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return visible;
}
