import { getTrendingAnime } from "@/data/dummy-anime";
import FeaturedCard from "./cards/FeaturedCard";

export default function Hero() {
  const trending = getTrendingAnime();
  const featured = trending[0];

  if (!featured) return null;

  return (
    <section className="relative w-full pt-4 pb-8 md:pt-8 md:pb-12 px-4 md:px-8">
      <FeaturedCard anime={featured} />
    </section>
  );
}
