import { Film } from "lucide-react";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

export default function AdminAnimePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Anime Catalog</h1>
        <p className="text-muted-foreground mt-1">Manage anime titles, descriptions, and cover assets.</p>
      </div>
      
      <Empty className="border border-dashed border-border bg-muted/20 p-12 rounded-xl">
        <EmptyHeader>
          <EmptyMedia variant="icon" className="bg-muted border border-border text-foreground">
            <Film className="h-4 w-4" />
          </EmptyMedia>
          <EmptyTitle>No Anime Loaded</EmptyTitle>
          <EmptyDescription>
            Anime Catalog Management Interface is currently under development.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}

