// bot-protection.ts - Protection from malicious bots and scrapers
export function isBotRequest(userAgent: string | null): boolean {
  if (!userAgent) return false;
  const botRegex = /bot|crawler|spider|scrape|curl/i;
  return botRegex.test(userAgent);
}
