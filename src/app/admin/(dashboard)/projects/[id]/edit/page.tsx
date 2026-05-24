import { notFound } from "next/navigation";
import { updateProject } from "@/actions/projects";
import { BackLink, PageHeading } from "@/components/admin/PageHeading";
import ProjectForm from "@/components/admin/ProjectForm";
import { getProjectById } from "@/lib/queries/projects";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  const action = updateProject.bind(null, project.id);

  return (
    <>
      <BackLink href="/admin/projects" label="Projects" />
      <PageHeading title="Edit Project" subtitle={project.name} />
      <ProjectForm
        action={action}
        project={project}
        submitLabel="Save changes"
      />
    </>
  );
}
