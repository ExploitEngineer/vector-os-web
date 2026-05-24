import { z } from "zod";

export const blogSchema = z.object({
  slug: z.string().trim().optional(),
  title: z.string().trim().min(1, "Title is required"),
  excerpt: z.string().trim().default(""),
  content: z.string().default(""),
  category: z.enum(["LINUX", "SECURITY", "TOOLS"]).default("TOOLS"),
  featuredImage: z
    .string()
    .trim()
    .url("Must be a valid URL")
    .or(z.literal(""))
    .optional(),
  published: z.boolean().default(false),
  displayOrder: z.coerce.number().int().default(0),
});

export type BlogInput = z.infer<typeof blogSchema>;
