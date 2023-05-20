import { render, screen } from "@testing-library/react";
import Threads from "@app/threads/page";

describe("Threads tests", () => {
  it("should browse threads", () => {
    render(<Threads />);
    const text = screen.getByText(/threads/i);
    expect(text).toBeInTheDocument();
  });
});
