"use client";

import {
  resendForgotPasswordOtp,
  resetForgotPassword,
  verifyForgotPasswordOtp,
} from "@/actions/server/user.action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { getErrorResponse } from "@/lib/error";
import { IconLoader, IconMailCheck, IconLock } from "@tabler/icons-react";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { createUserSchema } from "@/schemas/user";

type ForgotPasswordModalProps = {
  email: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

const passwordFormSchema = z.object({
  password: createUserSchema.shape.password,
});

type TPasswordForm = z.infer<typeof passwordFormSchema>;

export function ForgotPasswordModal({
  email,
  open,
  onOpenChange,
  onSuccess,
}: ForgotPasswordModalProps) {
  const [stage, setStage] = useState<1 | 2>(1);
  const [code, setCode] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isResending, startResendTransition] = useTransition();
  const maskedEmail = useMemo(() => email || "your email", [email]);

  const { handleSubmit, control, reset: resetForm } = useForm<TPasswordForm>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      password: "",
    },
  });

  const handleCodeChange = (value: string) => {
    setCode(value.replace(/\D/g, "").slice(0, 6));
  };

  const handleVerify = () => {
    startTransition(async () => {
      try {
        const result = await verifyForgotPasswordOtp({ email, code });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success(result.message);
        setStage(2);
      } catch (error) {
        toast.error(getErrorResponse(error).message);
      }
    });
  };

  const handleResend = () => {
    startResendTransition(async () => {
      try {
        const result = await resendForgotPasswordOtp({ email });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        setCode("");
        toast.success(result.message);
      } catch (error) {
        toast.error(getErrorResponse(error).message);
      }
    });
  };

  const handleResetPassword = (data: TPasswordForm) => {
    startTransition(async () => {
      try {
        const result = await resetForgotPassword({
          email,
          code,
          password: data.password,
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success(result.message);
        setCode("");
        resetForm();
        setStage(1);
        onOpenChange(false);
        onSuccess?.();
      } catch (error) {
        toast.error(getErrorResponse(error).message);
      }
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setStage(1);
          setCode("");
          resetForm();
        }
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="rounded-lg sm:max-w-105">
        {stage === 1 ? (
          <>
            <DialogHeader className="items-center text-center">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <IconMailCheck className="h-6 w-6" />
              </div>
              <DialogTitle>
                Verify Reset Code
              </DialogTitle>
              <DialogDescription>
                Enter the 6 digit reset code we sent to {maskedEmail}. It expires in 10
                minutes.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
                placeholder="000000"
                value={code}
                onChange={(event) => handleCodeChange(event.target.value)}
                className="h-12 text-center text-xl font-semibold tracking-[0.35em]"
                disabled={isPending}
                aria-busy={isPending}
                aria-label={isPending ? "Verifying..." : "Verify code"}
                aria-disabled={isPending}
                aria-readonly={isPending}
                aria-live={isPending ? "polite" : "off"}
                aria-atomic={isPending ? true : false}
              />

              <Button
                type="button"
                className="w-full"
                disabled={isPending || code.length !== 6}
                aria-busy={isPending}
                aria-label={isPending ? "Verifying..." : "Verify code"}
                aria-disabled={isPending}
                onClick={handleVerify}
              >
                {isPending && <IconLoader className="mr-2 h-4 w-4 animate-spin" />}
                Verify Code
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                disabled={isResending}
                aria-busy={isResending}
                aria-label={isResending ? "Resending..." : "Resend code"}
                onClick={handleResend}
              >
                {isResending && (
                  <IconLoader className="mr-2 h-4 w-4 animate-spin" />
                )}
                Resend code
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader className="items-center text-center">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <IconLock className="h-6 w-6" />
              </div>
              <DialogTitle>
                Set New Password
              </DialogTitle>
              <DialogDescription>
                Create a secure new password for your account.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(handleResetPassword)} className="space-y-4">
              <FieldGroup>
                <Controller
                  name="password"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="new-password">New Password *</FieldLabel>
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="••••••••"
                        aria-invalid={fieldState.invalid}
                        disabled={isPending}
                        {...field}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isPending}
                  aria-busy={isPending}
                  aria-label={isPending ? "Resetting password..." : "Reset Password"}
                >
                  {isPending && <IconLoader className="mr-2 h-4 w-4 animate-spin" />}
                  Reset Password
                </Button>
              </FieldGroup>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
