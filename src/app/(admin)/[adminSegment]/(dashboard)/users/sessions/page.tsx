import { Users } from "lucide-react";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

export default function AdminUsersSessionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Sessions</h1>
        <p className="text-muted-foreground mt-1">Monitor active user sessions and login activity.</p>
      </div>

      <Empty className="border border-dashed border-border bg-muted/20 p-12 rounded-xl">
        <EmptyHeader>
          <EmptyMedia variant="icon" className="bg-muted border border-border text-foreground">
            <Users className="h-4 w-4" />
          </EmptyMedia>
          <EmptyTitle>Session Monitor</EmptyTitle>
          <EmptyDescription>
            Session monitoring interface is currently under development.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
