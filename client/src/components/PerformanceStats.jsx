export default function PerformanceStats({ returns }) {
  const rows = [
    { name: "Portfolio", data: returns?.portfolio || {} },
    { name: "Nifty 50", data: returns?.nifty50 || {} },
    { name: "Gold", data: returns?.gold || {} },
  ]
  return (
    <section className="card">
      <h3 className="text-lg font-semibold mb-3">Performance Metrics</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {rows.map((r) => (
          <div key={r.name} className="rounded-lg border border-border bg-soft p-3">
            <div className="text-sm text-gray-400 mb-1">{r.name}</div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <Metric label="1M" value={r.data["1month"]} />
              <Metric label="3M" value={r.data["3months"]} />
              <Metric label="1Y" value={r.data["1year"]} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Metric({ label, value }) {
  const v = Number.isFinite(value) ? value : 0
  const cls = v >= 0 ? "text-success" : "text-danger"
  return (
    <div className="rounded bg-card p-2 text-center">
      <div className="text-xs text-gray-400">{label}</div>
      <div className={`font-semibold ${cls}`}>{fmt(v)}%</div>
    </div>
  )
}

function fmt(n) {
  return (Math.round(n * 10) / 10).toFixed(1)
}
