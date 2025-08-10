export default function OverviewCards({ summary, returns }) {
  const tiles = [
    { label: "Total Value", value: currency(summary.totalValue) },
    { label: "Total Gain/Loss", value: currency(summary.totalGainLoss), colored: true },
    { label: "Performance %", value: `${fmt(summary.totalGainLossPercent)}%`, colored: true },
    { label: "Holdings", value: summary.holdingsCount ?? "-" },
  ]
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {tiles.map((t) => (
        <div key={t.label} className="card">
          <div className="text-sm text-gray-400">{t.label}</div>
          <div
            className={`mt-1 text-2xl font-semibold ${t.colored ? (summary.totalGainLoss >= 0 ? "text-success" : "text-danger") : ""}`}
          >
            {t.value}
          </div>
        </div>
      ))}
      <div className="card col-span-2 lg:col-span-4 grid grid-cols-3 gap-4">
        <Bench
          entries={[
            { k: "Portfolio (1y)", v: returns.portfolio?.["1year"] ?? 0 },
            { k: "Nifty 50 (1y)", v: returns.nifty50?.["1year"] ?? 0 },
            { k: "Gold (1y)", v: returns.gold?.["1year"] ?? 0 },
          ]}
        />
      </div>
    </section>
  )
}
function Bench({ entries }) {
  return (
    <div className="col-span-3">
      <div className="text-sm text-gray-400">Portfolio vs Benchmarks</div>
      <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {entries.map((e) => (
          <div key={e.k} className="rounded-lg border border-border bg-soft px-3 py-2">
            <div className="text-xs text-gray-400">{e.k}</div>
            <div className={`text-lg font-semibold ${e.v >= 0 ? "text-success" : "text-danger"}`}>{fmt(e.v)}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}
function currency(n) {
  return (n ?? 0).toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })
}
function fmt(n) {
  return Number.isFinite(n) ? (Math.round(n * 100) / 100).toFixed(2) : "0.00"
}
