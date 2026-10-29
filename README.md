# Multi-Model AI Generation Platform (AI Studio)

> **Production-ready, unified AI creation workspace for Image, Video, Audio, and Text generation across hosted cloud APIs and rented GPU workers.**

---

## 🌟 Quick Overview for Vibe Coding

Welcome to your project repository! As a non-coder ("vibe coder"), you do not need to edit code files, install command-line dependencies, or worry about syntax errors.

* **Your Role**: Direct the product vision, define features, approve design aesthetics, review progress, and give feedback in plain English.
* **My Role (Antigravity AI)**: Act as your Senior Full-Stack Architect, AI Engineer, DevOps Engineer, Database Architect, and UI/UX Builder.

---

## 📚 Living Documentation Index

All core knowledge, site plans, and architecture are organized in the `docs/` folder:

1. **[Master Project Plan](file:///c:/new%20website%20creation/aistudio/docs/PROJECT_PLAN.md)**: The foundational vision, key concepts, supported modalities, business model, and principles.
2. **[Site Structure & UI/UX Wireframe Guide](file:///c:/new%20website%20creation/aistudio/docs/SITE_STRUCTURE.md)**: Full breakdown of every screen, navigation flow, generation workspaces, beginner vs. advanced controls, and admin dashboard.
3. **[Phased Implementation Roadmap](file:///c:/new%20website%20creation/aistudio/docs/PHASES_ROADMAP.md)**: Step-by-step phases, progress tracking checklists, and acceptance criteria.
4. **[Vibe Coding Playbook](file:///c:/new%20website%20creation/aistudio/docs/VIBE_CODING_PLAYBOOK.md)**: How you and your AI agent collaborate seamlessly without writing code.
5. **[Architecture Overview](file:///c:/new%20website%20creation/aistudio/docs/architecture/overview.md)**: Technical system design, monorepo structure, and data flows.
6. **[Database Schema Design](file:///c:/new%20website%20creation/aistudio/docs/architecture/database.md)**: PostgreSQL relational schema for users, credits, jobs, models, and transactions.
7. **[Job System & Queue Lifecycle](file:///c:/new%20website%20creation/aistudio/docs/architecture/job-system.md)**: Asynchronous task lifecycle, concurrency limits, and retry logic.
8. **[Credits, Billing & Pricing Engine](file:///c:/new%20website%20creation/aistudio/docs/architecture/credits-and-pricing.md)**: Two-phase credit ledger (reserve -> settle -> refund), margins, and internal cost tracking.

---

## 🛠️ Technology Stack at a Glance

* **Frontend**: Next.js 15+ (App Router), React 19, TypeScript, Tailwind CSS / Modern CSS, Lucide Icons.
* **Backend API**: Python 3.14 + FastAPI (Clean Architecture, Pydantic v2, SQLAlchemy 2.0 async).
* **Database**: PostgreSQL with Alembic migrations.
* **Task Queue & Cache**: Redis + Celery / ARQ (asynchronous, idempotent job processing).
* **AI Execution**:
  * *Path A (Hosted Cloud)*: Google Cloud Vertex AI / Gemini / Imagen / Veo APIs.
  * *Path B (Rented GPU)*: On-demand GPU workers (e.g. Blackwell / RTX Pro 6000 96GB VRAM) running Diffusers, ComfyUI, vLLM.
* **Storage**: Cloudflare R2 / Google Cloud Storage for generated media; private signed URLs.
