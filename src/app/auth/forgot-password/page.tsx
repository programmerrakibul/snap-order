import ForgotPasswordForm from "@/components/forms/forgot-password-form";
import Container from "@/components/shared/container";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Forgot Password",
};

export default function ForgotPasswordPage() {
  return (
    <section className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <Container className="max-w-sm md:max-w-5xl">
        <Suspense fallback={<div className="text-sm text-muted-foreground">Loading...</div>}>
          <ForgotPasswordForm />
        </Suspense>
      </Container>
    </section>
  );
}
