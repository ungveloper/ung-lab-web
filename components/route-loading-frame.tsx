/** Root loading screen, rendered under the existing app/layout.tsx. */
export function RouteLoadingFrame({ section = "화면" }: { section?: string }) {
  return (
    <main
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={`${section} 불러오는 중`}
      className="mx-auto flex min-h-[min(72dvh,650px)] w-full max-w-[780px] flex-col justify-center px-5 py-10 sm:px-8"
    >
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="flex items-center gap-4">
          <span aria-hidden="true" className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <svg viewBox="0 0 24 24" fill="none" className="size-6 motion-safe:animate-spin" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.2" />
              <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="m-0 text-xs font-bold tracking-[.1em] text-blue-600">웅이연구소</p>
            <h1 className="mt-1 mb-0 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{section}을 불러오는 중…</h1>
          </div>
        </div>
        <div aria-hidden="true" className="mt-8 space-y-4 motion-safe:animate-pulse">
          <div className="h-5 w-2/5 max-w-[220px] rounded-lg bg-slate-200" />
          <div className="h-4 w-full rounded-lg bg-slate-100" />
          <div className="h-4 w-4/5 rounded-lg bg-slate-100" />
          <div className="grid grid-cols-1 gap-3 pt-4 sm:grid-cols-2">
            <div className="h-24 rounded-xl border border-slate-100 bg-slate-50" />
            <div className="h-24 rounded-xl border border-slate-100 bg-slate-50" />
          </div>
        </div>
      </div>
    </main>
  );
}
