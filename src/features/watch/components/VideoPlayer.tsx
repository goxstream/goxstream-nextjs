"use client";

import * as React from "react";
import { MediaPlayer, MediaOutlet, MediaCommunitySkin } from "@vidstack/react";
import { Play } from "lucide-react";
import "vidstack/styles/defaults.css";
import "vidstack/styles/community-skin/video.css";

interface VideoPlayerProps {
  src?: string;
  poster?: string;
  title?: string;
}

export default function VideoPlayer({ 
  src = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", 
  poster, 
  title = "Video Player" 
}: VideoPlayerProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render matching loading skeleton on server and until mounted on client
    return (
      <div className="w-full aspect-video bg-black rounded-none md:rounded-2xl border-y md:border border-white/5 shadow-2xl relative flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30" />
        <div className="rounded-full bg-primary/20 p-5 text-primary-foreground/30 animate-pulse">
          <Play className="h-10 w-10 fill-current ml-1" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full aspect-video bg-black overflow-hidden rounded-none md:rounded-2xl border-y md:border border-white/5 shadow-2xl relative">
      <MediaPlayer
        src={src}
        poster={poster}
        title={title}
        aspectRatio={16 / 9}
        crossorigin=""
        className="w-full h-full"
      >
        <MediaOutlet />
        <MediaCommunitySkin />
      </MediaPlayer>
    </div>
  );
}
