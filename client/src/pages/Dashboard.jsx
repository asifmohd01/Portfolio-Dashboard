"use client"

import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../utils/api.js"
import Navbar from "../components/Navbar.jsx"
import OverviewCards from "../components/OverviewCards.jsx"
import AllocationCharts from "../components/AllocationCharts.jsx"
import PerformanceChart from "../components/PerformanceChart.jsx"
import PerformanceStats from "../components/PerformanceStats.jsx"
import HoldingsTable from "../components/HoldingsTable.jsx"
import TopMetrics from "../components/TopMetrics.jsx"
import UploadCSV from "../components/UploadCSV.jsx"
import { clearToken } from "../utils/auth.js"

export default function Dashboard() {
  const nav = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [holdings, setHoldings] = useState([])
  const [allocation, setAllocation] = useState({ bySector: {}, byMarketCap: {} })
  const [perf, setPerf] = useState({ timeline: [], returns: { portfolio: {}, nifty50: {}, gold: {} } })
  const [summary, setSummary] = useState(null)
  const [search, setSearch] = useState("")

  async function loadAll() {
    setLoading(true)
    setError("")
    try {
      const [h, a, p, s] = await Promise.all([
        api.get("/api/portfolio/holdings"),
        api.get("/api/portfolio/allocation"),
        api.get("/api/portfolio/performance"),
        api.get("/api/portfolio/summary"),
      ])
      setHoldings(h.data)
      setAllocation(a.data)
      setPerf(p.data)
      setSummary(s.data)
    } catch (err) {
      setError(err?.data?.error || err?.message || "Failed to load data")
      if (err?.status === 401) {
        clearToken()
        nav("/login")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  const filteredHoldings = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return holdings
    return holdings.filter((h) => h.symbol.toLowerCase().includes(q) || h.name.toLowerCase().includes(q))
  }, [holdings, search])

  return (
    <div className="min-h-screen">
      <Navbar onReload={loadAll} />
      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {loading && <div className="text-gray-400">Loading...</div>}
        {error && <div className="text-danger">{error}</div>}
        {!loading && summary && (
          <>
            <OverviewCards summary={summary} returns={perf.returns} />
            <UploadCSV onUploaded={loadAll} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AllocationCharts allocation={allocation} />
              <PerformanceChart data={perf.timeline} />
            </div>
            <PerformanceStats returns={perf.returns} />
            <TopMetrics summary={summary} />
            <div className="card space-y-4">
              <input
                className="input max-w-md"
                placeholder="Search by symbol or name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <HoldingsTable rows={filteredHoldings} />
            </div>
          </>
        )}
      </main>
    </div>
  )
}
