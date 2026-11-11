import { Link } from 'react-router-dom';
import { useIntro } from '../lib/intro';
import LogoMark from './LogoMark';

type LogoProps = {
  color?: 'white' | 'orange';
  // Logo de la nav du hero : c'est là que vient se poser le logo de l'intro
  introTarget?: boolean;
};

export default function Logo({ color = 'white', introTarget = false }: LogoProps) {
  const { landed } = useIntro();
  const text = color === 'white' ? 'text-white' : 'text-orange-accent';
  const hidden = introTarget && !landed;
  return (
    <Link to="/" className={`flex items-center ${text}`} aria-label="Maxens Sevilla — accueil">
      <span data-intro-target={introTarget || undefined} style={{ opacity: hidden ? 0 : 1 }} className="block">
        <LogoMark className="block h-10 w-auto sm:h-11" />
      </span>
    </Link>
  );
}
