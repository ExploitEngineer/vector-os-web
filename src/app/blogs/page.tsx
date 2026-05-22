import type { Metadata } from "next";
import BlogGrid from "@/components/sections/blog/BlogGrid";
import BlogHeader from "@/components/sections/blog/BlogHeader";

export const metadata: Metadata = {
  title: "Blog",
  description: "Research, updates and deep dives from the Vector OS team.",
};

export default function BlogsPage() {
  return (
    <>
      <BlogHeader />
      <BlogGrid />
    </>
  );
}
