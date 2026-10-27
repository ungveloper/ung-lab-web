import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const ready = process.env.NEXT_PUBLIC_LAUNCH_READY === "true";
  return {
    rules: ready
      ? [{ userAgent: "*", allow: "/", disallow: ["/api/", "/?"] }]
      : [{ userAgent: "*", disallow: "/" }],
    ...(ready ? { sitemap: `${SITE_URL}/sitemap.xml` } : {}),
  };
}
