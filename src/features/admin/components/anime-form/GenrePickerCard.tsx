import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import type { AdminGenreRow } from "@/modules/anime/dto/adminAnime";

interface GenrePickerCardProps {
  genres: AdminGenreRow[];
  selectedGenreIds: string[];
  loading: boolean;
  toggleGenre: (genreId: string) => void;
}

export function GenrePickerCard({
  genres,
  selectedGenreIds,
  loading,
  toggleGenre,
}: GenrePickerCardProps) {
  return (
    <Card className="border border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Genres</CardTitle>
        <CardDescription>
          Select the associated genres for this anime title.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {genres.length === 0 ? (
          <div className="text-sm text-muted-foreground py-2">
            No genres found. Go to genres page to register tags first.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {genres.map((genre) => {
              const isChecked = selectedGenreIds.includes(genre.id);
              return (
                <div
                  key={genre.id}
                  onClick={() => !loading && toggleGenre(genre.id)}
                  className={`flex items-center space-x-2 border rounded-lg p-3 transition-all select-none cursor-pointer ${
                    isChecked
                      ? "bg-accent/40 border-accent font-medium text-foreground"
                      : "bg-muted/10 border-border text-muted-foreground hover:bg-muted/20"
                  }`}
                >
                  <Checkbox
                    id={genre.id}
                    checked={isChecked}
                    onCheckedChange={() => !loading && toggleGenre(genre.id)}
                    disabled={loading}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Label
                    htmlFor={genre.id}
                    className="text-sm font-normal cursor-pointer flex-grow text-left"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {genre.name}
                  </Label>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
