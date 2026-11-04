# CapSteal

**Which NFL players are steals — and which contracts are robbing their teams?**
CapSteal ranks players by *surplus value*: how much more (or less) they produce than their contract pays for. You pick the stats, set the weights, and the rankings update live. Launching with QBs; RB, WR and TE come next.

## Architecture

```
 nflverse data ──▶ pipeline/ (Python) ──▶ Postgres (db/) ──▶ api/ (Spring Boot) ──▶ web/ (React)
                   weekly GitHub Action    Neon in prod       scoring + REST        Vercel
                                                              Render in prod        + PostHog
```

| Folder      | What lives there                                        |
|-------------|---------------------------------------------------------|
| `pipeline/` | Python 3.12 ETL: pull stats + contracts, clean, load    |
| `db/`       | Flyway SQL migrations (shared by the API and pipeline)  |
| `api/`      | Java 21 / Spring Boot 3 scoring engine and REST API     |
| `web/`      | React + TypeScript + Vite frontend                      |

## Run locally

Prerequisites: Docker Desktop. (For working outside Docker: Java 21, Node 22 LTS, Python 3.12.)

```bash
cp .env.example .env
docker compose up --build
```

- Web: http://localhost:5173 — should show **API: ok**
- API health: http://localhost:8080/actuator/health
- Postgres: `localhost:5432`, database/user/password `capsteal`

Flyway runs the migrations in `db/migrations` automatically when the API starts.

### Without Docker for the app code

```bash
docker compose up db                 # just Postgres
cd api && mvn spring-boot:run       # API on :8080 (needs Java 21 + Maven)
cd web && npm install && npm run dev # web on :5173
```

## Deployment

| Piece    | Host          | Deploys when                         |
|----------|---------------|--------------------------------------|
| Database | Neon (free)   | migrations run on API startup        |
| API      | Render (free) | every push to `main` (`render.yaml`) |
| Web      | Vercel        | every push to `main` (root: `web/`)  |

See [`docs/DEPLOY.md`](docs/DEPLOY.md) for first-time setup.
