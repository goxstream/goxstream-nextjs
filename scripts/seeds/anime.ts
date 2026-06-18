interface SeedAnime {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  bannerImage: string;
  synopsis: string;
  genres: string[];
  year: number;
  quarter: "Winter" | "Spring" | "Summer" | "Fall";
  episodeCount: number;
  status: "Ongoing" | "Completed" | "Upcoming";
  rating: number;
  popularity: number;
}

const seedAnimeList: SeedAnime[] = [
  {
    id: "1",
    title: "Solo Leveling",
    slug: "solo-leveling",
    coverImage: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx151807-it355ZgzquUd.png",
    bannerImage: "https://placehold.co/1920x600/0f172a/f8fafc?text=Solo+Leveling",
    synopsis: "They say whatever doesn't kill you makes you stronger, but that isn't the case for the world's weakest hunter Sung Jinwoo. After being brutally slaughtered by monsters in a high-ranking dungeon, Jinwoo came back with the System, a program only he could see, that's leveling him up in every way. Now, he's inspired to discover the secrets behind his powers and the dungeon that spawned them.",
    genres: ["Action", "Adventure", "Fantasy"],
    year: 2024,
    quarter: "Winter",
    episodeCount: 12,
    status: "Completed",
    rating: 8.4,
    popularity: 250000,
  },
  {
    id: "2",
    title: "Jujutsu Kaisen Season 2",
    slug: "jujutsu-kaisen-season-2",
    coverImage: "https://cdn.myanimelist.net/images/anime/1792/138022l.jpg",
    bannerImage: "https://placehold.co/1920x600/0f172a/f8fafc?text=Jujutsu+Kaisen+S2",
    synopsis: "The past comes to light when second-year students Satoru Gojo and Suguru Geto are tasked with escorting young Riko Amanai to Master Tengen. But when a non-sorcerer user tries to kill them, their mission to protect the Star Plasma Vessel threatens to turn them into bitter enemies and cement their destinies.",
    genres: ["Action", "Supernatural", "Fantasy"],
    year: 2023,
    quarter: "Summer",
    episodeCount: 23,
    status: "Completed",
    rating: 8.8,
    popularity: 350000,
  },
  {
    id: "3",
    title: "Frieren: Beyond Journey's End",
    slug: "frieren-beyond-journeys-end",
    coverImage: "https://cdn.myanimelist.net/images/anime/1015/138006l.jpg",
    bannerImage: "https://placehold.co/1920x600/0f172a/f8fafc?text=Frieren",
    synopsis: "Elf mage Frieren and her courageous fellow adventurers have defeated the Demon King and brought peace to the land. But Frieren will long outlive the rest of her former party. How will she come to understand what life means to the people around her? Decades after their victory, the funeral of one of her friends confronts Frieren with her own near immortality.",
    genres: ["Adventure", "Drama", "Fantasy", "Slice of Life"],
    year: 2023,
    quarter: "Fall",
    episodeCount: 28,
    status: "Completed",
    rating: 9.1,
    popularity: 300000,
  },
  {
    id: "4",
    title: "Kaiju No. 8",
    slug: "kaiju-no-8",
    coverImage: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx153288-25FBfFJzEQ5O.jpg",
    bannerImage: "https://placehold.co/1920x600/0f172a/f8fafc?text=Kaiju+No.+8",
    synopsis: "In a world plagued by Kaiju, Kafka Hibino works as a monster sweeper. But when a parasitic Kaiju enters his body, Kafka gains the ability to transform into a monster himself. With his newfound powers, Kafka aims to join the Anti-Kaiju Defense Force and keep the promise he made to his childhood friend.",
    genres: ["Action", "Sci-Fi", "Comedy"],
    year: 2024,
    quarter: "Spring",
    episodeCount: 12,
    status: "Ongoing",
    rating: 8.2,
    popularity: 180000,
  },
  {
    id: "5",
    title: "Demon Slayer: Hashira Training Arc",
    slug: "demon-slayer-hashira-training-arc",
    coverImage: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx166240-PBV7zukIHW7V.png",
    bannerImage: "https://placehold.co/1920x600/0f172a/f8fafc?text=Demon+Slayer",
    synopsis: "Tanjiro goes to see the Stone Hashira, Himejima, who intends to prepare him for the battles to come. The training to become a Hashira—a high-ranking member of the Demon Slayer Corps—is intense and demanding. Earning Himejima's approval seems impossible, but Tanjiro won't give up!",
    genres: ["Action", "Supernatural"],
    year: 2024,
    quarter: "Spring",
    episodeCount: 8,
    status: "Completed",
    rating: 8.1,
    popularity: 200000,
  },
  {
    id: "6",
    title: "Mushoku Tensei: Jobless Reincarnation II",
    slug: "mushoku-tensei-jobless-reincarnation-ii",
    coverImage: "https://cdn.myanimelist.net/images/anime/1823/140286l.jpg",
    bannerImage: "https://placehold.co/1920x600/0f172a/f8fafc?text=Mushoku+Tensei",
    synopsis: "Following the devastating events of the previous season, Rudeus Greyrat wanders the north, aiming to make a name for himself in hopes of finding his missing mother. His journey eventually leads him to the Ranoa University of Magic, where he reunites with a familiar face and embarks on a new chapter of his life.",
    genres: ["Adventure", "Drama", "Fantasy", "Isekai"],
    year: 2023,
    quarter: "Summer",
    episodeCount: 12,
    status: "Completed",
    rating: 8.3,
    popularity: 160000,
  },
  {
    id: "7",
    title: "Oshi no Ko",
    slug: "oshi-no-ko",
    coverImage: "https://cdn.myanimelist.net/images/anime/1812/134736l.jpg",
    bannerImage: "https://placehold.co/1920x600/0f172a/f8fafc?text=Oshi+no+Ko",
    synopsis: "When a pregnant young starlet appears in his countryside medical clinic, Dr. Goro is determined to help her deliver safely. But a mysterious figure interferes, and Goro finds himself reborn as the idol's son. Now, he must navigate the dark and treacherous world of the entertainment industry to uncover the truth.",
    genres: ["Drama", "Mystery", "Supernatural"],
    year: 2023,
    quarter: "Spring",
    episodeCount: 11,
    status: "Completed",
    rating: 8.7,
    popularity: 280000,
  },
  {
    id: "8",
    title: "Spy x Family Season 2",
    slug: "spy-x-family-season-2",
    coverImage: "https://cdn.myanimelist.net/images/anime/1666/138136l.jpg",
    bannerImage: "https://placehold.co/1920x600/0f172a/f8fafc?text=Spy+x+Family",
    synopsis: "World peace is at stake, and secret agent Twilight must undergo his most difficult mission yet—pretending to be a family man. Posing as a loving husband and father, he'll infiltrate an elite school to get close to a high-profile politician. He has the perfect cover, except his wife's a deadly assassin and neither knows each other's identity.",
    genres: ["Action", "Comedy"],
    year: 2023,
    quarter: "Fall",
    episodeCount: 12,
    status: "Completed",
    rating: 8.2,
    popularity: 210000,
  },
  {
    id: "9",
    title: "Dandadan",
    slug: "dandadan",
    coverImage: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx171018-60q1B6GK2Ghb.jpg",
    bannerImage: "https://placehold.co/1920x600/0f172a/f8fafc?text=Dandadan",
    synopsis: "Momo Ayase is a high school girl who believes in ghosts but not aliens, while her classmate Okarun believes in aliens but not ghosts. To prove each other wrong, they visit locations associated with both the occult and extraterrestrials, only to discover that both are very real—and incredibly dangerous.",
    genres: ["Action", "Comedy", "Supernatural"],
    year: 2024,
    quarter: "Fall",
    episodeCount: 12,
    status: "Upcoming",
    rating: 0,
    popularity: 150000,
  },
  {
    id: "10",
    title: "Chainsaw Man",
    slug: "chainsaw-man",
    coverImage: "https://cdn.myanimelist.net/images/anime/1806/126216l.jpg",
    bannerImage: "https://placehold.co/1920x600/0f172a/f8fafc?text=Chainsaw+Man",
    synopsis: "Denji's a poor young man who'll do anything for money, even hunting down devils with his pet devil-dog Pochita. He's a simple man with simple dreams, drowning under a mountain of debt. But his sad life gets turned upside down one day when he's betrayed by someone he trusts.",
    genres: ["Action", "Supernatural"],
    year: 2022,
    quarter: "Fall",
    episodeCount: 12,
    status: "Completed",
    rating: 8.5,
    popularity: 400000,
  },
  {
    id: "11",
    title: "Attack on Titan Final Season Part 3",
    slug: "attack-on-titan-final-season-part-3",
    coverImage: "https://cdn.myanimelist.net/images/anime/1759/133549l.jpg",
    bannerImage: "https://placehold.co/1920x600/0f172a/f8fafc?text=Attack+on+Titan",
    synopsis: "Eren activates the Rumbling in an attempt to destroy the world. Countless Titans begin their march, trampling everything in their path. Mikasa, Armin, Reiner, and the remaining members of the Survey Corps set out to stop Eren and save humanity.",
    genres: ["Action", "Drama", "Fantasy", "Suspense"],
    year: 2023,
    quarter: "Spring",
    episodeCount: 2,
    status: "Completed",
    rating: 9.0,
    popularity: 420000,
  },
  {
    id: "12",
    title: "My Hero Academia Season 7",
    slug: "my-hero-academia-season-7",
    coverImage: "https://cdn.myanimelist.net/images/anime/1838/142340l.jpg",
    bannerImage: "https://placehold.co/1920x600/0f172a/f8fafc?text=My+Hero+Academia",
    synopsis: "As the battle between heroes and villains escalates to its breaking point, Star and Stripe, the No. 1 hero of the United States of America, arrives to assist Japan against the looming threat of Tomura Shigaraki and All For One.",
    genres: ["Action", "Adventure", "Fantasy"],
    year: 2024,
    quarter: "Spring",
    episodeCount: 21,
    status: "Ongoing",
    rating: 8.3,
    popularity: 150000,
  },
  {
    id: "13",
    title: "Bocchi the Rock!",
    slug: "bocchi-the-rock",
    coverImage: "https://cdn.myanimelist.net/images/anime/1448/127956l.jpg",
    bannerImage: "https://placehold.co/1920x600/0f172a/f8fafc?text=Bocchi+the+Rock",
    synopsis: "Hitori Gotoh is a high school girl who starts learning to play the guitar because she dreams of being in a band, but she is so socially anxious that she hasn't made a single friend. However, her dream may come true after she meets Nijika Ijichi, who plays drums and is looking for a guitarist.",
    genres: ["Comedy", "Slice of Life", "Music"],
    year: 2022,
    quarter: "Fall",
    episodeCount: 12,
    status: "Completed",
    rating: 8.8,
    popularity: 120000,
  },
  {
    id: "14",
    title: "Bleach: Thousand-Year Blood War",
    slug: "bleach-thousand-year-blood-war",
    coverImage: "https://cdn.myanimelist.net/images/anime/1908/135431l.jpg",
    bannerImage: "https://placehold.co/1920x600/0f172a/f8fafc?text=Bleach+TYBW",
    synopsis: "When a new enemy appears, Ichigo Kurosaki jumps back onto the battlefield with his Zanpakuto to help those in need. Meanwhile, the Soul Society observes a sudden surge in the number of Hollows being destroyed in the World of the Living.",
    genres: ["Action", "Adventure", "Fantasy", "Supernatural"],
    year: 2022,
    quarter: "Fall",
    episodeCount: 13,
    status: "Completed",
    rating: 8.9,
    popularity: 180000,
  },
  {
    id: "15",
    title: "Kaguya-sama: Love is War - Ultra Romantic",
    slug: "kaguya-sama-love-is-war-ultra-romantic",
    coverImage: "https://cdn.myanimelist.net/images/anime/1160/122627l.jpg",
    bannerImage: "https://placehold.co/1920x600/0f172a/f8fafc?text=Kaguya-sama",
    synopsis: "The elite members of Shuchiin Academy's student council continue their competitive game of romantic cat and mouse. Kaguya Shinomiya and Miyuki Shirogane try to force each other to confess their feelings as the end of the school term approaches.",
    genres: ["Comedy", "Romance"],
    year: 2022,
    quarter: "Spring",
    episodeCount: 13,
    status: "Completed",
    rating: 8.9,
    popularity: 230000,
  },
];

// Extract unique genres
const uniqueGenresMap = new Map<string, { id: string; name: string; slug: string }>();
for (const anime of seedAnimeList) {
  for (const genreName of anime.genres) {
    const slug = genreName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const id = `genre-${slug}`;
    if (!uniqueGenresMap.has(slug)) {
      uniqueGenresMap.set(slug, { id, name: genreName, slug });
    }
  }
}

// Generate SQL
let sql = "";

// 1. Genres inserts
sql += `-- Insert Genres\n`;
sql += `INSERT OR IGNORE INTO genres (id, name, slug, created_at, updated_at)\nVALUES\n`;
const genreEntries = Array.from(uniqueGenresMap.values());
sql += genreEntries
  .map(
    (g) =>
      `  ('${g.id}', '${g.name.replace(/'/g, "''")}', '${g.slug}', strftime('%s', 'now'), strftime('%s', 'now'))`
  )
  .join(",\n") + ";\n\n";

// 2. Anime inserts
sql += `-- Insert Anime\n`;
sql += `INSERT OR IGNORE INTO anime (id, title, slug, cover_image, banner_image, synopsis, year, quarter, episode_count, status, rating, popularity, created_at, updated_at)\nVALUES\n`;
sql += seedAnimeList
  .map(
    (a) =>
      `  ('${a.id}', '${a.title.replace(/'/g, "''")}', '${a.slug}', '${a.coverImage}', '${a.bannerImage}', '${a.synopsis.replace(/'/g, "''")}', ${a.year}, '${a.quarter}', ${a.episodeCount}, '${a.status}', ${a.rating}, ${a.popularity}, strftime('%s', 'now'), strftime('%s', 'now'))`
  )
  .join(",\n") + ";\n\n";

// 3. Anime Genres mapping inserts
sql += `-- Insert Anime-Genres Relations\n`;
sql += `INSERT OR IGNORE INTO anime_genres (anime_id, genre_id)\nVALUES\n`;
const relationsEntries: string[] = [];
for (const anime of seedAnimeList) {
  for (const genreName of anime.genres) {
    const slug = genreName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const genreInfo = uniqueGenresMap.get(slug);
    if (genreInfo) {
      relationsEntries.push(`  ('${anime.id}', '${genreInfo.id}')`);
    }
  }
}
sql += relationsEntries.join(",\n") + ";\n";

export const animeSql = sql;
