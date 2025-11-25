import { render, screen } from "@testing-library/react";
import Hero from "@/components/Hero";
import { LocaleProvider } from "@/contexts/LocaleContext";

vi.mock("@/hooks/useShouldRenderHeroCanvas", () => ({
  useShouldRenderHeroCanvas: () => false,
}));

describe("Hero component", () => {
  test("renders primary heading and CTA actions", () => {
    render(
      <LocaleProvider>
        <Hero />
      </LocaleProvider>,
    );

    expect(
      screen.getByRole("heading", { name: /Delowar Hossain/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Case Study/i })).toBeInTheDocument();
  });
});

