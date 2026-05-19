"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { IconBellRinging } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import NotificationDropdown from "@/components/shared/dashboard/notification-dropdown";

export function SiteHeader() {
  const pathname = usePathname();
  const data = pathname.split("/");
  const res = data[data.length - 1].replaceAll("-", " ");

  return (
    <header className="sticky top-2 z-20 backdrop-blur-md flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-full"
        />
        <h1 className="text-base font-medium capitalize">{res}</h1>
        <div className="ml-auto flex items-center gap-2">
          <NotificationDropdown
            defaultOpen={false}
            align="center"
            trigger={
              <div className="rounded-full p-2 hover:bg-accent relative before:absolute before:bottom-0 before:left-1/2 before:z-10 before:w-2 before:h-2 before:rounded-full before:bg-red-500 before:top-1 cursor-pointer">
                <IconBellRinging className="size-4" />
              </div>
            }
          />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
