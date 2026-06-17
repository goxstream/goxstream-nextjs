import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import type { Anime } from "@/modules/anime/types";

export default function SmallCard({ anime, episode = 1 }: { anime: Anime; episode?: number }) {
  return (
    <Link href={`/anime/${anime.slug}`} className="group relative block overflow-hidden rounded-xl bg-muted/20">
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={anime.bannerImage}
          alt={anime.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
          <div className="rounded-full bg-primary p-3 text-primary-foreground transform scale-75 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
            <Play className="h-6 w-6 fill-current" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
          <div className="w-full bg-white/30 h-1.5 rounded-full overflow-hidden mb-2">
            <div className="bg-primary h-full w-[65%]" />
          </div>
          <p className="text-xs font-heading font-medium text-white/90">Episode {episode}</p>
        </div>
      </div>
      <div className="p-3">
        <h3 className="line-clamp-1 font-heading font-semibold text-sm">{anime.title}</h3>
      </div>
    </Link>
  );
}
