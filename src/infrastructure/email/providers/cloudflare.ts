import { EmailProvider, EmailMessage } from "../types";
import { getEmailBinding } from "@/cloudflare/bindings/email";

export class CloudflareEmailProvider implements EmailProvider {
  /**
   * Sends an email utilizing the native Cloudflare Workers Email Sending binding.
   * Consumes the Cloudflare-specific email binding.
   */
  async send(message: EmailMessage): Promise<void> {
    const emailBinding = getEmailBinding("EMAIL");
    if (typeof emailBinding.send !== "function") {
      throw new Error(
        "Invalid Cloudflare Send Email Binding. The 'send' method is not available."
      );
    }

    const toAddresses = Array.isArray(message.to) ? message.to : [message.to];

    for (const to of toAddresses) {
      await emailBinding.send({
        to,
        from: {
          email: message.from.email,
          name: message.from.name,
        },
        subject: message.subject,
        html: message.html,
        text: message.text,
      });
    }
  }
}
