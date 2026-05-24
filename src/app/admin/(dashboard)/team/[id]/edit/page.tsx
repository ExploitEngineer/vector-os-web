import { notFound } from "next/navigation";
import { updateTeamMember } from "@/actions/team";
import { BackLink, PageHeading } from "@/components/admin/PageHeading";
import TeamForm from "@/components/admin/TeamForm";
import { getTeamMemberById } from "@/lib/queries/team";

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = await getTeamMemberById(id);
  if (!member) notFound();

  const action = updateTeamMember.bind(null, member.id);

  return (
    <>
      <BackLink href="/admin/team" label="Team" />
      <PageHeading title="Edit Team Member" subtitle={member.name} />
      <TeamForm action={action} member={member} submitLabel="Save changes" />
    </>
  );
}
