"use client";

import Container from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import useUserData from "@/hooks/useUserData";
import Link from "next/link";

export default function Navbar() {
  const { authenticated } = useUserData();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild size="sm">
            <Link href={authenticated ? "/dashboard" : "/auth/signin"}>
              {authenticated ? "Dashboard" : "Sign In"}
            </Link>
          </Button>
        </div>
      </Container>
    </header>
  );
}
