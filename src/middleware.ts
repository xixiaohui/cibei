import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Always use the exact request origin — never '*'.
  // Credentialed requests (withCredentials: true) require a specific
  // origin; the browser rejects 'Access-Control-Allow-Origin: *' when
  // 'Access-Control-Allow-Credentials: true' is present.
  const origin = request.headers.get("origin") ?? "";

  // Handle CORS preflight (OPTIONS) requests
  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 204 });
    setCorsHeaders(response, origin);
    response.headers.set("Access-Control-Max-Age", "86400");
    return response;
  }

  // For actual API requests, add CORS headers
  const response = NextResponse.next();
  setCorsHeaders(response, origin);
  return response;
}

function setCorsHeaders(response: NextResponse, origin: string) {
  if (origin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set(
    "Access-Control-Expose-Headers",
    "Content-Length, X-Custom-Header"
  );
}

export const config = {
  matcher: "/api/:path*",
};
