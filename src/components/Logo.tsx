import { Link } from 'react-router-dom';

export default function Logo({ color = 'white' }: { color?: 'white' | 'orange' }) {
  const dot = color === 'white' ? 'bg-white' : 'bg-orange-accent';
  const text = color === 'white' ? 'text-white' : 'text-orange-accent';
  return (
    <Link to="/" className="flex items-center gap-2" aria-label="Accueil">
      <span className="grid grid-cols-2 gap-0.5">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`h-2.5 w-2.5 rounded-full sm:h-3 sm:w-3 ${dot}`} />
        ))}
      </span>
      <span className={`ml-1 text-lg font-bold sm:text-xl ${text}`}>Maxens</span>
    </Link>
  );
}
