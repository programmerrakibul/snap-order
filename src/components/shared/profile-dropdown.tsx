"use client";

import {
  IconDotsVertical,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react";

import { logoutUser } from "@/actions/server/user.action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import useUserData from "@/hooks/useUserData";
import { CLIENT_URL } from "@/lib/exportURL";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";

const DropdownTriggerSkeleton = () => {
  return (
    <SidebarMenuButton size="lg" disabled className="cursor-wait">
      {/* Avatar Skeleton */}
      <div className="h-8 w-8 rounded-lg bg-muted/80 flex items-center justify-center">
        <Skeleton className="h-8 w-8 rounded-lg bg-muted-foreground/20" />
      </div>

      {/* Text Content Skeleton */}
      <div className="grid flex-1 text-left text-sm leading-tight space-y-1.5">
        <Skeleton className="h-4 w-36 bg-muted-foreground/20" />
        <Skeleton className="h-3 w-48 bg-muted-foreground/20" />
      </div>

      {/* Right Icon Skeleton */}
      <Skeleton className="ml-auto size-4 rounded-full bg-muted-foreground/20" />
    </SidebarMenuButton>
  );
};

export default function ProfileDropdown() {
  const { push } = useRouter();
  const pathname = usePathname();
  const { isMobile } = useSidebar();
  const { user, loading } = useUserData();
  const callbackUrl = encodeURIComponent(CLIENT_URL + pathname);

  const handleLogout = async () => {
    try {
      const { success, message } = await logoutUser();

      if (success) {
        toast.success(message);
        push(`/auth/signin?callbackUrl=${callbackUrl}`);
      } else {
        toast.error(message);
      }
    } catch (error: unknown) {
      console.error(error);

      toast.error("Something went wrong!");
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          {loading ? (
            <DropdownTriggerSkeleton />
          ) : (
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarImage
                    src={user?.photoURL || ""}
                    alt={user?.name || user?.role}
                  />
                  <AvatarFallback className="rounded-lg">
                    {user?.name || user?.role}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user?.name || user?.role}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
                <IconDotsVertical className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
          )}
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user?.photoURL || ""}
                    alt={user?.name || user?.role}
                  />
                  <AvatarFallback className="rounded-lg">
                    {user?.name || user?.role}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user?.name || user?.role}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => push("/dashboard/profile")}>
                <IconUserCircle />
                Account
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
