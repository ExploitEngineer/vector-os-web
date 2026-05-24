import Link from "next/link";
import { deleteTeamMember } from "@/actions/team";
import DeleteButton from "@/components/admin/DeleteButton";
import { NewLink, PageHeading } from "@/components/admin/PageHeading";
import { getAllTeam } from "@/lib/queries/team";

export default async function AdminTeamPage() {
  const team = await getAllTeam();

  return (
    <>
      <PageHeading
        title="Team"
        subtitle={`${team.length} members`}
        action={<NewLink href="/admin/team/new" label="+ New member" />}
      />

      {team.length === 0 ? (
        <p className="font-mono text-[12px] text-white/30">
          {"// No team members yet."}
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-white/[0.07]">
          {team.map((m) => (
            <div
              key={m.id}
              className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.05] bg-vos-surface px-5 py-3.5 last:border-b-0"
            >
              <div className="min-w-0">
                <p className="truncate font-mono text-[13px] text-white/85">
                  {m.name}
                </p>
                <p className="truncate font-mono text-[10px] text-white/30">
                  @{m.handle} · {m.role || "—"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={`/admin/team/${m.id}/edit`}
                  className="rounded-md border border-white/[0.12] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/55 transition-colors hover:border-vos-cyan/40 hover:text-white/90"
                >
                  Edit
                </Link>
                <DeleteButton id={m.id} action={deleteTeamMember} />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
