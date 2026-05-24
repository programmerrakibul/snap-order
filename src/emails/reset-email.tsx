import { EmailLayout } from "@/emails/components/email-layout";
import { OtpCode } from "@/emails/components/otp-code";
import { OTP_EXPIRY_MINUTES } from "@/lib/otp";
import { Heading, Text } from "react-email";

type ResetEmailTemplateProps = {
  name?: string | null;
  code: string;
};

export function ResetEmailTemplate({ name, code }: ResetEmailTemplateProps) {
  return (
    <EmailLayout preview="Reset your Snap Order account access">
      <Heading className="m-0 mb-3 text-[24px] font-bold leading-8 text-ink">
        Reset your account access
      </Heading>
      <Text className="m-0 text-[15px] leading-6 text-gray-700">
        Hi {name ? ` ${name}` : "there"}, use this code to continue resetting
        your SnapOrder account access.
      </Text>
      <OtpCode code={code} />
      <Text className="m-0 text-[15px] leading-6 text-gray-700">
        This code expires in {OTP_EXPIRY_MINUTES} minutes.
      </Text>
    </EmailLayout>
  );
}
