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
