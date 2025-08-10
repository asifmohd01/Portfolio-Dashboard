"use client"

import { useMemo, useState } from "react"

export default function HoldingsTable({ rows }) {
  const [sort, setSort] = useState({ key: "value", dir: "desc" })
  const sorted = useMemo(() => {
    const arr = [...rows]
    arr.sort((a, b) => {
      const v1 = a[sort.key]
      const v2 = b[sort.key]
      if (v1 < v2) return sort.dir === "asc" ? -1 : 1
      if (v1 > v2) return sort.dir === "asc" ? 1 : -1
      return 0
    })
    return arr
  }, [rows, sort])

  function toggle(key) {
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }))
  }

  return (
    <div className="overflow-auto">
      <table className="table min-w-[900px]">
        <thead className="text-left text-gray-400">
          <tr>
            <Th onClick={() => toggle("symbol")} active={sort.key === "symbol"} dir={sort.dir}>
              Symbol
            </Th>
            <Th onClick={() => toggle("name")} active={sort.key === "name"} dir={sort.dir}>
              Name
            </Th>
            <Th onClick={() => toggle("quantity")} active={sort.key === "quantity"} dir={sort.dir}>
              Qty
            </Th>
            <Th onClick={() => toggle("avgPrice")} active={sort.key === "avgPrice"} dir={sort.dir}>
              Avg
            </Th>
            <Th onClick={() => toggle("currentPrice")} active={sort.key === "currentPrice"} dir={sort.dir}>
              Price
            </Th>
            <Th onClick={() => toggle("value")} active={sort.key === "value"} dir={sort.dir}>
              Value
            </Th>
            <Th onClick={() => toggle("gainLoss")} active={sort.key === "gainLoss"} dir={sort.dir}>
              Gain/Loss
            </Th>
            <Th onClick={() => toggle("gainLossPercent")} active={sort.key === "gainLossPercent"} dir={sort.dir}>
              Gain%
            </Th>
            <th className="px-3 py-2">Sector</th>
            <th className="px-3 py-2">Cap</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr key={r.symbol} className="hover:bg-soft">
              <td className="px-3 py-2 font-semibold">{r.symbol}</td>
              <td className="px-3 py-2 text-gray-300">{r.name}</td>
              <td className="px-3 py-2">{r.quantity}</td>
              <td className="px-3 py-2">{currency(r.avgPrice)}</td>
              <td className="px-3 py-2">{currency(r.currentPrice)}</td>
              <td className="px-3 py-2">{currency(r.value)}</td>
              <td className={`px-3 py-2 ${r.gainLoss >= 0 ? "text-success" : "text-danger"}`}>
                {currency(r.gainLoss)}
              </td>
              <td className={`px-3 py-2 ${r.gainLossPercent >= 0 ? "text-success" : "text-danger"}`}>
                {r.gainLossPercent.toFixed(2)}%
              </td>
              <td className="px-3 py-2">{r.sector}</td>
              <td className="px-3 py-2">{r.marketCap}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Th({ children, onClick, active, dir }) {
  return (
    <th className="px-3 py-2 cursor-pointer select-none" onClick={onClick}>
      <span className={active ? "text-gold" : ""}>{children}</span>
      {active && <span> {dir === "asc" ? "▲" : "▼"}</span>}
    </th>
  )
}
function currency(n) {
  return (n ?? 0).toLocaleString("en-IN", { style: "currency", currency: "INR" })
}
