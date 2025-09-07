"use client";

import { ChevronRight, Currency, type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [prevActiveItem, setPrevActiveItem] = useState<string | null>(null);

  // Xác định menu nào chứa route hiện tại
  useEffect(() => {
    const activeItem = items.find(
      (item) =>
        pathname === item.url ||
        item.items?.some((subItem) => pathname === subItem.url)
    );
    setPrevActiveItem(activeItem ? activeItem.title : null);

    // Chỉ cập nhật `openItem` nếu chưa có tab mở
    if (!openItem) {
      setOpenItem(activeItem ? activeItem.title : null);
    }
  }, [pathname, items]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Quản lý</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive =
            openItem === item.title || prevActiveItem === item.title;

          return (
            <Collapsible
              key={item.title}
              open={isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger
                  asChild
                  onClick={() => setOpenItem(isActive ? null : item.title)}
                >
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight
                      className={`ml-auto transition-transform duration-300 ${
                        isActive ? "rotate-90" : ""
                      }`}
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <AnimatePresence>
                  {isActive && (
                    <CollapsibleContent asChild>
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      >
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => (
                            <SidebarMenuSubItem
                              key={subItem.title}
                              className={
                                pathname === subItem.url
                                  ? "bg-gray-200 dark:bg-gray-700 rounded-md"
                                  : ""
                              }
                            >
                              <SidebarMenuSubButton asChild>
                                <Link
                                  href={subItem.url}
                                  onClick={() => setPrevActiveItem(item.title)}
                                >
                                  <span className="flex items-center gap-3">
                                    <Currency size={11} fontWeight={700} />
                                    {subItem.title}
                                  </span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </motion.div>
                    </CollapsibleContent>
                  )}
                </AnimatePresence>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
