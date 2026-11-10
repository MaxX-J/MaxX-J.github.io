import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StretchedTitle from '../components/StretchedTitle';

// Page 404 d'origine de la direction artistique, avec la tête 3D à la place de la vidéo
export default function NotFoundPage() {
  return (
    <main className="bg-hero relative flex h-[100svh] w-full flex-col overflow-hidden">
      <StretchedTitle text="404" box={{ top: -0.2, height: 1.4, side: 60 }} mobileBox={{ top: -0.2, height: 1.4, side: -40 }} />
      <div className="mask-fade-bottom pointer-events-none absolute inset-0 flex items-center justify-center opacity-80">
        <div className="h-[44vh] w-[clamp(120px,20vw,400px)] rounded-full bg-white md:h-[70vh]" />
      </div>

      <Navbar />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center" style={{ marginTop: 'calc(-6vh - 40px)' }}>
        <img src="/images/tete-3d.webp" alt="" className="h-[min(42svh,360px)] w-auto md:h-[min(60svh,560px)]" />
      </div>

      <div className="relative z-30 mt-auto flex flex-col items-center px-4 pb-8 text-center sm:pb-16">
        <h1 className="mb-3 text-lg font-medium text-white sm:mb-4 sm:text-xl md:text-2xl">
          Oups, cette page n'existe pas !
        </h1>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-orange-accent px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-105 hover:shadow-lg sm:px-8 sm:py-4 sm:text-base"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          Retour à l'accueil
        </Link>
      </div>
    </main>
  );
}
