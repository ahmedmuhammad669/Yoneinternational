import type { MetadataRoute } from "next";
import { baseUrl } from "../lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/cookie-preferences", "/html-sitemap"] }],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

