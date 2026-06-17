import { Film, Users, Tv, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DashboardOverviewProps {
  usersCount: number;
  animeCount: number;
  episodesCount: number;
  commentsCount: number;
}

export function DashboardOverview({
  usersCount,
  animeCount,
  episodesCount,
  commentsCount,
}: DashboardOverviewProps) {
  const stats = [
    {
      title: "Total Catalog Anime",
      value: animeCount,
      icon: Film,
      description: "Active titles in catalog",
    },
    {
      title: "Uploaded Episodes",
      value: episodesCount,
      icon: Tv,
      description: "Streaming-ready video episodes",
    },
    {
      title: "Registered Users",
      value: usersCount,
      icon: Users,
      description: "Total user authentication profiles",
    },
    {
      title: "Community Comments",
      value: commentsCount,
      icon: MessageSquare,
      description: "User comments across episodes",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Console Overview</h1>
        <p className="text-muted-foreground mt-1">
          Backstage system metrics and catalog health
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <span className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </span>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              <CardDescription className="text-xs text-muted-foreground mt-1">{stat.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Action Controls */}
      <Card className="p-6">
        <CardHeader className="px-0 pt-0 pb-4">
          <CardTitle className="text-lg font-semibold text-foreground">Quick Operations</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="p-4 bg-muted/40 border-border hover:border-accent transition duration-150 flex flex-col justify-between gap-3">
              <div>
                <h3 className="font-semibold text-foreground text-sm">Catalog Sync</h3>
                <p className="text-xs text-muted-foreground mt-1">Sync metadata profiles from external sources.</p>
              </div>
              <div>
                <Button size="sm" variant="secondary" className="text-xs px-3 py-1.5 cursor-pointer">
                  Trigger Sync
                </Button>
              </div>
            </Card>

            <Card className="p-4 bg-muted/40 border-border hover:border-accent transition duration-150 flex flex-col justify-between gap-3">
              <div>
                <h3 className="font-semibold text-foreground text-sm">Media Ingest</h3>
                <p className="text-xs text-muted-foreground mt-1">Upload and transcode new anime video files.</p>
              </div>
              <div>
                <Button size="sm" variant="secondary" className="text-xs px-3 py-1.5 cursor-pointer">
                  Open Transcoder
                </Button>
              </div>
            </Card>

            <Card className="p-4 bg-muted/40 border-border hover:border-accent transition duration-150 flex flex-col justify-between gap-3">
              <div>
                <h3 className="font-semibold text-foreground text-sm">System Logs</h3>
                <p className="text-xs text-muted-foreground mt-1">Inspect Cloudflare Worker debug logs.</p>
              </div>
              <div>
                <Button size="sm" variant="secondary" className="text-xs px-3 py-1.5 cursor-pointer">
                  View Worker Logs
                </Button>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
