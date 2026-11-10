import { scrollToTop } from '../lib/smoothScroll';
import Logo from './Logo';

export default function Footer({ tone = 'encre' }: { tone?: 'encre' | 'blanc' }) {
  const onWhite = tone === 'encre';
  return (
    <footer
      className={`flex w-full flex-col items-center gap-3 border-t pt-6 text-sm md:flex-row md:justify-between md:pt-7 ${
        onWhite ? 'border-encre/15 text-encre/60' : 'border-white/35 text-white/80'
      }`}
    >
      <Logo color={onWhite ? 'orange' : 'white'} />
      <p>© {new Date().getFullYear()} Maxens Sevilla — Portfolio</p>
      <a
        href="#top"
        onClick={(e) => {
          e.preventDefault();
          scrollToTop();
        }}
        className={`hidden font-medium md:inline ${onWhite ? 'text-orange-accent' : 'text-white'}`}
      >
        Retour en haut ↑
      </a>
    </footer>
  );
}
