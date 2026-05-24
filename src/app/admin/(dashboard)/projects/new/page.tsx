import { createProject } from "@/actions/projects";
import { BackLink, PageHeading } from "@/components/admin/PageHeading";
import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <>
      <BackLink href="/admin/projects" label="Projects" />
      <PageHeading title="New Project" />
      <ProjectForm action={createProject} submitLabel="Create project" />
    </>
  );
}
