import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/features/admin/components/data-table/DataTable";
import { animeColumns } from "@/features/admin/components/AnimeColumns";
import { AnimeService } from "@/modules/anime/services/animeService";

interface AdminAnimePageProps {
  params: Promise<{ adminSegment: string }>;
}

const statusOptions = [
  { label: "Ongoing", value: "Ongoing" },
  { label: "Completed", value: "Completed" },
  { label: "Upcoming", value: "Upcoming" },
];

export default async function AdminAnimePage({ params }: AdminAnimePageProps) {
  const { adminSegment } = await params;
  const animeService = new AnimeService();
  const data = await animeService.getAdminAnimeList();

  const facetedFilters = [
    {
      id: "status",
      title: "Status",
      options: statusOptions,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Anime Catalog</h1>
          <p className="text-muted-foreground mt-1">
            Manage anime titles, descriptions, status, metadata, and media cover assets.
          </p>
        </div>
        <div>
          <Button asChild className="cursor-pointer">
            <Link href={`/${adminSegment}/anime/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Add Anime
            </Link>
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <DataTable
          columns={animeColumns}
          data={data}
          searchColumnId="title"
          searchPlaceholder="Search by title or slug..."
          facetedFilters={facetedFilters}
        />
      </div>
    </div>
  );
}
