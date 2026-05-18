import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Replay } from "../src/Replay";

vi.mock("@four-leaf-studios/rl-socket-hook", () => ({
  useEventSelector: vi.fn(() => null),
  useEvent: vi.fn(() => null),
}));

// We need to mock useReplay since it depends on the socket hook
const mockUseReplay = vi.fn();
vi.mock("../src/hooks/useReplay", () => ({
  default: () => mockUseReplay(),
}));

describe("Replay", () => {
  it("renders replay box when replay is active", () => {
    mockUseReplay.mockReturnValue({ active: true });
    render(<Replay />);
    expect(screen.getByText("Replay")).toBeInTheDocument();
  });

  it("returns null when replay is not active", () => {
    mockUseReplay.mockReturnValue({ active: false });
    const { container } = render(<Replay />);
    expect(container.innerHTML).toBe("");
  });
});
