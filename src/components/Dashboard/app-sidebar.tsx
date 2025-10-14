"use client";

import * as React from "react";
import {
  AudioWaveform,
  Command,
  FileText,
  GalleryVerticalEnd,
  LayoutDashboard,
  Map,
  Package2,
  PieChart,
  Ticket,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "./team-switcher";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Thống kê",
          url: "/admin/dashboard",
        },
        {
          title: "Thống kê chi tiết",
          url: "/admin/report-period",
        },
      ],
    },
    {
      title: "Quản lý sản phẩm",
      url: "",
      icon: Package2,
      items: [
        {
          title: "Danh mục sản phẩm",
          url: "/admin/categories",
        },
        {
          title: "Danh sách thương hiệu",
          url: "/admin/brands",
        },
        {
          title: "Danh sách sản phẩm",
          url: "/admin/products",
        },
      ],
    },
    {
      title: "Quản lý đơn hàng",
      url: "/admin/orders",
      icon: FileText,
      items: [
        {
          title: "Đơn hàng gần đây",
          url: "/admin/orders",
        },
        // {
        //   title: "Đơn hàng ",
        //   url: "/trips/schedule",
        // },
      ],
    },
    {
      title: "Quản lý người dùng",
      url: "/admin/users",
      icon: Users,
      items: [
        {
          title: "Danh sách người dùng",
          url: "/admin/users",
        },
        // {
        //   title: "Team",
        //   url: "#",
        // },
      ],
    },
  ],
  // projects: [
  //   {
  //     name: "Đặt vé",
  //     url: "/ticket",
  //     icon: Ticket,
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     url: "#",
  //     icon: PieChart,
  //   },
  //   {
  //     name: "Travel",
  //     url: "#",
  //     icon: Map,
  //   },
  // ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
