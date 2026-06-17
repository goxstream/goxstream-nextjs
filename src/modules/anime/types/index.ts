export type Quarter = "Winter" | "Spring" | "Summer" | "Fall";
export type Status = "Ongoing" | "Completed" | "Upcoming";

export interface Anime {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  bannerImage: string;
  synopsis: string;
  genres: string[];
  year: number;
  quarter: Quarter;
  episodeCount: number;
  status: Status;
  rating: number;
  popularity: number;
}
