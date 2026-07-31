# Architecture foundation

The repository is a two-service monorepo. The frontend is a standalone Next.js application. The backend uses FastAPI with clear boundaries for HTTP transport (`api`), configuration and cross-cutting concerns (`core`), persistence (`database`, `models`, `repositories`), transport schemas (`schemas`), and use cases/integrations (`services`).

No product routes, domain models, or AI workflows are included yet. Future features should keep API handlers thin, put business orchestration in services, and isolate database operations in repositories.

Configuration is environment-driven and validated by Pydantic. Runtime database schema changes must be introduced through Alembic migrations. Health checking is intentionally independent of feature logic.
