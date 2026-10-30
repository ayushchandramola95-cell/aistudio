"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Terminal,
  Key,
  Code2,
  Copy,
  Check,
  Plus,
  Trash2,
  ShieldCheck,
  Zap,
  ExternalLink,
  BookOpen,
  Layers,
  ArrowRight,
  Server,
  Lock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Cpu,
  Sliders,
  Play,
  Settings,
  Database,
  Cloud,
  HardDrive,
  Activity,
  ArrowUpRight,
  Radio,
  FileCode,
  DollarSign,
  ChevronDown,
  Info,
  Maximize2,
  X,
  SlidersHorizontal,
  BarChart3,
  ShieldAlert,
  Flame,
  CheckCircle,
  HelpCircle
} from "lucide-react";

interface ModelRequirements {
  allowedAspectRatios: string[];
  maxPromptLength: number;
  maxBatchCount: number;
  safetyFilterLevel: "block_none" | "block_low_and_above" | "block_medium_and_above";
  personGeneration: "allow_all" | "allow_adult" | "dont_allow";
  synthIdWatermark: boolean;
  minCreditBalance: number;
  stepsMin: number;
  stepsMax: number;
  stepsDefault: number;
  cfgMin: number;
  cfgMax: number;
  cfgDefault: number;
  enforceNegativePrompt: boolean;
  negativePromptDefault: string;
}

interface ModelMonitoring {
  calls24h: number;
  p95LatencySec: number;
  avgLatencySec: number;
  successRate: string;
  errorCount24h: number;
  creditsEarned: number;
  uptimePercent: string;
  health: "HEALTHY" | "DEGRADED" | "PAUSED";
  recentLatencies: number[];
}

interface ModelItem {
  id: string;
  name: string;
  backend: string;
  status: "ACTIVE" | "PAUSED" | "MAINTENANCE";
  category: "google-image" | "google-multimodal" | "local-open" | "google-video";
  type: string;
  cost: number;
  latency: string;
  region: string;
  enabled: boolean;
  desc: string;
  version: string;
  requirements: ModelRequirements;
  monitoring: ModelMonitoring;
}

interface ApiKeyItem {
  id: string;
  name: string;
  key: string;
  env: "live" | "test";
  created: string;
  lastUsed: string;
}

const DEFAULT_MODELS: ModelItem[] = [
  {
    id: "imagen-3",
    name: "Google Imagen 3 (High Quality)",
    backend: "Google Vertex AI",
    status: "ACTIVE",
    category: "google-image",
    type: "Vertex AI Image API",
    cost: 8,
    latency: "2.1s",
    region: "us-central1",
    enabled: true,
    desc: "Google's flagship text-to-image engine. Top photorealism, fine typography & micro-textures.",
    version: "imagen-3.0-generate-002",
    requirements: {
      allowedAspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4"],
      maxPromptLength: 2000,
      maxBatchCount: 4,
      safetyFilterLevel: "block_medium_and_above",
      personGeneration: "allow_adult",
      synthIdWatermark: true,
      minCreditBalance: 8,
      stepsMin: 20,
      stepsMax: 50,
      stepsDefault: 30,
      cfgMin: 1.0,
      cfgMax: 15.0,
      cfgDefault: 7.0,
      enforceNegativePrompt: true,
      negativePromptDefault: "blurry, low resolution, bad anatomy, deformed fingers",
    },
    monitoring: {
      calls24h: 3842,
      p95LatencySec: 2.14,
      avgLatencySec: 1.82,
      successRate: "99.98%",
      errorCount24h: 1,
      creditsEarned: 30736,
      uptimePercent: "100.0%",
      health: "HEALTHY",
      recentLatencies: [1.8, 1.9, 2.1, 1.7, 2.0, 1.8, 2.2],
    },
  },
  {
    id: "imagen-3-fast",
    name: "Google Imagen 3 Fast",
    backend: "Google Vertex AI",
    status: "ACTIVE",
    category: "google-image",
    type: "Vertex AI Image API",
    cost: 4,
    latency: "0.9s",
    region: "us-central1",
    enabled: true,
    desc: "Ultra-fast generation optimized for real-time creativity, rapid drafting and lower cost.",
    version: "imagen-3.0-fast-generate-001",
    requirements: {
      allowedAspectRatios: ["1:1", "16:9", "9:16", "4:3"],
      maxPromptLength: 1000,
      maxBatchCount: 2,
      safetyFilterLevel: "block_medium_and_above",
      personGeneration: "allow_adult",
      synthIdWatermark: true,
      minCreditBalance: 4,
      stepsMin: 10,
      stepsMax: 20,
      stepsDefault: 12,
      cfgMin: 2.0,
      cfgMax: 10.0,
      cfgDefault: 5.0,
      enforceNegativePrompt: false,
      negativePromptDefault: "",
    },
    monitoring: {
      calls24h: 2190,
      p95LatencySec: 0.98,
      avgLatencySec: 0.84,
      successRate: "99.99%",
      errorCount24h: 0,
      creditsEarned: 8760,
      uptimePercent: "100.0%",
      health: "HEALTHY",
      recentLatencies: [0.8, 0.9, 0.8, 0.9, 1.0, 0.8, 0.9],
    },
  },
  {
    id: "imagen-3-edit",
    name: "Google Imagen 3 Inpainting & Edit",
    backend: "Google Vertex AI",
    status: "ACTIVE",
    category: "google-image",
    type: "Vertex AI Image API",
    cost: 10,
    latency: "2.8s",
    region: "us-central1",
    enabled: true,
    desc: "Region-based canvas masking, object replacement and background generative filling.",
    version: "imagen-3.0-generate-002",
    requirements: {
      allowedAspectRatios: ["1:1", "16:9", "9:16"],
      maxPromptLength: 1500,
      maxBatchCount: 1,
      safetyFilterLevel: "block_medium_and_above",
      personGeneration: "allow_adult",
      synthIdWatermark: true,
      minCreditBalance: 10,
      stepsMin: 20,
      stepsMax: 40,
      stepsDefault: 25,
      cfgMin: 2.0,
      cfgMax: 12.0,
      cfgDefault: 6.5,
      enforceNegativePrompt: true,
      negativePromptDefault: "artifacts, seams, unnatural boundary blending",
    },
    monitoring: {
      calls24h: 620,
      p95LatencySec: 2.92,
      avgLatencySec: 2.54,
      successRate: "99.85%",
      errorCount24h: 1,
      creditsEarned: 6200,
      uptimePercent: "99.9%",
      health: "HEALTHY",
      recentLatencies: [2.5, 2.7, 2.9, 2.4, 2.8, 2.6, 2.7],
    },
  },
  {
    id: "imagen-3-upscale",
    name: "Google Imagen 4K Upscaler",
    backend: "Google Vertex AI",
    status: "ACTIVE",
    category: "google-image",
    type: "Vertex AI Image API",
    cost: 4,
    latency: "1.5s",
    region: "us-central1",
    enabled: true,
    desc: "Deep super-resolution upscaling (2x / 4x) preserving high frequency facial and hair detail.",
    version: "imagen-3.0-upscale",
    requirements: {
      allowedAspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4"],
      maxPromptLength: 500,
      maxBatchCount: 1,
      safetyFilterLevel: "block_none",
      personGeneration: "allow_all",
      synthIdWatermark: false,
      minCreditBalance: 4,
      stepsMin: 10,
      stepsMax: 30,
      stepsDefault: 15,
      cfgMin: 1.0,
      cfgMax: 5.0,
      cfgDefault: 2.0,
      enforceNegativePrompt: false,
      negativePromptDefault: "",
    },
    monitoring: {
      calls24h: 1140,
      p95LatencySec: 1.62,
      avgLatencySec: 1.41,
      successRate: "100.0%",
      errorCount24h: 0,
      creditsEarned: 4560,
      uptimePercent: "100.0%",
      health: "HEALTHY",
      recentLatencies: [1.3, 1.4, 1.5, 1.4, 1.6, 1.4, 1.3],
    },
  },
  {
    id: "gemini-2-flash",
    name: "Google Gemini 2.0 Flash",
    backend: "Google Vertex AI",
    status: "ACTIVE",
    category: "google-multimodal",
    type: "Vertex AI Multimodal",
    cost: 1,
    latency: "0.4s",
    region: "us-central1",
    enabled: true,
    desc: "Low-latency vision reasoning, visual prompt expansion and creative multi-turn direction.",
    version: "gemini-2.0-flash-exp",
    requirements: {
      allowedAspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4"],
      maxPromptLength: 4000,
      maxBatchCount: 1,
      safetyFilterLevel: "block_medium_and_above",
      personGeneration: "allow_all",
      synthIdWatermark: false,
      minCreditBalance: 1,
      stepsMin: 0,
      stepsMax: 0,
      stepsDefault: 0,
      cfgMin: 0.0,
      cfgMax: 2.0,
      cfgDefault: 0.7,
      enforceNegativePrompt: false,
      negativePromptDefault: "",
    },
    monitoring: {
      calls24h: 8940,
      p95LatencySec: 0.48,
      avgLatencySec: 0.38,
      successRate: "99.99%",
      errorCount24h: 1,
      creditsEarned: 8940,
      uptimePercent: "100.0%",
      health: "HEALTHY",
      recentLatencies: [0.3, 0.4, 0.4, 0.3, 0.5, 0.4, 0.4],
    },
  },
  {
    id: "flux-1-schnell",
    name: "FLUX.1 Schnell",
    backend: "Local / Serverless GPU",
    status: "ACTIVE",
    category: "local-open",
    type: "Local GPU Worker",
    cost: 6,
    latency: "1.2s",
    region: "Local Worker",
    enabled: true,
    desc: "Ultra-fast 4-step latent rectification with razor-sharp composition and open weights.",
    version: "flux1-schnell-fp8",
    requirements: {
      allowedAspectRatios: ["1:1", "16:9", "9:16", "4:3"],
      maxPromptLength: 1500,
      maxBatchCount: 4,
      safetyFilterLevel: "block_none",
      personGeneration: "allow_all",
      synthIdWatermark: false,
      minCreditBalance: 6,
      stepsMin: 4,
      stepsMax: 12,
      stepsDefault: 4,
      cfgMin: 1.0,
      cfgMax: 6.0,
      cfgDefault: 3.5,
      enforceNegativePrompt: false,
      negativePromptDefault: "",
    },
    monitoring: {
      calls24h: 1840,
      p95LatencySec: 1.35,
      avgLatencySec: 1.18,
      successRate: "99.92%",
      errorCount24h: 1,
      creditsEarned: 11040,
      uptimePercent: "99.9%",
      health: "HEALTHY",
      recentLatencies: [1.1, 1.2, 1.3, 1.1, 1.2, 1.2, 1.1],
    },
  },
  {
    id: "flux-1-dev",
    name: "FLUX.1 Dev",
    backend: "Local / Serverless GPU",
    status: "ACTIVE",
    category: "local-open",
    type: "Local GPU Worker",
    cost: 10,
    latency: "3.6s",
    region: "Local Worker",
    enabled: true,
    desc: "Top guidance precision and artistic prompt adherence with 24GB VRAM execution.",
    version: "flux1-dev-bf16",
    requirements: {
      allowedAspectRatios: ["1:1", "16:9", "9:16", "4:3"],
      maxPromptLength: 2000,
      maxBatchCount: 2,
      safetyFilterLevel: "block_none",
      personGeneration: "allow_all",
      synthIdWatermark: false,
      minCreditBalance: 10,
      stepsMin: 20,
      stepsMax: 50,
      stepsDefault: 28,
      cfgMin: 1.0,
      cfgMax: 12.0,
      cfgDefault: 4.5,
      enforceNegativePrompt: false,
      negativePromptDefault: "",
    },
    monitoring: {
      calls24h: 910,
      p95LatencySec: 3.84,
      avgLatencySec: 3.52,
      successRate: "99.80%",
      errorCount24h: 2,
      creditsEarned: 9100,
      uptimePercent: "99.8%",
      health: "HEALTHY",
      recentLatencies: [3.4, 3.6, 3.8, 3.5, 3.7, 3.6, 3.4],
    },
  },
  {
    id: "sd-3-5",
    name: "Stable Diffusion 3.5 Large",
    backend: "Local Diffusers Engine",
    status: "ACTIVE",
    category: "local-open",
    type: "Local GPU Worker",
    cost: 5,
    latency: "1.9s",
    region: "Local Worker",
    enabled: true,
    desc: "Versatile styling, character design & concept exploration with SD3.5 architecture.",
    version: "sd3.5-large-turbo",
    requirements: {
      allowedAspectRatios: ["1:1", "16:9", "9:16", "4:3"],
      maxPromptLength: 1500,
      maxBatchCount: 4,
      safetyFilterLevel: "block_none",
      personGeneration: "allow_all",
      synthIdWatermark: false,
      minCreditBalance: 5,
      stepsMin: 15,
      stepsMax: 40,
      stepsDefault: 25,
      cfgMin: 1.0,
      cfgMax: 10.0,
      cfgDefault: 4.5,
      enforceNegativePrompt: true,
      negativePromptDefault: "blurry, low quality, distorted hands",
    },
    monitoring: {
      calls24h: 1210,
      p95LatencySec: 2.05,
      avgLatencySec: 1.88,
      successRate: "99.90%",
      errorCount24h: 1,
      creditsEarned: 6050,
      uptimePercent: "100.0%",
      health: "HEALTHY",
      recentLatencies: [1.8, 1.9, 2.0, 1.8, 1.9, 1.9, 1.8],
    },
  },
  {
    id: "veo-2",
    name: "Google Veo 2",
    backend: "Google Vertex AI",
    status: "ACTIVE",
    category: "google-video",
    type: "Vertex AI Video API",
    cost: 80,
    latency: "18.4s",
    region: "us-central1",
    enabled: true,
    desc: "Cinematic 1080p video motion with temporal physics and camera trajectory steering.",
    version: "veo-2.0",
    requirements: {
      allowedAspectRatios: ["16:9", "9:16"],
      maxPromptLength: 2000,
      maxBatchCount: 1,
      safetyFilterLevel: "block_medium_and_above",
      personGeneration: "allow_adult",
      synthIdWatermark: true,
      minCreditBalance: 80,
      stepsMin: 25,
      stepsMax: 60,
      stepsDefault: 40,
      cfgMin: 2.0,
      cfgMax: 10.0,
      cfgDefault: 5.0,
      enforceNegativePrompt: true,
      negativePromptDefault: "jitter, morphing, static slideshow, camera glitch",
    },
    monitoring: {
      calls24h: 240,
      p95LatencySec: 21.2,
      avgLatencySec: 18.2,
      successRate: "99.60%",
      errorCount24h: 1,
      creditsEarned: 19200,
      uptimePercent: "99.6%",
      health: "HEALTHY",
      recentLatencies: [17.5, 18.2, 19.1, 18.0, 20.4, 18.2, 17.8],
    },
  }
];

const DEFAULT_KEYS: ApiKeyItem[] = [
  {
    id: "key-1",
    name: "Production Web App",
    key: "sk_live_9a8f4c21e0b7d34199c82",
    env: "live",
    created: "Oct 24, 2026",
    lastUsed: "2 mins ago",
  },
  {
    id: "key-2",
    name: "Local Testing & CI/CD",
    key: "sk_test_7f1c9902b3e4a55812d04",
    env: "test",
    created: "Oct 28, 2026",
    lastUsed: "Yesterday",
  },
];

export default function DedicatedDeveloperConsolePage() {
  const [activeSection, setActiveSection] = useState<
    "image-ai" | "local-worker" | "api-keys" | "playground" | "telemetry" | "gcp-deploy"
  >("image-ai");

  const [envMode, setEnvMode] = useState<"local" | "cloud">("cloud");
  const [modelFilter, setModelFilter] = useState<"all" | "google-image" | "local-open">("all");

  // Models State
  const [models, setModels] = useState<ModelItem[]>(DEFAULT_MODELS);
  const [configuringModel, setConfiguringModel] = useState<ModelItem | null>(null);
  const [monitoringModel, setMonitoringModel] = useState<ModelItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Local Worker Configuration
  const [workerUrl, setWorkerUrl] = useState("http://127.0.0.1:8188");
  const [workerPingStatus, setWorkerPingStatus] = useState<"idle" | "testing" | "connected" | "offline">("connected");
  const [workerLatencyMs, setWorkerLatencyMs] = useState(14);
  const [weightsDirectory, setWeightsDirectory] = useState("C:\\ai-models\\checkpoints");

  // API Keys state
  const [keys, setKeys] = useState<ApiKeyItem[]>(DEFAULT_KEYS);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyEnv, setNewKeyEnv] = useState<"live" | "test">("live");
  const [generatedModalKey, setGeneratedModalKey] = useState<string | null>(null);
  const [visibleKeyIds, setVisibleKeyIds] = useState<Record<string, boolean>>({});
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Playground code
  const [codeLang, setCodeLang] = useState<"curl" | "python" | "typescript">("curl");
  const [copiedCode, setCopiedCode] = useState(false);

  // Load state from localStorage on client
  useEffect(() => {
    try {
      const savedModels = localStorage.getItem("aistudio_dev_models");
      if (savedModels) setModels(JSON.parse(savedModels));

      const savedKeys = localStorage.getItem("aistudio_api_keys");
      if (savedKeys) setKeys(JSON.parse(savedKeys));
    } catch {}
  }, []);

  const saveModelsState = (updated: ModelItem[]) => {
    setModels(updated);
    try {
      localStorage.setItem("aistudio_dev_models", JSON.stringify(updated));
    } catch {}
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle Model Enabled / Disabled
  const handleToggleModel = (id: string) => {
    const updated = models.map((m) =>
      m.id === id ? { ...m, enabled: !m.enabled, status: (!m.enabled ? "ACTIVE" : "PAUSED") as any } : m
    );
    saveModelsState(updated);
    const m = updated.find((x) => x.id === id);
    showToast(`${m?.name} is now ${m?.enabled ? "ONLINE (Active)" : "PAUSED (Disabled)"}`);
  };

  // Update Base Credit Cost directly
  const handleUpdateCost = (id: string, newCost: number) => {
    const updated = models.map((m) => (m.id === id ? { ...m, cost: Math.max(1, newCost) } : m));
    saveModelsState(updated);
  };

  // Save Modal Configuration Updates
  const handleSaveConfig = () => {
    if (!configuringModel) return;
    const updated = models.map((m) => (m.id === configuringModel.id ? configuringModel : m));
    saveModelsState(updated);
    setConfiguringModel(null);
    showToast(`Guardrails & Requirements updated for ${configuringModel.name}`);
  };

  // Toggle Aspect Ratio in modal
  const handleToggleRatio = (ratio: string) => {
    if (!configuringModel) return;
    const current = configuringModel.requirements.allowedAspectRatios;
    const exists = current.includes(ratio);
    const updatedRatios = exists
      ? current.filter((r) => r !== ratio)
      : [...current, ratio];

    if (updatedRatios.length === 0) return; // Must have at least 1
    setConfiguringModel({
      ...configuringModel,
      requirements: {
        ...configuringModel.requirements,
        allowedAspectRatios: updatedRatios,
      },
    });
  };

  const filteredModels = models.filter((m) => {
    if (modelFilter === "all") return true;
    if (modelFilter === "google-image") return m.category === "google-image" || m.category === "google-multimodal";
    if (modelFilter === "local-open") return m.category === "local-open";
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-neutral-900 flex flex-col antialiased">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-950 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-spring border border-neutral-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          TOP CONSOLE NAVIGATION BAR
         ========================================================================= */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40 shadow-xs">
        <div className="w-full max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-neutral-950 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <Terminal className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-neutral-950 font-sans">
                aistudio
              </span>
            </Link>

            <span className="text-neutral-300">/</span>

            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-neutral-100 border border-neutral-200 text-xs font-bold text-neutral-800">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Developer & Model Control Center</span>
            </div>

            {/* Cloud Run Live Switch */}
            <div className="hidden md:flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setEnvMode("cloud")}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  envMode === "cloud" ? "bg-white text-neutral-950 shadow-xs font-bold" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Google Cloud Run (Vertex AI)
              </button>
              <button
                onClick={() => setEnvMode("local")}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  envMode === "local" ? "bg-white text-neutral-950 shadow-xs font-bold" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Local Gateway (8100)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-neutral-800">
                {models.filter((m) => m.enabled).length} / {models.length} Models Operational
              </span>
              <span className="text-neutral-400">|</span>
              <span className="text-neutral-500 font-mono text-[11px]">99.98% SLA</span>
            </div>

            <Link
              href="/studio"
              className="px-3.5 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold flex items-center gap-1.5 transition-all btn-tactile"
            >
              <span>Launch Studio</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            <div className="h-4 w-px bg-neutral-200 mx-1 hidden sm:block" />

            <div className="flex items-center gap-2 pl-1">
              <div className="w-8 h-8 rounded-full bg-neutral-950 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                AD
              </div>
              <div className="hidden sm:block text-left text-xs leading-none">
                <div className="font-bold text-neutral-900">Admin Console</div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Model Policy Engine</div>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* =========================================================================
          MAIN WORKSPACE LAYOUT
         ========================================================================= */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto flex flex-col md:flex-row overflow-hidden">
        
        {/* Dedicated Sidebar */}
        <aside className="w-full md:w-64 bg-white border-r border-neutral-200 p-4 space-y-6 shrink-0">
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
              Model Management
            </div>

            <button
              onClick={() => setActiveSection("image-ai")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSection === "image-ai"
                  ? "bg-neutral-950 text-white shadow-xs"
                  : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span>Image Models & Rules</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                activeSection === "image-ai" ? "bg-neutral-800 text-neutral-200" : "bg-blue-50 text-blue-700"
              }`}>
                {models.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSection("local-worker")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSection === "local-worker"
                  ? "bg-neutral-950 text-white shadow-xs"
                  : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Cpu className="w-4 h-4 text-emerald-500" />
                <span>Local GPU & ComfyUI</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </button>
          </div>

          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
              Developer APIs
            </div>

            <button
              onClick={() => setActiveSection("api-keys")}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSection === "api-keys"
                  ? "bg-neutral-950 text-white shadow-xs"
                  : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950"
              }`}
            >
              <Key className="w-4 h-4" />
              <span>API Secret Keys</span>
            </button>

            <button
              onClick={() => setActiveSection("playground")}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSection === "playground"
                  ? "bg-neutral-950 text-white shadow-xs"
                  : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950"
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>REST Playground</span>
            </button>

            <button
              onClick={() => setActiveSection("telemetry")}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSection === "telemetry"
                  ? "bg-neutral-950 text-white shadow-xs"
                  : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950"
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Platform Telemetry</span>
            </button>
          </div>

          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
              Cloud Operations
            </div>

            <button
              onClick={() => setActiveSection("gcp-deploy")}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSection === "gcp-deploy"
                  ? "bg-neutral-950 text-white shadow-xs"
                  : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950"
              }`}
            >
              <Cloud className="w-4 h-4" />
              <span>Google Cloud Deployment</span>
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs space-y-1.5 mt-8">
            <div className="flex items-center justify-between font-bold text-neutral-800">
              <span>Vertex AI Integration</span>
              <span className="text-blue-600 font-extrabold">Active</span>
            </div>
            <p className="text-[11px] text-neutral-500 leading-snug">
              Imagen 3.0 & Gemini 2.0 connected via Project <code className="bg-white px-1 rounded text-neutral-800">us-central1</code>.
            </p>
          </div>
        </aside>

        {/* =========================================================================
            MAIN CONTENT AREA
           ========================================================================= */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto space-y-8">
          
          {/* SECTION 1: IMAGE MODELS, REQUIREMENTS & MONITORING */}
          {activeSection === "image-ai" && (
            <div className="space-y-6 animate-spring">
              
              {/* Header with Quick Filter Pills */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-neutral-950">
                    Model Control, Requirements & Monitoring
                  </h2>
                  <p className="text-xs text-neutral-500 mt-1 max-w-2xl">
                    Configure every Google Imagen 3 variant and open-weight model individually. Set safety thresholds, allowed aspect ratios, pricing, and inspect live latency telemetry.
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-neutral-200 shadow-xs">
                  {[
                    { id: "all", label: `All Models (${models.length})` },
                    { id: "google-image", label: "Google Vertex AI (5)" },
                    { id: "local-open", label: "Local & Open Weights (3)" },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setModelFilter(filter.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        modelFilter === filter.id
                          ? "bg-neutral-950 text-white shadow-xs"
                          : "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Models Matrix Table */}
              <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-50 text-neutral-500 font-bold uppercase tracking-wider text-[10px] border-b border-neutral-200">
                      <tr>
                        <th className="py-3.5 px-5">Model Name & ID</th>
                        <th className="py-3.5 px-4">Backend & Cloud Mode</th>
                        <th className="py-3.5 px-4">Active Guardrails</th>
                        <th className="py-3.5 px-4">P95 Latency</th>
                        <th className="py-3.5 px-4">Base Cost</th>
                        <th className="py-3.5 px-4 text-center">Status / Power</th>
                        <th className="py-3.5 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {filteredModels.map((model) => (
                        <tr key={model.id} className="hover:bg-neutral-50/60 transition-colors">
                          
                          {/* Name & ID */}
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-neutral-950 text-sm">{model.name}</span>
                              {model.category.includes("google") && (
                                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                                  Google
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <code className="text-[11px] font-mono text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
                                {model.id}
                              </code>
                              <span className="text-[11px] text-neutral-400">&bull;</span>
                              <span className="text-[11px] text-neutral-500 font-mono">{model.version}</span>
                            </div>
                          </td>

                          {/* Backend */}
                          <td className="py-4 px-4">
                            <span className="font-semibold text-neutral-800">{model.backend}</span>
                            <div className="text-[11px] text-neutral-400 mt-0.5">{model.region}</div>
                          </td>

                          {/* Active Guardrails Pills */}
                          <td className="py-4 px-4">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                                {model.requirements.allowedAspectRatios.length} Ratios
                              </span>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                                {model.requirements.maxBatchCount}x Batch
                              </span>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                                {model.requirements.safetyFilterLevel.replace("block_", "")}
                              </span>
                              {model.requirements.synthIdWatermark && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  SynthID
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Latency */}
                          <td className="py-4 px-4">
                            <div className="font-mono font-bold text-neutral-800">{model.monitoring.p95LatencySec}s</div>
                            <div className="text-[10px] text-emerald-600 font-semibold">{model.monitoring.successRate} OK</div>
                          </td>

                          {/* Credit Cost */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                min={1}
                                max={200}
                                value={model.cost}
                                onChange={(e) => handleUpdateCost(model.id, Number(e.target.value))}
                                className="w-16 bg-neutral-50 border border-neutral-200 rounded-lg px-2 py-1 font-bold text-neutral-900 text-xs focus:outline-none focus:border-neutral-950 text-center"
                              />
                              <span className="text-neutral-500 font-semibold text-xs">cr</span>
                            </div>
                          </td>

                          {/* Status & Live Toggle */}
                          <td className="py-4 px-4 text-center">
                            <button
                              onClick={() => handleToggleModel(model.id)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                                model.enabled
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                                  : "bg-neutral-100 text-neutral-500 border border-neutral-200 hover:bg-neutral-200"
                              }`}
                            >
                              <span className={`w-2 h-2 rounded-full ${model.enabled ? "bg-emerald-500 animate-pulse" : "bg-neutral-400"}`} />
                              <span>{model.enabled ? "Enabled" : "Disabled"}</span>
                            </button>
                          </td>

                          {/* Action Buttons: Configure Guardrails + View Telemetry */}
                          <td className="py-4 px-5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setConfiguringModel(model)}
                                className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-neutral-700 transition-all btn-tactile cursor-pointer"
                                title="Configure Requirements & Restrictions"
                              >
                                <SlidersHorizontal className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => setMonitoringModel(model)}
                                className="p-2 rounded-xl border border-neutral-200 hover:bg-blue-50 hover:border-blue-200 text-neutral-700 hover:text-blue-600 transition-all btn-tactile cursor-pointer"
                                title="Inspect Live Telemetry & Latency"
                              >
                                <BarChart3 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* =========================================================================
              MODAL 1: CONFIGURE MODEL RESTRICTIONS & REQUIREMENTS
             ========================================================================= */}
          {configuringModel && (
            <div
              className="fixed inset-0 z-50 bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-scale"
              onClick={() => setConfiguringModel(null)}
            >
              <div
                className="bg-white rounded-3xl border border-neutral-200 shadow-2xl max-w-2xl w-full p-6 sm:p-7 space-y-6 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-start justify-between border-b border-neutral-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                      <h3 className="text-base font-bold text-neutral-950">
                        Configure {configuringModel.name}
                      </h3>
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Enforce specific input requirements, aspect ratios, safety filters and batch limits.
                    </p>
                  </div>
                  <button
                    onClick={() => setConfiguringModel(null)}
                    className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-5 text-xs">
                  
                  {/* Allowed Aspect Ratios */}
                  <div className="space-y-2">
                    <label className="font-bold text-neutral-800 uppercase text-[10px] tracking-wider block">
                      Allowed Canvas Aspect Ratios
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["1:1", "16:9", "9:16", "4:3", "3:4", "21:9"].map((ratio) => {
                        const isSelected = configuringModel.requirements.allowedAspectRatios.includes(ratio);
                        return (
                          <button
                            key={ratio}
                            type="button"
                            onClick={() => handleToggleRatio(ratio)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                              isSelected
                                ? "bg-neutral-950 text-white border-neutral-950 shadow-xs"
                                : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100"
                            }`}
                          >
                            {ratio} {isSelected && "✓"}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Safety & Person Generation Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-bold text-neutral-800 uppercase text-[10px] tracking-wider block">
                        Safety Filter Threshold
                      </label>
                      <select
                        value={configuringModel.requirements.safetyFilterLevel}
                        onChange={(e) =>
                          setConfiguringModel({
                            ...configuringModel,
                            requirements: {
                              ...configuringModel.requirements,
                              safetyFilterLevel: e.target.value as any,
                            },
                          })
                        }
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold text-neutral-900 focus:outline-none focus:border-neutral-950"
                      >
                        <option value="block_medium_and_above">Block Medium & Above (Standard Google SLA)</option>
                        <option value="block_low_and_above">Block Low & Above (Strict Enterprise)</option>
                        <option value="block_none">Block None (Developer / Creative Freedom)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-neutral-800 uppercase text-[10px] tracking-wider block">
                        Person Generation Policy
                      </label>
                      <select
                        value={configuringModel.requirements.personGeneration}
                        onChange={(e) =>
                          setConfiguringModel({
                            ...configuringModel,
                            requirements: {
                              ...configuringModel.requirements,
                              personGeneration: e.target.value as any,
                            },
                          })
                        }
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold text-neutral-900 focus:outline-none focus:border-neutral-950"
                      >
                        <option value="allow_adult">Allow Adults Only (Default)</option>
                        <option value="allow_all">Allow All People</option>
                        <option value="dont_allow">Do Not Allow Person Generation</option>
                      </select>
                    </div>
                  </div>

                  {/* Batch & Prompt Limits */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-bold text-neutral-800 uppercase text-[10px] tracking-wider block">
                        Max Parallel Batch
                      </label>
                      <select
                        value={configuringModel.requirements.maxBatchCount}
                        onChange={(e) =>
                          setConfiguringModel({
                            ...configuringModel,
                            requirements: {
                              ...configuringModel.requirements,
                              maxBatchCount: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold text-neutral-900 focus:outline-none focus:border-neutral-950"
                      >
                        <option value={1}>1x Only (Single output)</option>
                        <option value={2}>Up to 2x Parallel</option>
                        <option value={4}>Up to 4x Parallel (Pro Tier)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-neutral-800 uppercase text-[10px] tracking-wider block">
                        Max Prompt Length
                      </label>
                      <input
                        type="number"
                        min={100}
                        max={4000}
                        step={100}
                        value={configuringModel.requirements.maxPromptLength}
                        onChange={(e) =>
                          setConfiguringModel({
                            ...configuringModel,
                            requirements: {
                              ...configuringModel.requirements,
                              maxPromptLength: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none focus:border-neutral-950"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-neutral-800 uppercase text-[10px] tracking-wider block">
                        Min User Balance
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={500}
                        value={configuringModel.requirements.minCreditBalance}
                        onChange={(e) =>
                          setConfiguringModel({
                            ...configuringModel,
                            requirements: {
                              ...configuringModel.requirements,
                              minCreditBalance: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none focus:border-neutral-950"
                      />
                    </div>
                  </div>

                  {/* SynthID Watermark Toggle */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
                    <div className="space-y-0.5">
                      <div className="font-bold text-neutral-900">Google SynthID Invisible Watermarking</div>
                      <div className="text-[11px] text-neutral-500">
                        Embeds imperceptible cryptographic digital watermark identifying AI provenance.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={configuringModel.requirements.synthIdWatermark}
                      onChange={(e) =>
                        setConfiguringModel({
                          ...configuringModel,
                          requirements: {
                            ...configuringModel.requirements,
                            synthIdWatermark: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 accent-neutral-950 rounded cursor-pointer"
                    />
                  </div>

                  {/* Mandatory Negative Prompt Filter */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-neutral-800 uppercase text-[10px] tracking-wider">
                        Enforced Negative Prompt (Auto-Injected)
                      </label>
                      <span className="text-[10px] text-neutral-400">Guarantees commercial quality</span>
                    </div>
                    <input
                      type="text"
                      value={configuringModel.requirements.negativePromptDefault}
                      onChange={(e) =>
                        setConfiguringModel({
                          ...configuringModel,
                          requirements: {
                            ...configuringModel.requirements,
                            negativePromptDefault: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-950 font-medium"
                    />
                  </div>

                </div>

                {/* Footer Save Button */}
                <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-2.5">
                  <button
                    onClick={() => setConfiguringModel(null)}
                    className="px-4 py-2 rounded-xl border border-neutral-200 text-neutral-700 font-semibold text-xs hover:bg-neutral-50 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveConfig}
                    className="px-6 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                  >
                    Save Model Requirements
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              MODAL 2: LIVE MONITORING & TELEMETRY PER MODEL
             ========================================================================= */}
          {monitoringModel && (
            <div
              className="fixed inset-0 z-50 bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-scale"
              onClick={() => setMonitoringModel(null)}
            >
              <div
                className="bg-white rounded-3xl border border-neutral-200 shadow-2xl max-w-xl w-full p-6 sm:p-7 space-y-6"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-start justify-between border-b border-neutral-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                      <h3 className="text-base font-bold text-neutral-950">
                        {monitoringModel.name} Telemetry
                      </h3>
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Live endpoint health, latency distribution & 24h request metrics.
                    </p>
                  </div>
                  <button
                    onClick={() => setMonitoringModel(null)}
                    className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Gauges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
                    <div className="text-[10px] font-bold uppercase text-neutral-400">24h Invocations</div>
                    <div className="text-lg font-extrabold text-neutral-950">
                      {monitoringModel.monitoring.calls24h.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-emerald-600 font-semibold">+14.2% traffic</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
                    <div className="text-[10px] font-bold uppercase text-neutral-400">P95 Latency</div>
                    <div className="text-lg font-extrabold text-neutral-950 font-mono">
                      {monitoringModel.monitoring.p95LatencySec}s
                    </div>
                    <div className="text-[10px] text-neutral-500">avg {monitoringModel.monitoring.avgLatencySec}s</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
                    <div className="text-[10px] font-bold uppercase text-neutral-400">Success Rate</div>
                    <div className="text-lg font-extrabold text-emerald-600">
                      {monitoringModel.monitoring.successRate}
                    </div>
                    <div className="text-[10px] text-neutral-500">{monitoringModel.monitoring.errorCount24h} errors</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
                    <div className="text-[10px] font-bold uppercase text-neutral-400">Credits Settled</div>
                    <div className="text-lg font-extrabold text-neutral-950">
                      {monitoringModel.monitoring.creditsEarned.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-blue-600 font-semibold">escrow cleared</div>
                  </div>
                </div>

                {/* Real-time Latency Histogram Bars */}
                <div className="p-4 rounded-2xl bg-neutral-900 text-white space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Recent Latency Samples (Last 7 Jobs)</span>
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400">
                      Target: &lt; 3.0s
                    </span>
                  </div>

                  <div className="h-16 flex items-end justify-between gap-2 pt-2 px-1">
                    {monitoringModel.monitoring.recentLatencies.map((lat, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full bg-blue-500 hover:bg-blue-400 rounded-t-md transition-all"
                          style={{ height: `${Math.min(100, (lat / 4.0) * 100)}%` }}
                        />
                        <span className="text-[9px] font-mono text-neutral-400">{lat}s</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Endpoint Health */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Endpoint Status: HEALTHY &bull; Vertex AI us-central1 online</span>
                  </div>
                  <button
                    onClick={() => showToast(`Dry run ping to ${monitoringModel.name} passed in 38ms.`)}
                    className="px-3 py-1 rounded-xl bg-white text-emerald-800 border border-emerald-300 text-xs font-bold hover:bg-emerald-100 transition-all cursor-pointer"
                  >
                    Test Ping
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: LOCAL GPU & COMFYUI WORKER */}
          {activeSection === "local-worker" && (
            <div className="space-y-6 animate-spring">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-neutral-950">
                  Local GPU & ComfyUI Worker Bridge
                </h2>
                <p className="text-xs text-neutral-500 mt-1 max-w-2xl">
                  Connect your local machine's GPU to the AI Studio platform. When users choose FLUX.1 or SD 3.5, the job routes directly to your local hardware.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <div className="font-bold text-sm text-neutral-900">Worker Status</div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Connected (14ms ping)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Worker URL</label>
                    <input
                      type="text"
                      value={workerUrl}
                      onChange={(e) => setWorkerUrl(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 font-mono text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">Checkpoints Directory</label>
                    <input
                      type="text"
                      value={weightsDirectory}
                      onChange={(e) => setWeightsDirectory(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: API SECRET KEYS */}
          {activeSection === "api-keys" && (
            <div className="space-y-6 animate-spring">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-neutral-950">
                  Developer Secret Keys & Authentication
                </h2>
                <p className="text-xs text-neutral-500 mt-1 max-w-2xl">
                  Generate scoped tokens to authenticate your REST calls.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-neutral-950">Active Secret Keys</h3>
                <div className="divide-y divide-neutral-100">
                  {keys.map((k) => (
                    <div key={k.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                      <div>
                        <div className="font-bold text-neutral-950">{k.name}</div>
                        <code className="text-neutral-500 font-mono">{k.key}</code>
                      </div>
                      <span className="px-2 py-0.5 rounded font-bold bg-blue-50 text-blue-700 text-[10px]">
                        {k.env}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: REST PLAYGROUND */}
          {activeSection === "playground" && (
            <div className="space-y-6 animate-spring">
              <h2 className="text-2xl font-extrabold tracking-tight text-neutral-950">
                REST API Playground & Code Snippets
              </h2>
              <div className="bg-neutral-900 text-neutral-100 p-6 rounded-3xl font-mono text-xs overflow-x-auto">
                <pre>{`curl -X POST "http://localhost:8100/api/v1/jobs" \\
  -H "Authorization: Bearer sk_live_your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model_id": "imagen-3",
    "raw_prompt": "A majestic golden eagle soaring above snow-capped Alps, 8k",
    "parameters": { "aspect_ratio": "16:9", "sample_count": 1 }
  }'`}</pre>
              </div>
            </div>
          )}

          {/* SECTION 5: INFERENCE TELEMETRY */}
          {activeSection === "telemetry" && (
            <div className="space-y-6 animate-spring">
              <h2 className="text-2xl font-extrabold tracking-tight text-neutral-950">
                Inference Telemetry Dashboard
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm space-y-1">
                  <div className="text-[10px] font-bold text-neutral-400 uppercase">Total Generations</div>
                  <div className="text-2xl font-extrabold text-neutral-950">14,280</div>
                  <div className="text-[10px] text-emerald-600 font-bold">100% Escrow Integrity</div>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm space-y-1">
                  <div className="text-[10px] font-bold text-neutral-400 uppercase">Average Latency</div>
                  <div className="text-2xl font-extrabold text-neutral-950 font-mono">1.64s</div>
                  <div className="text-[10px] text-neutral-500">Global P95 SLA</div>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm space-y-1">
                  <div className="text-[10px] font-bold text-neutral-400 uppercase">Platform Success</div>
                  <div className="text-2xl font-extrabold text-emerald-600">99.98%</div>
                  <div className="text-[10px] text-neutral-500">Auto-refund on all timeouts</div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: GOOGLE CLOUD DEPLOYMENT */}
          {activeSection === "gcp-deploy" && (
            <div className="space-y-6 animate-spring">
              <h2 className="text-2xl font-extrabold tracking-tight text-neutral-950">
                Google Cloud Run Architecture
              </h2>
              <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-3 text-xs leading-relaxed text-neutral-600">
                <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
                  <strong className="text-neutral-950 block">1. Cloud Run Deployment (Free Tier / Scale to Zero)</strong>
                  <span>Your frontend and API run with 0 GPU cost on Cloud Run in <code>us-central1</code>.</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
                  <strong className="text-neutral-950 block">2. Vertex AI Native User Binding</strong>
                  <span>Cloud Run automatically calls Google Imagen 3 via IAM role <code>roles/aiplatform.user</code>.</span>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
