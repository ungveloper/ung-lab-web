export function GuideRouteLoading(){
  return <main className={`guide-route-loading flex flex-col items-center justify-center gap-[15px] w-full min-h-[calc(100dvh_-_64px)] text-[#69778c] text-[15px] font-[550] text-center p-6 max-[720px]:min-h-[calc(100dvh_-_58px)] max-[720px]:p-4`} role="status" aria-live="polite" aria-busy="true">
    <div className="w-full max-w-[780px] rounded-[28px] border border-slate-200 bg-white p-6 text-left shadow-sm sm:p-10">
      <div className="flex items-center gap-4">
        <span className={`tool-app-loading-spinner w-[38px] h-[38px] [border:3px_solid_#e5ecf8] [border-top-color:#2563eb] rounded-full [animation:spin_.75s_linear_infinite] motion-reduce:[animation-duration:2s] [.guide-route-loading_&]:[flex:0_0_auto]`} aria-hidden="true"/>
        <div className="min-w-0">
          <p className="mb-1 text-xs font-bold tracking-[.1em] text-blue-600">웅이연구소</p>
          <h2 className="m-0 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">가이드를 불러오는 중…</h2>
        </div>
      </div>
      <div aria-hidden="true" className="mt-8 space-y-4 motion-safe:animate-pulse">
        <div className="h-5 w-2/5 max-w-[220px] rounded-lg bg-slate-200" />
        <div className="h-4 w-full rounded-lg bg-slate-100" />
        <div className="h-4 w-5/6 rounded-lg bg-slate-100" />
        <div className="grid grid-cols-1 gap-3 pt-4 sm:grid-cols-2">
          <div className="h-24 rounded-xl border border-slate-100 bg-slate-50" />
          <div className="h-24 rounded-xl border border-slate-100 bg-slate-50" />
        </div>
      </div>
    </div>
  </main>;
}
