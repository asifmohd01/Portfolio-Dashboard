"use client"

import { useNavigate } from "react-router-dom"
import { clearToken } from "../utils/auth.js"

export default function Navbar({ onReload }) {
  const nav = useNavigate()
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-[#0b0b0f]/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gold shadow-glow" />
          <span className="font-semibold">Portfolio Dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost" onClick={onReload}>
            Refresh
          </button>
          <button
            className="btn"
            onClick={() => {
              clearToken()
              nav("/login")
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}
