import PageHeader from "@/components/ui/PageHeader";

export default function BlogHeader() {
  return (
    <>
      {/* full-viewport CRT scanline overlay */}
      <div className="scanlines pointer-events-none fixed inset-0 z-[9999]" />
      <PageHeader
        eyebrow="Knowledge Base"
        lead="FIELD"
        accent="REPORTS."
        sub="Research, updates and deep dives from the Vector OS team."
      />
    </>
  );
}
