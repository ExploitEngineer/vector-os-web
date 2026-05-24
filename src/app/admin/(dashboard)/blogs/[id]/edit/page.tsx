import { notFound } from "next/navigation";
import { updateBlog } from "@/actions/blogs";
import BlogForm from "@/components/admin/BlogForm";
import { BackLink, PageHeading } from "@/components/admin/PageHeading";
import { getBlogById } from "@/lib/queries/blogs";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const blog = await getBlogById(id);
  if (!blog) notFound();

  const action = updateBlog.bind(null, blog.id);

  return (
    <>
      <BackLink href="/admin/blogs" label="Blog Posts" />
      <PageHeading title="Edit Post" subtitle={blog.title} />
      <BlogForm action={action} blog={blog} submitLabel="Save changes" />
    </>
  );
}
