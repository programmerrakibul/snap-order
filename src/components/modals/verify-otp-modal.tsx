"use client";

import {
  resendEmailVerification,
  verifyEmailOtp,
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
import { getErrorResponse } from "@/lib/error";
import { IconLoader, IconMailCheck } from "@tabler/icons-react";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

type VerifyOtpModalProps = {
  email: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerified?: () => void;
};

export function VerifyOtpModal({
  email,
  open,
  onOpenChange,
  onVerified,
}: VerifyOtpModalProps) {
  const [code, setCode] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isResending, startResendTransition] = useTransition();
  const maskedEmail = useMemo(() => email || "your email", [email]);

  const handleCodeChange = (value: string) => {
    setCode(value.replace(/\D/g, "").slice(0, 6));
  };

  const handleVerify = () => {
    startTransition(async () => {
      try {
        const result = await verifyEmailOtp({ email, code });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success(result.message);
        setCode("");
        onOpenChange(false);
        onVerified?.();
      } catch (error) {
        toast.error(getErrorResponse(error).message);
      }
    });
  };

  const handleResend = () => {
    startResendTransition(async () => {
      try {
        const result = await resendEmailVerification({ email });

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-lg sm:max-w-105">
        <DialogHeader className="items-center text-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <IconMailCheck className="h-6 w-6" />
          </div>
          <DialogTitle
            aria-description="Verify your email"
            aria-label="Verify your email"
            aria-readonly={true}
          >
            Verify your email
          </DialogTitle>
          <DialogDescription>
            Enter the 6 digit code we sent to {maskedEmail}. It expires in 10
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
            aria-label={isPending ? "Verifying..." : "Verify email"}
            aria-disabled={isPending}
            aria-pressed={isPending}
            about={isPending ? "Verifying..." : "Verify email"}
            title={isPending ? "Verifying..." : "Verify email"}
            aria-readonly={isPending}
            tabIndex={isPending ? -1 : 0}
            aria-live={isPending ? "polite" : "off"}
            aria-atomic={isPending ? true : false}
          />

          <Button
            type="button"
            className="w-full"
            disabled={isPending || code.length !== 6}
            aria-busy={isPending}
            aria-label={isPending ? "Verifying..." : "Verify email"}
            aria-disabled={isPending}
            aria-pressed={isPending}
            about={isPending ? "Verifying..." : "Verify email"}
            title={isPending ? "Verifying..." : "Verify email"}
            aria-readonly={isPending}
            tabIndex={isPending ? -1 : 0}
            aria-live={isPending ? "polite" : "off"}
            aria-atomic={isPending ? true : false}
            onClick={handleVerify}
          >
            {isPending && <IconLoader className="mr-2 h-4 w-4 animate-spin" />}
            Verify Email
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            disabled={isResending}
            aria-busy={isResending}
            aria-label={isResending ? "Resending..." : "Resend code"}
            aria-disabled={isResending}
            aria-pressed={isResending}
            about={isResending ? "Resending..." : "Resend code"}
            title={isResending ? "Resending..." : "Resend code"}
            aria-readonly={isResending}
            tabIndex={isResending ? -1 : 0}
            aria-live={isResending ? "polite" : "off"}
            aria-atomic={isResending ? true : false}
            onClick={handleResend}
          >
            {isResending && (
              <IconLoader className="mr-2 h-4 w-4 animate-spin" />
            )}
            Resend code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
