# db

Flyway migrations live in `migrations/`, named `V<n>__<description>.sql`.
The API packages this folder and runs pending migrations on startup, locally and against Neon.

Never edit a migration that has already run in production; add a new one instead.
