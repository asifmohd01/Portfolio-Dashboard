import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"

const COLORS = ["#d4af37", "#8b5cf6", "#22c55e", "#ef4444", "#06b6d4", "#f59e0b", "#eab308"]

export default function AllocationCharts({ allocation }) {
  const bySector = Object.entries(allocation.bySector || {}).map(([name, v]) => ({ name, value: v.percentage }))
  const byCap = Object.entries(allocation.byMarketCap || {}).map(([name, v]) => ({ name, value: v.percentage }))

  return (
    <section className="card grid grid-cols-1 gap-6">
      <h3 className="text-lg font-semibold">Asset Allocation</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartBlock title="By Sector" data={bySector} />
        <ChartBlock title="By Market Cap" data={byCap} />
      </div>
    </section>
  )
}

function ChartBlock({ title, data }) {
  return (
    <div className="rounded-lg border border-border bg-soft p-3">
      <div className="text-sm text-gray-400 mb-2">{title}</div>
      <div className="h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={2}>
              {data.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => [`${v}%`, "Allocation"]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
