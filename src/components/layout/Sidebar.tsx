"use client";

import Link from "next/link";
import { Home, Tv, Film, TrendingUp, Grid } from "lucide-react";
import { motion } from "motion/react";

const mainNav = [
  { title: "Home", href: "/", icon: Home },
  { title: "Anime", href: "/anime", icon: Tv },
  { title: "Movies", href: "/movies", icon: Film },
  { title: "Trending", href: "/trending", icon: TrendingUp },
  { title: "Categories", href: "/categories", icon: Grid },
];

const sidebarVariants = {
  collapsed: {
    width: 72,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
  expanded: {
    width: 256,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
} as const;

const textVariants = {
  collapsed: {
    opacity: 0,
    x: -10,
    transition: {
      duration: 0.15,
      ease: "easeInOut",
    },
  },
  expanded: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
} as const;

export default function Sidebar() {
  return (
    <motion.aside
      initial="collapsed"
      whileHover="expanded"
      variants={sidebarVariants}
      className="fixed left-0 top-16 z-40 hidden h-[calc(100vh-4rem)] border-r border-border/40 bg-background/95 backdrop-blur md:block overflow-hidden w-[72px]"
    >
      <div className="flex h-full flex-col gap-4 py-6">
        <nav className="flex flex-1 flex-col gap-2">
          <div className="px-3 py-2">
            <motion.h2
              variants={textVariants}
              className="mb-4 px-2 text-xs uppercase font-heading font-semibold tracking-wider text-muted-foreground whitespace-nowrap"
            >
              Discover
            </motion.h2>
            <div className="space-y-1">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center rounded-xl px-3 py-3 text-sm font-heading font-medium text-foreground/80 transition-all hover:bg-primary/10 hover:text-primary overflow-hidden"
                  title={item.title}
                >
                  <item.icon className="h-6 w-6 shrink-0 transition-transform duration-200 group-hover:scale-115" />
                  <motion.span
                    variants={textVariants}
                    className="ml-4 whitespace-nowrap"
                  >
                    {item.title}
                  </motion.span>
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </motion.aside>
  );
}
