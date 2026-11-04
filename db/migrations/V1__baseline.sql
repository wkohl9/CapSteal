-- Phase 0 baseline: proves Flyway is wired up end to end.
-- The real schema (players, weekly_stats, contracts, stat_definitions,
-- saved_formulas) arrives in Phase 1 as V2+.
CREATE TABLE app_meta (
    key        TEXT PRIMARY KEY,
    value      TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO app_meta (key, value) VALUES ('app_name', 'CapSteal');
