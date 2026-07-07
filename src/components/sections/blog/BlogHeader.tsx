import PageHeader from "@/components/ui/PageHeader";

export default function BlogHeader() {
  return (
    <>
      {/* full-viewport CRT scanline overlay (sits below the navbar chrome) */}
      <div className="scanlines pointer-events-none fixed inset-0 z-[900] opacity-70" />
      <PageHeader
        eyebrow="Knowledge Base"
        lead="FIELD"
        accent="REPORTS."
        sub="Research, updates and deep dives from the Vector OS team."
      />
    </>
  );
}
