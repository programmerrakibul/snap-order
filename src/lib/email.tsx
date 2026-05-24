import { AccountCreatedEmailTemplate } from "@/emails/account-created";
import { EmailVerificationTemplate } from "@/emails/email-verification";
import { ResetEmailTemplate } from "@/emails/reset-email";
import { getEnv } from "@/lib/env";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import * as React from "react";

type SendEmailPayload = {
  to: string;
  subject: string;
  react: React.ReactElement;
  text: string;
};

let transporter: nodemailer.Transporter<
  SMTPTransport.SentMessageInfo,
  SMTPTransport.Options
> | null = null;

const getTransporter = () => {
  if (!transporter) {
    const {
      EMAIL_FROM,
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_REFRESH_TOKEN,
    } = getEnv();

    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: EMAIL_FROM,
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        refreshToken: GOOGLE_REFRESH_TOKEN,
      },
    });
  }

  return transporter;
};

const getFromAddress = () => {
  const { EMAIL_FROM, EMAIL_FROM_NAME } = getEnv();

  return `${EMAIL_FROM_NAME} <${EMAIL_FROM}>`;
};

export const sendEmail = async ({
  to,
  subject,
  react,
  text,
}: SendEmailPayload) => {
  const html = await render(react);

  return getTransporter().sendMail({
    from: getFromAddress(),
    to,
    subject,
    html,
    text,
  });
};

export const sendEmailVerificationOtp = async ({
  to,
  name,
  code,
}: {
  to: string;
  name?: string | null;
  code: string;
}) =>
  sendEmail({
    to,
    subject: "Verify your email",
    react: <EmailVerificationTemplate name={name} code={code} />,
    text: `Verify your email with this Snap Order code: ${code}. It expires in 10 minutes.`,
  });

export const sendAccountCreatedEmail = async ({
  to,
  name,
}: {
  to: string;
  name?: string | null;
}) =>
  sendEmail({
    to,
    subject: "Your Snap Order account has been created",
    react: <AccountCreatedEmailTemplate name={name} />,
    text: "Your Snap Order account has been created. Please verify your email to finish securing your account.",
  });

export const sendResetEmail = async ({
  to,
  name,
  code,
}: {
  to: string;
  name?: string | null;
  code: string;
}) =>
  sendEmail({
    to,
    subject: "Reset your Snap Order account access",
    react: <ResetEmailTemplate name={name} code={code} />,
    text: `Use this Snap Order reset code: ${code}. It expires in 10 minutes.`,
  });
