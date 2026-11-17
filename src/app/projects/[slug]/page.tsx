import { getProjectData, getAllProjectSlugs, getSortedProjectsData } from '@/lib/projects';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { TagPill } from '@/components/page-header';

export async function generateStaticParams() {
  return getAllProjectSlugs();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getSortedProjectsData().find((p) => p.slug === slug);
  if (!project) return { title: 'Project Not Found' };
  return { title: project.title, description: project.summary };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let projectData;
  try {
    projectData = await getProjectData(slug);
  } catch {
    notFound();
  }

  const linkBtn =
    'inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium transition-colors hover:border-accent/60 hover:text-link';

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <Link href="/projects" className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-link">
        <ArrowLeft className="h-4 w-4" /> 所有專案
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl font-bold leading-tight md:text-4xl">{projectData.title}</h1>
        {projectData.summary && (
          <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{projectData.summary}</p>
        )}
        {projectData.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {projectData.tags.map((tag) => <TagPill key={tag}>{tag}</TagPill>)}
          </div>
        )}
        {(projectData.githubUrl || projectData.liveUrl) && (
          <div className="mt-5 flex flex-wrap gap-2">
            {projectData.githubUrl && (
              <a href={projectData.githubUrl} target="_blank" rel="noopener noreferrer" className={linkBtn}>
                <Github className="h-4 w-4" /> GitHub
              </a>
            )}
            {projectData.liveUrl && (
              <a href={projectData.liveUrl} target="_blank" rel="noopener noreferrer" className={linkBtn}>
                <ExternalLink className="h-4 w-4" /> Demo
              </a>
            )}
          </div>
        )}
      </header>

      {projectData.image && (
        <div className="relative mb-10 aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border shadow-md">
          <Image
            src={projectData.image}
            alt={`${projectData.title} 預覽圖`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>
      )}

      <article className="manual-prose" dangerouslySetInnerHTML={{ __html: projectData.contentHtml }} />
    </div>
  );
}
