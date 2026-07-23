# MySQL image with the schema + seed data baked in via MySQL's native
# docker-entrypoint-initdb.d mechanism. These scripts run automatically,
# only on first startup against an empty data directory — no separate
# "seeder" container/service needed.
FROM mysql:8.0
COPY init/*.sql /docker-entrypoint-initdb.d/
