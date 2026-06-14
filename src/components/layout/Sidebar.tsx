import Link from "next/link";
import { Home, Tv, Film, TrendingUp, Grid } from "lucide-react";

const mainNav = [
  { title: "Home", href: "/", icon: Home },
  { title: "Anime", href: "/anime", icon: Tv },
  { title: "Movies", href: "/movies", icon: Film },
  { title: "Trending", href: "/trending", icon: TrendingUp },
  { title: "Categories", href: "/categories", icon: Grid },
];

export default function Sidebar() {
  return (
    <aside className="group fixed left-0 top-16 z-40 hidden h-[calc(100vh-4rem)] w-[72px] border-r border-border/40 bg-background/95 backdrop-blur transition-[width] duration-300 hover:w-64 md:block overflow-hidden">
      <div className="flex h-full flex-col gap-4 py-6">
        <nav className="flex flex-1 flex-col gap-2">
          <div className="px-3 py-2">
            <h2 className="mb-4 px-2 text-xs uppercase font-heading font-semibold tracking-wider text-muted-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100 whitespace-nowrap">
              Discover
            </h2>
            <div className="space-y-1">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center rounded-xl px-3 py-3 text-sm font-heading font-medium text-foreground/80 transition-all hover:bg-primary/10 hover:text-primary overflow-hidden"
                  title={item.title}
                >
                  <item.icon className="h-6 w-6 shrink-0" />
                  <span className="ml-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 whitespace-nowrap">
                    {item.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
}
