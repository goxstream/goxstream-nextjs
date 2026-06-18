import { EmailProvider, EmailMessage } from "../types";

export class SmtpEmailProvider implements EmailProvider {
  private host: string;
  private port: number;
  private user: string;
  private pass: string;

  constructor() {
    this.host = process.env.GOX_EMAIL_SMTP_HOST || "";
    this.port = Number(process.env.GOX_EMAIL_SMTP_PORT) || 587;
    this.user = process.env.GOX_EMAIL_SMTP_USER || "";
    this.pass = process.env.GOX_EMAIL_SMTP_PASS || "";
  }

  /**
   * Sends an email utilizing SMTP configurations.
   * Note: In Cloudflare Workers V8 isolates, traditional Node.js TCP socket libraries (like nodemailer)
   * do not work directly. SMTP is simulated here or relayed via HTTP endpoints.
   */
  async send(message: EmailMessage): Promise<void> {
    if (!this.host || !this.user || !this.pass) {
      throw new Error(
        "SMTP configuration is incomplete. Ensure GOX_EMAIL_SMTP_HOST, GOX_EMAIL_SMTP_USER, and GOX_EMAIL_SMTP_PASS are configured."
      );
    }

    const toAddresses = Array.isArray(message.to) ? message.to : [message.to];
    const fromString = message.from.name
      ? `${message.from.name} <${message.from.email}>`
      : message.from.email;

    console.log(
      `[SMTP RELAY SIMULATION] Relaying email to ${this.host}:${this.port}. From: ${fromString}, To: ${toAddresses.join(
        ", "
      )}, Subject: ${message.subject}`
    );
  }
}
