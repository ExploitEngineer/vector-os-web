import AboutSection from "@/components/sections/home/AboutSection";
import GetInvolved from "@/components/sections/home/GetInvolved";
import Hero from "@/components/sections/home/Hero";
import Mission from "@/components/sections/home/Mission";
import TeamSection from "@/components/sections/home/TeamSection";
import TickerStrip from "@/components/sections/home/TickerStrip";
import ProjectGrid from "@/components/sections/projects/ProjectGrid";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Mission />
      <TickerStrip />
      <AboutSection />
      {/* "Our work" — grid only, no filters/load-more */}
      <ProjectGrid columns={2} showFilters={false} showLoadMore={false} />
      <TeamSection />
      <GetInvolved />
    </>
  );
}
