"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {clearPendingFeatureRequest,featureRequestMessage,featureRequestSubject,readPendingFeatureRequest} from "@/lib/feature-request.mjs";

type State = "idle" | "sending" | "success" | "error";

const field = "mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-[16px] text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-3 focus:outline-blue-100";

export default function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");
  const [featureMode, setFeatureMode] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("type") !== "feature") return;
    let pending;
    try {pending = readPendingFeatureRequest(window.sessionStorage)} catch {return}
    if (!pending || !formRef.current) return;
    const subject = formRef.current.elements.namedItem("subject");
    const message = formRef.current.elements.namedItem("message");
    if (!(subject instanceof HTMLInputElement) || !(message instanceof HTMLTextAreaElement)) return;
    subject.value = featureRequestSubject(pending.query);
    message.value = featureRequestMessage(pending.query);
    queueMicrotask(() => setFeatureMode(true));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    setState("sending");
    setMessage("");
    const form = event.currentTarget;
    const payload = {
      name: String(new FormData(form).get("name") ?? ""),
      email: String(new FormData(form).get("email") ?? ""),
      subject: String(new FormData(form).get("subject") ?? ""),
      message: String(new FormData(form).get("message") ?? ""),
      website: String(new FormData(form).get("website") ?? ""),
    };
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      });
      if (response.status !== 201) {
        const errorData: unknown = await response.json().catch(() => null);
        const message = errorData && typeof errorData === "object" && "message" in errorData
          && typeof errorData.message === "string" ? errorData.message : "문의 전송에 실패했습니다.";
        const code = errorData && typeof errorData === "object" && "code" in errorData
          && typeof errorData.code === "string" && /^CONTACT_[A-Z_]{1,50}$/.test(errorData.code)
          ? ` (${errorData.code})` : "";
        setState("error");
        setMessage(`${message}${code} 입력 내용은 유지됩니다. 잠시 후 다시 시도해 주세요.`);
        return;
      }
      form.reset();
      if (featureMode) {
        try {clearPendingFeatureRequest(window.sessionStorage)} catch {/* Storage restricted. */}
        setFeatureMode(false);
      }
      setState("success");
      setMessage("");
      toast.success("문의가 정상적으로 접수되었습니다.", {
        id: "ung-lab-contact-submitted",
        description: "보내주셔서 감사합니다.",
        duration: 5000,
      });
    } catch {
      setState("error");
      setMessage("네트워크 연결을 확인하고 다시 시도해 주세요.");
    }
  }

  return (
    <form ref={formRef} onSubmit={submit} className="relative mt-5 space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input name="website" id="contact-website" tabIndex={-1} autoComplete="off" />
      </div>
      {featureMode && <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-800" role="status">
        <strong className="block font-semibold">기능 추가 요청</strong>
        새 채팅에서 입력하신 요청을 제목과 내용에 미리 적었습니다. 필요한 세부 사항을 자유롭게 수정해 주세요.
      </div>}
      <div>
        <label className="block text-[15px] font-semibold text-slate-800" htmlFor="contact-name">성함 또는 닉네임 <span className="text-red-600">*</span></label>
        <input className={field} id="contact-name" name="name" type="text" maxLength={80} required autoComplete="name" placeholder="이름 또는 닉네임을 입력해 주세요" />
      </div>
      <div>
        <label className="block text-[15px] font-semibold text-slate-800" htmlFor="contact-email">이메일 <span className="text-red-600">*</span></label>
        <input className={field} id="contact-email" name="email" type="email" maxLength={254} required autoComplete="email" placeholder="답변받을 이메일을 입력해 주세요" />
      </div>
      <div>
        <label className="block text-[15px] font-semibold text-slate-800" htmlFor="contact-subject">문의 제목 <span className="text-red-600">*</span></label>
        <input className={field} id="contact-subject" name="subject" type="text" maxLength={120} required placeholder="어떤 내용인지 간단히 알려주세요" />
      </div>
      <div>
        <label className="block text-[15px] font-semibold text-slate-800" htmlFor="contact-message">문의 내용 <span className="text-red-600">*</span></label>
        <textarea className={`${field} min-h-[200px] resize-y leading-7`} id="contact-message" name="message" rows={8} minLength={10} maxLength={4000} required placeholder="발생한 상황이나 궁금한 점을 구체적으로 작성해 주세요" />
      </div>
      <label className="flex items-start gap-3 text-sm leading-6 text-slate-600">
        <input type="checkbox" required className="mt-1 size-4 shrink-0 accent-blue-600" />
        <span>문의 처리에 필요한 이름·이메일·문의 내용의 수집 및 Notion 저장에 동의합니다. <Link href="/privacy" className="font-semibold text-blue-700 underline underline-offset-2">개인정보 처리방침</Link></span>
      </label>
      {message && <p role="status" aria-live="polite" className={`rounded-lg p-3 text-sm leading-6 ${state === "success" ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}>{message}</p>}
      <button type="submit" disabled={state === "sending"} className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-blue-600 px-5 text-[16px] font-bold text-white! hover:bg-blue-700 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-400 disabled:cursor-wait disabled:opacity-60">
        {state === "sending" ? "전송 중…" : "문의 보내기"}
      </button>
    </form>
  );
}
