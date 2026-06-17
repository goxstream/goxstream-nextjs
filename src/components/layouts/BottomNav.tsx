"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Tv, Film, Grid, User } from "lucide-react";
import { cn } from "@/lib/utils";

const mobileNavItems = [
  { title: "Home", href: "/", icon: Home },
  { title: "Anime", href: "/anime", icon: Tv },
  { title: "Movies", href: "/movies", icon: Film },
  { title: "Categories", href: "/categories", icon: Grid },
  { title: "Profile", href: "/profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden pb-safe">
      <div className="grid h-full grid-cols-5 items-center justify-items-center">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-full h-full text-muted-foreground transition-colors hover:text-primary",
                isActive && "text-primary font-medium"
              )}
            >
              <Icon className="h-5.5 w-5.5" />
              <span className="text-[10px] font-body tracking-wide">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
