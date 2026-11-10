import { motion, useScroll, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { useRef } from 'react';
import Button from '../components/Button';
import FadeIn from '../components/FadeIn';
import Media from '../components/Media';
import { HOME_PROJECTS } from '../data/site';
import type { Project } from '../data/site';


type CardProps = {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
};

function StackCard({ project, index, total, progress }: CardProps) {
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);
  const [img1, img2, img3] = project.images;
  const radius = 'rounded-[22px] sm:rounded-[30px] md:rounded-[36px]';

  return (
    <div className="sticky top-24 flex h-[85vh] items-start justify-center md:top-32">
      {/* largeur bornée par la hauteur de l'écran : la carte entière (images en 16:9) tient toujours sur un écran,
          même sur un portable peu haut ; sur grand écran elle s'arrête à 1000 px */}
      <motion.article
        style={{ scale, top: `${index * 28}px` }}
        className="bg-menu relative flex w-full max-w-[min(1000px,calc((100svh-360px)*2.4))] origin-top flex-col gap-3 rounded-[32px] border-2 border-white p-4 sm:gap-4 sm:rounded-[40px] sm:p-5 md:rounded-[48px] md:p-6"
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-2 md:flex-nowrap md:gap-8 md:px-4">
          <span className="font-display font-black leading-[0.8] text-white" style={{ fontSize: 'clamp(3rem, 6vw, 84px)' }}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="flex flex-1 flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-[0.1em] text-white/80 sm:text-base">
              {project.category} · {project.context}
            </span>
            <h3 className="font-display font-medium uppercase text-white" style={{ fontSize: 'clamp(1.25rem, 2.2vw, 2rem)' }}>
              {project.title}
            </h3>
          </div>
          <Button variant="contour" to={`/projets/${project.slug}`} className="w-full md:w-auto">
            Voir le projet
          </Button>
        </div>
        {/* 1/3 - 2/3 : la 1re image (la couverture) est la grande ; elle remplit la hauteur des deux petites (16:9),
            quel que soit son format d'origine, pour que toutes les cartes aient la même taille */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-[1fr_2fr]">
          <div className="contents md:flex md:flex-col md:gap-4">
            <Media src={img2} className={`aspect-video w-full object-cover ${radius}`} />
            <Media src={img3} className={`aspect-video w-full object-cover ${radius}`} />
          </div>
          <div className={`relative order-first col-span-2 aspect-video overflow-hidden md:order-none md:col-span-1 md:aspect-auto ${radius}`}>
            <Media src={img1} className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export default function ProjectsSection() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: container, offset: ['start start', 'end end'] });

  return (
    <section
      id="projets"
      className="bg-hero relative z-20 -mt-10 rounded-t-[40px] px-4 pb-32 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pt-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pb-44 md:pt-32"
    >
      <FadeIn as="h2" y={40} className="text-center">
        <span
          className="font-display font-black uppercase leading-[0.9] tracking-tight text-white"
          style={{ fontSize: 'clamp(3.5rem, 12vw, 160px)' }}
        >
          Projets
        </span>
      </FadeIn>
      <p className="mt-4 text-center text-sm font-medium text-white/85 sm:text-base">
        {HOME_PROJECTS.length} projets à la une
      </p>

      {/* marge basse = décalage de la dernière carte empilée, pour qu'elle ne recouvre pas le bouton */}
      <div ref={container} className="mt-10 pb-[120px] md:mt-16 md:pb-[160px]">
        {HOME_PROJECTS.map((project, i) => (
          <StackCard key={project.title} project={project} index={i} total={HOME_PROJECTS.length} progress={scrollYProgress} />
        ))}
      </div>

      <div className="relative z-10 flex justify-center">
        <Button to="/projets">Découvrir tous mes projets</Button>
      </div>
    </section>
  );
}
