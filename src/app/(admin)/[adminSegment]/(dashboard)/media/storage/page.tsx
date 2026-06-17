import { Database } from "lucide-react";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

export default function AdminMediaStoragePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Storage (R2)</h1>
        <p className="text-muted-foreground mt-1">Monitor Cloudflare R2 bucket usage for video and thumbnail assets.</p>
      </div>

      <Empty className="border border-dashed border-border bg-muted/20 p-12 rounded-xl">
        <EmptyHeader>
          <EmptyMedia variant="icon" className="bg-muted border border-border text-foreground">
            <Database className="h-4 w-4" />
          </EmptyMedia>
          <EmptyTitle>Storage Dashboard</EmptyTitle>
          <EmptyDescription>
            R2 storage monitoring interface is currently under development.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
