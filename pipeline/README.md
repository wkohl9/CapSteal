# pipeline

Python 3.12 ETL (Phase 1): pulls 2026 player stats and contracts from nflverse with `nflreadpy`,
cleans and joins them with Polars, and upserts into Postgres. Runs weekly on GitHub Actions.

```bash
cd pipeline
python3.12 -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
```
