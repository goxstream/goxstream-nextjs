import * as React from "react";
import Footer from "@/components/layout/Footer";
import Hero from "@/features/home/components/Hero";
import AnimeRail from "@/features/home/components/AnimeRail";
import GenreShowcase from "@/features/home/components/GenreShowcase";
import SmallCard from "@/features/home/components/cards/SmallCard";
import MediumCard from "@/features/home/components/cards/MediumCard";
import { AnimeService } from "@/modules/anime/services/animeService";

export default async function Home() {
  const animeService = new AnimeService();
  const {
    trending,
    newReleases,
    topRated,
    continueWatching,
    recommended,
    seasonal,
    featured,
  } = await animeService.getHomepageData();

  return (
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
  );
}
