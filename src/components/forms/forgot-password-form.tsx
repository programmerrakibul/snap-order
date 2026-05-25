"use client";

import { forgotPassword } from "@/actions/server/user.action";
import { ForgotPasswordModal } from "@/components/modals/forgot-password-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getErrorResponse } from "@/lib/error";
import { cn } from "@/lib/utils";
import { forgotPasswordSchema, TForgotPassword } from "@/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const queryEmail = searchParams.get("email") || "";

  const [isLoading, startTransition] = useTransition();
  const [resetEmail, setResetEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { handleSubmit, control, setValue } = useForm<TForgotPassword>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (queryEmail) {
      setValue("email", queryEmail);
    }
  }, [queryEmail, setValue]);

  const handleForgotPassword = (data: TForgotPassword) => {
    startTransition(async () => {
      try {
        const { success, message } = await forgotPassword(data);

        if (!success) {
          toast.error(message);
          return;
        }

        setResetEmail(data.email);
        setIsModalOpen(true);
        toast.success(message);
      } catch (error: unknown) {
        const { message } = getErrorResponse(error);
        toast.error(message);
      }
    });
  };

  return (
    <>
      <ForgotPasswordModal
        email={resetEmail}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={() => {
          replace("/auth/signin");
        }}
      />

      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form
              onSubmit={handleSubmit(handleForgotPassword)}
              className="p-6 md:p-8"
            >
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">Forgot Password</h1>
                  <p className="text-balance text-muted-foreground">
                    Enter your email to receive a password reset code
                  </p>
                </div>

                <Controller
                  name="email"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="email">Email *</FieldLabel>
                      <Input
                        id="email"
                        type="email"
                        aria-invalid={fieldState.invalid}
                        placeholder="john@example.com"
                        disabled={isLoading}
                        {...field}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Field>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <IconLoader className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Reset Code"
                    )}
                  </Button>
                </Field>

                <FieldDescription className="text-center">
                  Remembered your password?
                  <Link href="/auth/signin"> Sign in</Link>
                </FieldDescription>
              </FieldGroup>
            </form>
            <div className="relative hidden bg-muted md:block">
              <Image
                src="/authentication.jpg"
                alt="Image"
                loading="eager"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                width={400}
                height={400}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
