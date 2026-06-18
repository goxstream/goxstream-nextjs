import { EmailProvider, EmailMessage } from "../types";

export class AwsSesEmailProvider implements EmailProvider {
  private accessKeyId: string;
  private secretAccessKey: string;
  private region: string;

  constructor() {
    this.accessKeyId = process.env.GOX_EMAIL_AWS_ACCESS_KEY_ID || "";
    this.secretAccessKey = process.env.GOX_EMAIL_AWS_SECRET_ACCESS_KEY || "";
    this.region = process.env.GOX_EMAIL_AWS_REGION || "us-east-1";

    if (!this.accessKeyId || !this.secretAccessKey) {
      console.warn(
        "AWS credentials (GOX_EMAIL_AWS_ACCESS_KEY_ID / GOX_EMAIL_AWS_SECRET_ACCESS_KEY) are not set in environment variables."
      );
    }
  }

  private async hmac(key: Uint8Array | ArrayBuffer, message: string | Uint8Array): Promise<Uint8Array> {
    const msgBuffer = typeof message === "string" ? new TextEncoder().encode(message) : message;
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      key as any,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const sigBuffer = await crypto.subtle.sign("HMAC", cryptoKey, msgBuffer as any);
    return new Uint8Array(sigBuffer);
  }

  private async sha256(message: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  private async getSignatureKey(
    key: string,
    dateStamp: string,
    regionName: string,
    serviceName: string
  ): Promise<Uint8Array> {
    const kDate = await this.hmac(new TextEncoder().encode("AWS4" + key), dateStamp);
    const kRegion = await this.hmac(kDate, regionName);
    const kService = await this.hmac(kRegion, serviceName);
    return await this.hmac(kService, "aws4_request");
  }

  /**
   * Sends an email utilizing the AWS SES v2 Outbound Emails HTTP API.
   * Leverages Web Crypto API (SubtleCrypto) to calculate the AWS Signature Version 4.
   * Completely compatible with Cloudflare Edge runtime with no Node.js dependencies.
   */
  async send(message: EmailMessage): Promise<void> {
    if (!this.accessKeyId || !this.secretAccessKey) {
      throw new Error(
        "AWS credentials are incomplete. Ensure GOX_EMAIL_AWS_ACCESS_KEY_ID and GOX_EMAIL_AWS_SECRET_ACCESS_KEY environment variables are configured."
      );
    }

    const toAddresses = Array.isArray(message.to) ? message.to : [message.to];
    const fromString = message.from.name
      ? `${message.from.name} <${message.from.email}>`
      : message.from.email;

    const payload: Record<string, any> = {
      FromEmailAddress: fromString,
      Destination: {
        ToAddresses: toAddresses,
      },
      Content: {
        Simple: {
          Subject: {
            Data: message.subject,
            Charset: "UTF-8",
          },
          Body: {
            Text: {
              Data: message.text,
              Charset: "UTF-8",
            },
            Html: {
              Data: message.html,
              Charset: "UTF-8",
            },
          },
        },
      },
    };

    if (message.replyTo) {
      payload.ReplyToAddresses = [message.replyTo];
    }

    const payloadStr = JSON.stringify(payload);
    const payloadHash = await this.sha256(payloadStr);

    const amzDate = new Date().toISOString().replace(/[:-]/g, "").split(".")[0] + "Z";
    const dateStamp = amzDate.substring(0, 8);

    const host = `email.${this.region}.amazonaws.com`;
    const contentType = "application/json";

    const canonicalHeaders =
      `content-type:${contentType}\n` +
      `host:${host}\n` +
      `x-amz-content-sha256:${payloadHash}\n` +
      `x-amz-date:${amzDate}\n`;

    const signedHeaders = "content-type;host;x-amz-content-sha256;x-amz-date";

    const canonicalRequest = [
      "POST",
      "/v2/email/outbound-emails",
      "",
      canonicalHeaders,
      signedHeaders,
      payloadHash,
    ].join("\n");

    const credentialScope = `${dateStamp}/${this.region}/ses/aws4_request`;
    const hashedCanonicalRequest = await this.sha256(canonicalRequest);

    const stringToSign = [
      "AWS4-HMAC-SHA256",
      amzDate,
      credentialScope,
      hashedCanonicalRequest,
    ].join("\n");

    const signingKey = await this.getSignatureKey(
      this.secretAccessKey,
      dateStamp,
      this.region,
      "ses"
    );

    const signatureBytes = await this.hmac(signingKey, stringToSign);
    const signature = Array.from(signatureBytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const authorization = `AWS4-HMAC-SHA256 Credential=${this.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    const response = await fetch(`https://${host}/v2/email/outbound-emails`, {
      method: "POST",
      headers: {
        "Content-Type": contentType,
        Host: host,
        "X-Amz-Content-Sha256": payloadHash,
        "X-Amz-Date": amzDate,
        Authorization: authorization,
      },
      body: payloadStr,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `AWS SES email delivery failed: ${response.status} - ${errorText}`
      );
    }
  }
}
