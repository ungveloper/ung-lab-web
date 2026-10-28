#!/usr/bin/env node
/** Read-only Notion contact connectivity check. No secrets or response bodies are printed. */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadLocalEnv() {
  const file = resolve(process.cwd(), ".env.local");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const entry = /^\s*(?:export\s+)?(NOTION_API_TOKEN|NOTION_DATA_SOURCE_ID)\s*=\s*(.*)\s*$/.exec(line);
    if (!entry || process.env[entry[1]]) continue;
    let value = entry[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[entry[1]] = value;
  }
}

function instructions(status) {
  if (status === 401) return "Notion 연동 토큰이 유효한지 확인하세요. Internal integration secret을 새로 확인해 주세요.";
  if (status === 403) return "Notion 연동 권한(Read content / Insert content)을 확인하고 대상 데이터베이스에 연결을 추가하세요.";
  if (status === 404) return "폼 페이지/데이터베이스 ID가 아닌 실제 Data source ID인지, 해당 데이터베이스가 연동에 공유됐는지 확인하세요.";
  if (status === 400) return "데이터 소스 ID와 Notion API 버전을 확인하세요.";
  if (status === 429) return "Notion 요청 제한입니다. 잠시 후 진단을 재실행하세요.";
  return "Notion 서비스 상태와 네트워크를 확인하세요.";
}

loadLocalEnv();
const token = process.env.NOTION_API_TOKEN?.trim() ?? "";
const id = process.env.NOTION_DATA_SOURCE_ID?.trim() ?? "";
if (!token || !id) {
  console.error("진단 실패: .env.local에 NOTION_API_TOKEN, NOTION_DATA_SOURCE_ID 중 누락된 값이 있습니다. (값은 출력하지 않습니다.)");
  process.exitCode = 2;
} else if (!/^[0-9a-f-]{32,36}$/i.test(id)) {
  console.error("진단 실패: NOTION_DATA_SOURCE_ID 형식이 올바르지 않습니다. (값은 출력하지 않습니다.)");
  process.exitCode = 2;
} else {
  console.log("Notion 연동 진단: 자격 증명과 Data Source ID 형식 확인됨 (실제 값 숨김)");
  try {
    const response = await fetch(`https://api.notion.com/v1/data_sources/${id}`, {
      headers: { Authorization: `Bearer ${token}`, "Notion-Version": "2026-03-11" },
      signal: AbortSignal.timeout(12000),
      cache: "no-store",
    });
    console.log(`Notion 데이터 소스 조회: HTTP ${response.status}`);
    if (!response.ok) {
      let code = "unknown";
      try { const data = await response.json(); if (typeof data?.code === "string" && /^[a-z_]{1,64}$/.test(data.code)) code = data.code; } catch { /* ignore */ }
      console.error(`Notion 오류 코드: ${code}`);
      console.error(`확인할 사항: ${instructions(response.status)}`);
      process.exitCode = 1;
    } else {
      const data = await response.json();
      const properties = data && typeof data.properties === "object" ? data.properties : null;
      const title = properties && Object.entries(properties).find(([,value]) => value?.type === "title")?.[0];
      if (!title) { console.error("조회는 성공했지만 title 속성이 보이지 않습니다. Data Source 스키마를 확인하세요."); process.exitCode = 1; }
      else {
        console.log("데이터 소스 조회 및 title 속성 확인 성공.");
        for (const [name, type] of [["성함 혹은 닉네임", "rich_text"], ["이메일", "email"]]) {
          const found = properties?.[name];
          console.log(`${name} 속성: ${found ? found.type : "없음"}${found && found.type !== type ? " (타입 확인 필요)" : ""}`);
        }
        console.log("읽기 검사는 정상입니다. 그러나 실제 페이지 생성(쓰기) 권한과 추가 필수 속성은 검증되지 않았습니다.");
        console.log("전송 시 502가 계속되면 Next.js 개발 서버의 [contact:notion] create 단계 상태/코드를 확인하세요.");
      }
    }
  } catch (error) {
    const type = error instanceof Error && /^[A-Za-z]{1,40}$/.test(error.name) ? error.name : "unknown";
    console.error(`Notion 연결 실패: ${type}. 네트워크/시간 제한을 확인하세요.`);
    process.exitCode = 1;
  }
}
