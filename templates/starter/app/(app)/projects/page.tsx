import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { projects } from "@/lib/data";
import { NewProjectDialog } from "./new-project-dialog";
import { ProjectsTable } from "./projects-table";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <div className="grid gap-8">
      <PageHeader
        title="Projects"
        description="Everything your team is working on."
        actions={<NewProjectDialog />}
      />
      <ProjectsTable projects={projects} />
    </div>
  );
}
