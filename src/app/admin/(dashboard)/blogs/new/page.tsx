import { createBlog } from "@/actions/blogs";
import BlogForm from "@/components/admin/BlogForm";
import { BackLink, PageHeading } from "@/components/admin/PageHeading";

export default function NewBlogPage() {
  return (
    <>
      <BackLink href="/admin/blogs" label="Blog Posts" />
      <PageHeading title="New Post" />
      <BlogForm action={createBlog} submitLabel="Create post" />
    </>
  );
}
