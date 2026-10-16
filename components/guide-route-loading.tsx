export function GuideRouteLoading(){
  return <main className="guide-route-loading" role="status" aria-live="polite" aria-busy="true">
    <span className="tool-app-loading-spinner" aria-hidden="true"/>
    <span>가이드를 불러오는 중…</span>
  </main>;
}
