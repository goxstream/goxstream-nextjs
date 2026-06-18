import { EmailProvider, EmailMessage } from "../types";

export class ResendEmailProvider implements EmailProvider {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GOX_EMAIL_RESEND_API_KEY || "";
    if (!this.apiKey) {
      console.warn("Resend API key (GOX_EMAIL_RESEND_API_KEY) is not set in environment variables.");
    }
  }

  /**
   * Sends an email utilizing the Resend HTTP API.
   * Uses standard fetch to be compatible with Cloudflare Edge runtime.
   */
  async send(message: EmailMessage): Promise<void> {
    if (!this.apiKey) {
      throw new Error(
        "Resend API key is missing. Ensure GOX_EMAIL_RESEND_API_KEY environment variable is configured."
      );
    }

    const toAddresses = Array.isArray(message.to) ? message.to : [message.to];
    const fromString = message.from.name
      ? `${message.from.name} <${message.from.email}>`
      : message.from.email;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        from: fromString,
        to: toAddresses,
        subject: message.subject,
        html: message.html,
        text: message.text,
        reply_to: message.replyTo,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Resend email delivery failed: ${response.status} - ${errorText}`
      );
    }
  }
}
