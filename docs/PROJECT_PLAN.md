# MASTER PROJECT PLAN: Unified Multi-Model AI Studio

> **Status**: Living Document (Source of Truth)  
> **Last Updated**: October 29, 2026  
> **Project Code Name**: AI Studio (`aistudio`)  
> **Target Audience**: Content creators, designers, storytellers, marketers, developers, and AI enthusiasts.

---

## 1. Executive Summary & Vision

The **AI Studio** is a unified, production-grade AI generation and creative workflow platform. 

Instead of forcing users to jump between Midjourney for images, Runway/Luma for video, ElevenLabs for voice, and ChatGPT/Claude for text, **AI Studio aggregates the world's best AI models into a single, intuitive workspace** powered by:

1. **A Single Credit Balance**: Users pay transparent platform credits—never confusing GPU seconds or complex API tokens.
2. **Dual-Path Execution**:
   * **Hosted Cloud APIs**: Google Cloud Vertex AI (Imagen, Veo, Gemini) for reliable, zero-maintenance high-speed inference.
   * **Rented GPU Workers**: Dedicated GPU servers (e.g., 96GB VRAM NVIDIA RTX PRO 6000 / Blackwell class) running bleeding-edge open-weight models (FLUX, Wan, HunyuanVideo, Kokoro, Whisper).
3. **Intelligent Router & Prompt Enhancer**: Plain-English prompts are transformed into model-optimized instructions, and the best model is automatically recommended based on quality, speed, and credit cost.
4. **Adaptive UX**:
   * *Beginner Mode*: 3-click generation (Describe -> Pick Style -> Generate).
   * *Advanced Mode*: Full parameter control (Steps, Guidance, Seeds, Samplers, LoRAs, Negative Prompts, Resolution, Duration).
5. **Durable Asynchronous Queue**: Users can trigger 10 generations in parallel and close their browser; jobs run reliably in the background.

---

## 2. The Core Problems We Solve

| The Current AI Problem | AI Studio Solution |
| :--- | :--- |
| **Tool Fragmentation**: 5 subscriptions ($20/mo each) for image, video, audio, text. | **Unified Hub**: One credit pool works across all media types. |
| **Technical Overwhelm**: Complicated open-source UIs (ComfyUI, WebUI) frighten beginners. | **Adaptive UI**: Clean, modern interface for beginners; collapsible power tools for pros. |
| **Bad Prompts**: Most users don't know model-specific prompting syntax. | **Smart Enhancer**: Modality-aware prompt expander tailored to each model's nuances. |
| **GPU Waste**: Leaving cloud GPUs running 24/7 wastes hundreds of dollars. | **Smart GPU Lifecycle**: Workers boot on-demand and shut down when idle. |
| **Unreliable Apps**: Web apps that hang if you close the tab. | **Durable Asynchronous Queue**: Redis/PostgreSQL backed job engine that runs offline. |

---

## 3. Product Modalities & Capabilities

### A. Image Generation & Editing
* **Tasks**: Text-to-Image, Image-to-Image, Variations, Inpainting, Outpainting.
* **Controls**: Aspect ratios (1:1, 16:9, 9:16, 4:3, etc.), Style presets (Photorealistic, Anime, Cinematic, 3D, Cyberpunk, etc.), Resolution up to 4K, Seed control, Negative prompts.
* **Target Models**: FLUX.1 (Dev/Schnell), SDXL, SD 3.5, Google Imagen 3.

### B. Video Generation
* **Tasks**: Text-to-Video, Image-to-Video, Camera motion control, Video extension.
* **Controls**: Duration (2s–10s), Aspect ratio, Resolution (720p/1080p), Quality tiers, Seed.
* **Target Models**: Google Veo, Wan 2.1, LTX-Video, HunyuanVideo, CogVideoX.

### C. Speech & Audio
* **Tasks**: Text-to-Speech (TTS), Audio Transcription (STT), Voice cloning (future).
* **Controls**: Speaker selection, Speech speed, Pitch, Language selection, Timestamped exports (SRT/VTT).
* **Target Models**: Kokoro TTS, F5-TTS, OpenAI/Faster-Whisper.

### D. Text & Creative Writing
* **Tasks**: Prompt expansion, Story writing, Video scriptwriting, Character dialogues.
* **Target Models**: Google Gemini 1.5/2.0 Flash/Pro, Qwen 2.5, Llama 3.3.

### E. Enhancements & Creative Utilities
* **Tasks**: 4x AI Upscaling, Background removal, Face restoration, Format conversion (PNG/WebP/MP4/WAV).
* **Target Models**: Real-ESRGAN, BiRefNet, SwinIR.

---

## 4. Business & Monetization Architecture

* **Unit of Value**: **Credits**.
  * User buys credit packs or monthly subscription tiers.
  * Operations cost a transparent number of credits (e.g., Image = 6 credits, Video = 80 credits, TTS = 2 credits).
* **Cost Accounting**:
  * The backend computes the real cost: `Real Cost = Provider Fee OR (GPU Seconds * Rate + Idle Share) + Storage + Network`.
  * The credit price guarantees a healthy gross margin (e.g., 50–70% target margin) plus safety buffers.
* **Transaction Safety**:
  * **2-Phase Ledger**: Credits are **Reserved** upon job submission -> **Settled** upon successful completion -> **Refunded** immediately if generation fails.

---

## 5. Non-Negotiable Engineering Principles

1. **Never Fake Results**: No placeholder mock data in production pathways. All outputs must come from real model executions.
2. **Never Trust the Client**: Frontend cannot dictate prices, credit balances, job status, or model capabilities. All validation is server-side.
3. **Decoupled Infrastructure**: Website, database, and API must stay 100% operational even if GPU inference nodes are sleeping or offline.
4. **Vibe Coder Friendly**: The system is modular, clean, self-documenting, and designed for guided maintenance.
5. **Budget Vigilance**: Respect the initial $300 Google Cloud credit budget; do not spin up persistent expensive VMs until production-ready.

---

## 6. Document Update Log

| Date | Author | Changes |
| :--- | :--- | :--- |
| **2026-10-29** | AI Studio Team | Elevated navbar height to a generous 90px (`h-[90px]`), widened container, refined minimalist obsidian logo (`aistudio`), integrated luxury `Instrument Serif` editorial typography, authentic collaborator SVG cursors, and Invideo-style horizontal modality creation dock. |
| **2026-10-29** | AI Studio Team | Transformed visual design to high-aesthetic **Pure Light Theme**; added full public marketing homepage at `/` with interactive live preview, modality showcase, pricing, FAQ, and integrated Login/Register modal with 100 free welcome credits. Moved creative workspace to `/studio`. |
| **2026-10-29** | AI Studio Team | Initial creation of the Master Project Plan based on Master Prompt specs. |

