import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, ArrowLeft, Star, Calendar, Volume2, Maximize2, SkipForward, SkipBack, Settings, Info, ListVideo } from "lucide-react";
import Footer from "@/components/layout/Footer";
import { AnimeService } from "@/modules/anime/services/animeService";

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
            
            {/* Mock Video Player */}
            <div className="group relative aspect-video w-full overflow-hidden rounded-none md:rounded-2xl bg-black border-y md:border border-white/5 shadow-2xl">
              {/* Background Art / Thumbnail */}
              <Image
                src={anime.bannerImage}
                alt={currentEpisode.title}
                fill
                className="object-cover opacity-60 blur-xs transition-transform duration-700 group-hover:scale-101"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30" />
              
              {/* Center Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center cursor-pointer">
                <div className="rounded-full bg-primary/95 p-5 text-primary-foreground transform scale-100 transition-all duration-300 hover:scale-110 shadow-lg shadow-primary/30 group-hover:scale-105">
                  <Play className="h-10 w-10 fill-current ml-1" />
                </div>
              </div>

              {/* Watermark Logo */}
              <div className="absolute top-4 right-6 text-white/40 font-heading font-black tracking-wider text-sm select-none">
                GOXSTREAM
              </div>
              
              {/* Floating Bottom Controller Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col gap-3 translate-y-1 opacity-90 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                
                {/* Progress Bar */}
                <div className="w-full flex items-center gap-3 cursor-pointer">
                  <div className="h-1 w-full bg-white/20 rounded-full relative overflow-hidden group/bar hover:h-1.5 transition-all">
                    <div className="absolute left-0 top-0 h-full w-[35%] bg-primary rounded-full" />
                    <div className="absolute left-[35%] top-1/2 -translate-y-1/2 h-3 w-3 bg-primary rounded-full opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-xs font-mono text-white/80 select-none">08:24 / 24:00</span>
                </div>

                {/* Media Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Previous Episode Button */}
                    {prevEp ? (
                      <Link 
                        href={`/anime/${slug}/${prevEp}`}
                        className="text-white/80 hover:text-primary transition-colors"
                        title={`Episode ${prevEp}`}
                      >
                        <SkipBack className="h-5 w-5 fill-current" />
                      </Link>
                    ) : (
                      <button className="text-white/20 cursor-not-allowed" disabled>
                        <SkipBack className="h-5 w-5 fill-current" />
                      </button>
                    )}

                    {/* Play Button */}
                    <button className="text-white hover:text-primary transition-colors">
                      <Play className="h-5 w-5 fill-current" />
                    </button>

                    {/* Next Episode Button */}
                    {nextEp ? (
                      <Link 
                        href={`/anime/${slug}/${nextEp}`}
                        className="text-white/80 hover:text-primary transition-colors"
                        title={`Episode ${nextEp}`}
                      >
                        <SkipForward className="h-5 w-5 fill-current" />
                      </Link>
                    ) : (
                      <button className="text-white/20 cursor-not-allowed" disabled>
                        <SkipForward className="h-5 w-5 fill-current" />
                      </button>
                    )}

                    <div className="h-4 w-px bg-white/20" />

                    {/* Volume Button */}
                    <button className="text-white/80 hover:text-primary transition-colors">
                      <Volume2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Settings Button */}
                    <button className="text-white/80 hover:text-primary transition-colors">
                      <Settings className="h-5 w-5" />
                    </button>

                    {/* Fullscreen Button */}
                    <button className="text-white/80 hover:text-primary transition-colors">
                      <Maximize2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

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
