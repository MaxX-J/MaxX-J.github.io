import { Play } from 'lucide-react';
import { useRef, useState } from 'react';
import type { MouseEvent } from 'react';

// Vidéo YouTube : écrite « youtube:IDENTIFIANT » dans les données (aucun fichier téléchargé)
export const isYouTube = (src: string) => src.startsWith('youtube:');
const youTubeId = (src: string) => src.slice('youtube:'.length);

export const isVideo = (src: string) => isYouTube(src) || /\.(mp4|webm)$/i.test(src);

// Image fixe d'une vidéo : même nom, en .webp (ex. vox.mp4 → vox.webp), ou l'aperçu de YouTube.
// Vidéo hébergée ailleurs (release GitHub, trop lourde pour Pages) : son image reste sur le site, dans /videos/posters/
export const posterOf = (src: string) => {
  if (isYouTube(src)) return `https://img.youtube.com/vi/${youTubeId(src)}/maxresdefault.jpg`;
  if (/^https?:\/\//.test(src)) return `/videos/posters/${src.split('/').pop()!.replace(/\.(mp4|webm)$/i, '.webp')}`;
  return src.replace(/\.(mp4|webm)$/i, '.webp');
};

type MediaProps = {
  src: string;
  alt?: string;
  className?: string;
  // Vidéo : bouton play, puis lecture avec le son et les contrôles (plein écran…)
  controls?: boolean;
};

const play = (e: MouseEvent<HTMLVideoElement>) => {
  e.currentTarget.play().catch(() => {});
};

// À la sortie de la souris, on recharge la vidéo pour revenir sur son image fixe
const stop = (e: MouseEvent<HTMLVideoElement>) => {
  e.currentTarget.pause();
  e.currentTarget.load();
};

// Lecteur de la page projet : image fixe + gros bouton play orange ; au clic, la vidéo se lance avec le son et ses contrôles
function VideoPlayer({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  const start = () => {
    setStarted(true);
    ref.current?.play().catch(() => {});
  };

  return (
    <div className="relative">
      <video
        ref={ref}
        src={src}
        poster={posterOf(src)}
        className={className}
        aria-label={alt || undefined}
        playsInline
        preload="none"
        controls={started}
      />
      {!started && (
        <button
          type="button"
          onClick={start}
          aria-label={alt ? `Lire la vidéo : ${alt}` : 'Lire la vidéo'}
          className="group absolute inset-0 grid cursor-pointer place-items-center bg-encre/10 transition-colors hover:bg-encre/25"
        >
          <span className="grid h-16 w-16 place-items-center rounded-full bg-orange-accent shadow-[0_12px_30px_-8px_rgba(120,40,0,0.6)] transition-transform duration-300 group-hover:scale-110 md:h-24 md:w-24">
            <Play className="ml-1 h-7 w-7 fill-white text-white md:h-10 md:w-10" />
          </span>
        </button>
      )}
    </div>
  );
}

// Lecteur YouTube : l'aperçu et le bouton play d'abord ; YouTube (sans cookies) ne se charge qu'au clic
function YouTubePlayer({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [started, setStarted] = useState(false);
  if (started) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${youTubeId(src)}?autoplay=1&rel=0`}
        title={alt || 'Vidéo YouTube'}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        className={`aspect-video w-full ${className ?? ''}`}
      />
    );
  }
  return (
    <div className="relative">
      <img src={posterOf(src)} alt={alt} loading="lazy" className={`aspect-video w-full object-cover ${className ?? ''}`} />
      <button
        type="button"
        onClick={() => setStarted(true)}
        aria-label={alt ? `Lire la vidéo : ${alt}` : 'Lire la vidéo'}
        className="group absolute inset-0 grid cursor-pointer place-items-center bg-encre/10 transition-colors hover:bg-encre/25"
      >
        <span className="grid h-16 w-16 place-items-center rounded-full bg-orange-accent shadow-[0_12px_30px_-8px_rgba(120,40,0,0.6)] transition-transform duration-300 group-hover:scale-110 md:h-24 md:w-24">
          <Play className="ml-1 h-7 w-7 fill-white text-white md:h-10 md:w-10" />
        </span>
      </button>
    </div>
  );
}

// Image ou vidéo selon l'extension.
// Sans contrôles (cartes), une vidéo affiche son image fixe et ne se lit qu'au survol ;
// avec contrôles (page projet), elle attend un clic sur le bouton play.
export default function Media({ src, alt = '', className, controls = false }: MediaProps) {
  if (isYouTube(src)) {
    // sur les cartes, l'aperçu seul ; sur la page projet, le lecteur
    return controls ? <YouTubePlayer src={src} alt={alt} className={className} /> : <img src={posterOf(src)} alt={alt} loading="lazy" className={className} />;
  }
  if (isVideo(src)) {
    return controls ? (
      <VideoPlayer src={src} alt={alt} className={className} />
    ) : (
      <video
        src={src}
        poster={posterOf(src)}
        className={className}
        aria-label={alt || undefined}
        muted
        loop
        playsInline
        preload="none"
        onMouseEnter={play}
        onMouseLeave={stop}
      />
    );
  }
  return <img src={src} alt={alt} loading="lazy" className={className} />;
}
