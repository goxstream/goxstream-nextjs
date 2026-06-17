import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authAdmin } from "@/modules/auth/services/authAdmin";
import { AdminSidebar } from "@/features/admin/layout/AdminSidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/layouts/ThemeToggle";

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{ adminSegment?: string }>;
}

export default async function AdminDashboardLayout({
  children,
  params,
}: AdminDashboardLayoutProps) {
  const { adminSegment } = await params;
  
  if (!adminSegment) {
    redirect("/404");
  }
  
  // Retrieve session using Better Auth admin server API
  const session = await authAdmin.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(`/${adminSegment}/login`);
  }

  return (
    <SidebarProvider>
      <AdminSidebar adminSlug={adminSegment} />
      <SidebarInset className="bg-background text-foreground min-h-screen flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-6 bg-background/50 backdrop-blur-md sticky top-0 z-10 justify-between">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground cursor-pointer" />
            <div className="h-4 w-px bg-border" />
            <span className="text-sm text-muted-foreground font-medium">Console Backstage</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex-1 p-8 bg-muted/10">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

