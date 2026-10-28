/** In-tab handoff: raw chat queries never appear in URLs, server logs or analytics. */
export const FEATURE_REQUEST_STORAGE_KEY = "ung-lab:pending-feature-request:v1";
const VALID_FOR_MS = 30 * 60 * 1000;
const featureTerms = /(?:pdf|ppt|word|docx|xlsx|xls|csv|png|jpg|webp|mp4|qr|파일|도구|기능|문서|사진|이미지|영상|오디오|음성|녹음|변환|압축|편집|생성|만들|삭제|추출|인식|합치|분리|저장|변경|요약|자막|편집|열어|읽어|해줘|해주세요|싶어|찾아)/iu;
const cleanQuery = (input) => String(input ?? "").trim().slice(0, 500);

/** Avoid suggesting a feature for meaningless short greetings or arbitrary strings. */
export function isFeatureRequestCandidate(input) {
  const query = cleanQuery(input);
  return query.length >= 4 && featureTerms.test(query);
}
export function featureRequestSubject(input) {
  // Keep the actual chat request, without adding a category or a suffix.
  // The contact subject field is capped at 120 characters.
  return cleanQuery(input).replace(/[\r\n]+/gu, " ").slice(0, 120);
}
export function featureRequestMessage(input) {
  const query = cleanQuery(input);
  return `새 채팅에서 다음 기능을 요청했으나 현재 이용할 수 있는 도구를 찾지 못했습니다.\n\n요청한 작업: ${query}\n\n필요한 파일 형식이나 원하는 사용 방법 등을 추가로 적어 주세요.`;
}
export function savePendingFeatureRequest(storage, input, now = Date.now()) {
  const query = cleanQuery(input);
  if (!query || !Number.isFinite(now)) return false;
  try {storage.setItem(FEATURE_REQUEST_STORAGE_KEY, JSON.stringify({query, savedAt:now}));return true}
  catch{return false}
}
export function readPendingFeatureRequest(storage, now = Date.now()) {
  try {
    const raw = storage.getItem(FEATURE_REQUEST_STORAGE_KEY);
    if (!raw) return null;
    const item = JSON.parse(raw);
    if (!item || typeof item.query !== "string" || !cleanQuery(item.query)
      || typeof item.savedAt !== "number" || !Number.isFinite(item.savedAt)
      || item.savedAt > now || now - item.savedAt > VALID_FOR_MS) {
      storage.removeItem(FEATURE_REQUEST_STORAGE_KEY);
      return null;
    }
    return {query:cleanQuery(item.query), savedAt:item.savedAt};
  } catch {return null}
}
export function clearPendingFeatureRequest(storage) {
  try {storage.removeItem(FEATURE_REQUEST_STORAGE_KEY)} catch{/* Restricted storage */}
}
