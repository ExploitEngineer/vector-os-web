import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .url("Must be a valid URL")
  .or(z.literal(""))
  .optional();

export const teamMemberSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  handle: z.string().trim().min(1, "Handle is required"),
  role: z.string().trim().default(""),
  focus: z.string().trim().default(""),
  tags: z.array(z.string().trim().min(1)).default([]),
  avatar: z
    .string()
    .trim()
    .url("Must be a valid URL")
    .or(z.literal(""))
    .default(""),
  github: z
    .string()
    .trim()
    .url("Must be a valid URL")
    .or(z.literal(""))
    .default(""),
  linkedin: optionalUrl,
  twitter: optionalUrl,
  displayOrder: z.coerce.number().int().default(0),
});

export type TeamMemberInput = z.infer<typeof teamMemberSchema>;
