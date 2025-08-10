import { getToken } from './auth.js'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function isFormData(value) {
  return typeof FormData !== 'undefined' && value instanceof FormData
}

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const token = getToken()
  const finalHeaders = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  }
  // Only set JSON header when body is not FormData
  const hasForm = isFormData(body)
  if (!hasForm) {
    finalHeaders['Content-Type'] = 'application/json'
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: body ? (hasForm ? body : JSON.stringify(body)) : undefined,
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
