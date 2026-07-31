# CodeMedic AI

**Fix. Explain. Optimize. Powered by Codex.**

CodeMedic AI is a premium, developer-focused AI code analysis and optimization platform. It brings a cursor-like, Notion-rich, and SonarQube-detailed diagnostics pipeline directly to the browser. Designed for rapid codebase scanning, security vulnerability checks, performance tuning, and automated test generation.

---

## 🚀 Key Features

- **Interactive Editor Workspace**: Features Monaco Editor (VS Code’s engine) with full syntax highlighting, code folding, multiple cursors, formatting (`Alt+Shift+F`), search, and drag-and-drop file upload.
- **AI Analysis Engine**: Executes multi-layered diagnostic scans via OpenAI's Beta Response API. Runs bug detections, security vulnerability audits, and performance analysis, calculating complexity (Time/Space) and auto-generating unit test boilerplate.
- **Server-Sent Events (SSE)**: Streams incremental diagnostic stage updates (`Analyzing...` -> `Reviewing...` -> `Security Audit...` -> `Done`) directly to the browser.
- **Reports Directory & Archival**: Saves every diagnostic run into a historical PostgreSQL repository. Allows list queries, searches, deletion, duplication, and exports.
- **Side-by-Side Comparison**: Select any two historical reports to compare code quality score delta, bug count reductions, and security score improvements.
- **Multi-Format Exports**: One-click exports of audit results to:
  - **PDF Report**: Multi-page custom formatted PDF with cover page, metrics grid, code logs, and footers.
  - **Markdown Report**: Developer-friendly local documentation.
  - **JSON Payload**: Raw analysis telemetry for CI/CD integrations.
  - **Optimized Source Code / Unit Tests**: Download ready-to-run source files.
- **Guided Demo Tour**: Step-by-step cross-page onboarding workflow specifically built for hackathon evaluators to demonstrate capabilities seamlessly.

---

## 🛠 Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Monaco Editor (`@monaco-editor/react`), Framer Motion (micro-interactions), Lucide, TanStack Query.
- **Backend**: FastAPI, Python 3.12, SQLAlchemy ORM, PostgreSQL, Pydantic v2 (settings and schemas), PyJWT, Uvicorn, ReportLab (PDF generation).
- **Deployment**: Docker Compose, Vercel (Frontend), Railway (Backend).

---

## 📦 Project Architecture

```
├── backend/
│   ├── app/
│   │   ├── api/v1/         # Health, Auth, Analysis, and Report routers
│   │   ├── core/           # Security token keys and logging configs
│   │   ├── database/       # DB session pooler
│   │   ├── models/         # User, Session, and AnalysisReport models
│   │   ├── repositories/   # Report CRUD database mappers
│   │   ├── schemas/        # Pydantic validation structures
│   │   ├── services/       # OpenAI Beta parsing and Prompt builders
│   │   └── utils/          # PDF generator helpers
│   ├── pyproject.toml      # Package dependencies
│   └── alembic/            # Database migrations directory
├── frontend/
│   ├── app/                # Next.js App Router (Landing, Demo, Analyze, Reports)
│   ├── components/         # Reusable layouts, Monaco wraps, and UI components
│   ├── public/             # SEO assets, manifest, robots, sitemaps
│   └── package.json        # Node dependency package
├── docker/                 # Container images
└── docker-compose.yml      # Orchestration compose
```

---

## ⚙ Environment Variables

Configure these variables in your local `.env` files (refer to `.env.example` in root):

```env
# Database Settings
DATABASE_URL=postgresql+psycopg://codemedic:codemedic@localhost:5432/codemedic

# Security Settings
JWT_SECRET_KEY=replace-with-a-long-random-secret-at-least-32-characters
JWT_ALGORITHM=HS256

# OpenAI Settings (Required for AI Analysis Engine)
OPENAI_API_KEY=your-openai-api-key-here
```

---

## 🚀 Running Locally

### Option 1: Docker Compose (Quickest)

1. Make sure Docker is running on your machine.
2. In the project root, run:
   ```bash
   docker compose up --build
   ```
3. Open `http://localhost:3000` to access the application.

### Option 2: Individual Development Servers

#### 1. Setup Backend
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a python virtual environment:
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # macOS/Linux:
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -e ".[dev]"
   ```
4. Create a `.env` file and populate secrets.
5. Run the FastAPI development server:
   ```bash
   python -m uvicorn app.main:app --reload --port 8000
   ```

#### 2. Setup Frontend
1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install npm packages:
   ```bash
   npm ci
   ```
3. Start the Next.js dev server:
   ```bash
   npm run dev
   ```
4. Access the web app at `http://localhost:3000`.

---

## 📈 Quality Verification & Testing

Verify project stability and types formatting before committing:

- **Backend**:
  ```bash
  cd backend
  # Run lint rules
  .venv\Scripts\ruff check .
  # Run static type checks
  .venv\Scripts\mypy .
  ```
- **Frontend**:
  ```bash
  cd frontend
  # Run lint checks
  npm run lint
  # Run TypeScript verification
  npm run typecheck
  # Run production build compilation
  npm run build
  ```

---

## 🛡 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🏆 Hackathon Details
Developed for the **OpenAI Codex Hackathon**.
- **Application**: CodeMedic AI
- **Tagline**: Fix. Explain. Optimize. Powered by Codex.
