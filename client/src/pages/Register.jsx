"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../utils/api.js"

export default function Register() {
  const nav = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")
    try {
      await api.post("/api/auth/register", { email, password })
      setSuccess("Account created. Redirecting to sign in...")
      setTimeout(() => nav("/login"), 1000)
    } catch (err) {
      setError(err?.data?.error || err?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Create your account</h1>
          <p className="text-gray-400">Start analyzing your portfolio in minutes.</p>
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
              placeholder="At least 8 characters"
              required
            />
          </div>
          {error && <div className="text-danger text-sm">{error}</div>}
          {success && <div className="text-success text-sm">{success}</div>}
          <button className="btn w-full disabled:opacity-60" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
        <div className="text-sm text-gray-400 text-center">
          Already have an account?{" "}
          <Link className="text-gold hover:underline" to="/login">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
