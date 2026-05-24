import type { Metadata } from "next";
import BlogGrid from "@/components/sections/blog/BlogGrid";
import BlogHeader from "@/components/sections/blog/BlogHeader";
import { getPublishedBlogs } from "@/lib/queries/blogs";

export const metadata: Metadata = {
  title: "Blog",
  description: "Research, updates and deep dives from the Vector OS team.",
};

export default async function BlogsPage() {
  const posts = await getPublishedBlogs();

  return (
    <>
      <BlogHeader />
      <BlogGrid posts={posts} />
    </>
  );
}
