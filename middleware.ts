import { NextRequest, NextResponse } from "next/server";

// Add this helper function for testing
function shouldSimulateError(
  request: NextRequest
): { status: number; message: string } | null {
  const { searchParams } = request.nextUrl;

  // Allow testing with ?simulate=401, ?simulate=403, etc.
  const simulate = searchParams.get("simulate");

  if (simulate === "401") {
    return { status: 401, message: "Your session has expired" };
  }
  if (simulate === "403") {
    return {
      status: 403,
      message: "You do not have permission to access this resource",
    };
  }
  if (simulate === "429") {
    return {
      status: 429,
      message: "Too many requests. Please try again later",
    };
  }
  if (simulate === "500") {
    return { status: 500, message: "Service temporarily unavailable" };
  }

  return null;
}

// In your middleware function, add this before the token check:
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for certain paths
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname === "/auth-error" ||
    pathname === "/login"
  ) {
    return NextResponse.next();
  }

  // TEST MODE: Check for simulated errors
  const simulatedError = shouldSimulateError(request);
  if (simulatedError) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth-error";
    url.searchParams.delete("simulate"); // Remove simulate param
    url.searchParams.set("status", simulatedError.status.toString());
    url.searchParams.set("message", simulatedError.message);
    url.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Rest of your existing middleware code...
}
