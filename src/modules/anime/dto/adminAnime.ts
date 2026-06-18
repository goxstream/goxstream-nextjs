import { z } from "zod";
import { createAnimeSchema } from "../schemas/createAnimeSchema";

export interface AdminAnimeRow {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  status: "Ongoing" | "Completed" | "Upcoming" | null;
  genres: string[];
  year: number | null;
  quarter: "Winter" | "Spring" | "Summer" | "Fall" | null;
  episodeCount: number | null;
  rating: number | null;
  popularity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminGenreRow {
  id: string;
  name: string;
  slug: string;
  animeCount: number;
}

export type CreateAnimeInput = z.infer<typeof createAnimeSchema>;

