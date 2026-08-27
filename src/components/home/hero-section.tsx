"use client";

import Container from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import useUserData from "@/hooks/useUserData";
import Link from "next/link";

function HeroActions() {
  const { authenticated } = useUserData();

  return (
    <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
      <Button asChild size="lg">
        <Link href={authenticated ? "/dashboard" : "/auth/signin"}>
          {authenticated ? "Go to Dashboard" : "Get Started"}
        </Link>
      </Button>
      {!authenticated && (
        <Button asChild variant="outline" size="lg">
          <Link href="/auth/signup">Create Account</Link>
        </Button>
      )}
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-primary/5 via-background to-background" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,oklch(0.5_0_0/0.04)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.5_0_0/0.04)_1px,transparent_1px)] bg-size-[24px_24px]" />
      <Container>
        <div className="mx-auto max-w-3xl text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="mb-4 text-sm font-medium tracking-wide text-primary uppercase">
            Order Management with RBAC
          </p>
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl">
            Inventory, orders, and access control in one place
          </h1>
          <p className="mt-6 text-lg text-muted-foreground text-balance md:text-xl">
            Snap Order helps teams track stock, process orders, and enforce
            role-based permissions — from placement to fulfillment, with clarity
            at every step.
          </p>
          <HeroActions />
        </div>
      </Container>
    </section>
  );
}
