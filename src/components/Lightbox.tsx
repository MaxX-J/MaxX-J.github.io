import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect } from 'react';
import { lockScroll } from '../lib/smoothScroll';

type LightboxProps = {
  photos: string[];
  index: number | null;
  onChange: (index: number | null) => void;
};

// Photo en grand, par-dessus la page ; flèches et Échap au clavier
export default function Lightbox({ photos, index, onChange }: LightboxProps) {
  const open = index !== null;

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onChange(null);
      if (e.key === 'ArrowRight') onChange((index + 1) % photos.length);
      if (e.key === 'ArrowLeft') onChange((index - 1 + photos.length) % photos.length);
    };
    lockScroll(true);
    window.addEventListener('keydown', onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, index, photos.length, onChange]);

  if (index === null) return null;
  const go = (step: number) => onChange((index + step + photos.length) % photos.length);
  const arrow = 'absolute top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm" onClick={() => onChange(null)} role="dialog" aria-modal>
      <img
        src={photos[index]}
        alt=""
        className="max-h-[85vh] max-w-[92vw] rounded-2xl object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      <button type="button" aria-label="Fermer" onClick={() => onChange(null)} className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/30">
        <X className="h-5 w-5" />
      </button>
      {photos.length > 1 && (
        <>
          <button type="button" aria-label="Photo précédente" onClick={(e) => (e.stopPropagation(), go(-1))} className={`${arrow} left-3 md:left-6`}>
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button type="button" aria-label="Photo suivante" onClick={(e) => (e.stopPropagation(), go(1))} className={`${arrow} right-3 md:right-6`}>
            <ChevronRight className="h-6 w-6" />
          </button>
          <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/15 px-3 py-1 text-sm text-white">
            {index + 1} / {photos.length}
          </span>
        </>
      )}
    </div>
  );
}
