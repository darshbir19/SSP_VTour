export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-ssp-bg">
      <h2 className="neon-title font-neon text-2xl text-white">FeelSSP</h2>

      <div className="mtr-loading-line">
        <div className="mtr-loading-dot" />
      </div>

      <p className="animate-pulse text-sm tracking-widest text-slate-500">
        Loading Sham Shui Po…
      </p>
    </div>
  )
}
