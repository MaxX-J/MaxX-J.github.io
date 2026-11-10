import { useState } from 'react';
import Button from '../components/Button';
import FadeIn from '../components/FadeIn';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import ProjectCard from '../components/ProjectCard';
import StretchedTitle from '../components/StretchedTitle';
import { CATEGORIES, PROJECTS } from '../data/site';
import type { Category } from '../data/site';

type Filter = 'Tous' | Category;

export default function ProjectsPage() {
  const [filter, setFilter] = useState<Filter>('Tous');
  const filters: Filter[] = ['Tous', ...CATEGORIES];
  const count = (f: Filter) => (f === 'Tous' ? PROJECTS.length : PROJECTS.filter((p) => p.category === f).length);
  const visible = filter === 'Tous' ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <main style={{ overflowX: 'clip' }}>
      <section className="bg-hero relative flex h-[560px] flex-col overflow-hidden md:h-[620px]">
        <StretchedTitle text="Projets" box={{ top: 0.113, height: 0.839, side: 24 }} mobileBox={{ top: 0.143, height: 0.536, side: 8 }} />
        <Navbar />
        <div className="relative z-10 mt-auto flex flex-col items-center gap-4 px-4 pb-20 text-center md:flex-row-reverse md:items-end md:justify-between md:px-12 md:pb-[108px] md:text-left">
          <FadeIn immediate delay={0.2}>
            <span className="font-display text-[28px] font-medium uppercase text-white md:text-[40px]">
              {PROJECTS.length} projets
            </span>
          </FadeIn>
          <FadeIn immediate delay={0.1} className="flex flex-col items-center gap-5 md:items-start">
            <p className="order-1 max-w-[320px] font-light uppercase leading-snug tracking-wide text-white md:order-2 md:max-w-[460px] md:text-[22px]">
              Tous mes travaux en UI/UX, développement web, 3D sous Unity et motion design.
            </p>
            <div className="order-2 md:order-1">
              <Button to="/" icon={false}>
                Retour à l'accueil
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="relative z-10 -mt-10 rounded-t-[40px] bg-white px-4 pb-32 pt-10 md:-mt-14 md:rounded-t-[60px] md:px-12 md:pb-44 md:pt-20">
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:gap-2.5 md:px-0">
          {filters.map((f) => {
            const active = f === filter;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`flex shrink-0 items-center gap-2 rounded-full border-[1.5px] border-orange-accent px-[18px] py-2.5 text-[15px] font-semibold transition-colors md:px-[22px] md:py-3 md:text-base ${
                  active ? 'bg-orange-accent text-white' : 'text-orange-accent hover:bg-orange-accent/10'
                }`}
              >
                {f}
                <span className="text-sm font-medium opacity-70">{count(f)}</span>
              </button>
            );
          })}
        </div>

        {/* rangés par année de BUT, du plus récent au plus ancien (ordre de PROJECTS) */}
        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:mt-14 md:gap-y-14 lg:grid-cols-3">
          {visible.map((project, i) => (
            <FadeIn key={project.title} delay={(i % 3) * 0.08}>
              <ProjectCard project={project} />
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="bg-hero relative z-20 -mt-10 flex flex-col items-center gap-6 rounded-t-[40px] px-5 pb-8 pt-20 text-center md:-mt-14 md:gap-9 md:rounded-t-[60px] md:px-12 md:pb-10 md:pt-32">
        <FadeIn as="h2" y={40}>
          <span
            className="block max-w-[340px] font-display font-black uppercase leading-[0.95] tracking-tight text-white md:max-w-none"
            style={{ fontSize: 'clamp(3rem, 8.4vw, 120px)' }}
          >
            Un projet en tête ?
          </span>
        </FadeIn>
        <p className="max-w-[320px] text-white/85 md:max-w-none md:text-[22px]">
          Je cherche un stage : parlons de ce qu'on pourrait construire ensemble.
        </p>
        <Button to="/#contact">Me contacter</Button>
        <div className="mt-6 w-full md:mt-14">
          <Footer tone="blanc" />
        </div>
      </section>
    </main>
  );
}
