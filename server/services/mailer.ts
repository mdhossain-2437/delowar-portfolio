import { Resend } from "resend";
import { appConfig } from "../config";

const resend =
  appConfig.resendApiKey !== ""
    ? new Resend(appConfig.resendApiKey)
    : undefined;

interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactNotification(payload: ContactPayload) {
  if (!resend) {
    console.warn("Resend API key missing. Skipping email notification.");
    return;
  }

  try {
    await resend.emails.send({
      from: appConfig.emailSender,
      to: appConfig.contactInboxEmail,
      subject: `Portfolio contact from ${payload.name}: ${payload.subject}`,
      text: [
        `Name: ${payload.name}`,
        `Email: ${payload.email}`,
        `Subject: ${payload.subject}`,
        "",
        payload.message,
      ].join("\n"),
    });
  } catch (error) {
    console.error("Failed to send contact notification:", error);
  }
}

export async function sendContactReplyEmail(to: string, body: string) {
  if (!resend) {
    console.warn("Resend API key missing. Cannot send replies.");
    return;
  }

  try {
    await resend.emails.send({
      from: appConfig.emailSender,
      to,
      subject: "Thanks for reaching out",
      text: body,
    });
  } catch (error) {
    console.error("Failed to send reply email:", error);
  }
}
