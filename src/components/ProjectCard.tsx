import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { yearLabel } from '../data/site';
import type { Project } from '../data/site';
import Media from './Media';
import ToolChip from './ToolChip';

// Carte de la grille de la page Projets
export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link to={`/projets/${project.slug}`} className="group flex flex-col gap-4">
      <div className="overflow-hidden rounded-[28px] md:rounded-[32px]">
        <Media
          src={project.images[0]}
          alt={project.title}
          className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex items-center justify-between">
        <ToolChip label={project.category} />
        <span className="text-sm font-medium text-encre/50">{yearLabel(project)}</span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-display text-xl font-medium uppercase text-encre md:text-[26px]">{project.title}</h3>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-accent text-white transition-transform group-hover:rotate-45">
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </div>
    </Link>
  );
}
