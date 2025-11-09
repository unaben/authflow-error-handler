import { render, screen } from "@testing-library/react";
import AuthErrorPage from "@/app/auth-error/page";
import { useSearchParams } from "next/navigation";

jest.mock("next/navigation");

describe("AuthErrorPage", () => {
  it("renders 401 error correctly", () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => {
        if (key === "status") return "401";
        if (key === "message") return "Session expired";
        return "/dashboard";
      },
    });

    render(<AuthErrorPage />);
    expect(screen.getByText("Authentication Required")).toBeInTheDocument();
    expect(screen.getByText("Session expired")).toBeInTheDocument();
  });
});
