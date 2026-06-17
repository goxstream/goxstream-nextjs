import { Settings } from "lucide-react";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

export default function AdminSettingsTokensPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">API Tokens</h1>
        <p className="text-muted-foreground mt-1">Manage API access tokens for external integrations.</p>
      </div>

      <Empty className="border border-dashed border-border bg-muted/20 p-12 rounded-xl">
        <EmptyHeader>
          <EmptyMedia variant="icon" className="bg-muted border border-border text-foreground">
            <Settings className="h-4 w-4" />
          </EmptyMedia>
          <EmptyTitle>Token Manager</EmptyTitle>
          <EmptyDescription>
            API token management interface is currently under development.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
