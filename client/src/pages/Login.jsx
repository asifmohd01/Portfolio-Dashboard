'use client'

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/api.js'
import { setToken } from '../utils/auth.js'

export default function Login() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/api/auth/login', { email, password })
      setToken(data.token)
      nav('/dashboard')
    } catch (err) {
      setError(err?.data?.error || err?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
      {/* Left visual panel */}
      <div className="relative hidden lg:block">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/images/login-hero.png")' }}
          aria-hidden="true"
        />
        {/* Gradient/overlay to ensure text contrast */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"
          aria-hidden="true"
        />
        {/* Centered marketing card */}
        <div className="relative z-10 h-full flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-[#0b0b0f]/70 backdrop-blur-sm shadow-glow p-6 md:p-8">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gold shadow-glow" aria-hidden="true" />
              <h2 className="text-2xl md:text-3xl font-semibold">Portfolio Dashboard</h2>
            </div>

            <p className="mt-4 text-gray-300 text-base md:text-lg leading-relaxed">
              Track, analyze, and compare your portfolio performance with market benchmarks.
            </p>

            <ul className="mt-6 space-y-3 text-sm md:text-base text-gray-300">
              <Bullet>Overview cards for total value, gain/loss, and holdings count</Bullet>
              <Bullet>Allocation by sector and market cap with interactive charts</Bullet>
              <Bullet>Performance vs Nifty 50 and Gold with 1M/3M/1Y metrics</Bullet>
              <Bullet>Sortable/searchable holdings table and CSV upload</Bullet>
            </ul>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-xl space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-gold" aria-hidden="true" />
              <h1 className="text-2xl md:text-3xl font-semibold">Sign in</h1>
            </div>
            <p className="text-gray-400">Access your portfolio analytics dashboard.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4 card">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm">
                Email
              </label>
              <input
                id="email"
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm">
                Password
              </label>
              <input
                id="password"
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>
            {error && <div className="text-danger text-sm">{error}</div>}
            <button className="btn w-full disabled:opacity-60" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="text-sm text-gray-400">
            No account?{' '}
            <Link className="text-gold hover:underline" to="/register">
              Create one
            </Link>
          </div>

          {/* Demo credentials */}
          <div className="text-xs text-gray-500">Demo: test@example.com / password123</div>
        </div>
      </div>
    </div>
  )
}

function Bullet({ children }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-1 inline-block w-2.5 h-2.5 rounded-full bg-gold" aria-hidden="true" />
      <span className="leading-relaxed">{children}</span>
    </li>
  )
}
