import AboutSection from "@/components/sections/home/AboutSection";
import GetInvolved from "@/components/sections/home/GetInvolved";
import Hero from "@/components/sections/home/Hero";
import Mission from "@/components/sections/home/Mission";
import TeamSection from "@/components/sections/home/TeamSection";
import TickerStrip from "@/components/sections/home/TickerStrip";
import ProjectGrid from "@/components/sections/projects/ProjectGrid";
import { getAllProjects } from "@/lib/queries/projects";
import { getAllTeam } from "@/lib/queries/team";
import { getOrgStats } from "@/lib/services/github";

export default async function HomePage() {
  const [projects, members, stats] = await Promise.all([
    getAllProjects(),
    getAllTeam(),
    getOrgStats(),
  ]);

  return (
    <>
      <Hero />
      <Mission />
      <TickerStrip />
      <AboutSection stats={stats ?? undefined} />
      {/* "Our work" — grid only, no filters/load-more */}
      <ProjectGrid
        projects={projects}
        columns={2}
        showFilters={false}
        showLoadMore={false}
      />
      <TeamSection members={members} />
      <GetInvolved />
    </>
  );
}
