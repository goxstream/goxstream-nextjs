import { EmailProvider } from "./types";
import { CloudflareEmailProvider } from "./providers/cloudflare";
import { ResendEmailProvider } from "./providers/resend";
import { SmtpEmailProvider } from "./providers/smtp";
import { BrevoEmailProvider } from "./providers/brevo";
import { MailgunEmailProvider } from "./providers/mailgun";
import { AwsSesEmailProvider } from "./providers/ses";

/**
 * Factory function to retrieve the configured EmailProvider based on the GOX_EMAIL_PROVIDER variable.
 * Defaults to the native Cloudflare Email Sending provider.
 * 
 * @returns The resolved EmailProvider instance
 */
export function getEmailProvider(): EmailProvider {
  const providerType = process.env.GOX_EMAIL_PROVIDER || "cloudflare";

  switch (providerType.toLowerCase()) {
    case "cloudflare":
      return new CloudflareEmailProvider();
    case "resend":
      return new ResendEmailProvider();
    case "smtp":
      return new SmtpEmailProvider();
    case "brevo":
      return new BrevoEmailProvider();
    case "mailgun":
      return new MailgunEmailProvider();
    case "ses":
      return new AwsSesEmailProvider();
    default:
      console.warn(
        `Unknown email provider '${providerType}' configured. Falling back to CloudflareEmailProvider.`
      );
      return new CloudflareEmailProvider();
  }
}

/**
 * Unified application-level email service helper.
 */
export const emailService = {
  /**
   * Dispatches an email message to target recipients using the active provider.
   * 
   * @param to - Recipient email address or array of addresses
   * @param subject - Email subject line
   * @param html - HTML body content
   * @param text - Plain text body content
   * @param options - Additional options including replyTo
   */
  async send(
    to: string | string[],
    subject: string,
    html: string,
    text: string,
    options?: { replyTo?: string }
  ): Promise<void> {
    const provider = getEmailProvider();
    const fromEmail = process.env.GOX_EMAIL_FROM || "noreply@goxstream.com";
    const fromName = process.env.GOX_EMAIL_FROM_NAME || "GoxStream";

    await provider.send({
      to,
      from: {
        email: fromEmail,
        name: fromName,
      },
      subject,
      html,
      text,
      replyTo: options?.replyTo,
    });
  },
};
