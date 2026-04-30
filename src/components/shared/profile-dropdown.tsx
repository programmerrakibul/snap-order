"use client";

import type { ReactElement } from "react";
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
  IconBookmark,
  TablerIcon,
  IconUser,
  IconSettings,
  IconLogout,
  IconReceipt,
} from "@tabler/icons-react";
import useUserData from "@/hooks/useUserData";

type Props = {
  trigger: ReactElement;
  defaultOpen?: boolean;
  align?: "start" | "center" | "end";
};

type MenuItem = {
  label: string;
  icon: TablerIcon;
  destructive?: boolean;
};

const PROFILE_ITEMS: MenuItem[] = [
  { label: "My Profile", icon: IconUser },
  { label: "My Subscription", icon: IconBookmark },
  { label: "My Invoice", icon: IconReceipt },
];

const SETTINGS_ITEMS: MenuItem[] = [
  { label: "Account Settings", icon: IconSettings },
];

const LOGOUT_ITEM: MenuItem = {
  label: "Signout",
  icon: IconLogout,
  destructive: true,
};

const itemClass = "px-4 py-2.5 text-base cursor-pointer gap-3";

const ProfileDropdown = ({ trigger, defaultOpen, align = "end" }: Props) => {
  const data = useUserData();

  console.log(data);

  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger>{trigger}</DropdownMenuTrigger>

      <DropdownMenuContent className="w-80" align={align}>
        <DropdownMenuGroup>
          {/* User Info */}
          <DropdownMenuLabel className="flex items-center gap-4 px-4 py-2.5 font-normal">
            <div className="relative">
              <Avatar className="size-10">
                <AvatarImage
                  src={
                    "https://res.cloudinary.com/dqh5dajig/image/upload/v1777525265/4eb2ad02c9358d515cfa9a8cc6eb52dc_orubcs.jpg"
                  }
                  alt={data?.email}
                />
                <AvatarFallback>DM</AvatarFallback>
              </Avatar>
              <span className="ring-card absolute right-0 bottom-0 size-2 rounded-full bg-green-600 ring-2" />
            </div>

            <div className="flex flex-col">
              <span className="text-foreground text-lg font-semibold">
                David McMichael
              </span>
              <span className="text-muted-foreground text-sm">
                {data?.email}
              </span>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {/* Main Links */}
          {PROFILE_ITEMS.map(({ label, icon: Icon }) => (
            <DropdownMenuItem key={label} className={itemClass}>
              <Icon size={20} className="text-foreground" />
              <span>{label}</span>
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          {/* Settings */}
          <DropdownMenuGroup>
            {SETTINGS_ITEMS.map(({ label, icon: Icon }) => (
              <DropdownMenuItem key={label} className={itemClass}>
                <Icon size={20} className="text-foreground" />
                <span>{label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Logout */}
          <DropdownMenuItem variant="destructive" className={itemClass}>
            <LOGOUT_ITEM.icon size={20} />
            <span>{LOGOUT_ITEM.label}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
