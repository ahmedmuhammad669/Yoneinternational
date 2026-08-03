import { NextRequest, NextResponse } from "next/server";
import type { Locale } from "./lib/i18n";
import { createServerClient } from "@supabase/ssr";

const routeLocales: Record<string, Locale> = {
  us: "en-US",
  ar: "ar",
  de: "de",
  it: "it",
  zh: "zh-CN",
  ja: "ja",
  ko: "ko",
};

export async function proxy(request: NextRequest) {
  let authResponse=NextResponse.next({request});
  if(request.nextUrl.pathname.startsWith("/admin")||request.nextUrl.pathname.startsWith("/auth")){
    const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if(url&&key){const supabase=createServerClient(url,key,{cookies:{getAll:()=>request.cookies.getAll(),setAll:(updates)=>{updates.forEach(({name,value})=>request.cookies.set(name,value));authResponse=NextResponse.next({request});updates.forEach(({name,value,options})=>authResponse.cookies.set(name,value,options));}}});await supabase.auth.getUser();}
  }
  const segments = request.nextUrl.pathname.split("/").filter(Boolean);
  const locale = routeLocales[segments[0] || ""];
  if (!locale) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-yone-public-path", request.nextUrl.pathname);
    if(request.nextUrl.pathname.startsWith("/admin")||request.nextUrl.pathname.startsWith("/auth"))return authResponse;
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
    "/((?!api|_next|images|icon-|favicon.svg|manifest.webmanifest|sw.js|robots.txt|sitemap.xml).*)",
  ],
};
