"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Star, Flame, Film } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "../data-table/DataTableColumnHeader";
import type { AdminAnimeRow } from "@/modules/anime/dto/adminAnime";
import { ActionsCell } from "./ActionsCell";

export const animeColumns: ColumnDef<AdminAnimeRow>[] = [
  {
    accessorKey: "coverImage",
    header: "Cover",
    cell: ({ row }) => {
      const coverImage = row.getValue("coverImage") as string;
      return (
        <div className="w-[40px] h-[56px] bg-muted rounded overflow-hidden flex items-center justify-center border shadow-xs">
          {coverImage ? (
            <img
              src={coverImage}
              alt={row.original.title}
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          ) : (
            <Film className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      const title = row.original.title;
      const slug = row.original.slug;
      return (
        <div className="flex flex-col gap-0.5 max-w-[280px]">
          <span className="font-semibold truncate text-foreground" title={title}>
            {title}
          </span>
          <span className="text-xs text-muted-foreground truncate" title={slug}>
            {slug}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      if (!status) return null;
      const colorMap: Record<string, string> = {
        Ongoing: "bg-blue-500/15 text-blue-400 border-blue-500/20 dark:bg-blue-500/10",
        Completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20 dark:bg-emerald-500/10",
        Upcoming: "bg-amber-500/15 text-amber-400 border-amber-500/20 dark:bg-amber-500/10",
      };
      return (
        <Badge variant="outline" className={cn("rounded-md font-medium text-xs py-0.5 px-2", colorMap[status] || "bg-muted text-muted-foreground")}>
          {status}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "genres",
    header: "Genres",
    cell: ({ row }) => {
      const genres = (row.getValue("genres") as string[]) || [];
      const maxDisplay = 3;
      const displayGenres = genres.slice(0, maxDisplay);
      const remaining = genres.length - maxDisplay;
      return (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {displayGenres.map((genre) => (
            <Badge key={genre} variant="secondary" className="text-[10px] py-0 px-1.5 rounded-sm">
              {genre}
            </Badge>
          ))}
          {remaining > 0 && (
            <Badge variant="outline" className="text-[10px] py-0 px-1 rounded-sm text-muted-foreground">
              +{remaining}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "year",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Year" />
    ),
    cell: ({ row }) => {
      const year = row.getValue("year") as number | null;
      return <span className="font-medium text-foreground">{year ?? "-"}</span>;
    },
  },
  {
    accessorKey: "quarter",
    header: "Quarter",
    cell: ({ row }) => {
      const quarter = row.getValue("quarter") as string | null;
      return <span className="capitalize text-muted-foreground">{quarter ?? "-"}</span>;
    },
  },
  {
    accessorKey: "episodeCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Episodes" />
    ),
    cell: ({ row }) => {
      const episodes = row.getValue("episodeCount") as number | null;
      return <span className="font-medium">{episodes ?? "-"}</span>;
    },
  },
  {
    accessorKey: "rating",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rating" />
    ),
    cell: ({ row }) => {
      const rating = row.getValue("rating") as number | null;
      return (
        <div className="flex items-center gap-1 font-medium text-foreground">
          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
          <span>{rating ? rating.toFixed(1) : "-"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "popularity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Popularity" />
    ),
    cell: ({ row }) => {
      const popularity = row.getValue("popularity") as number;
      return (
        <div className="flex items-center gap-1 text-muted-foreground font-medium">
          <Flame className="h-3.5 w-3.5 text-orange-500 fill-orange-500" />
          <span>{popularity.toLocaleString()}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
