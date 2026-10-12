import { PageHeader } from "@nukta-solutions/ui";
import { projects } from "@/lib/data";
import { NewProjectDialog } from "./new-project-dialog";
import { ProjectsTable } from "./projects-table";

export function ProjectsPage() {
  return (
    <div className="grid gap-8">
      <title>Projects · Nukta Starter</title>
      <PageHeader
        title="Projects"
        description="Everything your team is working on."
        actions={<NewProjectDialog />}
      />
      <ProjectsTable projects={projects} />
    </div>
  );
}
