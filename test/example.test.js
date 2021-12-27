import { render, screen } from "@testing-library/react";

import Profile from "../pages/profile";

describe("Should render the app without crashing", () => {
  it("Render the home page with and heading", () => {
    render(<Profile />);
    expect(
      screen.getByRole("heading", { name: "Profile" })
    ).toBeInTheDocument();
  });
});
