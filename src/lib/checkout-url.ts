const UTM_PARAMETERS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
  "utm_id", "utm_source_platform", "utm_creative_format", "utm_marketing_tactic",
] as const;

/** Forward campaign labels only, never arbitrary visitor or personal data. */
export function buildCheckoutUrl(checkoutUrl: string, pageSearch: string): string {
  const checkout = new URL(checkoutUrl);
  const incoming = new URLSearchParams(pageSearch);
  for (const name of UTM_PARAMETERS) {
    const value = incoming.get(name);
    if (value) checkout.searchParams.set(name, value);
  }
  return checkout.toString();
}