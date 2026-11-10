import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { scrollToTop } from '../lib/smoothScroll';

// Bouton flottant qui ramène en haut de la page, visible dès qu'on a un peu défilé
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Revenir en haut de la page"
      onClick={() => scrollToTop()}
      className={`fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-orange-accent text-white shadow-[0_10px_30px_-10px_rgba(120,40,0,0.6)] transition-all duration-300 hover:scale-110 md:bottom-8 md:right-8 md:h-14 md:w-14 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <ArrowUp className="h-6 w-6" />
    </button>
  );
}
