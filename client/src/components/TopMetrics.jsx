export default function TopMetrics({ summary }) {
  const { topPerformer, worstPerformer, diversificationScore, riskLevel } = summary
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="card">
        <div className="text-sm text-gray-400">Top Performer</div>
        {topPerformer ? <Item perf={topPerformer} /> : <div className="text-gray-500 mt-2">N/A</div>}
      </div>
      <div className="card">
        <div className="text-sm text-gray-400">Worst Performer</div>
        {worstPerformer ? <Item perf={worstPerformer} /> : <div className="text-gray-500 mt-2">N/A</div>}
      </div>
      <div className="card grid gap-2">
        <div className="text-sm text-gray-400">Risk & Diversification</div>
        <div className="text-lg">
          Risk: <span className="font-semibold">{riskLevel}</span>
        </div>
        <div>
          <div className="text-sm text-gray-400 mb-1">Diversification Score</div>
          <div className="h-3 w-full rounded bg-soft">
            <div className="h-3 rounded bg-gold" style={{ width: `${(diversificationScore / 10) * 100}%` }} />
          </div>
          <div className="text-right text-sm mt-1">{diversificationScore}/10</div>
        </div>
      </div>
    </section>
  )
}

function Item({ perf }) {
  const cls = perf.gainPercent >= 0 ? "text-success" : "text-danger"
  return (
    <div className="mt-2 rounded-lg border border-border bg-soft p-3">
      <div className="flex items-center justify-between">
        <div className="font-semibold">{perf.symbol}</div>
        <div className={`text-sm ${cls}`}>
          {perf.gainPercent >= 0 ? "▲" : "▼"} {Math.abs(perf.gainPercent).toFixed(2)}%
        </div>
      </div>
      <div className="text-gray-400 text-sm">{perf.name}</div>
    </div>
  )
}
