import { z } from "zod";

export const createAnimeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  coverImage: z.string().url("Invalid Cover Image URL"),
  bannerImage: z.string().url("Invalid Banner Image URL"),
  synopsis: z.string().optional().nullable(),
  year: z.number().int().min(1900).max(2100).optional().nullable(),
  quarter: z.enum(["Winter", "Spring", "Summer", "Fall"]).optional().nullable(),
  episodeCount: z.number().int().nonnegative().optional().nullable(),
  status: z.enum(["Ongoing", "Completed", "Upcoming"]).optional().nullable(),
  rating: z.number().min(0).max(10).optional().nullable(),
  popularity: z.number().int().nonnegative().default(0),
  genreIds: z.array(z.string()).default([]),
});
