// ─── Types ────────────────────────────────────────────────────────────────────

interface ApiClientOptions {
  baseUrl?: string
  defaultHeaders?: Record<string, string>
}

interface FetchOptions extends RequestInit {
  /** Query-string parameters appended to the URL. */
  params?: Record<string, string | number | boolean>
}

// ─── Errors ───────────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly body: unknown
  ) {
    super(`API error ${status}: ${statusText}`)
    this.name = 'ApiError'
  }
}

// ─── Client ───────────────────────────────────────────────────────────────────

class ApiClient {
  private readonly baseUrl: string
  private readonly defaultHeaders: Record<string, string>

  constructor(options: ApiClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? ''
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...options.defaultHeaders,
    }
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private buildUrl(
    path: string,
    params?: Record<string, string | number | boolean>
  ): string {
    const url = `${this.baseUrl}${path}`
    if (!params || Object.keys(params).length === 0) return url

    const searchParams = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
      searchParams.set(key, String(value))
    }
    return `${url}?${searchParams.toString()}`
  }

  private getAuthHeader(): Record<string, string> {
    // Reads the JWT from sessionStorage (populated by next-auth).
    // Falls back to an empty object when running on the server or when no
    // token is present.
    if (typeof window === 'undefined') return {}
    const token = sessionStorage.getItem('sesame_jwt')
    if (!token) return {}
    return { Authorization: `Bearer ${token}` }
  }

  private async request<T>(
    path: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { params, ...init } = options

    const url = this.buildUrl(path, params)
    const headers = {
      ...this.defaultHeaders,
      ...this.getAuthHeader(),
      ...(init.headers as Record<string, string> | undefined),
    }

    const response = await fetch(url, { ...init, headers })

    if (!response.ok) {
      let body: unknown
      try {
        body = await response.json()
      } catch {
        body = await response.text()
      }
      throw new ApiError(response.status, response.statusText, body)
    }

    // 204 No Content — return undefined cast to T
    if (response.status === 204) return undefined as T

    return response.json() as Promise<T>
  }

  // ── Public methods ─────────────────────────────────────────────────────────

  async get<T>(path: string, options?: FetchOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' })
  }

  async post<T>(path: string, body: unknown, options?: FetchOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  async put<T>(path: string, body: unknown, options?: FetchOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    })
  }

  async patch<T>(path: string, body: unknown, options?: FetchOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    })
  }

  async delete<T>(path: string, options?: FetchOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' })
  }
}

// ─── Singleton ────────────────────────────────────────────────────────────────

export const apiClient = new ApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
})

export { ApiClient }
export type { ApiClientOptions, FetchOptions }
