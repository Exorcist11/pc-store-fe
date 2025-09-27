"use client";

import { AutoBreadcrumb } from "@/components/AutoBeadcrumbs/AutoBreadcrumb";
import { AppSidebar } from "@/components/Dashboard/app-sidebar";
import AdminProtectedRoute from "@/components/Providers/AdminProtectedRoute";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProtectedRoute>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-white">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <AutoBreadcrumb />
            </div>
          </header>
          <main className="flex-1 p-4 bg-white">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </AdminProtectedRoute>
  );
}
