import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .url("Must be a valid URL")
  .or(z.literal(""))
  .optional();

export const bootLineSchema = z.object({
  text: z.string(),
  color: z.string(),
});

export const projectSchema = z.object({
  slug: z.string().trim().optional(),
  name: z.string().trim().min(1, "Name is required"),
  short: z.string().trim().default(""),
  lang: z.string().trim().default(""),
  stars: z.coerce.number().int().min(0).default(0),
  status: z.enum(["active", "coming-soon", "classified"]).default("active"),
  tags: z.array(z.string().trim().min(1)).default([]),
  scrollSpeed: z.string().trim().default("8s"),
  bootlog: z.array(bootLineSchema).default([]),
  url: z
    .string()
    .trim()
    .url("Must be a valid URL")
    .or(z.literal(""))
    .default(""),
  githubUrl: optionalUrl,
  imageUrl: optionalUrl,
  featured: z.boolean().default(false),
  displayOrder: z.coerce.number().int().default(0),
});

export type ProjectInput = z.infer<typeof projectSchema>;
