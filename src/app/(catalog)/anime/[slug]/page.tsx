import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Plus, Star, Calendar, Tv, Users, ArrowLeft } from "lucide-react";
import Footer from "@/components/layout/Footer";
import { AnimeService } from "@/modules/anime/services/animeService";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function AnimeDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const animeService = new AnimeService();
  const { anime, episodes } = await animeService.getAnimeDetails(slug);

  return (
    <>
      {/* Banner Section */}
      <div className="relative w-full h-[300px] md:h-[450px]">
        <Image
          src={anime.bannerImage}
          alt={anime.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute top-6 left-6 md:left-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-sm font-heading font-semibold text-white backdrop-blur-md hover:bg-black/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>
      </div>

      {/* Details Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pb-16 -mt-24 md:-mt-32">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Cover Poster & Side Stats */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-muted">
              <Image
                src={anime.coverImage}
                alt={anime.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 25vw"
              />
            </div>
            
            <div className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-4 shadow-sm">
              <div className="flex justify-between items-center pb-2 border-b border-border/40">
                <span className="text-sm text-muted-foreground flex items-center gap-1"><Star className="h-4 w-4 fill-amber-500 text-amber-500" /> Score</span>
                <span className="font-heading font-bold text-lg text-foreground">{anime.rating}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border/40">
                <span className="text-sm text-muted-foreground flex items-center gap-1"><Calendar className="h-4 w-4 text-primary" /> Year</span>
                <span className="font-heading font-medium text-foreground">{anime.year}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border/40">
                <span className="text-sm text-muted-foreground flex items-center gap-1"><Tv className="h-4 w-4 text-primary" /> Status</span>
                <span className="rounded bg-primary/10 px-2.5 py-0.5 text-xs font-heading font-bold text-primary">{anime.status}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center gap-1"><Users className="h-4 w-4 text-primary" /> Popularity</span>
                <span className="font-heading font-medium text-foreground">{anime.popularity.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Title, Genres, Synopsis, Episode List */}
          <div className="lg:col-span-3 flex flex-col gap-8">
            
            {/* Header Information */}
            <div className="flex flex-col gap-4">
              <h1 className="font-heading font-extrabold text-3xl md:text-5xl tracking-tight text-foreground leading-tight">
                {anime.title}
              </h1>
              
              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {anime.genres.map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-heading font-semibold text-primary transition-colors hover:bg-primary/10 cursor-pointer"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Quick Action CTAs */}
              <div className="flex items-center gap-3 pt-3">
                <Link
                  href={`/anime/${anime.slug}/play`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-heading font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 shadow-lg shadow-primary/20"
                >
                  <Play className="h-4 w-4 fill-current" /> Play Episode 1
                </Link>
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-heading font-bold text-foreground transition-colors hover:bg-muted"
                >
                  <Plus className="h-4 w-4" /> Watchlist
                </button>
              </div>
            </div>

            {/* Synopsis */}
            <div className="flex flex-col gap-3">
              <h2 className="font-heading font-bold text-xl text-foreground">Synopsis</h2>
              <p className="font-body text-muted-foreground leading-relaxed text-base md:text-lg whitespace-pre-line">
                {anime.synopsis}
              </p>
            </div>

            {/* Episodes Section */}
            <div className="flex flex-col gap-4 pt-4">
              <h2 className="font-heading font-bold text-2xl text-foreground">Episodes ({episodes.length})</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {episodes.map((ep) => (
                  <Link
                    key={ep.id}
                    href={`/anime/${anime.slug}/play?ep=${ep.episodeNumber}`}
                    className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-all hover:shadow-md"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-muted">
                      <Image
                        src={anime.bannerImage}
                        alt={ep.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 30vw"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                        <div className="rounded-full bg-primary p-2 text-primary-foreground transform scale-75 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                          <Play className="h-5 w-5 fill-current" />
                        </div>
                      </div>
                      <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-2xs font-medium text-white backdrop-blur-sm">
                        24:00
                      </span>
                    </div>
                    <div className="p-4 flex flex-col gap-1.5 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-heading font-bold text-primary">
                          Episode {ep.episodeNumber}
                        </span>
                      </div>
                      <h3 className="line-clamp-1 font-heading font-semibold text-sm group-hover:text-primary transition-colors text-foreground">
                        {ep.title}
                      </h3>
                      <p className="line-clamp-2 font-body text-xs text-muted-foreground leading-normal mt-0.5">
                        {ep.synopsis}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
