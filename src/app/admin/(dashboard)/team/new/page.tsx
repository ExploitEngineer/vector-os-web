import { createTeamMember } from "@/actions/team";
import { BackLink, PageHeading } from "@/components/admin/PageHeading";
import TeamForm from "@/components/admin/TeamForm";

export default function NewTeamMemberPage() {
  return (
    <>
      <BackLink href="/admin/team" label="Team" />
      <PageHeading title="New Team Member" />
      <TeamForm action={createTeamMember} submitLabel="Create member" />
    </>
  );
}
