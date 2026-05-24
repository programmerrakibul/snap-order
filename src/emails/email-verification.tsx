import * as React from "react";
import { Heading, Text } from "react-email";
import { EmailLayout } from "@/emails/components/email-layout";
import { OtpCode } from "@/emails/components/otp-code";
import { OTP_EXPIRY_MINUTES } from "@/lib/otp";

type EmailVerificationTemplateProps = {
  name?: string | null;
  code: string;
};

export function EmailVerificationTemplate({
  name,
  code,
}: EmailVerificationTemplateProps) {
  return (
    <EmailLayout preview="Verify your email for Snap Order">
      <Heading className="m-0 mb-3 text-[24px] font-bold leading-8 text-ink">
        Verify your email
      </Heading>
      <Text className="m-0 text-[15px] leading-6 text-gray-700">
        Hi {name ? ` ${name}` : "there"}, please use the verification code below to
        verify your email and finish securing your SnapOrder account.
      </Text>
      <OtpCode code={code} />
      <Text className="m-0 text-[15px] leading-6 text-gray-700">
        This code expires in {OTP_EXPIRY_MINUTES} minutes. For your security,
        each code can be tried up to 5 times.
      </Text>
    </EmailLayout>
  );
}
