# First-time deploy (Phase 0 skeleton)

Do these once, in order. After that, every push to `main` redeploys the API (Render) and the web app (Vercel) automatically.

## 1. GitHub
1. Create a **public** repo named `capsteal` (no README, no .gitignore — the repo already has them).
2. Push:
   ```bash
   git remote add origin git@github.com:<you>/capsteal.git
   git push -u origin main
   ```
3. Check the **Actions** tab: the `CI` workflow should go green (api, web, migrations).

## 2. Neon (database)
1. Sign up at neon.com → new project `capsteal`, Postgres 16+, region near your Render region (e.g. US East).
2. Open **Connect** and copy the connection details. Neon shows a URL like
   `postgresql://USER:PASSWORD@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`.
   Spring needs it split into three values:
   - `SPRING_DATASOURCE_URL` = `jdbc:postgresql://ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`
   - `SPRING_DATASOURCE_USERNAME` = `USER`
   - `SPRING_DATASOURCE_PASSWORD` = `PASSWORD`
3. You don't run migrations by hand: Flyway applies them when the API starts.

## 3. Render (API)
1. Sign up at render.com with GitHub → **New → Blueprint** → pick the `capsteal` repo. It reads `render.yaml`.
2. Fill in the four environment variables it asks for (the three above, plus `CORS_ALLOWED_ORIGINS` — put `http://localhost:5173` for now; you'll add the Vercel URL in step 5).
3. Wait for the first build (~5 min), then open `https://capsteal-api.onrender.com/actuator/health`.
   You want `"status":"UP"` with a `db` component that is also `UP`.
4. In Neon, run `select * from flyway_schema_history;` — you should see `V1 baseline`. That's "Flyway connected".

## 4. Vercel (web)
1. Sign up at vercel.com with GitHub → **Add New → Project** → import `capsteal`.
2. **Root Directory:** `web`. Framework preset: Vite (auto-detected).
3. Environment variable: `VITE_API_URL` = your Render URL (no trailing slash).
4. Deploy. Note the URL, e.g. `https://capsteal.vercel.app`.

## 5. Close the loop
1. In Render, set `CORS_ALLOWED_ORIGINS` = `https://capsteal.vercel.app,http://localhost:5173` and save (it redeploys).
2. Open the Vercel URL. You should see **API: ok** and **Database: connected**.
   If the API was asleep, you'll see "Warming up the server…" first — that's the cold start the plan warns about.

## 6. PostHog
Sign up at posthog.com and create a project now; you'll paste its key into the web app in Phase 5.

## Troubleshooting
| Symptom | Likely cause |
|---|---|
| Browser console: "blocked by CORS policy" | Vercel URL missing from `CORS_ALLOWED_ORIGINS`, or it has a trailing slash |
| Health shows `db: DOWN` | JDBC URL missing `?sslmode=require`, or you pasted the `postgresql://` URL instead of `jdbc:postgresql://` |
| Web shows `localhost:8080` in the footer on Vercel | `VITE_API_URL` wasn't set before the build — set it and redeploy |
| Render build fails on `dependency:go-offline` | Transient Maven Central error; hit **Manual Deploy → Clear cache & deploy** |
