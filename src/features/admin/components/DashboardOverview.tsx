import { Film, Users, Tv, MessageSquare } from "lucide-react";

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
        <h1 className="text-3xl font-bold tracking-tight text-white">Console Overview</h1>
        <p className="text-neutral-400 mt-1">
          Backstage system metrics and catalog health
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between space-y-0 pb-2">
              <span className="text-sm font-medium text-neutral-400">
                {stat.title}
              </span>
              <stat.icon className="h-4 w-4 text-red-500" />
            </div>
            <div className="mt-2">
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <p className="text-xs text-neutral-500 mt-1">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action Controls */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/20 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Operations</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition duration-150">
            <h3 className="font-medium text-neutral-200">Catalog Sync</h3>
            <p className="text-xs text-neutral-500 mt-1 mb-3">Sync metadata profiles from external sources.</p>
            <button className="text-xs bg-neutral-850 hover:bg-neutral-800 text-neutral-200 px-3 py-1.5 rounded transition cursor-pointer">
              Trigger Sync
            </button>
          </div>

          <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition duration-150">
            <h3 className="font-medium text-neutral-200">Media Ingest</h3>
            <p className="text-xs text-neutral-500 mt-1 mb-3">Upload and transcode new anime video files.</p>
            <button className="text-xs bg-neutral-850 hover:bg-neutral-800 text-neutral-200 px-3 py-1.5 rounded transition cursor-pointer">
              Open Transcoder
            </button>
          </div>

          <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition duration-150">
            <h3 className="font-medium text-neutral-200">System Logs</h3>
            <p className="text-xs text-neutral-500 mt-1 mb-3">Inspect Cloudflare Worker debug logs.</p>
            <button className="text-xs bg-neutral-850 hover:bg-neutral-800 text-neutral-200 px-3 py-1.5 rounded transition cursor-pointer">
              View Worker Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
