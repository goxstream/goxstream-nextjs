import { MessageSquare } from "lucide-react";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

export default function AdminCommentsModerationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Moderation</h1>
        <p className="text-muted-foreground mt-1">Review and moderate community comments across episodes.</p>
      </div>

      <Empty className="border border-dashed border-border bg-muted/20 p-12 rounded-xl">
        <EmptyHeader>
          <EmptyMedia variant="icon" className="bg-muted border border-border text-foreground">
            <MessageSquare className="h-4 w-4" />
          </EmptyMedia>
          <EmptyTitle>Comment Moderation</EmptyTitle>
          <EmptyDescription>
            Comment moderation interface is currently under development.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
