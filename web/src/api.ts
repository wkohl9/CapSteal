// Every call to the CapSteal API goes through this module, so adding auth
// headers later (Phase 7) is a one-file change.

export const API_URL: string = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080').replace(/\/$/, '')

export type HealthStatus = 'UP' | 'DOWN' | 'OUT_OF_SERVICE' | 'UNKNOWN'

export interface Health {
  status: HealthStatus
  components?: Record<string, { status: HealthStatus }>
}

export async function getHealth(signal?: AbortSignal): Promise<Health> {
  const res = await fetch(`${API_URL}/actuator/health`, { signal })
  // Actuator returns 503 with a JSON body when a component (e.g. db) is down.
  if (!res.ok && res.status !== 503) {
    throw new Error(`Health check failed: HTTP ${res.status}`)
  }
  return (await res.json()) as Health
}
