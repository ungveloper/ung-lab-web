import type { MetadataRoute } from "next";
import { tools, categories } from "@/lib/tools";
import { guides } from "@/lib/guides";
import { SITE_URL } from "@/lib/site-url";

/** 공개된 실제 페이지 목록만 안내합니다. 생성일을 수정일처럼 표시하지 않습니다. */
export default function sitemap(): MetadataRoute.Sitemap {
  if (process.env.NEXT_PUBLIC_LAUNCH_READY !== "true") return [];
  const fixed = ["/", "/tools", "/guides", "/about", "/contact", "/privacy", "/terms"];
  const paths = [
    ...fixed,
    ...tools.map(tool => `/tools/${tool.slug}`),
    ...Object.keys(categories).map(category => `/category/${category}`),
    ...guides.map(guide => `/guides/${guide.slug}`),
  ];
  return [...new Set(paths)].map(path => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path.startsWith("/guides/") ? "yearly" as const : "monthly" as const,
    priority: path === "/" ? 1 : path.startsWith("/tools/") ? 0.8 : 0.5,
  }));
}
