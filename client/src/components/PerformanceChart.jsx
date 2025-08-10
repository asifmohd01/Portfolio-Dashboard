import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts"

export default function PerformanceChart({ data }) {
  return (
    <section className="card">
      <h3 className="text-lg font-semibold mb-2">Performance (YTD)</h3>
      <div className="h-72">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid stroke="#2a2a33" />
            <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 12 }} />
            <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="portfolio" stroke="#d4af37" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="nifty50" stroke="#8b5cf6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="gold" stroke="#22c55e" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
