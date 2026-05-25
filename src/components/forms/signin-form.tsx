"use client";

import { loginUser } from "@/actions/server/user.action";
import { VerifyOtpModal } from "@/components/modals/verify-otp-modal";
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
import { CLIENT_URL } from "@/lib/exportURL";
import { cn } from "@/lib/utils";
import { loginUserSchema, TLoginUser } from "@/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const callbackUrl =
    searchParams.get("callbackUrl") || `${CLIENT_URL}/dashboard`;
  const [isLoading, startTransition] = useTransition();
  const [verificationEmail, setVerificationEmail] = useState("");
  const [forgotEmail, setForgotEmail] = useState<string | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const { handleSubmit, control, reset } = useForm<TLoginUser>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = (data: TLoginUser) => {
    startTransition(async () => {
      try {
        const { success, message } = await loginUser(data);

        if (!success) {
          setVerificationEmail(data.email);
          setIsVerifyModalOpen(true);
          toast.info(message);
          return;
        }

        replace(callbackUrl);
        reset();
        setForgotEmail(null);
        toast.success(message);
      } catch (error: unknown) {
        const { message } = getErrorResponse(error);
        toast.error(message);
      }
    });
  };

  return (
    <>
      <VerifyOtpModal
        email={verificationEmail}
        open={isVerifyModalOpen}
        onOpenChange={setIsVerifyModalOpen}
        onVerified={() => {
          reset();
          replace(callbackUrl);
        }}
      />

      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form onSubmit={handleSubmit(handleLogin)} className="p-6 md:p-8">
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-balance text-muted-foreground">
                    Login to your Acme Inc account
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
                        onChange={(e) => {
                          const value = e.target.value;

                          field.onChange(value);
                          setForgotEmail(value);
                        }}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="password"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="password">Password *</FieldLabel>
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          aria-invalid={fieldState.invalid}
                          disabled={isLoading}
                          {...field}
                        />

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}

                        <FieldDescription className="text-xs">
                          <Link
                            href={`/auth/forgot-password${forgotEmail ? `?email=${encodeURIComponent(forgotEmail)}` : ""}`}
                          >
                            Forgotten password?
                          </Link>
                        </FieldDescription>
                      </Field>
                    </>
                  )}
                />

                <Field>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <IconLoader className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </Field>

                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link href={"/auth/signup"}>Sign up</Link>
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
