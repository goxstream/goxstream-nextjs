import { Video } from "lucide-react";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

export default function AdminMediaSourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Video Sources</h1>
        <p className="text-muted-foreground mt-1">Manage video qualities, formats, and source files.</p>
      </div>

      <Empty className="border border-dashed border-border bg-muted/20 p-12 rounded-xl">
        <EmptyHeader>
          <EmptyMedia variant="icon" className="bg-muted border border-border text-foreground">
            <Video className="h-4 w-4" />
          </EmptyMedia>
          <EmptyTitle>Video Source Manager</EmptyTitle>
          <EmptyDescription>
            Video source management interface is currently under development.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
