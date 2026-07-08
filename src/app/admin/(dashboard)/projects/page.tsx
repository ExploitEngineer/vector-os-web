import Link from "next/link";
import { deleteProject } from "@/actions/projects";
import DeleteButton from "@/components/admin/DeleteButton";
import { NewLink, PageHeading } from "@/components/admin/PageHeading";
import { getAllProjects } from "@/lib/queries/projects";
import { STATUS_CFG } from "@/lib/theme";

export default async function AdminProjectsPage() {
  const projects = await getAllProjects();

  return (
    <>
      <PageHeading
        title="Projects"
        subtitle={`${projects.length} total`}
        action={<NewLink href="/admin/projects/new" label="+ New project" />}
      />

      {projects.length === 0 ? (
        <p className="font-mono text-[12px] text-white/30">
          {"// No projects yet."}
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-white/[0.07]">
          {projects.map((p, i) => {
            const st = STATUS_CFG[p.status];
            return (
              <div
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.05] bg-vos-surface px-5 py-3.5 last:border-b-0 animate-[fade-up_0.5s_var(--ease-settle)_both]"
                style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}
              >
                <div className="min-w-0">
                  <p className="truncate font-mono text-[13px] text-white/85">
                    {p.name}
                    {p.featured ? (
                      <span className="ml-2 font-mono text-[9px] uppercase tracking-[0.12em] text-vos-cyan/70">
                        ★ featured
                      </span>
                    ) : null}
                  </p>
                  <p className="truncate font-mono text-[10px] text-white/30">
                    /{p.slug} · {p.lang || "—"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="font-mono text-[10px] tracking-[0.1em]"
                    style={{ color: st?.color }}
                  >
                    {st?.label ?? p.status}
                  </span>
                  <Link
                    href={`/admin/projects/${p.id}/edit`}
                    className="inline-flex min-h-10 items-center justify-center rounded-md border border-white/[0.12] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/55 transition-all hover:border-vos-cyan/40 hover:text-white/90 active:translate-y-px active:scale-[0.99] sm:min-h-0"
                  >
                    Edit
                  </Link>
                  <DeleteButton id={p.id} action={deleteProject} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
