import FeaturedCard from "./cards/FeaturedCard";
import type { Anime } from "@/data/dummy-anime";

export default function Hero({ anime }: { anime: Anime }) {
  if (!anime) return null;

  return (
    <section className="relative w-full pt-4 pb-8 md:pt-8 md:pb-12 px-4 md:px-8">
      <FeaturedCard anime={anime} />
    </section>
  );
}
