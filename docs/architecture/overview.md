# SYSTEM ARCHITECTURE OVERVIEW

> **Document**: Technical System Design  
> **Status**: Approved Foundation  
> **Target Audience**: Technical Architects, Engineers, and Maintainers.

---

## 1. High-Level System Architecture

```
                       ┌──────────────────────────────────────────────┐
                       │          CLIENT LAYER                        │
                       │  - Web App (Next.js 15, React 19, TS)        │
                       │  - Desktop App (Tauri / TS)                  │
                       │  - Mobile App (React Native / Expo)          │
                       └──────────────────────┬───────────────────────┘
                                              │ HTTPS / WSS
                                              ▼
                       ┌──────────────────────────────────────────────┐
                       │          API GATEWAY (FastAPI)               │
                       │  - Auth (JWT / Sessions)                     │
                       │  - Rate Limiting & Input Validation (Pydantic│
                       │  - Credit Engine (Two-Phase Ledger)          │
                       │  - Model Router & Registry Service           │
                       └──────────────┬───────────────────────────────┘
                                      │
           ┌──────────────────────────┼──────────────────────────┐
           │                          │                          │
           ▼                          ▼                          ▼
┌────────────────────┐     ┌────────────────────┐     ┌────────────────────┐
│   DATABASE LAYER   │     │    ASYNC QUEUE     │     │   OBJECT STORAGE   │
│ - PostgreSQL 16+   │     │ - Redis 7+ Broker  │     │ - Google Cloud GCS │
│ - Users, Credits,  │     │ - Celery / ARQ     │     │ - Cloudflare R2    │
│   Jobs, Models     │     │ - Priority Queues  │     │ - Presigned URLs   │
└────────────────────┘     └──────────┬─────────┘     └────────────────────┘
                                      │
            ┌─────────────────────────┴─────────────────────────┐
            │                                                   │
            ▼                                                   ▼
┌─────────────────────────────────┐           ┌─────────────────────────────────┐
│     HOSTED AI WORKER SERVICE    │           │     RENTED GPU WORKER NODE      │
│  - Google Cloud Vertex AI       │           │  - 96GB VRAM (Blackwell/RTX)    │
│  - Imagen 3 (Image Gen)         │           │  - Diffusers / ComfyUI / vLLM   │
│  - Veo 2 (Video Gen)            │           │  - FLUX.1, Wan 2.1, Hunyuan     │
│  - Gemini 2.0 (Prompt/Text)     │           │  - On-Demand Lifecycle Manager  │
└─────────────────────────────────┘           └─────────────────────────────────┘
```

---

## 2. Monorepo Organization

```
aistudio/
├── apps/
│   ├── web/                    # Next.js 15 web application
│   ├── desktop/                # Tauri desktop application (Phase 9)
│   └── mobile/                 # React Native / Expo mobile application (Phase 9)
├── services/
│   ├── api/                    # FastAPI core backend service
│   ├── orchestrator/           # Model routing & prompt enhancement engine
│   ├── cloud-ai-worker/        # Cloud AI worker (Vertex AI, Gemini, Imagen)
│   └── gpu-worker/             # GPU worker runtime for open-weight models
├── packages/
│   ├── shared-types/           # Shared TypeScript interfaces & schemas
│   ├── shared-config/          # Shared constants, styles, and configurations
│   └── api-client/             # Generated TypeScript SDK for the API
├── infrastructure/
│   ├── docker/                 # Container definitions
│   └── deployment/             # Deployment scripts and configuration
└── docs/                       # Living project documentation
```

---

## 3. Communication Patterns

* **Client to API**: RESTful endpoints for CRUD, user authentication, and profile management.
* **Job Submission**: REST endpoint `POST /api/v1/jobs` returns a `202 Accepted` with a unique `job_id` and initial `RESERVED` status.
* **Live Job Status**: SSE (Server-Sent Events) or WebSocket connection for low-latency live progress updates to client browsers without aggressive polling.
* **Worker Execution**: Workers pull serialized jobs from Redis, execute inference, upload artifacts directly to object storage, write status to PostgreSQL, and emit a completion event.
