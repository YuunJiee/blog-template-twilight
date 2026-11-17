import { getSortedProjectsData } from '@/lib/projects';
import { ProjectCard } from '@/components/project-card';
import { PageHeader } from '@/components/page-header';

export const metadata = {
  title: '專案作品集',
  description: '個人開發的作品與專案展示。',
};

export default function ProjectsPage() {
  const projects = getSortedProjectsData();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <PageHeader title="專案作品集" description="做過的作品與 side project。" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
