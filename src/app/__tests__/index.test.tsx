import { render, screen } from "@testing-library/react";
import Index from "../page";

describe("Index", () => {
  it("renders the index page", () => {
    render(<Index />);
    const text = screen.getByText(/get started/i);
    expect(text).toBeInTheDocument();
  });
});
