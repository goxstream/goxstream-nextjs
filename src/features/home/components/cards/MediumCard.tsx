import Image from "next/image";
import Link from "next/link";
import { Play, Plus } from "lucide-react";
import type { Anime } from "@/data/dummy-anime";

export default function MediumCard({ anime }: { anime: Anime }) {
  return (
    <Link href={`/anime/${anime.slug}`} className="group relative flex w-full flex-col gap-2">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-muted/20">
        <Image
          src={anime.coverImage}
          alt={anime.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 33vw, (max-width: 1200px) 20vw, 15vw"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col gap-3 translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
            <div className="flex items-center gap-2">
              <span className="rounded bg-primary/20 px-1.5 py-0.5 text-xs font-heading font-bold text-primary backdrop-blur-md">
                ★ {anime.rating}
              </span>
              <span className="text-xs font-heading font-medium text-white/80">{anime.year}</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex-1 rounded-md bg-primary py-1.5 flex items-center justify-center gap-1 text-xs font-heading font-bold text-primary-foreground hover:bg-primary/90 transition-colors">
                <Play className="h-3.5 w-3.5 fill-current" /> Play
              </button>
              <button className="rounded-md bg-white/20 p-1.5 backdrop-blur-md hover:bg-white/30 transition-colors">
                <Plus className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="px-1">
        <h3 className="line-clamp-2 font-heading font-semibold text-sm leading-tight group-hover:text-primary transition-colors">
          {anime.title}
        </h3>
      </div>
    </Link>
  );
}
