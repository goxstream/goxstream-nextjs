import { getEnv } from "./env";

/**
 * Retrieves the bound Cloudflare Email Sending interface by its binding name.
 * 
 * @param bindingName - The name of the email binding in wrangler.jsonc
 * @returns The SendEmail interface instance
 */
export function getEmailBinding(bindingName: string): any {
  const env = getEnv() as any;
  const email = env[bindingName];
  if (!email) {
    throw new Error(
      `Cloudflare Send Email binding '${bindingName}' not found. Please ensure it is configured in wrangler.jsonc.`
    );
  }
  return email;
}
