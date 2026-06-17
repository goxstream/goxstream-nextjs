import * as React from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 pb-16 md:pb-0 md:pl-[72px] w-full max-w-full overflow-hidden">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
