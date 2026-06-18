import { EmailProvider, EmailMessage } from "../types";

export class BrevoEmailProvider implements EmailProvider {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GOX_EMAIL_BREVO_API_KEY || "";
    if (!this.apiKey) {
      console.warn("Brevo API key (GOX_EMAIL_BREVO_API_KEY) is not set in environment variables.");
    }
  }

  /**
   * Sends an email utilizing the Brevo Transactional Email HTTP API (v3).
   * Uses standard fetch to be compatible with Cloudflare Edge runtime.
   */
  async send(message: EmailMessage): Promise<void> {
    if (!this.apiKey) {
      throw new Error(
        "Brevo API key is missing. Ensure GOX_EMAIL_BREVO_API_KEY environment variable is configured."
      );
    }

    const toAddresses = Array.isArray(message.to) ? message.to : [message.to];
    const toList = toAddresses.map((email) => ({ email }));

    const body: Record<string, any> = {
      sender: {
        email: message.from.email,
        name: message.from.name,
      },
      to: toList,
      subject: message.subject,
      htmlContent: message.html,
      textContent: message.text,
    };

    if (message.replyTo) {
      body.replyTo = {
        email: message.replyTo,
      };
    }

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": this.apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Brevo email delivery failed: ${response.status} - ${errorText}`
      );
    }
  }
}
