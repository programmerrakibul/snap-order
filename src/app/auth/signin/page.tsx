import { LoginForm } from "@/components/forms/signin-form";
import Container from "@/components/shared/container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LogIn",
};

export default function LoginPage() {
  return (
    <section className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <Container className="max-w-sm md:max-w-5xl">
        <LoginForm />
      </Container>
    </section>
  );
}
