import { isAuthenticated } from "@/actions/server/isAuthenticated";
import Container from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Link from "next/link";
import { Suspense } from "react";

async function AuthNavAction() {
  const user = await isAuthenticated();

  return (
    <Button asChild size="sm">
      <Link href={user ? "/dashboard" : "/auth/signin"}>
        {user ? "Dashboard" : "Sign In"}
      </Link>
    </Button>
  );
}

function AuthNavActionFallback() {
  return (
    <Button asChild size="sm">
      <Link href="/auth/signin">Sign In</Link>
    </Button>
  );
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Suspense fallback={<AuthNavActionFallback />}>
            <AuthNavAction />
          </Suspense>
        </div>
      </Container>
    </header>
  );
}
