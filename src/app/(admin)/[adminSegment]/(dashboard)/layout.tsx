import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authAdmin } from "@/lib/auth/admin";
import { AdminSidebar } from "@/components/layouts/AdminSidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

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
      <SidebarInset className="bg-neutral-950 text-neutral-50 min-h-screen flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-neutral-900 px-6 bg-neutral-950/50 backdrop-blur-md sticky top-0 z-10 justify-between">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="text-neutral-400 hover:text-neutral-200 cursor-pointer" />
            <div className="h-4 w-px bg-neutral-800" />
            <span className="text-sm text-neutral-400 font-medium">Console Backstage</span>
          </div>
        </header>
        <div className="flex-1 p-8 bg-neutral-900/20">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
