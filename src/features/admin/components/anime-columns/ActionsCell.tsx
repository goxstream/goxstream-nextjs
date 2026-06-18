"use client";

import { useParams, useRouter } from "next/navigation";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AdminAnimeRow } from "@/modules/anime/dto/adminAnime";

interface ActionsCellProps {
  row: { original: AdminAnimeRow };
}

export function ActionsCell({ row }: ActionsCellProps) {
  const params = useParams();
  const router = useRouter();
  const adminSegment = params?.adminSegment || "admin";
  const anime = row.original;

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
          onClick={() => router.push(`/anime/${anime.slug}`)}
          className="cursor-pointer"
        >
          <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
          View Public
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/${adminSegment}/anime/${anime.id}/edit`)}
          className="cursor-pointer"
        >
          <Edit className="mr-2 h-4 w-4 text-muted-foreground" />
          Edit Anime
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            if (confirm(`Are you sure you want to delete ${anime.title}?`)) {
              // Future TODO: call server action for deletion
              console.log("Delete ID:", anime.id);
            }
          }}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
