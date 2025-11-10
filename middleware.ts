import { NextRequest, NextResponse } from "next/server";
import { shouldSimulateError } from "./utils/shouldSimulateError";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname === "/auth-error" ||
    pathname === "/login"
  ) {
    return NextResponse.next();
  }

  const simulatedError = shouldSimulateError(request);
  if (simulatedError) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth-error";
    url.searchParams.delete("simulate");
    url.searchParams.set("status", simulatedError.status.toString());
    url.searchParams.set("message", simulatedError.message);
    url.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(url);
  }
}
