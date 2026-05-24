import React from "react";
import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
  pixelBasedPreset,
} from "react-email";

type EmailLayoutProps = {
  preview: string;
  children: React.ReactNode;
};

export function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                brand: "#2563eb",
                ink: "#111827",
                muted: "#6b7280",
                surface: "#f6f7f9",
              },
            },
          },
        }}
      >
        <Body className="m-0 bg-surface font-sans text-ink">
          <Section className="w-full px-4 py-8">
            <Container className="mx-auto max-w-140 rounded-lg border border-solid border-gray-200 bg-white p-8">
              <Text className="m-0 mb-6 text-[18px] font-bold leading-6 text-ink">
                Snap Order
              </Text>
              {children}
            </Container>
            <Container className="mx-auto mt-4 max-w-140">
              <Text className="m-0 text-center text-[12px] leading-4.5 text-muted">
                This message was sent by Snap Order. If you did not request it,
                you can safely ignore this email.
              </Text>
            </Container>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
}
