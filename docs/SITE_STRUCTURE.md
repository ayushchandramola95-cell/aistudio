# SITE STRUCTURE & UI/UX ARCHITECTURE

> **Status**: Living Specification  
> **Last Updated**: October 29, 2026  
> **Purpose**: Visual wireframe blueprint and screen breakdown for user interface implementation.

---

## 1. High-Level Sitemap & Navigation Flow

```
                      ┌────────────────────────────────────────┐
                      │          AI STUDIO MAIN SHELL          │
                      │  (Sidebar + Top Header + Status Bar)   │
                      └──────────────────┬─────────────────────┘
                                         │
     ┌──────────────────┬────────────────┼─────────────────┬──────────────────┐
     ▼                  ▼                ▼                 ▼                  ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐   ┌─────────────┐    ┌─────────────┐
│  HOME / HUB │  │ GENERATION  │  │ CREATIONS   │   │ CREDITS &   │    │    ADMIN    │
│  DASHBOARD  │  │ WORKSPACES  │  │   GALLERY   │   │   BILLING   │    │  DASHBOARD  │
└─────────────┘  └──────┬──────┘  └─────────────┘   └─────────────┘    └─────────────┘
                        │
    ┌───────────────┬───┴───────────┬───────────────┬───────────────┐
    ▼               ▼               ▼               ▼               ▼
┌────────┐     ┌────────┐     ┌─────────┐      ┌────────┐      ┌───────────┐
│ IMAGE  │     │ VIDEO  │     │ AUDIO   │      │  TEXT  │      │  ENHANCE  │
│ STUDIO │     │ STUDIO │     │ (TTS/   │      │ STUDIO │      │ & RESTORE │
│        │     │        │     │  STT)   │      │        │      │           │
└────────┘     └────────┘     └─────────┘      └────────┘      └───────────┘
```

---

## 2. Global Shell & Persistent Components

### A. Top Navigation Bar (Header)
* **Brand Logo**: Clean icon + "AI Studio" brand mark.
* **Model Router Indicator**: Visual badge showing active route mode (`Auto-Select` or `Manual Model`).
* **Active Tasks Counter**: Pulsing badge showing queued / generating jobs (e.g. `2 generating...`). Clicking opens a slide-over Job Queue Drawer.
* **Credits Balance Pill**: Displays user balance (e.g. `💎 350 Credits`) with instant `+ Add Credits` button.
* **User Profile Avatar**: Dropdown menu (Profile, Account Settings, Theme Toggle, Admin Dashboard link if authorized, Sign Out).

### B. Persistent Left Sidebar
* **Creation Hub**:
  * 🎨 **Image Studio** (`/image`)
  * 🎬 **Video Studio** (`/video`)
  * 🎙️ **Audio & Speech** (`/audio`)
  * ✍️ **Text & Writing** (`/text`)
  * ⚡ **Enhance & Upscale** (`/enhance`)
* **Assets & History**:
  * 🖼️ **My Creations** (`/creations`) — All outputs across modalities.
  * 📁 **Projects** (`/projects`) — Folder collections.
* **Account & Admin**:
  * 💎 **Credits & Usage** (`/credits`)
  * ⚙️ **Settings** (`/settings`)
  * 🛡️ **Admin Panel** (`/admin`) *(Visible only to admin role)*

---

## 3. Screen-by-Screen Specifications

### Screen 1: The Unified Generation Workspace (`/image`, `/video`, etc.)
The studio workspace is divided into two distinct panels for high productivity:

#### Left Panel: Creation Controls (Adaptive UX)
* **Prompt Box**: Auto-expanding text area with syntax highlighting and token count.
* **✨ Enhance Prompt Button**: One-click AI optimization of prompt tailored to chosen modality/style.
* **Mode Switcher**: Toggle between **Beginner Mode** (default) and **Advanced Mode**.
  * **Beginner Controls**:
    * *Style Preset Picker*: Visual grid cards (Photorealistic, Anime, Cinematic, 3D Render, Watercolor, Cyberpunk).
    * *Aspect Ratio Selector*: Visual pill buttons (`1:1 Square`, `16:9 Landscape`, `9:16 Portrait`, `4:3 Standard`).
    * *Outputs Count*: `1`, `2`, or `4` images.
  * **Advanced Controls (Accordion dropdown)**:
    * *Model Dropdown*: Exact model selection (e.g. FLUX.1 Dev, SDXL, Imagen 3).
    * *Negative Prompt*: Words to exclude.
    * *Sampling Steps & Guidance Scale (CFG)*: Sliders with recommended defaults.
    * *Seed Field*: Randomizer button or specific numerical seed for reproducibility.
* **Bottom Action Bar**:
  * Estimated cost indicator (e.g., `Estimated: 6 Credits`).
  * Big Primary **"Generate" Button** (disabled if insufficient credits, with clear tooltip).

#### Right Panel: Canvas & Results Viewer
* **Stage Display**: High-resolution viewer with zoom, pan, and comparison slider.
* **Action Strip**: Download (Original/Upscaled), Upscale 4x, Remove Background, Copy Prompt, Reuse Settings, Delete.
* **Recent Runs Strip**: Quick horizontal carousel of user's past 10 generations in this modality.

---

### Screen 2: My Creations Gallery (`/creations`)
* **Filter Bar**: Filter by Modality (All, Images, Videos, Audio, Text), Models, Dates, Favorites.
* **View Modes**: Masonry Grid, Square Grid, Detailed List.
* **Batch Actions**: Bulk Download (.zip), Bulk Delete, Move to Project folder.
* **Lightbox Modal**: Full-screen modal with metadata inspection:
  * Prompt used, Enhanced prompt version, Model ID, Seed, Steps, Guidance, Generation Duration, Credits Spent.

---

### Screen 3: Asynchronous Job Drawer (Slide-Over)
* Accessible globally from the top navigation bar.
* Lists all background jobs:
  * **Queued**: Position in queue (e.g., `#2 in line`).
  * **Processing**: Real-time progress bar and elapsed seconds.
  * **Completed**: Instant preview thumbnail and "View in Canvas" button.
  * **Failed**: Friendly error explanation and 1-click "Retry" (with automatic credit refund notification).

---

### Screen 4: Credits & Billing (`/credits`)
* **Balance Card**: Available credits, reserved credits (in-flight jobs), lifetime credits spent.
* **Pricing Packages**: Tiered packages (e.g. Starter 500 Credits, Pro 2,500 Credits, Studio 10,000 Credits).
* **Ledger History Table**: Immutable transaction log:
  * Timestamp, Transaction Type (`RESERVE`, `SETTLE`, `REFUND`, `PURCHASE`), Amount, Job ID, Running Balance.

---

### Screen 5: Admin & Infrastructure Dashboard (`/admin`)
Restricted to users with `is_admin = True`.
* **Tab A: System Health & Metrics**: Active GPU worker nodes, CPU/VRAM gauges, Redis queue length, API response times.
* **Tab B: Model Registry**: Master table of all models. Toggle availability (`Active`, `Maintenance`, `Disabled`), edit credit price formulas, inspect license records.
* **Tab C: GPU Lifecycle**: Live status of rented GPU nodes. One-click manual start/stop, idle timeout settings, real-time hourly cost tracker.
* **Tab D: Jobs & Audit Log**: Real-time stream of all platform generation jobs, provider latencies, and transaction audits.
