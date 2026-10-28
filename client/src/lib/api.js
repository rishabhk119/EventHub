export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/$/, '')

// Thin fetch wrapper: sends JSON + Bearer token, throws an Error carrying the
// API's message, status and (for 400s) the validation errors array.
export async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw Object.assign(new Error('Cannot reach the EventHub server. Please try again.'), { status: 0, errors: [] })
  }

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const error = new Error(payload?.message || `Request failed (${response.status})`)
    error.status = response.status
    error.errors = Array.isArray(payload?.errors) ? payload.errors : []
    throw error
  }

  return payload
}
