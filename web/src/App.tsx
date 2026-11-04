import { useEffect, useState } from 'react'
import { API_URL, getHealth, type Health } from './api'

type State =
  | { kind: 'loading'; slow: boolean }
  | { kind: 'ok'; health: Health }
  | { kind: 'error'; message: string }

// Render's free tier sleeps after 15 idle minutes; a cold Spring Boot start can take ~1 min.
const SLOW_AFTER_MS = 4000
const TIMEOUT_MS = 90_000

export default function App() {
  const [state, setState] = useState<State>({ kind: 'loading', slow: false })

  useEffect(() => {
    const controller = new AbortController()
    const slowTimer = setTimeout(() => setState((s) => (s.kind === 'loading' ? { kind: 'loading', slow: true } : s)), SLOW_AFTER_MS)
    let timedOut = false
    const timeout = setTimeout(() => {
      timedOut = true
      controller.abort()
    }, TIMEOUT_MS)

    getHealth(controller.signal)
      .then((health) => setState({ kind: 'ok', health }))
      .catch((err: unknown) => {
        if (timedOut) {
          setState({ kind: 'error', message: 'the API did not respond in time.' })
        } else if (!controller.signal.aborted) {
          // Aborted without a timeout means the component unmounted: ignore.
          setState({ kind: 'error', message: err instanceof Error ? err.message : String(err) })
        }
      })
      .finally(() => {
        clearTimeout(slowTimer)
        clearTimeout(timeout)
      })

    return () => {
      clearTimeout(slowTimer)
      clearTimeout(timeout)
      controller.abort()
    }
  }, [])

  return (
    <main className="shell">
      <h1>
        Cap<span className="accent">Steal</span>
      </h1>
      <p className="tagline">Which NFL players are steals, and which contracts are robbing their teams?</p>

      <section className="status" aria-live="polite">
        {state.kind === 'loading' && (
          <p>{state.slow ? 'Warming up the server… this can take up to a minute.' : 'Checking API…'}</p>
        )}
        {state.kind === 'ok' && <StatusLine health={state.health} />}
        {state.kind === 'error' && (
          <p className="bad">
            API: unreachable — {state.message}
          </p>
        )}
      </section>

      <footer>
        API: <code>{API_URL}</code>
      </footer>
    </main>
  )
}

function StatusLine({ health }: { health: Health }) {
  const ok = health.status === 'UP'
  const db = health.components?.db?.status
  return (
    <>
      <p className={ok ? 'good' : 'bad'}>API: {ok ? 'ok' : health.status.toLowerCase()}</p>
      {db && <p className="detail">Database: {db === 'UP' ? 'connected' : db.toLowerCase()}</p>}
    </>
  )
}
