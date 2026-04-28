import { SignupForm } from "@/components/forms/signup-form";
import Container from "@/components/shared/container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function SignupPage() {
  return (
    <section className="flex min-h-svh flex-col items-center justify-center bg-muted py-6 md:py-10">
      <Container className="max-w-sm md:max-w-5xl">
        <SignupForm />
      </Container>
    </section>
  );
}
