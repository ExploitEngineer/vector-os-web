import Link from "next/link";
import { deleteBlog } from "@/actions/blogs";
import DeleteButton from "@/components/admin/DeleteButton";
import { NewLink, PageHeading } from "@/components/admin/PageHeading";
import { getAllBlogs } from "@/lib/queries/blogs";
import { CAT_COLORS } from "@/lib/theme";

export default async function AdminBlogsPage() {
  const blogs = await getAllBlogs();

  return (
    <>
      <PageHeading
        title="Blog Posts"
        subtitle={`${blogs.length} total`}
        action={<NewLink href="/admin/blogs/new" label="+ New post" />}
      />

      {blogs.length === 0 ? (
        <p className="font-mono text-[12px] text-white/30">
          {"// No posts yet."}
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-white/[0.07]">
          {blogs.map((b, i) => (
            <div
              key={b.id}
              className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.05] bg-vos-surface px-5 py-3.5 last:border-b-0 animate-[fade-up_0.5s_var(--ease-settle)_both]"
              style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}
            >
              <div className="min-w-0">
                <p className="truncate font-mono text-[13px] text-white/85">
                  {b.title}
                </p>
                <p className="truncate font-mono text-[10px] text-white/30">
                  /{b.slug}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="font-mono text-[10px] tracking-[0.1em]"
                  style={{ color: CAT_COLORS[b.category] }}
                >
                  {b.category}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] ${
                    b.published
                      ? "bg-vos-green/10 text-vos-green"
                      : "bg-white/[0.05] text-white/40"
                  }`}
                >
                  {b.published ? "Published" : "Draft"}
                </span>
                <Link
                  href={`/admin/blogs/${b.id}/edit`}
                  className="inline-flex min-h-10 items-center justify-center rounded-md border border-white/[0.12] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/55 transition-all hover:border-vos-cyan/40 hover:text-white/90 active:translate-y-px active:scale-[0.99] sm:min-h-0"
                >
                  Edit
                </Link>
                <DeleteButton id={b.id} action={deleteBlog} />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
