# PHASES ROADMAP & IMPLEMENTATION MILESTONES

> **Status**: Living Execution Tracker  
> **Last Updated**: October 29, 2026  
> **Approach**: Phased, End-to-End, Zero Fake Data, Continuous Verification.

---

## 🗺️ Roadmap Overview

```
Phase 1: Architecture & Monorepo Foundation (Current)
   │
Phase 2: Core Platform (Web Shell, Auth, Database, Queue & Credits Ledger)
   │
Phase 3: First Real End-to-End Generation Workflow (Image Generation)
   │
Phase 4: Smart Prompt Enhancer & Intelligent Model Router
   │
Phase 5: Local/Rented GPU Worker Node (Open-Weight Inference Pipeline)
   │
Phase 6: AI Video Generation Studio (Veo / Wan / Hunyuan)
   │
Phase 7: Audio & Text Studio (Speech-to-Text, Kokoro TTS, Creative Text)
   │
Phase 8: Admin & GPU Cost Management Dashboard
   │
Phase 9: Multi-Platform Expansion (Desktop Tauri & Mobile Expo)
   │
Phase 10: Commercial Launch Hardening, Security & Stripe Billing
```

---

## 📌 Phase 1: Architecture, Monorepo & Documentation Foundation
*Goal: Establish the clean repository foundation, living documentation, and shared TypeScript/Python contracts before writing application code.*

* [x] **Milestone 1.1**: Initialize Git repository and verify local environment (Node.js 24, Python 3.14).
* [x] **Milestone 1.2**: Author Core Vision & Master Plan (`docs/PROJECT_PLAN.md`).
* [x] **Milestone 1.3**: Author Site Structure & UI/UX Blueprint (`docs/SITE_STRUCTURE.md`).
* [x] **Milestone 1.4**: Author Phased Implementation Roadmap (`docs/PHASES_ROADMAP.md`).
* [x] **Milestone 1.5**: Author Vibe Coding Playbook (`docs/VIBE_CODING_PLAYBOOK.md`).
* [ ] **Milestone 1.6**: Author Technical System Architecture & Database Schema docs (`docs/architecture/`).
* [ ] **Milestone 1.7**: Establish monorepo workspace directory structure (`apps/web`, `services/api`, `packages/shared-types`).

**Acceptance Criteria for Phase 1**:
* All blueprint docs are available in `docs/`.
* Directory structure is organized and ready for frontend and backend bootstrapping.

---

## 📌 Phase 2: Core Platform (Web Shell, Auth, Database, Queue & Credits)
*Goal: Build the real website shell, database models, user authentication, and the 2-phase transactional credit ledger.*

* [ ] **Milestone 2.1**: Initialize Next.js 15+ App Router web application with Tailwind CSS and Lucide icons.
* [ ] **Milestone 2.2**: Build responsive Global Shell: Top navigation bar, persistent sidebar, Theme toggle, Credits pill, and User profile menu.
* [ ] **Milestone 2.3**: Initialize FastAPI backend service with async PostgreSQL and SQLAlchemy 2.0.
* [ ] **Milestone 2.4**: Implement Database Models: `users`, `credit_accounts`, `credit_transactions`, `generation_jobs`, `models_registry`.
* [ ] **Milestone 2.5**: Build Two-Phase Credit Engine:
  * Reserve credits on job trigger (`status = RESERVED`).
  * Settle credits on success (`status = SETTLED`).
  * Instant automatic refund on failure (`status = REFUNDED`).
* [ ] **Milestone 2.6**: Set up durable Redis job queue for asynchronous background task dispatching.

**Acceptance Criteria for Phase 2**:
* You can open `http://localhost:3000` in your browser and see the sleek AI Studio interface.
* You can sign up/log in, view your initial credit balance, and see credit reservation transactions test cleanly.

---

## 📌 Phase 3: First Real End-to-End Generation Workflow (Image Studio)
*Goal: Implement the complete, real image generation pipeline from prompt to file storage with zero mock data.*

* [ ] **Milestone 3.1**: Build `/image` studio screen with prompt input, aspect ratio cards, style presets, and beginner/advanced toggle.
* [ ] **Milestone 3.2**: Connect first real provider (e.g. Google Cloud Vertex AI Imagen 3 / Cloud AI API).
* [ ] **Milestone 3.3**: Implement Object Storage service (Google Cloud Storage / Cloudflare R2) with secure signed URLs.
* [ ] **Milestone 3.4**: Connect asynchronous job drawer: submit job, watch real-time status, view generated high-res image on canvas.
* [ ] **Milestone 3.5**: Verify full credit ledger cycle (Credits reserved -> Image generated -> Media uploaded -> Credits deducted).

**Acceptance Criteria for Phase 3**:
* You type "A futuristic city in neon rain", click Generate, and within seconds you see a real, high-resolution generated image in your browser gallery, with credits correctly deducted.

---

## 📌 Phase 4: Prompt Enhancement & Intelligent Model Router
*Goal: Let beginners type simple prompts and turn them into cinematic masterpieces, with automatic model recommendation.*

* [ ] **Milestone 4.1**: Build the Prompt Enhancer engine using fast, cost-effective LLMs (e.g., Gemini 1.5 Flash).
* [ ] **Milestone 4.2**: Add one-click "✨ Enhance" button in the prompt box with live before/after diff preview.
* [ ] **Milestone 4.3**: Implement Intelligent Router: automatically selects the best model based on prompt style, required aspect ratio, quality tier, and credit cost.

**Acceptance Criteria for Phase 4**:
* Clicking "✨ Enhance" turns a simple 5-word prompt into a rich, detailed prompt with style tags.

---

## 📌 Phase 5: Rented GPU Worker Infrastructure (Open-Weight Models)
*Goal: Connect a rented GPU instance (e.g. 96GB VRAM) for high-performance open-weight models (FLUX.1, SDXL).*

* [ ] **Milestone 5.1**: Build containerized GPU worker runtime (Diffusers/ComfyUI backend).
* [ ] **Milestone 5.2**: Implement VRAM-aware model caching and loading/unloading logic.
* [ ] **Milestone 5.3**: Build GPU Lifecycle Controller: automated on-demand boot, health pinging, and idle-timeout auto-shutdown.
* [ ] **Milestone 5.4**: Route generation jobs to the GPU worker when selected.

**Acceptance Criteria for Phase 5**:
* Generating with FLUX.1 routes to the GPU worker, produces the image, and the GPU worker shuts down when idle to avoid wasting money.

---

## 📌 Phase 6: AI Video Generation Studio
*Goal: Launch `/video` workspace with camera controls, durations, and asynchronous progress.*

* [ ] **Milestone 6.1**: Build Video Studio UI (Text-to-Video, Image-to-Video, duration selector 3s-10s, aspect ratio).
* [ ] **Milestone 6.2**: Integrate real video model APIs (Google Veo / Wan 2.1 / HunyuanVideo).
* [ ] **Milestone 6.3**: Implement video transcoding, thumbnail generation, and streaming video player.

**Acceptance Criteria for Phase 6**:
* You can generate a smooth, high-definition AI video, preview it in the built-in player, and download the MP4 file.

---

## 📌 Phase 7: Audio, Speech & Text Studios
*Goal: Expand to Text-to-Speech (Kokoro/F5-TTS), Audio Transcription (Whisper), and Creative Text.*

* [ ] **Milestone 7.1**: Build Audio Studio UI with voice audition player, speech speed, and waveform visualizer.
* [ ] **Milestone 7.2**: Connect Kokoro TTS and Faster-Whisper transcription engines.
* [ ] **Milestone 7.3**: Build Text Studio for creative writing, video scripts, and prompt libraries.

**Acceptance Criteria for Phase 7**:
* Type text and generate lifelike spoken voice audio; upload audio and receive accurate timestamped transcripts.

---

## 📌 Phase 8: Admin & Cost Management Dashboard
*Goal: Private internal command center to monitor GPU spend, manage models, and view transactions.*

* [ ] **Milestone 8.1**: Build `/admin` dashboard with role-based security.
* [ ] **Milestone 8.2**: Model Registry manager: update credit multipliers, enable/disable models, view health logs.
* [ ] **Milestone 8.3**: Live GPU monitor & manual start/stop controls.
* [ ] **Milestone 8.4**: Real-time platform revenue vs. provider cost ledger.

**Acceptance Criteria for Phase 8**:
* Admins can view real-time platform statistics, toggle models with a single switch, and monitor server costs.

---

## 📌 Phase 9: Multi-Platform Expansion (Desktop & Mobile)
*Goal: Package the shared web app into desktop (Windows/Mac/Linux) and mobile (Android/iOS) apps.*

* [ ] **Milestone 9.1**: Configure Tauri desktop wrapper sharing the Next.js frontend and secure API.
* [ ] **Milestone 9.2**: Configure React Native with Expo for mobile app, sharing data contracts.

**Acceptance Criteria for Phase 9**:
* Downloadable Windows installer (.msi/.exe) and mobile build connecting to the same user account.

---

## 📌 Phase 10: Commercial Launch & Hardening
*Goal: Security audits, rate limiting, Stripe payment gateway, and production deployment.*

* [ ] **Milestone 10.1**: Stripe Checkout integration for purchasing credit packages.
* [ ] **Milestone 10.2**: Rate limiting, bot protection, and abuse prevention.
* [ ] **Milestone 10.3**: Production deployment (Docker, CDN, SSL, automated daily database backups).
