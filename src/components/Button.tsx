import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Variant = 'blanc' | 'orange' | 'contour' | 'contour-orange';

const VARIANTS: Record<Variant, string> = {
  blanc: 'bg-white text-orange-accent hover:shadow-lg',
  orange: 'bg-orange-accent text-white hover:shadow-lg',
  contour: 'border-2 border-white text-white hover:bg-white/10',
  'contour-orange': 'border-2 border-orange-accent text-orange-accent hover:bg-orange-accent/10',
};

type ButtonProps = {
  children: ReactNode;
  variant?: Variant;
  // Lien interne (react-router) ou externe (href)
  to?: string;
  href?: string;
  icon?: ReactNode | false;
  className?: string;
};

export default function Button({ children, variant = 'blanc', to, href, icon, className = '' }: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full font-semibold uppercase tracking-widest whitespace-nowrap
    px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base
    transition-all duration-200 hover:scale-[1.03] ${VARIANTS[variant]} ${className}`;
  const content = (
    <>
      {children}
      {icon !== false && (icon ?? <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" />)}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    );
  }
  const external = href?.startsWith('http');
  return (
    <a href={href} className={classes} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
      {content}
    </a>
  );
}
