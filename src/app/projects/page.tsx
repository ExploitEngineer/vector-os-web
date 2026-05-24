import type { Metadata } from "next";
import ProjectGrid from "@/components/sections/projects/ProjectGrid";
import PageHeader, { type HeaderStat } from "@/components/ui/PageHeader";
import { getAllProjects } from "@/lib/queries/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Open source tools and systems built by the Vector OS team.",
};

const pad = (n: number) => String(n).padStart(2, "0");

export default async function ProjectsPage() {
  const projects = await getAllProjects();
  const totalStars = projects.reduce((sum, p) => sum + p.stars, 0);

  const stats: HeaderStat[] = [
    { value: pad(projects.length), label: "Projects" },
    { value: `${totalStars}`, label: "Stars" },
    {
      value: pad(projects.filter((p) => p.status === "active").length),
      label: "Active",
      color: "green",
    },
    {
      value: pad(projects.filter((p) => p.status === "coming-soon").length),
      label: "In Dev",
      color: "cyan",
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="All Projects"
        lead="THE"
        accent="ARSENAL."
        sub="Open source tools, utilities and systems built by Vector OS."
        stats={stats}
      />
      <ProjectGrid
        projects={projects}
        columns={3}
        showFilters
        pageSize={6}
        showLoadMore
      />
    </>
  );
}
