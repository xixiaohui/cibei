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
  // No Origin header = same-origin request, no CORS headers needed
  if (!origin) return;

  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, Accept"
  );
  response.headers.set(
    "Access-Control-Expose-Headers",
    "Content-Length, Content-Type"
  );
  // CRITICAL: Without Vary: Origin, CDNs may cache a response for
  // one origin and serve it to another, causing spurious CORS failures.
  response.headers.set("Vary", "Origin");
}

export const config = {
  matcher: "/api/:path*",
};
