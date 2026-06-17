import { Settings } from "lucide-react";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Site Config</h1>
        <p className="text-muted-foreground mt-1">Manage site-wide configuration and key-value settings.</p>
      </div>

      <Empty className="border border-dashed border-border bg-muted/20 p-12 rounded-xl">
        <EmptyHeader>
          <EmptyMedia variant="icon" className="bg-muted border border-border text-foreground">
            <Settings className="h-4 w-4" />
          </EmptyMedia>
          <EmptyTitle>Site Configuration</EmptyTitle>
          <EmptyDescription>
            Site configuration editor is currently under development.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
