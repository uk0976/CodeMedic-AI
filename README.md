# CodeMedic AI

**Fix. Explain. Optimize. Powered by Codex.**

CodeMedic AI is an AI-assisted code analysis platform foundation built for the OpenAI Codex Hackathon. This repository intentionally contains infrastructure and application architecture only; product features and pages will be added in later phases.

## Stack

- Frontend: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui-ready primitives, TanStack Query, React Hook Form, Zod, Monaco Editor, Lucide, Framer Motion
- Backend: FastAPI, Pydantic, SQLAlchemy, Alembic, JWT, OpenAI SDK, PostgreSQL
- Delivery: Docker Compose, GitHub Actions, Vercel/Railway-ready configuration

## Quick start

1. Copy `.env.example` to `.env` and replace all placeholder secrets.
2. Start PostgreSQL, frontend, and backend: `docker compose up --build`.
3. Verify the backend at `http://localhost:8000/health` and frontend at `http://localhost:3000`.

## Local development

Frontend: `cd frontend`, `npm ci`, then `npm run dev`.

Backend (Python 3.12+): `cd backend`, create and activate a virtual environment, `pip install -e ".[dev]"`, then `uvicorn app.main:app --reload`.

Run quality checks with `npm run lint`, `npm run typecheck`, `ruff check .`, `black --check .`, `isort --check-only .`, `flake8`, and `mypy app`.

## Layout

`frontend/` Next.js application shell; `backend/` FastAPI application shell; `docker/` container images; `docs/` operational documentation; `.github/` CI workflows.

## Environment

All configuration is validated at startup by Pydantic settings. See `.env.example`; never commit real secrets. Use a distinct strong `JWT_SECRET_KEY` and production database credentials for each deployed environment.
