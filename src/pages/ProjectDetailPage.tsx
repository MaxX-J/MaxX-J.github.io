import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import BackToTop from '../components/BackToTop';
import Button from '../components/Button';
import FadeIn from '../components/FadeIn';
import Footer from '../components/Footer';
import Lightbox from '../components/Lightbox';
import Media, { isVideo, posterOf } from '../components/Media';
import Navbar from '../components/Navbar';
import ToolChip from '../components/ToolChip';
import { getProjectDetails, PROJECTS, yearLabel } from '../data/site';
import NotFoundPage from './NotFoundPage';

function SectionTitle({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-2">
      <span className="font-display font-black leading-[0.85] text-orange-accent" style={{ fontSize: 'clamp(3.25rem, 6.7vw, 96px)' }}>
        {num}
      </span>
      <h2 className="font-display font-medium uppercase text-encre" style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.5rem)' }}>
        {title}
      </h2>
    </div>
  );
}

// Format commun d'un groupe de photos (largeur / hauteur) : la médiane de leurs formats d'origine.
// Côte à côte, toutes les photos prennent ce format (légèrement recadrées si besoin) pour une grille homogène.
function useCommonRatio(images: string[]) {
  const [ratio, setRatio] = useState(16 / 9);
  const key = images.join('|');
  useEffect(() => {
    let alive = true;
    Promise.all(
      images.map((src) =>
        isVideo(src)
          ? Promise.resolve(16 / 9)
          : new Promise<number>((resolve) => {
              const img = new Image();
              img.onload = () => resolve(img.naturalWidth / img.naturalHeight || 16 / 9);
              img.onerror = () => resolve(16 / 9);
              img.src = src;
            }),
      ),
    ).then((ratios) => {
      if (!alive || ratios.length === 0) return;
      const sorted = [...ratios].sort((a, b) => a - b);
      setRatio(sorted[Math.floor((sorted.length - 1) / 2)]);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return ratio;
}

// Photo qui s'ouvre en grand au clic. Seule, elle garde son format d'origine ; dans une grille, elle prend le
// format commun (ratio). Une vidéo se lit sur place, avec ses contrôles (son, plein écran).
function Photo({ src, onOpen, ratio, className = '' }: { src: string; onOpen: (src: string) => void; ratio?: number; className?: string }) {
  if (isVideo(src)) {
    return (
      <div className={`overflow-hidden rounded-[20px] bg-encre md:rounded-[28px] ${className}`} style={ratio ? { aspectRatio: ratio } : undefined}>
        <Media src={src} controls className={`w-full object-contain ${ratio ? 'h-full' : 'aspect-video'}`} />
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={() => onOpen(src)}
      className={`group block w-full cursor-zoom-in overflow-hidden rounded-[20px] md:rounded-[28px] ${className}`}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      <img
        src={src}
        alt=""
        loading="lazy"
        className={`w-full transition-transform duration-500 group-hover:scale-[1.03] ${ratio ? 'h-full object-cover' : 'h-auto'}`}
      />
    </button>
  );
}

function PhotoGrid({ images, onOpen }: { images: string[]; onOpen: (src: string) => void }) {
  const ratio = useCommonRatio(images);
  const single = images.length === 1;
  const cols = single ? '' : images.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2';
  return (
    <div className={`grid items-start gap-3 md:gap-5 ${cols}`}>
      {images.map((src, i) => {
        // avec 5 photos, la 1re prend toute la largeur (et garde son format)
        const wide = images.length === 5 && i === 0;
        return (
          <FadeIn key={src} delay={(i % 3) * 0.06} className={wide ? 'md:col-span-2' : ''}>
            <Photo src={src} onOpen={onOpen} ratio={single || wide ? undefined : ratio} />
          </FadeIn>
        );
      })}
    </div>
  );
}

// Galerie finale : une grille homogène ; 4 photos tiennent sur une seule ligne (les pistes de la parution),
// et des écrans de téléphone (format en hauteur) se rangent par 5
function GalleryGrid({ photos, onOpen }: { photos: string[]; onOpen: (src: string) => void }) {
  const ratio = useCommonRatio(photos);
  const phone = ratio < 0.6;
  const cols = photos.length === 4 ? 'grid-cols-2 md:grid-cols-4' : phone ? 'grid-cols-3 md:grid-cols-5' : 'grid-cols-2 md:grid-cols-3';
  return (
    <div className={`grid items-start gap-3 md:gap-5 ${cols}`}>
      {photos.map((src, i) => (
        <FadeIn key={src} delay={(i % 4) * 0.06}>
          <Photo src={src} onOpen={onOpen} ratio={ratio} />
        </FadeIn>
      ))}
    </div>
  );
}

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const index = PROJECTS.findIndex((p) => p.slug === slug);
  if (index === -1) return <NotFoundPage />;
  // key : rejoue les animations et referme la visionneuse quand on passe au projet suivant
  return <ProjectDetail key={slug} index={index} />;
}

function ProjectDetail({ index }: { index: number }) {
  const project = PROJECTS[index];
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  const d = getProjectDetails(project);
  const gallery = d.gallery ?? [];
  const sections = d.sections ?? [];
  const allPhotos = [
    ...new Set([
      project.images[0],
      ...(d.photos ?? []),
      ...(d.problemImages ?? []),
      ...(d.sectionsIntroImages ?? []),
      ...sections.flatMap((s) => s.images ?? []),
      ...gallery,
    ]),
  ].filter((src) => !isVideo(src)); // la visionneuse ne montre que les photos
  // la galerie apporte de nouvelles photos : celles déjà montrées plus haut n'y sont pas répétées
  const shown = new Set([
    project.images[0],
    ...(d.problemImages ?? []),
    ...(d.sectionsIntroImages ?? []),
    ...sections.flatMap((s) => s.images ?? []),
    ...gallery,
  ]);
  const extraPhotos = (d.photos ?? []).filter((src) => !shown.has(src));
  const [viewer, setViewer] = useState<number | null>(null);
  const open = (src: string) => setViewer(allPhotos.indexOf(src));
  let num = 0;
  const nextNum = () => String(++num).padStart(2, '0');

  return (
    <main style={{ overflowX: 'clip' }}>
      {/* HERO */}
      <section className="bg-hero relative pb-[240px] md:pb-[410px]">
        <Navbar />
        <div className="flex flex-col items-start gap-5 px-5 pt-2 md:gap-7 md:px-12 md:pt-6">
          <FadeIn immediate y={-10}>
            <Link to="/projets" className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/30 md:text-[15px]">
              ← Tous les projets
            </Link>
          </FadeIn>
          <FadeIn immediate delay={0.1} className="flex flex-wrap gap-2">
            {[project.category, project.context, yearLabel(project)].map((tag) => (
              <span key={tag} className="rounded-full border-[1.5px] border-white px-3 py-1.5 text-[13px] font-medium text-white md:px-4 md:py-2 md:text-[15px]">
                {tag}
              </span>
            ))}
            {project.tag && (
              <span className="rounded-full border-[1.5px] border-white bg-white px-3 py-1.5 text-[13px] font-semibold text-orange-accent md:px-4 md:py-2 md:text-[15px]">
                {project.tag}
              </span>
            )}
          </FadeIn>
          <FadeIn immediate delay={0.2} y={40} as="h1">
            <span
              className="block font-display font-black uppercase leading-[0.92] tracking-tight text-white"
              style={{ fontSize: 'clamp(2.6rem, 9vw, 130px)' }}
            >
              {project.title}
            </span>
          </FadeIn>
          <FadeIn immediate delay={0.3}>
            <p className="max-w-[760px] font-light leading-[1.4] text-white" style={{ fontSize: 'clamp(1rem, 1.7vw, 1.5rem)' }}>
              {d.pitch}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* CONTENU */}
      <section className="relative z-10 -mt-10 flow-root rounded-t-[40px] bg-white px-5 pb-32 md:-mt-14 md:rounded-t-[60px] md:px-12 md:pb-44">
        {/* couverture à cheval sur le hero, affichée en entier */}
        <FadeIn immediate delay={0.4} y={40} className="-mt-[150px] md:-mt-[260px]">
          {isVideo(project.images[0]) ? (
            // couverture d'un projet vidéo : juste son image fixe, la vidéo se lit plus bas
            <div className="overflow-hidden rounded-[32px] shadow-[0_30px_60px_-30px_rgba(120,40,0,0.45)] md:rounded-[48px]">
              <img src={project.cover ?? posterOf(project.images[0])} alt={project.title} className="h-auto w-full" />
            </div>
          ) : (
            // une couverture verticale (affiche, parution) ne dépasse pas la hauteur de l'écran
            <button type="button" onClick={() => open(project.images[0])} className="mx-auto block w-fit max-w-full cursor-zoom-in overflow-hidden rounded-[32px] shadow-[0_30px_60px_-30px_rgba(120,40,0,0.45)] md:rounded-[48px]">
              <img src={project.images[0]} alt={project.title} className="h-auto max-h-[85vh] w-auto max-w-full" />
            </button>
          )}
        </FadeIn>

        <div className="mt-16 flex flex-col gap-16 md:mt-24 md:gap-28">
          {/* infos clés + liens */}
          <div className="flex flex-col gap-8 md:gap-12">
            <dl className="grid grid-cols-1 border-encre/10 md:grid-cols-4 md:border-y">
              {[
                ['Rôle', d.role],
                ['Durée', d.duration],
                ['Contexte', d.context],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between border-b border-encre/10 py-3.5 md:flex-col md:items-start md:justify-start md:gap-2.5 md:border-0 md:py-8 md:pr-6">
                  <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-orange-accent md:text-sm">{label}</dt>
                  <dd className="font-display text-lg font-medium text-encre md:text-[26px]">{value}</dd>
                </div>
              ))}
              <div className="flex items-center justify-between border-b border-encre/10 py-3.5 md:flex-col md:items-start md:justify-start md:gap-2.5 md:border-0 md:py-8">
                <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-orange-accent md:text-sm">Outils</dt>
                <dd className="flex flex-wrap justify-end gap-1.5 md:justify-start">
                  {d.tools.map((t) => (
                    <ToolChip key={t} label={t} />
                  ))}
                </dd>
              </div>
            </dl>
            {d.links && d.links.length > 0 && (
              <div className="flex flex-col gap-3 sm:flex-row">
                {d.links.map((l, i) => (
                  <Button key={l.label} href={l.href} variant={i === 0 ? 'orange' : 'contour-orange'}>
                    {l.label}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* le projet / le contexte (absent si le texte est vide) */}
          {d.problem && <div className="flex flex-col gap-8 md:gap-12">
            <FadeIn className="grid gap-4 md:grid-cols-[420px_1fr] md:gap-20">
              <SectionTitle num={nextNum()} title={d.problemTitle ?? 'Le contexte'} />
              <div className="flex flex-col gap-6 md:pt-2">
                <p className="leading-[1.6] text-encre/70" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.3rem)' }}>
                  {d.problem}
                </p>
                {d.team && (
                  <ul className="flex flex-col border-t border-encre/10">
                    {d.team.map((m) => (
                      <li key={m.name} className="flex flex-col gap-0.5 border-b border-encre/10 py-3 md:flex-row md:gap-6">
                        <span className="font-display text-lg font-medium text-encre md:w-[160px] md:shrink-0">{m.name}</span>
                        <span className="text-[15px] text-encre/65 md:text-base">{m.role}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </FadeIn>
            {d.problemImages && <PhotoGrid images={d.problemImages} onOpen={open} />}
          </div>}

          {/* sections regroupées en un seul chapitre (ex. « Le jeu »), chacune en sous-partie */}
          {d.sectionsTitle && sections.length > 0 && (() => {
            const chapter = nextNum();
            return (
              <div className="flex flex-col gap-10 md:gap-16">
                <div className="flex flex-col gap-8 md:gap-12">
                  <FadeIn className="grid gap-4 md:grid-cols-[420px_1fr] md:gap-20">
                    <SectionTitle num={chapter} title={d.sectionsTitle} />
                    {d.sectionsIntro && (
                      <p className="leading-[1.6] text-encre/70 md:pt-2" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.3rem)' }}>
                        {d.sectionsIntro}
                      </p>
                    )}
                  </FadeIn>
                  {d.sectionsIntroImages && <PhotoGrid images={d.sectionsIntroImages} onOpen={open} />}
                </div>
                {sections.map((s, i) => (
                  <div key={s.title} className="flex flex-col gap-6 border-t border-encre/10 pt-8 md:gap-10 md:pt-12">
                    <FadeIn className="grid gap-3 md:grid-cols-[420px_1fr] md:gap-20">
                      <div className="flex flex-col items-start gap-2 md:gap-3">
                        <span className="font-display text-lg font-black text-orange-accent md:text-2xl">
                          {chapter}.{i + 1}
                        </span>
                        <h3 className="font-display font-medium uppercase text-encre" style={{ fontSize: 'clamp(1.25rem, 2.2vw, 2rem)' }}>
                          {s.title}
                        </h3>
                        {s.mine && (
                          <span className="rounded-full bg-orange-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-white">
                            Ma partie
                          </span>
                        )}
                      </div>
                      <p className="leading-[1.6] text-encre/70 md:pt-2" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.3rem)' }}>
                        {s.text}
                      </p>
                    </FadeIn>
                    {s.images && s.images.length > 0 && <PhotoGrid images={s.images} onOpen={open} />}
                  </div>
                ))}
              </div>
            );
          })()}

          {/* sections façon étude de cas, chacune son chapitre */}
          {!d.sectionsTitle && sections.map((s) => (
            <div key={s.title} className="flex flex-col gap-8 md:gap-12">
              <FadeIn className="grid gap-4 md:grid-cols-[420px_1fr] md:gap-20">
                <div className="flex flex-col items-start gap-3">
                  <SectionTitle num={nextNum()} title={s.title} />
                  {s.mine && (
                    <span className="rounded-full bg-orange-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-white">
                      Ma partie
                    </span>
                  )}
                </div>
                <p className="leading-[1.6] text-encre/70 md:pt-2" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.3rem)' }}>
                  {s.text}
                </p>
              </FadeIn>
              {s.images && s.images.length > 0 && <PhotoGrid images={s.images} onOpen={open} />}
            </div>
          ))}

          {/* démarche / ma part */}
          {d.steps.length > 0 && <div className="flex flex-col gap-4 md:gap-12">
            <FadeIn>
              <SectionTitle num={nextNum()} title={d.stepsTitle ?? 'Ma démarche'} />
            </FadeIn>
            <div className="grid gap-4 md:grid-cols-4 md:gap-5">
              {d.steps.map((s, i) => (
                <FadeIn key={s.title} delay={i * 0.08} className="flex flex-col gap-2.5 rounded-[24px] bg-[#FFF1E4] p-5 md:gap-4 md:rounded-[32px] md:p-7">
                  <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-accent font-display text-lg font-medium text-white md:h-12 md:w-12 md:text-[22px]">
                      {i + 1}
                    </span>
                    <h3 className="font-display text-xl font-medium uppercase text-encre md:text-[26px]">{s.title}</h3>
                  </div>
                  <p className="text-[15px] leading-[1.55] text-encre/65 md:text-[17px]">{s.text}</p>
                </FadeIn>
              ))}
            </div>
          </div>}

          {/* galerie intermédiaire (projets sans sections) */}
          {gallery.length > 0 && (
            <div className="flex flex-col gap-3 md:gap-5">
              <PhotoGrid images={gallery} onOpen={open} />
              {d.caption && <p className="text-[13px] text-encre/50 md:text-base">{d.caption}</p>}
            </div>
          )}

          {/* résultat */}
          {d.results && d.results.length > 0 && (
            <div className="flex flex-col gap-4 md:gap-12">
              <FadeIn>
                <SectionTitle num={nextNum()} title="Le résultat" />
              </FadeIn>
              <div className="grid gap-4 md:grid-cols-3 md:gap-5">
                {d.results.map((r, i) => (
                  <FadeIn key={r.label} delay={i * 0.08} className="flex flex-col gap-1 border-t-2 border-orange-accent pt-4 md:gap-2 md:border-t-[3px] md:pt-7">
                    <span className="font-display font-black leading-[0.95] text-orange-accent" style={{ fontSize: 'clamp(3.5rem, 6.7vw, 96px)' }}>
                      {r.value}
                    </span>
                    <span className="text-[15px] leading-[1.5] text-encre/70 md:text-[19px]">{r.label}</span>
                  </FadeIn>
                ))}
              </div>
            </div>
          )}

          {/* ce que j'ai appris */}
          {d.learning && (
            <FadeIn className="flex flex-col gap-3.5 rounded-[28px] bg-[#FFF1E4] p-7 md:gap-6 md:rounded-[40px] md:px-[72px] md:py-16">
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-orange-accent md:text-[15px]">Ce que j'ai appris</span>
              <p className="font-display font-medium leading-[1.3] text-encre" style={{ fontSize: 'clamp(1.375rem, 2.65vw, 2.4rem)' }}>
                « {d.learning} »
              </p>
            </FadeIn>
          )}

          {/* galerie finale : de nouvelles photos, en grille */}
          {/* une seule photo en plus ne fait pas une galerie */}
          {extraPhotos.length > 1 && (
            <div className="flex flex-col gap-4 md:gap-12">
              <FadeIn className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <SectionTitle num={nextNum()} title="Galerie" />
                <span className="text-sm text-encre/50 md:text-base">{extraPhotos.length} photos · clique pour agrandir</span>
              </FadeIn>
              <GalleryGrid photos={extraPhotos} onOpen={open} />
            </div>
          )}
        </div>
      </section>

      {/* PROJET SUIVANT */}
      <section className="bg-hero relative z-20 -mt-10 rounded-t-[40px] px-5 pb-7 pt-16 md:-mt-14 md:rounded-t-[60px] md:px-12 md:pb-10 md:pt-28">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-12">
          <div className="flex flex-1 flex-col items-start gap-5">
            <span className="text-[13px] font-semibold uppercase tracking-[0.1em] text-white/85 md:text-base">
              Projet suivant · {String(((index + 1) % PROJECTS.length) + 1).padStart(2, '0')}
            </span>
            <h2 className="font-display font-black uppercase leading-[1] tracking-tight text-white" style={{ fontSize: 'clamp(2.6rem, 7vw, 96px)' }}>
              {next.title}
            </h2>
            <div className="hidden md:block">
              <Button to={`/projets/${next.slug}`}>Voir le projet</Button>
            </div>
          </div>
          <Link to={`/projets/${next.slug}`} className="block overflow-hidden rounded-[28px] md:w-[520px] md:rounded-[40px]">
            <Media src={next.images[0]} alt={next.title} className="aspect-video w-full object-cover transition-transform duration-500 hover:scale-105" />
          </Link>
          <div className="md:hidden">
            <Button to={`/projets/${next.slug}`} className="w-full">
              Voir le projet
            </Button>
          </div>
        </div>
        <div className="mt-12 md:mt-14">
          <Footer tone="blanc" />
        </div>
      </section>

      <BackToTop />
      <Lightbox photos={allPhotos} index={viewer} onChange={setViewer} />
    </main>
  );
}
