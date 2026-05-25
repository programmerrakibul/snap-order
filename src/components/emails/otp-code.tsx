import { Section, Text } from "react-email";

type OtpCodeProps = {
  code: string;
};

export function OtpCode({ code }: OtpCodeProps) {
  return (
    <Section className="my-6 rounded-lg bg-ink px-6 py-5 text-center">
      <Text className="m-0 text-[32px] font-bold leading-10 tracking-[8px] text-white">
        {code}
      </Text>
    </Section>
  );
}
