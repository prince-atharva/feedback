import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken");
  const url = request.nextUrl.pathname;
  if (
    accessToken &&
    (url.startsWith("/signin") ||
      url.startsWith("/signup") ||
      url.startsWith("/verify"))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!accessToken && url == "/") {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

export const config = {
  matcher: ["/", "/signin", "/signup", "/verify/:path*"],
};
