import { EmailLayout } from "@/emails/components/email-layout";
import { Heading, Text } from "react-email";

type AccountCreatedEmailTemplateProps = {
  name?: string | null;
};

export function AccountCreatedEmailTemplate({
  name,
}: AccountCreatedEmailTemplateProps) {
  return (
    <EmailLayout preview="Your Snap Order account has been created">
      <Heading className="m-0 mb-3 text-[24px] font-bold leading-8 text-ink">
        Your account has been created
      </Heading>
      <Text className="m-0 text-[15px] leading-6 text-gray-700">
        Hi {name ? `${name}` : "there"}, welcome to SnapOrder. Your account is
        ready to use after you verify your email.
      </Text>
      <Text className="m-0 mt-4 text-[15px] leading-6 text-gray-700">
        We are glad to have you here and will keep your ordering experience
        clear, secure, and reliable.
      </Text>
    </EmailLayout>
  );
}
