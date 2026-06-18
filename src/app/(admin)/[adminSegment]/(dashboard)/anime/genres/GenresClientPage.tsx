"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/features/admin/components/data-table/DataTable";
import { getGenreColumns } from "@/features/admin/components/GenreColumns";
import { GenreActionDialogs } from "@/features/admin/components/GenreActionDialogs";
import type { AdminGenreRow } from "@/modules/anime/dto/adminAnime";

interface GenresClientPageProps {
  data: AdminGenreRow[];
}

export function GenresClientPage({ data }: GenresClientPageProps) {
  const [createOpen, setCreateOpen] = React.useState(false);
  const [renameGenre, setRenameGenre] = React.useState<AdminGenreRow | null>(null);
  const [deleteGenre, setDeleteGenre] = React.useState<AdminGenreRow | null>(null);

  const columns = React.useMemo(
    () => getGenreColumns(setRenameGenre, setDeleteGenre),
    []
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Genres</h1>
          <p className="text-muted-foreground mt-1">
            Manage anime genre tags, classifications, and associations.
          </p>
        </div>
        <div>
          <Button onClick={() => setCreateOpen(true)} className="cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            Add Genre
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <DataTable
          columns={columns}
          data={data}
          searchColumnId="name"
          searchPlaceholder="Search by genre name..."
        />
      </div>

      <GenreActionDialogs
        createOpen={createOpen}
        onCreateOpenChange={setCreateOpen}
        renameGenre={renameGenre}
        onRenameClose={() => setRenameGenre(null)}
        deleteGenre={deleteGenre}
        onDeleteClose={() => setDeleteGenre(null)}
      />
    </div>
  );
}
