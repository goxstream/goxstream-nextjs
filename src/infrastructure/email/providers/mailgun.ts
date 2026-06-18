import { EmailProvider, EmailMessage } from "../types";

export class MailgunEmailProvider implements EmailProvider {
  private apiKey: string;
  private domain: string;
  private region: string;

  constructor() {
    this.apiKey = process.env.GOX_EMAIL_MAILGUN_API_KEY || "";
    this.domain = process.env.GOX_EMAIL_MAILGUN_DOMAIN || "";
    this.region = (process.env.GOX_EMAIL_MAILGUN_REGION || "US").toUpperCase();

    if (!this.apiKey) {
      console.warn("Mailgun API key (GOX_EMAIL_MAILGUN_API_KEY) is not set in environment variables.");
    }
    if (!this.domain) {
      console.warn("Mailgun domain (GOX_EMAIL_MAILGUN_DOMAIN) is not set in environment variables.");
    }
  }

  /**
   * Sends an email utilizing the Mailgun HTTP API.
   * Uses standard fetch to be compatible with Cloudflare Edge runtime.
   */
  async send(message: EmailMessage): Promise<void> {
    if (!this.apiKey || !this.domain) {
      throw new Error(
        "Mailgun configuration is incomplete. Ensure GOX_EMAIL_MAILGUN_API_KEY and GOX_EMAIL_MAILGUN_DOMAIN environment variables are configured."
      );
    }

    const toAddresses = Array.isArray(message.to) ? message.to.join(",") : message.to;
    const fromString = message.from.name
      ? `${message.from.name} <${message.from.email}>`
      : message.from.email;

    const host = this.region === "EU" ? "api.eu.mailgun.net" : "api.mailgun.net";
    const url = `https://${host}/v3/${this.domain}/messages`;

    const params = new URLSearchParams();
    params.append("from", fromString);
    params.append("to", toAddresses);
    params.append("subject", message.subject);
    params.append("text", message.text);
    params.append("html", message.html);

    if (message.replyTo) {
      params.append("h:Reply-To", message.replyTo);
    }

    const authHeader = `Basic ${btoa(`api:${this.apiKey}`)}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Mailgun email delivery failed: ${response.status} - ${errorText}`
      );
    }
  }
}
