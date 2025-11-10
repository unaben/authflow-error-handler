import { NextRequest } from "next/server";

export function shouldSimulateError(
  request: NextRequest
): { status: number; message: string } | null {
  const { searchParams } = request.nextUrl;

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
