import { useMotionValueEvent, useScroll } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { isVideo, posterOf } from '../components/Media';
import ToolChip from '../components/ToolChip';
import { SKILLS } from '../data/site';

// Vidéo d'une compétence : lue en boucle sans le son tant que sa ligne est active, en pause sinon
function SkillVideo({ src, label, playing, className }: { src: string; label: string; playing: boolean; className: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (playing) video.play().catch(() => {});
    else video.pause();
  }, [playing]);
  return <video ref={ref} src={src} poster={posterOf(src)} aria-label={label} muted loop playsInline preload="metadata" className={className} />;
}

// « Je conçois et je code » (v2) avec les compétences du final : section épinglée,
// la compétence active, son texte, ses outils et son image changent au défilement
export default function SkillsSection() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const n = SKILLS.length;
  const skill = SKILLS[active];

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    setActive(Math.min(n - 1, Math.floor(p * n)));
  });

  return (
    <section
      ref={ref}
      id="competences"
      aria-label="Compétences"
      className="relative z-10 -mt-10 rounded-t-[40px] bg-white sm:-mt-12 sm:rounded-t-[50px] md:-mt-14 md:rounded-t-[60px]"
      style={{ height: `${100 + n * 60}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center px-5 sm:px-8 md:px-12">
        <div className="mx-auto grid w-full max-w-[1360px] items-center gap-6 md:grid-cols-2 md:gap-[clamp(24px,5vw,80px)]">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.12em] text-encre/60 md:mb-6 md:text-lg">Je conçois et je code</p>
            <div className="flex flex-col gap-0.5 md:gap-2">
              {SKILLS.map((s, i) => (
                <p
                  key={s.name}
                  className={`whitespace-nowrap font-display font-semibold uppercase leading-[1.05] tracking-tight transition-[opacity,color,transform] duration-500 ${
                    i === active ? 'translate-x-2 text-orange-accent opacity-100' : 'text-encre opacity-[0.15]'
                  }`}
                  style={{ fontSize: 'clamp(1.5rem, 0.8rem + 2.5vw, 3.6rem)' }}
                >
                  {s.word}
                </p>
              ))}
            </div>
            {/* key : le texte et les outils se fondent à chaque changement */}
            <div key={skill.name} className="animate-[skill-in_0.5s_ease] mt-4 md:mt-7">
              <p className="max-w-xl font-light leading-relaxed text-encre/70" style={{ fontSize: 'clamp(0.95rem, 1.3vw, 1.2rem)' }}>
                {skill.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 md:mt-4">
                {skill.tools.map((tool) => (
                  <ToolChip key={tool} label={tool} />
                ))}
              </div>
            </div>
          </div>

          <div className="relative aspect-[16/9] overflow-hidden rounded-[28px] bg-orange-300/30 shadow-[0_30px_60px_-30px_rgba(120,40,0,0.45)] md:rounded-[40px]">
            {SKILLS.map((s, i) => {
              const className = `absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ${
                i === active ? 'scale-100 opacity-100' : 'scale-[1.06] opacity-0'
              }`;
              return isVideo(s.image) ? (
                <SkillVideo key={s.name} src={s.image} label={s.alt} playing={i === active} className={className} />
              ) : (
                <img key={s.name} src={s.image} alt={s.alt} loading="lazy" className={className} />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
