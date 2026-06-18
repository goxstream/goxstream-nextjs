import { AnimeService } from "@/modules/anime/services/animeService";
import { AnimeForm } from "@/features/admin/components/anime-form";

interface AdminAnimeNewPageProps {
  params: Promise<{ adminSegment: string }>;
}

export default async function AdminAnimeNewPage({ params }: AdminAnimeNewPageProps) {
  const { adminSegment } = await params;
  const animeService = new AnimeService();
  const genres = await animeService.getAdminGenreList();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">New Anime</h1>
        <p className="text-muted-foreground mt-1">Register a new anime title to the catalog.</p>
      </div>

      <AnimeForm genres={genres} adminSegment={adminSegment} />
    </div>
  );
}
