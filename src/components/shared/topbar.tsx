"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import NotificationDropdown from "./notification-dropdown";
import ProfileDropdown from "./profile-dropdown";
import { IconBellRinging } from "@tabler/icons-react";
import Container from "./container";
import useUserData from "@/hooks/useUserData";

const DashboardTopbar = () => {
  const data = useUserData();

  return (
    <header className="bg-card sticky top-0 z-50 border-b">
      <Container className="flex items-center justify-between gap-6 px-6 lg:px-8  h-16">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-xs gap-4">
                  <li>
                    <NavigationMenuLink href="#">
                      <div className="flex flex-col items-start gap-0.5!">
                        <p className="font-medium">Components</p>
                        <p className="text-muted-foreground">
                          Browse all components in the library.
                        </p>
                      </div>
                    </NavigationMenuLink>
                    <NavigationMenuLink href="#">
                      <div className="flex flex-col items-start gap-0.5!">
                        <p className="font-medium">Documentation</p>
                        <p className="text-muted-foreground">
                          Learn how to use the library.
                        </p>
                      </div>
                    </NavigationMenuLink>
                    <NavigationMenuLink href="#">
                      <div className="flex flex-col items-start gap-0.5!">
                        <p className="font-medium">Blog</p>
                        <p className="text-muted-foreground">
                          Read our latest blog posts.
                        </p>
                      </div>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center gap-2.5">
          <NotificationDropdown
            defaultOpen={false}
            align="center"
            trigger={
              <div className="rounded-full p-2 hover:bg-accent relative before:absolute before:bottom-0 before:left-1/2 before:z-10 before:w-2 before:h-2 before:rounded-full before:bg-red-500 before:top-1">
                <IconBellRinging className="size-4" />
              </div>
            }
          />
          <ProfileDropdown
            trigger={
              <div
                id="profile-dropdown-trigger"
                className="rounded-full cursor-pointer"
              >
                <Avatar className="size-7 rounded-full">
                  <AvatarImage src="https://res.cloudinary.com/dqh5dajig/image/upload/v1777525265/4eb2ad02c9358d515cfa9a8cc6eb52dc_orubcs.jpg" />
                  <AvatarFallback>NJ</AvatarFallback>
                </Avatar>
              </div>
            }
          />
        </div>
      </Container>
    </header>
  );
};

export default DashboardTopbar;
