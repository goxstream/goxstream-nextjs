import Link from "next/link";
import { Swords, Compass, Wand2, Heart, Laugh } from "lucide-react";

const genres = [
  { name: "Action", icon: Swords, color: "bg-red-500/10 text-red-500", border: "border-red-500/20" },
  { name: "Adventure", icon: Compass, color: "bg-green-500/10 text-green-500", border: "border-green-500/20" },
  { name: "Fantasy", icon: Wand2, color: "bg-purple-500/10 text-purple-500", border: "border-purple-500/20" },
  { name: "Romance", icon: Heart, color: "bg-pink-500/10 text-pink-500", border: "border-pink-500/20" },
  { name: "Comedy", icon: Laugh, color: "bg-yellow-500/10 text-yellow-500", border: "border-yellow-500/20" },
];

export default function GenreShowcase() {
  return (
    <section className="py-8 px-4 md:px-8">
      <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-6">
        Explore Genres
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {genres.map((genre) => (
          <Link
            key={genre.name}
            href={`/genres/${genre.name.toLowerCase()}`}
            className={`flex flex-col items-center justify-center gap-3 rounded-2xl border ${genre.border} bg-muted/20 p-6 transition-all duration-300 hover:scale-105 hover:bg-muted/40`}
          >
            <div className={`rounded-full p-4 ${genre.color}`}>
              <genre.icon className="h-8 w-8" />
            </div>
            <span className="font-heading font-semibold">{genre.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
