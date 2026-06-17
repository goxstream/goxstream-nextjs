import Image from "next/image";
import Link from "next/link";
import { Play, Info } from "lucide-react";
import type { Anime } from "@/modules/anime/types";

export default function FeaturedCard({ anime }: { anime: Anime }) {
  return (
    <div className="group relative w-full overflow-hidden rounded-2xl bg-muted/20 aspect-[21/9] md:aspect-[2.5/1]">
      <Image
        src={anime.bannerImage}
        alt={anime.title}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        priority
      />
      
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      
      <div className="absolute bottom-0 left-0 flex h-full w-full flex-col justify-end p-6 md:w-2/3 md:p-12 lg:w-1/2">
        <div className="flex flex-col gap-4 translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {anime.title}
          </h2>
          
          <div className="flex items-center gap-3 text-sm font-heading font-medium text-muted-foreground">
            <span className="flex items-center gap-1 text-primary">
              ★ {anime.rating}
            </span>
            <span>{anime.year}</span>
            <span>{anime.episodeCount} Episodes</span>
            <span className="rounded bg-muted/50 px-2 py-0.5 text-xs text-foreground backdrop-blur-sm">
              {anime.status}
            </span>
          </div>
          
          <p className="line-clamp-2 text-sm font-body text-muted-foreground/80 md:line-clamp-3 md:text-base">
            {anime.synopsis}
          </p>
          
          <div className="flex items-center gap-3 pt-2">
            <Link 
              href={`/anime/${anime.slug}/${anime.episodeCount || 1}`}
              className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 font-heading font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105"
            >
              <Play className="h-4 w-4 fill-current" /> Play Now
            </Link>
            <Link 
              href={`/anime/${anime.slug}`}
              className="flex items-center justify-center gap-2 rounded-full bg-white/10 px-6 py-2.5 font-heading font-bold text-foreground backdrop-blur-md transition-all hover:bg-white/20"
            >
              <Info className="h-4 w-4" /> More Info
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
