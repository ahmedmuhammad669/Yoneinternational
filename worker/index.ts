/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import { setRuntimeEnv, type YoneRuntimeEnv } from "../lib/runtime-env";

interface Env extends YoneRuntimeEnv {
  ASSETS: Fetcher;
  DB: D1Database;
  BUCKET: R2Bucket;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    setRuntimeEnv(env);
    const url = new URL(request.url);

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    if (request.method === "GET" && env.DB) {
      const userAgent=request.headers.get("user-agent")||"";
      const excluded=url.pathname.startsWith("/admin")||url.pathname.startsWith("/api")||url.pathname.startsWith("/_")||url.pathname.includes(".");
      const bot=/bot|crawler|spider|preview|headless/i.test(userAgent);
      if(!excluded&&!bot&&request.headers.get("sec-gpc")!=="1"){
        const referrer=request.headers.get("referer");
        let referrerDomain:string|null=null;
        try{referrerDomain=referrer?new URL(referrer).hostname:null;}catch{}
        const deviceClass=/mobile|android|iphone/i.test(userAgent)?"mobile":/tablet|ipad/i.test(userAgent)?"tablet":"desktop";
        ctx.waitUntil(env.DB.prepare("INSERT INTO analytics_events(id,event_name,path,anonymous_id,referrer_domain,utm_source,utm_medium,utm_campaign,country,city,device_class,consent_mode,is_bot,occurred_at) VALUES(?,?,?,NULL,?,?,?,?,?,?,?,'cookieless',0,?)")
          .bind(`evt_${crypto.randomUUID().replaceAll("-","")}`,"page_view",url.pathname,referrerDomain,url.searchParams.get("utm_source"),url.searchParams.get("utm_medium"),url.searchParams.get("utm_campaign"),request.headers.get("cf-ipcountry"),request.headers.get("cf-ipcity"),deviceClass,Math.floor(Date.now()/1000)).run().catch(()=>undefined));
      }
    }
    const redirectRow=request.method==="GET"&&env.DB?await env.DB.prepare("SELECT destination_path AS destination,status_code AS statusCode FROM redirects WHERE source_path=? AND active=1 LIMIT 1").bind(url.pathname).first<{destination:string;statusCode:number}>().catch(()=>null):null;
    if(redirectRow)return Response.redirect(new URL(redirectRow.destination,url.origin),redirectRow.statusCode);
    const response=await handler.fetch(request, env, ctx);
    const secured=new Response(response.body,response);
    secured.headers.set("Content-Security-Policy","default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self'; font-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests");
    secured.headers.set("Strict-Transport-Security","max-age=31536000; includeSubDomains; preload");
    secured.headers.set("Referrer-Policy","strict-origin-when-cross-origin");
    secured.headers.set("Permissions-Policy","camera=(), microphone=(), geolocation=(), payment=()");
    secured.headers.set("X-Content-Type-Options","nosniff");
    secured.headers.set("X-Frame-Options","DENY");
    secured.headers.set("Cross-Origin-Opener-Policy","same-origin");
    if(url.pathname.startsWith("/admin")||url.pathname.startsWith("/api"))secured.headers.set("Cache-Control","private, no-store");
    return secured;
  },
};

export default worker;
