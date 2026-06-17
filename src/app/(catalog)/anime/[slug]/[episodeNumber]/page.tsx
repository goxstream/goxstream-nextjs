import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, ArrowLeft, Star, Calendar, ListVideo } from "lucide-react";
import Footer from "@/components/layouts/Footer";
import { AnimeService } from "@/modules/anime/services/animeService";
import VideoPlayer from "@/features/watch/components/VideoPlayer";

interface PageProps {
  params: Promise<{
    slug: string;
    episodeNumber: string;
  }>;
}

export default async function WatchPage({ params }: PageProps) {
  const { slug, episodeNumber } = await params;
  const currentEpNum = parseInt(episodeNumber, 10) || 1;
  
  const animeService = new AnimeService();
  const { anime, episodes } = await animeService.getAnimeDetails(slug);
  
  // Find current episode
  const currentEpisode = episodes.find(e => e.episodeNumber === currentEpNum) || episodes[0] || {
    id: "default",
    episodeNumber: currentEpNum,
    title: `Episode ${currentEpNum}`,
    synopsis: `Description for episode ${currentEpNum} of ${anime.title}. In this episode, we follow the characters as they face new obstacles and uncover secrets.`,
    durationSeconds: 1440,
    thumbnailKey: anime.bannerImage,
  };
  
  // Navigation helper info
  const prevEp = currentEpNum > 1 ? currentEpNum - 1 : null;
  const nextEp = currentEpNum < (anime.episodeCount || episodes.length) ? currentEpNum + 1 : null;
  
  return (
    <>
      <div className="relative max-w-7xl mx-auto px-0 md:px-8 py-0 md:py-6 flex flex-col gap-6">
        
        {/* Breadcrumbs / Back button */}
        <div className="hidden md:flex items-center justify-between">
          <Link
            href={`/anime/${slug}`}
            className="inline-flex items-center gap-2 rounded-full bg-card hover:bg-muted border border-border px-4 py-2 text-sm font-heading font-semibold text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Details
          </Link>
          <span className="text-sm font-heading text-muted-foreground">
            Watching <span className="font-bold text-foreground">{anime.title}</span>
          </span>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Column: Video Player & Episode Info */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            
            {/* Video Player */}
            <VideoPlayer
              src="https://files.vidstack.io/sprite-fight/hls/720p/stream.m3u8"
              poster={anime.bannerImage}
              title={`${anime.title} - Episode ${currentEpisode.episodeNumber}`}
            />

            {/* Episode Details Description */}
            <div className="px-4 md:px-0">
              <div className="flex flex-col gap-4 p-6 rounded-2xl border border-border bg-card shadow-sm">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-heading font-bold text-primary tracking-wider uppercase">
                    Episode {currentEpisode.episodeNumber}
                  </span>
                  <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-foreground">
                    {currentEpisode.title}
                  </h1>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-xs font-heading font-medium text-muted-foreground border-b border-border/40 pb-4">
                  <span className="flex items-center gap-1 text-primary">★ {anime.rating}</span>
                  <span>{anime.year}</span>
                  <span>{anime.status}</span>
                  <span className="rounded bg-muted/60 px-2 py-0.5 text-foreground">{anime.quarter}</span>
                </div>
                
                <div className="flex flex-col gap-2">
                  <h3 className="font-heading font-bold text-sm text-foreground">Episode Synopsis</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    {currentEpisode.synopsis}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar Column: Episode Selection List */}
          <div className="lg:col-span-1 flex flex-col gap-4 px-4 md:px-0 pb-8 lg:pb-0">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <ListVideo className="h-5 w-5 text-primary" />
              <h2 className="font-heading font-bold text-lg text-foreground">Episode List</h2>
            </div>
            
            {/* Scrollable playlist container */}
            <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
              {episodes.map((ep) => {
                const isActive = ep.episodeNumber === currentEpNum;
                return (
                  <Link
                    key={ep.id}
                    href={`/anime/${slug}/${ep.episodeNumber}`}
                    className={`group flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                      isActive
                        ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/15"
                        : "border-border bg-card hover:border-primary/30 hover:bg-muted text-foreground"
                    }`}
                  >
                    {/* Tiny Thumbnail */}
                    <div className="relative aspect-video w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={anime.bannerImage}
                        alt={ep.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                      <div className={`absolute inset-0 bg-black/30 flex items-center justify-center ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity`}>
                        <Play className={`h-4 w-4 fill-current ${isActive ? "text-primary" : "text-white"}`} />
                      </div>
                    </div>

                    {/* Text Title details */}
                    <div className="flex flex-col gap-0.5 overflow-hidden">
                      <span className={`text-[10px] font-heading font-bold uppercase tracking-wider ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                        Episode {ep.episodeNumber}
                      </span>
                      <h3 className="line-clamp-1 font-heading font-semibold text-xs leading-snug">
                        {ep.title}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>

      </div>
      <Footer />
    </>
  );
}
