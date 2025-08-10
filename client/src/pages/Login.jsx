"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../utils/api.js"
import { setToken } from "../utils/auth.js"

export default function Login() {
  const nav = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const { data } = await api.post("/api/auth/login", { email, password })
      setToken(data.token)
      nav("/dashboard")
    } catch (err) {
      setError(err?.data?.error || err?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div
        className="hidden lg:flex w-1/2 items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://sjc.microlink.io/ma_nCxuTXCcVsXdwItu9QC0c9FLTHw1MxdNjdhm5ul3DzWu6TbIlY7Ema64C_6ljVHOOdCWHAKAabyg2LhpDXw.jpeg")',
        }}
      />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gold" />
              <h1 className="text-2xl font-semibold">Portfolio Dashboard</h1>
            </div>
            <p className="text-gray-400">Sign in to access your portfolio analytics.</p>
          </div>
          <form onSubmit={onSubmit} className="space-y-4 card">
            <div className="space-y-2">
              <label className="text-sm">Email</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm">Password</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            {error && <div className="text-danger text-sm">{error}</div>}
            <button className="btn w-full disabled:opacity-60" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <div className="text-sm text-gray-400">
            No account?{" "}
            <Link className="text-gold hover:underline" to="/register">
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
