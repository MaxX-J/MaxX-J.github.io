import Button from '../components/Button';
import FadeIn from '../components/FadeIn';
import FloatingHead from '../components/FloatingHead';
import Magnet from '../components/Magnet';
import Navbar from '../components/Navbar';
import StretchedTitle from '../components/StretchedTitle';

export default function HeroSection() {
  return (
    <section className="bg-hero relative flex h-[100svh] min-h-[620px] flex-col overflow-hidden" style={{ overflowX: 'clip' }}>
      <FadeIn immediate delay={0.15} y={40} className="absolute inset-0">
        <StretchedTitle text="Maxens" box={{ top: 0.122, height: 0.8, side: 24 }} mobileBox={{ top: 0.178, height: 0.569, side: 8 }} />
      </FadeIn>

      <FadeIn immediate delay={0} y={-20} className="relative z-20">
        <Navbar />
      </FadeIn>

      {/* Tête 3D au centre, qui suit la souris */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        <FadeIn immediate delay={0.6} y={30} className="-mt-[30px] md:mt-0">
          <Magnet padding={150} strength={3} className="pointer-events-auto">
            <FloatingHead
              src="/images/tete-3d.webp"
              alt="Portrait 3D de Maxens"
              className="h-[min(43svh,360px)] w-auto md:h-[min(72svh,660px)]"
            />
          </Magnet>
        </FadeIn>
      </div>

      <div className="relative z-20 mt-auto flex flex-col items-center gap-4 px-4 pb-8 text-center sm:pb-10 md:flex-row md:items-end md:justify-between md:px-12 md:pb-12 md:text-left">
        <FadeIn immediate delay={0.35} y={20} className="flex flex-col items-center gap-4 md:items-start">
          <span className="flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-2 text-xs font-medium text-white sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-white" />
            Disponible pour un stage
          </span>
          <p
            className="max-w-[300px] font-light uppercase leading-[1.3] tracking-[0.02em] text-white md:max-w-[340px]"
            style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.375rem)' }}
          >
            Designer UI/UX, développeur web &amp; créateur 3D sous Unity
          </p>
        </FadeIn>
        <FadeIn immediate delay={0.5} y={20}>
          <Button to="/#contact">Me contacter</Button>
        </FadeIn>
      </div>
    </section>
  );
}
