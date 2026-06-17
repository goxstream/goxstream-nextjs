import { Tv } from "lucide-react";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

export default function AdminEpisodesNewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Upload Episode</h1>
        <p className="text-muted-foreground mt-1">Upload video files and attach to an anime title.</p>
      </div>

      <Empty className="border border-dashed border-border bg-muted/20 p-12 rounded-xl">
        <EmptyHeader>
          <EmptyMedia variant="icon" className="bg-muted border border-border text-foreground">
            <Tv className="h-4 w-4" />
          </EmptyMedia>
          <EmptyTitle>Upload Interface</EmptyTitle>
          <EmptyDescription>
            Episode upload and transcoding panel is currently under development.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
