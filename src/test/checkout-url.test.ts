import { describe, expect, it } from "vitest";
import { buildCheckoutUrl } from "@/lib/checkout-url";
import { ATOMOPAY_CHECKOUT_URL } from "@/lib/page-data";

describe("Checkout campaign parameters", () => {
  it("forwards incoming UTMs to the configured AtomoPay checkout", () => {
    const result = new URL(buildCheckoutUrl(ATOMOPAY_CHECKOUT_URL, "?utm_source=instagram&utm_medium=paid&utm_campaign=faxina&utm_content=video&utm_term=celular"));
    expect(result.origin + result.pathname).toBe("https://go.atomopay.com.br/p14pjthjpl");
    expect(Object.fromEntries(result.searchParams)).toEqual({ utm_source: "instagram", utm_medium: "paid", utm_campaign: "faxina", utm_content: "video", utm_term: "celular" });
  });
  it("keeps the original checkout URL when no UTMs are provided", () => {
    expect(buildCheckoutUrl(ATOMOPAY_CHECKOUT_URL, "")).toBe(ATOMOPAY_CHECKOUT_URL);
  });
  it("preserves existing checkout parameters and correctly encodes campaign labels", () => {
    const result = new URL(buildCheckoutUrl(`${ATOMOPAY_CHECKOUT_URL}?offer=original`, "?utm_campaign=Faxina+%26+IA"));
    expect(result.searchParams.get("offer")).toBe("original");
    expect(result.searchParams.get("utm_campaign")).toBe("Faxina & IA");
  });
  it("does not forward personal data or unrelated page parameters", () => {
    const result = new URL(buildCheckoutUrl(ATOMOPAY_CHECKOUT_URL, "?email=private@example.com&phone=123&token=secret&utm_source=instagram"));
    expect([...result.searchParams.keys()]).toEqual(["utm_source"]);
  });
});