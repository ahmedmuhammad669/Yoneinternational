import { NextRequest, NextResponse } from "next/server";
import type { Locale } from "./lib/i18n";

const routeLocales: Record<string, Locale> = {
  us: "en-US",
  ar: "ar",
  de: "de",
  it: "it",
  zh: "zh-CN",
  ja: "ja",
  ko: "ko",
};

export function proxy(request: NextRequest) {
  const segments = request.nextUrl.pathname.split("/").filter(Boolean);
  const locale = routeLocales[segments[0] || ""];
  if (!locale) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-yone-public-path", request.nextUrl.pathname);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const remainingPath = `/${segments.slice(1).join("/")}` || "/";
  if (remainingPath === "/admin" || remainingPath.startsWith("/admin/")) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  const destination = request.nextUrl.clone();
  destination.pathname = remainingPath;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-yone-locale", locale);
  requestHeaders.set("x-yone-locale-prefix", segments[0]);
  requestHeaders.set("x-yone-public-path", request.nextUrl.pathname);

  return NextResponse.rewrite(destination, {
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    "/((?!api|admin|_next|images|favicon.svg|robots.txt|sitemap.xml).*)",
  ],
};
