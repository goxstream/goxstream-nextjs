"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Film,
  Tv,
  Users,
  Shield,
  MessageSquare,
  Settings,
  HardDrive,
} from "lucide-react";
import { NavMain } from "./NavMain";
import { NavUser } from "./NavUser";

interface AdminSidebarProps {
  adminSlug: string;
}

export function AdminSidebar({ adminSlug, ...props }: AdminSidebarProps & React.ComponentProps<typeof Sidebar>) {
  const overviewItems = [
    {
      name: "Dashboard",
      href: `/${adminSlug}`,
      icon: LayoutDashboard,
    },
  ];

  const contentItems = [
    {
      name: "Anime",
      icon: Film,
      items: [
        { name: "All Anime", href: `/${adminSlug}/anime` },
        { name: "New Anime", href: `/${adminSlug}/anime/new` },
        { name: "Genres", href: `/${adminSlug}/anime/genres` },
      ],
    },
    {
      name: "Episodes",
      icon: Tv,
      items: [
        { name: "All Episodes", href: `/${adminSlug}/episodes` },
        { name: "Upload Episode", href: `/${adminSlug}/episodes/new` },
        { name: "Subtitles", href: `/${adminSlug}/episodes/subtitles` },
      ],
    },
    {
      name: "Media",
      icon: HardDrive,
      items: [
        { name: "Video Sources", href: `/${adminSlug}/media/sources` },
        { name: "Storage (R2)", href: `/${adminSlug}/media/storage` },
      ],
    },
  ];

  const communityItems = [
    {
      name: "Users",
      icon: Users,
      items: [
        { name: "Accounts", href: `/${adminSlug}/users` },
        { name: "Roles & Permissions", href: `/${adminSlug}/users/roles` },
        { name: "Sessions", href: `/${adminSlug}/users/sessions` },
      ],
    },
    {
      name: "Comments",
      icon: MessageSquare,
      items: [
        { name: "Moderation", href: `/${adminSlug}/comments` },
        { name: "Reported", href: `/${adminSlug}/comments/reported` },
      ],
    },
  ];

  const systemItems = [
    {
      name: "Settings",
      icon: Settings,
      items: [
        { name: "Site Config", href: `/${adminSlug}/settings` },
        { name: "API Tokens", href: `/${adminSlug}/settings/tokens` },
      ],
    },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground" {...props}>
      <SidebarHeader className="border-b border-sidebar-border p-4 bg-sidebar">
        <div className="flex items-center gap-2.5 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent border border-border text-foreground">
            <Shield className="h-4 w-4" />
          </div>
          <span className="font-bold tracking-tight text-foreground group-data-[collapsible=icon]:hidden">
            GoxStream Console
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-sidebar">
        <NavMain label="Overview" items={overviewItems} />
        <NavMain label="Content" items={contentItems} />
        <NavMain label="Community" items={communityItems} />
        <NavMain label="System" items={systemItems} />
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border bg-sidebar">
        <NavUser adminSlug={adminSlug} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
