import * as React from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import Hero from "@/features/home/components/Hero";
import AnimeRail from "@/features/home/components/AnimeRail";
import GenreShowcase from "@/features/home/components/GenreShowcase";
import SmallCard from "@/features/home/components/cards/SmallCard";
import MediumCard from "@/features/home/components/cards/MediumCard";
import { getDb } from "@/db";
import { anime as animeTable } from "@/db/schema";
import type { Anime } from "@/data/dummy-anime";

async function getAnimeData(): Promise<Anime[]> {
  try {
    const db = getDb();
    const list = await db.select().from(animeTable).all();
    
    return list.map((a) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      coverImage: a.coverImage,
      bannerImage: a.bannerImage,
      synopsis: a.synopsis || "",
      genres: a.genres,
      year: a.year || new Date().getFullYear(),
      quarter: a.quarter || "Winter",
      episodeCount: a.episodeCount || 0,
      status: a.status || "Ongoing",
      rating: a.rating || 0,
      popularity: a.popularity || 0,
    }));
  } catch (error) {
    console.warn("Failed to fetch anime from DB, falling back to dummy data:", error);
    const { dummyAnime } = await import("@/data/dummy-anime");
    return dummyAnime;
  }
}

export default async function Home() {
  const allAnime = await getAnimeData();

  const trending = [...allAnime].sort((a, b) => (b.popularity || 0) - (a.popularity || 0)).slice(0, 5);
  const newReleases = allAnime.filter(a => a.year === 2024).slice(0, 5);
  const topRated = [...allAnime].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5);
  const continueWatching = allAnime.slice(0, 5);
  const recommended = allAnime.slice(5, 10);
  const seasonal = allAnime.filter(a => a.year === 2024 && a.quarter === "Winter").slice(0, 5);

  const featured = trending[0] || allAnime[0];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 md:pl-[72px] w-full max-w-full overflow-hidden">
          <div className="w-full max-w-[1920px] mx-auto pb-12">
            {featured && <Hero anime={featured} />}
            
            <AnimeRail title="Continue Watching" small>
              {continueWatching.map((anime) => (
                <SmallCard key={anime.id} anime={anime} episode={Math.floor(Math.random() * 12) + 1} />
              ))}
            </AnimeRail>

            <AnimeRail title="Trending This Week">
              {trending.map((anime) => (
                <MediumCard key={anime.id} anime={anime} />
              ))}
            </AnimeRail>

            <AnimeRail title="New Releases">
              {newReleases.map((anime) => (
                <MediumCard key={anime.id} anime={anime} />
              ))}
            </AnimeRail>

            <GenreShowcase />

            <AnimeRail title="Winter 2024 Anime">
              {seasonal.map((anime) => (
                <MediumCard key={anime.id} anime={anime} />
              ))}
            </AnimeRail>

            <AnimeRail title="Top Rated">
              {topRated.map((anime) => (
                <MediumCard key={anime.id} anime={anime} />
              ))}
            </AnimeRail>

            <AnimeRail title="Recommended For You" small>
              {recommended.map((anime) => (
                <SmallCard key={anime.id} anime={anime} />
              ))}
            </AnimeRail>
            
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}

