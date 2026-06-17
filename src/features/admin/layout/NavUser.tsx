"use client";

import { useRouter } from "next/navigation";
import { authClientAdmin } from "@/modules/auth/client";
import { toast } from "sonner";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Shield, ChevronsUpDown } from "lucide-react";

interface NavUserProps {
  adminSlug: string;
}

export function NavUser({ adminSlug }: NavUserProps) {
  const router = useRouter();
  const { isMobile } = useSidebar();

  // Retrieve logged-in administrator session
  const { data: sessionData } = authClientAdmin.useSession();
  const admin = sessionData?.user;

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

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={admin?.image || ""} alt={admin?.name || "Admin"} />
                <AvatarFallback className="rounded-lg bg-accent text-foreground font-medium">
                  AD
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{admin?.name || "Admin User"}</span>
                <span className="truncate text-xs text-sidebar-foreground/60">{admin?.email || "admin@example.com"}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={admin?.image || ""} alt={admin?.name || "Admin"} />
                  <AvatarFallback className="rounded-lg bg-accent text-foreground font-medium">
                    AD
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{admin?.name || "Admin User"}</span>
                  <span className="truncate text-xs text-muted-foreground">{admin?.email || "admin@example.com"}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 cursor-default select-none pointer-events-none">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground font-medium">Backstage Access</span>
                  <span className="text-sm font-semibold">{admin?.name || "Administrator"}</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Exit Backstage</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
