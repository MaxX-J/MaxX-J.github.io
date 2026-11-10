import { useEffect, useRef, useState } from 'react';

const PILLS = ['UI/UX', 'Dév web', '3D & VR'];

// Le bureau en 3D de la v2 : la caméra plonge dans l'écran au fil du défilement, puis fondu au noir
export default function DeskSection() {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const fade = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLParagraphElement>(null);
  const pills = useRef<HTMLDivElement>(null);
  const [noWebgl, setNoWebgl] = useState(false);

  useEffect(() => {
    let dispose: (() => void) | null = null;
    let cancelled = false;
    // three.js est chargé à part ; on attend aussi Kanit pour les affiches dessinées dans la scène
    Promise.all([import('../three/desk'), document.fonts.ready]).then(([{ initDesk }]) => {
      if (cancelled || !section.current || !canvas.current) return;
      dispose = initDesk({
        section: section.current,
        canvas: canvas.current,
        fade: fade.current,
        hint: hint.current,
        pills: pills.current,
      });
      if (!dispose) setNoWebgl(true);
    });
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);

  return (
    <section
      ref={section}
      id="bureau"
      aria-label="Mon bureau en 3D"
      className={`relative z-10 -mt-10 sm:-mt-12 md:-mt-14 ${noWebgl ? '' : 'h-[320vh]'}`}
    >
      <div
        className={`desk-dots sticky top-0 overflow-hidden rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] ${
          noWebgl ? 'relative grid h-[50vh] place-items-center' : 'h-screen'
        }`}
      >
        <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 block h-full w-full" />

        <div
          ref={pills}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-[8%] z-10 flex justify-between gap-2 px-4 sm:px-[5vw]"
        >
          {PILLS.map((label) => (
            <span
              key={label}
              className="whitespace-nowrap rounded-full bg-orange-accent px-4 py-2 font-display font-medium uppercase text-white shadow-[0_10px_30px_-12px_rgba(120,40,0,0.45)] sm:px-6 sm:py-2.5"
              style={{ fontSize: 'clamp(0.85rem, 0.6rem + 0.9vw, 1.6rem)' }}
            >
              {label}
            </span>
          ))}
        </div>

        <p
          ref={hint}
          aria-hidden="true"
          className="absolute left-1/2 top-16 -translate-x-1/2 whitespace-nowrap text-xs font-medium uppercase tracking-[0.15em] text-encre/60 sm:text-sm"
        >
          Défiler pour entrer dans l'écran ↓
        </p>

        <div ref={fade} aria-hidden="true" className="pointer-events-none absolute inset-0 bg-encre opacity-0" />

        {noWebgl && <p className="relative font-medium text-encre">Mon bureau en 3D (la 3D n'est pas disponible sur cet appareil).</p>}
      </div>
    </section>
  );
}
