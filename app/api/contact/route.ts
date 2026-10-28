import { NextRequest, NextResponse } from "next/server";

const noStore = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
const json = (message: string, status: number) => NextResponse.json({ message }, { status, headers: noStore });
const richText = (value: string) => [{ type: "text", text: { content: value } }];

// Only provider status and machine-readable error code are logged.
// Never log tokens, Notion response messages, user inputs or page contents.
async function notionFailure(stage: "schema" | "create", response: Response) {
  let upstreamCode = "unknown";
  try {
    const detail: unknown = await response.json();
    if (detail && typeof detail === "object" && "code" in detail && typeof detail.code === "string") {
      upstreamCode = /^[a-z_]{1,64}$/.test(detail.code) ? detail.code : "other";
    }
  } catch { /* Provider returned non-JSON; do not expose it. */ }
  console.error(`[contact:notion] stage=${stage} status=${response.status} code=${upstreamCode}`);
  const code = stage === "schema" ? "CONTACT_SOURCE_UNAVAILABLE" : "CONTACT_WRITE_FAILED";
  return NextResponse.json(
    { message: "문의 서비스 연결에 문제가 발생했습니다. 잠시 후 외부 문의 양식을 이용해 주세요.", code },
    { status: 502, headers: noStore },
  );
}


type Property = { type?: string; status?: { options?: { name: string }[] } };

type ContactInput = { name?: unknown; email?: unknown; subject?: unknown; message?: unknown; website?: unknown };

function propertyMap(properties: Record<string, Property>, name: string, value: string) {
  const prop = properties[name];
  if (!prop) return null;
  switch (prop.type) {
    case "rich_text": return { rich_text: richText(value) };
    case "email": return name === "이메일" ? { email: value } : null;
    case "title": return { title: richText(value) };
    default: return null;
  }
}

export async function POST(request: NextRequest) {
  const token = process.env.NOTION_API_TOKEN?.trim();
  const dataSourceId = process.env.NOTION_DATA_SOURCE_ID?.trim();
  if (!token || !dataSourceId || !/^[0-9a-f-]{32,36}$/i.test(dataSourceId)) return json("문의 기능 설정을 확인해 주세요.", 503);

  const origin = request.headers.get("origin");
  if (!origin || origin !== request.nextUrl.origin) return json("허용되지 않은 요청입니다.", 403);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return json("잘못된 요청 형식입니다.", 415);
  if (Number(request.headers.get("content-length") || 0) > 12000) return json("문의 내용이 너무 깁니다.", 413);

  let data: ContactInput;
  try {
    const raw = await request.text();
    if (raw.length > 12000) return json("문의 내용이 너무 깁니다.", 413);
    data = JSON.parse(raw) as ContactInput;
  } catch {
    return json("입력 내용을 다시 확인해 주세요.", 400);
  }
  if (!data || typeof data !== "object") return json("입력 내용을 다시 확인해 주세요.", 400);
  if (data.website) return NextResponse.json({ ok: true }, { status: 200, headers: noStore }); // spam honeypot

  const name = typeof data.name === "string" ? data.name.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const subject = typeof data.subject === "string" ? data.subject.trim() : "";
  const body = typeof data.message === "string" ? data.message.trim() : "";
  if (!name || name.length > 80 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !subject || subject.length > 120 || body.length < 10 || body.length > 4000) {
    return json("필수 항목을 확인해 주세요.", 400);
  }

  const headers = { Authorization: `Bearer ${token}`, "Notion-Version": "2026-03-11", "Content-Type": "application/json" };
  try {
    const schemaResponse = await fetch(`https://api.notion.com/v1/data_sources/${dataSourceId}`, { headers, cache: "no-store", signal: AbortSignal.timeout(10000) });
    if (!schemaResponse.ok) return notionFailure("schema", schemaResponse);
    const schema = await schemaResponse.json() as { properties?: Record<string, Property> };
    const available = schema.properties;
    if (!available) return json("문의 설정을 확인해 주세요.", 503);
    const titleKey = Object.entries(available).find(([, p]) => p?.type === "title")?.[0];
    if (!titleKey) return json("문의 양식 설정을 확인해 주세요.", 503);
    const title = `[문의] ${subject}`;
    const properties: Record<string, unknown> = { [titleKey]: { title: richText(title) } };
    for (const [key, value] of [["성함 혹은 닉네임", name], ["이메일", email]] as const) {
      if (key === titleKey) continue;
      const prop = propertyMap(available, key, value);
      if (prop) properties[key] = prop;
    }
    const status = available["상태"];
    if (status?.type === "status" && status.status?.options?.some(o => o.name === "접수")) {
      properties["상태"] = { status: { name: "접수" } };
    }
    const children = [
      { object: "block", type: "paragraph", paragraph: { rich_text: richText(`이름: ${name}`) } },
      { object: "block", type: "paragraph", paragraph: { rich_text: richText(`이메일: ${email}`) } },
      { object: "block", type: "paragraph", paragraph: { rich_text: richText(`제목: ${subject}`) } },
      ...Array.from({ length: Math.ceil(body.length / 1800) }, (_, i) => ({ object: "block", type: "paragraph", paragraph: { rich_text: richText(body.slice(i * 1800, (i + 1) * 1800)) } })),
    ];
    const res = await fetch("https://api.notion.com/v1/pages", {
      method: "POST", headers, cache: "no-store", signal: AbortSignal.timeout(10000),
      body: JSON.stringify({ parent: { type: "data_source_id", data_source_id: dataSourceId }, properties, children }),
    });
    if (!res.ok) return notionFailure("create", res);
    return NextResponse.json({ ok: true }, { status: 201, headers: noStore });
  } catch (error: unknown) {
    const errorType = error instanceof Error && /^[A-Za-z]{1,40}$/.test(error.name) ? error.name : "unknown";
    console.error(`[contact:notion] stage=network error_type=${errorType}`);
    return NextResponse.json(
      { message: "문의 서비스와 통신하지 못했습니다. 네트워크 상태를 확인해 주세요.", code: "CONTACT_NETWORK_ERROR" },
      { status: 502, headers: noStore },
    );
  }
}
