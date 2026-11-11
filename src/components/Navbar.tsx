import { ArrowUpRight, FileText, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CONTACT, NAV_LINKS } from '../data/site';
import { lockScroll, scrollToElement } from '../lib/smoothScroll';
import { useActiveSection, useFloatingNav } from '../lib/useNavState';
import Logo from './Logo';

// Lien vers une section de l'accueil : sur l'accueil on glisse jusqu'à elle, ailleurs on y retourne
type SectionLinkProps = { id: string; className: string; style?: CSSProperties; onNavigate?: () => void; children: ReactNode };

function SectionLink({ id, className, style, onNavigate, children }: SectionLinkProps) {
  const { pathname } = useLocation();

  const onClick = (e: MouseEvent) => {
    onNavigate?.();
    if (pathname !== '/') return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    // depuis le menu mobile, on attend qu'il se ferme et débloque le défilement
    window.setTimeout(() => scrollToElement(target), onNavigate ? 80 : 0);
    window.history.replaceState(null, '', `/#${id}`);
  };

  return (
    <Link to={`/#${id}`} onClick={onClick} className={className} style={style}>
      {children}
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const active = useActiveSection();
  const floating = useFloatingNav();

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    return () => lockScroll(false);
  }, [open]);

  const menuButton = (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="flex items-center gap-2 rounded-full bg-orange-accent px-4 py-2 text-white transition-opacity hover:opacity-90 sm:px-5 sm:py-2.5 md:hidden"
      aria-label="Ouvrir le menu"
    >
      <Menu className="h-4 w-4" />
      <span className="hidden text-sm font-medium sm:inline">Menu</span>
    </button>
  );

  const cvButton = (
    <a
      href={CONTACT.cv}
      target="_blank"
      rel="noreferrer"
      className="hidden items-center gap-2 rounded-full bg-orange-accent px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 md:flex"
    >
      <FileText className="h-4 w-4" />
      Mon CV
    </a>
  );

  return (
    <>
      {/* Barre du haut de page, posée sur le hero */}
      <nav className="relative z-20 flex items-center justify-between px-4 py-4 sm:px-6 sm:py-5 md:px-12">
        <Logo introTarget />
        <div className="hidden gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <SectionLink
              key={link.id}
              id={link.id}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors hover:opacity-90 ${
                active === link.id ? 'bg-orange-accent text-white' : 'bg-white text-orange-accent'
              }`}
            >
              {link.label}
            </SectionLink>
          ))}
        </div>
        {/* Sur ordinateur les liens sont visibles : le bouton de droite ouvre le CV ; sur mobile, le menu */}
        {cvButton}
        {menuButton}
      </nav>

      {/* La barre flottante et le menu sont rendus dans <body> : posés dans le hero, ils restaient
          sous les sections suivantes (Projets, Contact), qui ont un z-index plus élevé */}
      {createPortal(
      <>
      {/* Barre flottante : réapparaît dès qu'on remonte, se cache quand on descend */}
      <div
        className={`fixed inset-x-0 top-3 z-40 flex justify-center px-3 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:top-4 ${
          floating ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-[140%] opacity-0'
        }`}
        aria-hidden={!floating}
      >
        <nav className="flex w-full max-w-[860px] items-center justify-between gap-3 rounded-full border border-encre/5 bg-white/80 py-2 pl-5 pr-2 shadow-[0_12px_40px_-16px_rgba(120,40,0,0.35)] backdrop-blur-md">
          <Logo color="orange" />
          <div className="hidden gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <SectionLink
                key={link.id}
                id={link.id}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  active === link.id ? 'bg-orange-accent text-white' : 'text-encre/75 hover:bg-orange-accent/10 hover:text-orange-accent'
                }`}
              >
                {link.label}
              </SectionLink>
            ))}
          </div>
          {cvButton}
          {menuButton}
        </nav>
      </div>

      {/* Menu plein écran, repris de la page 404 */}
      <div
        className={`fixed inset-0 z-50 transition-[visibility] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? 'visible' : 'invisible'
        }`}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`bg-menu absolute right-0 top-0 h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:w-[380px] ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between px-6 py-5">
            <Logo />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30"
              aria-label="Fermer le menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-col gap-2 px-6 pt-4">
            {NAV_LINKS.map((link, i) => (
              <SectionLink
                key={link.id}
                id={link.id}
                onNavigate={() => setOpen(false)}
                className={`rounded-2xl px-6 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-white/20 ${
                  active === link.id ? 'bg-white/25' : 'bg-white/10'
                } ${open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                style={{ transitionDelay: open ? `${150 + i * 60}ms` : '0ms' }}
              >
                {link.label}
              </SectionLink>
            ))}
          </div>
          <div
            className={`absolute bottom-0 left-0 right-0 p-6 transition-opacity duration-500 ${
              open ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDelay: open ? '450ms' : '0ms' }}
          >
            <a
              href={CONTACT.cv}
              target="_blank"
              rel="noreferrer"
              className="mb-3 flex w-full items-center justify-center gap-2 rounded-full border-2 border-white py-4 text-base font-semibold uppercase tracking-widest text-white transition-colors hover:bg-white/10"
            >
              <FileText className="h-5 w-5" />
              Mon CV
            </a>
            <SectionLink
              id="contact"
              onNavigate={() => setOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-white py-4 text-base font-semibold uppercase tracking-widest text-orange-accent transition-transform hover:scale-[1.02]"
            >
              Me contacter
              <ArrowUpRight className="h-5 w-5" />
            </SectionLink>
          </div>
        </div>
      </div>
      </>,
      document.body,
      )}
    </>
  );
}
