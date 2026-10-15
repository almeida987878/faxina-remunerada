import { describe, expect, it } from "vitest";

import { ATOMOPAY_CHECKOUT_URL, shouldShowPurchaseButton } from "@/lib/page-data";

// The purchase button goes straight to the payment page, so a placeholder or a
// relative address would send buyers to a dead end instead of the checkout.
describe("Checkout link", () => {
  it("points at the real Atomopay payment page", () => {
    const url = new URL(ATOMOPAY_CHECKOUT_URL);

    expect(ATOMOPAY_CHECKOUT_URL).not.toContain("COLE_AQUI");
    expect(url.protocol).toBe("https:");
    expect(url.hostname).toBe("go.atomopay.com.br");
    expect(url.pathname).toBe("/p14pjthjpl");
  });
});

describe("Purchase button visibility", () => {
  it("stays hidden before completion when the option is off", () => {
    expect(shouldShowPurchaseButton(false, false)).toBe(false);
  });

  it("appears without video completion when keep-visible is enabled", () => {
    expect(shouldShowPurchaseButton(false, true)).toBe(true);
  });

  it("remains visible after completion even when the option is off", () => {
    expect(shouldShowPurchaseButton(true, false)).toBe(true);
  });
});
