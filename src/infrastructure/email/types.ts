export interface EmailAddress {
  email: string;
  name?: string;
}

export interface EmailMessage {
  to: string | string[];
  from: EmailAddress;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

export interface EmailProvider {
  /**
   * Sends an email message.
   * 
   * @param message - The email payload to send
   */
  send(message: EmailMessage): Promise<void>;
}
