import { NextRequest, NextResponse } from "next/server";
import { isLocale, localeCookie } from "../../../lib/i18n";

function safeReturnPath(request: NextRequest) {
  const explicit = request.nextUrl.searchParams.get("returnTo");
  if (explicit?.startsWith("/") && !explicit.startsWith("//")) return explicit;

  const referer = request.headers.get("referer");
  if (!referer) return "/";

  try {
    const source = new URL(referer);
    if (source.origin !== request.nextUrl.origin) return "/";
    return `${source.pathname}${source.search}`;
  } catch {
    return "/";
  }
}

export function GET(request: NextRequest) {
  const requested = request.nextUrl.searchParams.get("locale");
  const locale = isLocale(requested) ? requested : "en";
  const prefixes = {
    en: "",
    "en-US": "/us",
    ar: "/ar",
    de: "/de",
    it: "/it",
    "zh-CN": "/zh",
    ja: "/ja",
    ko: "/ko",
  } as const;
  const returnUrl = new URL(safeReturnPath(request), request.nextUrl.origin);
  const knownPrefixes = Object.values(prefixes).filter(Boolean);
  const activePrefix = knownPrefixes.find(
    (prefix) =>
      returnUrl.pathname === prefix ||
      returnUrl.pathname.startsWith(`${prefix}/`),
  );
  const unprefixedPath = activePrefix
    ? returnUrl.pathname.slice(activePrefix.length) || "/"
    : returnUrl.pathname;
  const nextPath =
    `${prefixes[locale]}${unprefixedPath === "/" ? "" : unprefixedPath}` || "/";
  const destination = new URL(`${nextPath}${returnUrl.search}`, request.nextUrl.origin);
  destination.searchParams.delete("locale");

  const response = NextResponse.redirect(destination, 303);
  response.cookies.set(localeCookie, locale, {
    // This is a non-sensitive display preference. Keeping it readable allows
    // the no-account language control to recover gracefully in all runtimes.
    httpOnly: false,
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}
