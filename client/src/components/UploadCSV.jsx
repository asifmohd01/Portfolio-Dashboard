"use client"

import { useState } from "react"
import api from "../utils/api.js"

const TEMPLATE = `symbol,name,quantity,avgPrice,currentPrice,sector,marketCap
RELIANCE,Reliance Industries Ltd,50,2450,2680.5,Energy,Large
INFY,Infosys Limited,100,1800,2010.75,Technology,Large
HDFC,HDFC Bank,60,1450,1420.1,Banking,Large
PBFINTECH,PB Fintech,25,620,455,Financials,Small
`

export default function UploadCSV({ onUploaded }) {
  const [mode, setMode] = useState("merge")
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  function downloadTemplate() {
    const blob = new Blob([TEMPLATE], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "holdings-template.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (!file) {
      setError("Please choose a CSV file")
      return
    }
    setLoading(true)
    setError("")
    setMessage("")
    try {
      const form = new FormData()
      form.append("file", file)
      form.append("mode", mode)
      const { data } = await api.post("/api/portfolio/upload", form)
      setMessage(
        `Uploaded: ${data.rows} rows • inserted ${data.inserted}, updated ${data.updated} (mode: ${data.mode})`,
      )
      if (onUploaded) onUploaded()
      setFile(null)
    } catch (err) {
      const details = err?.data?.details ? `\n${err.data.details.join("\n")}` : ""
      setError((err?.data?.error || err?.message || "Upload failed") + details)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="card space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Upload Holdings (CSV)</h3>
        <button className="btn-ghost" onClick={downloadTemplate}>
          Download template
        </button>
      </div>
      <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <input
          type="file"
          accept=".csv,text/csv"
          className="input"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <select className="input sm:w-40" value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="merge">Merge (upsert by symbol)</option>
          <option value="replace">Replace (overwrite all)</option>
        </select>
        <button className="btn sm:w-40 disabled:opacity-60" disabled={loading}>
          {loading ? "Uploading..." : "Upload CSV"}
        </button>
      </form>
      {message && <div className="text-success text-sm whitespace-pre-wrap">{message}</div>}
      {error && <div className="text-danger text-sm whitespace-pre-wrap">{error}</div>}
      <div className="text-xs text-gray-400">
        Columns: symbol,name,quantity,avgPrice,currentPrice,sector,marketCap • marketCap must be Large|Mid|Small
      </div>
    </section>
  )
}
