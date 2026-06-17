"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClientAdmin } from "@/lib/auth/client";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Film, Tv, Users, LogOut, Shield } from "lucide-react";

interface AdminSidebarProps {
  adminSlug: string;
}

export function AdminSidebar({ adminSlug }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await authClientAdmin.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed out successfully");
            router.push(`/${adminSlug}/login`);
          },
          onError: () => {
            toast.error("Failed to sign out");
          }
        },
      });
    } catch (err) {
      toast.error("An error occurred during sign out");
    }
  };

  const navItems = [
    {
      name: "Dashboard",
      href: `/${adminSlug}`,
      icon: LayoutDashboard,
    },
    {
      name: "Anime Catalog",
      href: `/${adminSlug}/anime`,
      icon: Film,
    },
    {
      name: "Episodes",
      href: `/${adminSlug}/episodes`,
      icon: Tv,
    },
    {
      name: "User Management",
      href: `/${adminSlug}/users`,
      icon: Users,
    },
  ];

  return (
    <Sidebar className="border-r border-neutral-900 bg-neutral-950 text-neutral-50">
      <SidebarHeader className="border-b border-neutral-900/60 p-4 bg-neutral-950">
        <div className="flex items-center gap-2.5 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-950/50 border border-red-500/20 text-red-500">
            <Shield className="h-4 w-4" />
          </div>
          <span className="font-bold text-neutral-100 tracking-tight">GoxStream Console</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-neutral-950 py-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-neutral-500 text-xs px-3">Management</SidebarGroupLabel>
          <SidebarGroupContent className="mt-1.5">
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={
                        isActive
                          ? "bg-red-950/30 border border-red-500/25 text-red-500 hover:bg-red-950/40 hover:text-red-400"
                          : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900"
                      }
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-neutral-900 p-4 bg-neutral-950">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              className="text-neutral-400 hover:text-red-400 hover:bg-red-950/10 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Exit Backstage</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
