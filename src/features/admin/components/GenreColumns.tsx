"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "./data-table/DataTableColumnHeader";
import type { AdminGenreRow } from "@/modules/anime/dto/adminAnime";

export const getGenreColumns = (
  onRename: (genre: AdminGenreRow) => void,
  onDelete: (genre: AdminGenreRow) => void
): ColumnDef<AdminGenreRow>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Genre Name" />
    ),
    cell: ({ row }) => {
      return (
        <span className="font-semibold text-foreground">
          {row.original.name}
        </span>
      );
    },
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => {
      return (
        <span className="text-xs text-muted-foreground font-mono">
          {row.original.slug}
        </span>
      );
    },
  },
  {
    accessorKey: "animeCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Anime Count" />
    ),
    cell: ({ row }) => {
      return (
        <span className="font-medium text-foreground">
          {row.original.animeCount}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const genre = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem
              onClick={() => onRename(genre)}
              className="cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4 text-muted-foreground" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(genre)}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
