import { FileText, FolderGit2, PencilRuler, Plus, Users } from "lucide-react";
import Link from "next/link";
import DashboardCharts, {
  type MonthPoint,
  type StatusPoint,
} from "@/components/admin/DashboardCharts";
import { PageHeading } from "@/components/admin/PageHeading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllBlogs } from "@/lib/queries/blogs";
import { getAllProjects } from "@/lib/queries/projects";
import { getAllTeam } from "@/lib/queries/team";
import { CAT_COLORS } from "@/lib/theme";

function buildPostsPerMonth(
  blogs: Awaited<ReturnType<typeof getAllBlogs>>,
): MonthPoint[] {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleString("en-US", { month: "short" }),
      posts: 0,
    };
  });
  for (const b of blogs) {
    if (!b.published || !b.publishedAt) continue;
    const d = new Date(b.publishedAt);
    const m = months.find(
      (x) => x.key === `${d.getFullYear()}-${d.getMonth()}`,
    );
    if (m) m.posts += 1;
  }
  return months.map(({ label, posts }) => ({ label, posts }));
}

export default async function AdminDashboardPage() {
  const [projects, blogs, team] = await Promise.all([
    getAllProjects(),
    getAllBlogs(),
    getAllTeam(),
  ]);

  const published = blogs.filter((b) => b.published).length;

  const stats = [
    {
      label: "Projects",
      value: projects.length,
      sub: `${projects.filter((p) => p.featured).length} featured`,
      icon: FolderGit2,
      href: "/admin/projects",
    },
    {
      label: "Published Posts",
      value: published,
      sub: `${blogs.length - published} drafts`,
      icon: FileText,
      href: "/admin/blogs",
    },
    {
      label: "Team Members",
      value: team.length,
      sub: "on the site",
      icon: Users,
      href: "/admin/team",
    },
    {
      label: "Total Stars",
      value: projects.reduce((s, p) => s + p.stars, 0),
      sub: "across projects",
      icon: PencilRuler,
      href: "/admin/projects",
    },
  ];

  const projectsByStatus: StatusPoint[] = [
    {
      status: "Active",
      value: projects.filter((p) => p.status === "active").length,
      fill: "#22ff6e",
    },
    {
      status: "In Dev",
      value: projects.filter((p) => p.status === "coming-soon").length,
      fill: "#00e5ff",
    },
    {
      status: "Classified",
      value: projects.filter((p) => p.status === "classified").length,
      fill: "#ff2d55",
    },
  ];

  const recent = [...blogs]
    .sort(
      (a, b) =>
        (b.publishedAt?.getTime() ?? b.createdAt.getTime()) -
        (a.publishedAt?.getTime() ?? a.createdAt.getTime()),
    )
    .slice(0, 5);

  return (
    <>
      <PageHeading
        title="Dashboard"
        subtitle="Overview of the content powering the public site."
        action={
          <div className="flex gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="active:translate-y-px active:scale-[0.99]"
            >
              <Link href="/admin/projects/new">
                <Plus className="size-3.5" /> Project
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="active:translate-y-px active:scale-[0.99]"
            >
              <Link href="/admin/blogs/new">
                <Plus className="size-3.5" /> Post
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="block animate-[fade-up_0.5s_var(--ease-settle)_both]"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <Card className="gap-0 py-5 transition-all hover:border-primary/30 active:translate-y-px active:scale-[0.99]">
                <CardContent className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      {s.label}
                    </p>
                    <p className="mt-2 font-display text-[40px] leading-none text-foreground">
                      {s.value}
                    </p>
                    <p className="mt-1.5 font-mono text-[10px] text-muted-foreground/70">
                      {s.sub}
                    </p>
                  </div>
                  <span className="flex size-9 items-center justify-center rounded-md border border-border bg-accent text-primary">
                    <Icon className="size-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div
        className="mt-4 animate-[fade-up_0.5s_var(--ease-settle)_both]"
        style={{ animationDelay: "300ms" }}
      >
        <DashboardCharts
          postsPerMonth={buildPostsPerMonth(blogs)}
          projectsByStatus={projectsByStatus}
        />
      </div>

      <Card
        className="mt-4 animate-[fade-up_0.5s_var(--ease-settle)_both]"
        style={{ animationDelay: "360ms" }}
      >
        <CardHeader>
          <CardTitle className="font-mono text-sm uppercase tracking-[0.12em]">
            Recent posts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {recent.length === 0 ? (
            <p className="font-mono text-[12px] text-muted-foreground">
              {"// No posts yet."}
            </p>
          ) : (
            recent.map((b) => (
              <Link
                key={b.id}
                href={`/admin/blogs/${b.id}/edit`}
                className="flex min-h-10 items-center justify-between gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-white/[0.03] active:bg-white/[0.06]"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span
                    className="size-1.5 shrink-0 rounded-full"
                    style={{ background: CAT_COLORS[b.category] }}
                  />
                  <span className="truncate font-mono text-[12px] text-foreground/85">
                    {b.title}
                  </span>
                </span>
                <Badge variant={b.published ? "success" : "muted"}>
                  {b.published ? "Published" : "Draft"}
                </Badge>
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </>
  );
}
