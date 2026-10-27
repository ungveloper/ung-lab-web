import { guides } from "@/lib/guides";
import { toolBySlug } from "@/lib/tools";
import { SITE_URL } from "@/lib/site-url";

// XML 엔티티를 이스케이프하여 제목/설명에 특수문자가 있어도 RSS가 유효하게 유지됩니다.
function xml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

/** 새 가이드가 lib/guides.ts에 등록되면 RSS 항목도 함께 갱신됩니다. */
export function GET(): Response {
  if (process.env.NEXT_PUBLIC_LAUNCH_READY !== "true") {
    return new Response("Not Found\n", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }
  const entries = guides.map(guide => {
    const url = `${SITE_URL}/guides/${encodeURIComponent(guide.slug)}`;
    const tool = toolBySlug(guide.tool);
    const summary = [guide.overview, ...guide.steps, ...guide.checks, ...guide.troubleshooting].join(" ");
    return `<item><title>${xml(guide.title)}</title><link>${xml(url)}</link><guid isPermaLink="true">${xml(url)}</guid><description>${xml(summary)}</description>${tool ? `<category>${xml(tool.title)}</category>` : ""}</item>`;
  }).join("\n");
  const feed = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>웅이연구소 사용 가이드</title><link>${SITE_URL}/guides</link><description>PDF, 이미지, 문서 작업에 필요한 사용법과 문제 해결 방법</description><language>ko-KR</language><generator>웅이연구소</generator>${entries}</channel></rss>`;
  return new Response(feed, { status: 200, headers: {
    "Content-Type": "application/rss+xml; charset=utf-8",
    "Cache-Control": "public, max-age=0, s-maxage=3600",
    "X-Content-Type-Options": "nosniff",
  } });
}
