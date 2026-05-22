import type { Metadata } from "next";
import ProjectGrid from "@/components/sections/projects/ProjectGrid";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Projects",
  description: "Open source tools and systems built by the Vector OS team.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Vector OS Projects"
        title="PROJECTS"
        sub="Open source tools and systems built by the team."
      />
      <ProjectGrid columns={3} showFilters pageSize={6} showLoadMore />
    </>
  );
}
