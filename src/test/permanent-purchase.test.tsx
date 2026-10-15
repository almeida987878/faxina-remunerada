import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { Route } from "@/routes/index";

it("offers the real checkout immediately without completing the video or enabling the switch", () => {
  const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
  const Page = Route.options.component;
  if (!Page) throw new Error("Video page is missing");
  render(<Page />);
  expect(screen.getByRole("link", { name: "Comprar Método Faxina Remunerada" })).toHaveAttribute(
    "href", "https://go.atomopay.com.br/p14pjthjpl",
  );
  expect(screen.getByRole("switch")).not.toBeChecked();
  play.mockRestore();
});