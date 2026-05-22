import type { Metadata } from "next";
import ProjectGrid from "@/components/sections/projects/ProjectGrid";
import PageHeader, { type HeaderStat } from "@/components/ui/PageHeader";
import { PROJECTS } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Open source tools and systems built by the Vector OS team.",
};

const pad = (n: number) => String(n).padStart(2, "0");

const stats: HeaderStat[] = [
  { value: pad(PROJECTS.length), label: "Projects" },
  { value: "38+", label: "Stars" },
  {
    value: pad(PROJECTS.filter((p) => p.status === "active").length),
    label: "Active",
    color: "green",
  },
  {
    value: pad(PROJECTS.filter((p) => p.status === "coming-soon").length),
    label: "In Dev",
    color: "cyan",
  },
];

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="All Projects"
        lead="THE"
        accent="ARSENAL."
        sub="Open source tools, utilities and systems built by Vector OS."
        stats={stats}
      />
      <ProjectGrid columns={3} showFilters pageSize={6} showLoadMore />
    </>
  );
}
