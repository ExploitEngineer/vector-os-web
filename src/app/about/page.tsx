import type { Metadata } from "next";
import AboutSection from "@/components/sections/home/AboutSection";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "About",
  description:
    "Who we are — a collective of engineers building open source low-level tools.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Us"
        lead="THE"
        accent="COLLECTIVE."
        sub="A crew of engineers building open source tools that actually matter."
      />
      <AboutSection />
    </>
  );
}
