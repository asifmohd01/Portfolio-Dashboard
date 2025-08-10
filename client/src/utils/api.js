import { getToken } from './auth.js'

const ENV_BASE = (import.meta.env.VITE_API_URL || '').trim()

function joinUrl(base, path) {
  const a = base.endsWith('/') ? base.slice(0, -1) : base
  const b = path.startsWith('/') ? path : `/${path}`
  return `${a}${b}`
}

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  // If ENV_BASE is set (e.g., in production), use it; otherwise use relative /api for Vite proxy in dev.
  const url = ENV_BASE ? joinUrl(ENV_BASE, path) : path

  const token = getToken()
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const text = await res.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = { message: text }
  }

  if (!res.ok) {
    const err = new Error(data?.error || data?.message || 'Request failed')
    err.status = res.status
    err.data = data
    throw err
  }
  return { data, status: res.status }
}

const api = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
  patch: (path, body, opts) => request(path, { ...opts, method: 'PATCH', body }),
  delete: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
}

export default api
