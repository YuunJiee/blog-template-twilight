import Image from 'next/image';
import Link from 'next/link';
import { FolderGit2 } from 'lucide-react';
import { TagPill } from '@/components/page-header';
import type { ProjectPreview } from '@/lib/projects';

export function ProjectCard({ project }: { project: ProjectPreview }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary">
        {project.image ? (
          <Image
            src={project.image}
            alt={`${project.title} 預覽圖`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="hero-gradient flex h-full w-full items-center justify-center">
            <FolderGit2 className="h-10 w-10 text-white/80" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold transition-colors group-hover:text-link">{project.title}</h3>
        {project.summary && (
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{project.summary}</p>
        )}
        {project.tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
            {project.tags.slice(0, 4).map((tag) => <TagPill key={tag}>{tag}</TagPill>)}
          </div>
        )}
      </div>
    </Link>
  );
}
