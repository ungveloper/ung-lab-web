import { NextRequest, NextResponse } from "next/server";

const noStore = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
const json = (message: string, status: number) => NextResponse.json({ message }, { status, headers: noStore });
const richText = (value: string) => [{ type: "text", text: { content: value } }];

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
    if (!schemaResponse.ok) return json("문의 서비스를 일시적으로 이용할 수 없습니다.", 502);
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
    if (!res.ok) return json("문의 서비스 응답에 문제가 발생했습니다.", 502);
    return NextResponse.json({ ok: true }, { status: 201, headers: noStore });
  } catch {
    return json("잠시 후 다시 시도해 주세요.", 502);
  }
}
