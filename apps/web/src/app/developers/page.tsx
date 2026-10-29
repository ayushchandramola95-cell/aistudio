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
  X
} from "lucide-react";

interface ApiKeyItem {
  id: string;
  name: string;
  key: string;
  env: "live" | "test";
  created: string;
  lastUsed: string;
}

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

  // Environment mode
  const [envMode, setEnvMode] = useState<"local" | "cloud">("local");

  // ── Image AI Engine State ────────────────────────────────────────────────
  const [imageModels, setImageModels] = useState([
    {
      id: "imagen-3",
      name: "Google Imagen 3",
      backend: "Google Vertex AI",
      status: "ACTIVE",
      type: "Cloud API",
      cost: 8,
      latency: "2.1s",
      region: "us-central1",
      quotaPerMin: 60,
      enabled: true,
      desc: "Top photorealism, typography & intricate micro-details",
      version: "imagen-3.0-generate-002",
    },
    {
      id: "flux-1-schnell",
      name: "FLUX.1 Schnell",
      backend: "Local / Serverless GPU",
      status: "ACTIVE",
      type: "Local / Open Weights",
      cost: 6,
      latency: "1.2s",
      region: "Local Worker",
      quotaPerMin: 120,
      enabled: true,
      desc: "Ultra-fast 4-step latent rectification with sharp composition",
      version: "flux1-schnell-fp8",
    },
    {
      id: "flux-1-dev",
      name: "FLUX.1 Dev",
      backend: "Local / Serverless GPU",
      status: "ACTIVE",
      type: "Local / Open Weights",
      cost: 10,
      latency: "3.6s",
      region: "Local Worker",
      quotaPerMin: 60,
      enabled: true,
      desc: "High guidance precision & professional artistic adherence",
      version: "flux1-dev-bf16",
    },
    {
      id: "sd-3-5",
      name: "Stable Diffusion 3.5",
      backend: "Local Diffusers Engine",
      status: "STANDBY",
      type: "Local / Open Weights",
      cost: 5,
      latency: "1.9s",
      region: "Local Worker",
      quotaPerMin: 80,
      enabled: true,
      desc: "Versatile styling, character design & concept exploration",
      version: "sd3.5-large-turbo",
    },
    {
      id: "gemini-2-flash",
      name: "Gemini 2.0 Flash",
      backend: "Google Vertex AI",
      status: "ACTIVE",
      type: "Cloud API",
      cost: 1,
      latency: "0.4s",
      region: "us-central1",
      quotaPerMin: 300,
      enabled: true,
      desc: "Multimodal vision understanding & intelligent prompt enhancement",
      version: "gemini-2.0-flash-exp",
    },
  ]);

  // Local Worker Configuration
  const [workerUrl, setWorkerUrl] = useState("http://127.0.0.1:8188");
  const [workerPingStatus, setWorkerPingStatus] = useState<"idle" | "testing" | "connected" | "offline">("connected");
  const [workerLatencyMs, setWorkerLatencyMs] = useState(14);
  const [weightsDirectory, setWeightsDirectory] = useState("C:\\ai-models\\checkpoints");
  const [gpuDeviceName, setGpuDeviceName] = useState("NVIDIA GeForce RTX (CUDA 12.4)");
  const [vramAllocatedGb, setVramAllocatedGb] = useState("9.4 / 16.0 GB (58%)");
  const [autoOffloadCpu, setAutoOffloadCpu] = useState(true);

  // Global Image AI Guardrails
  const [maxResolution, setMaxResolution] = useState("4K (3840×2160)");
  const [defaultCfgScale, setDefaultCfgScale] = useState(7.0);
  const [defaultInferenceSteps, setDefaultInferenceSteps] = useState(25);
  const [globalNegativeFilter, setGlobalNegativeFilter] = useState("blurry, bad anatomy, low resolution, artifacts, watermark");

  // Admin Image Test Harness (Zero-Credit Sandbox)
  const [testPrompt, setTestPrompt] = useState("A serene Japanese zen garden in autumn rain, mossy stones, cinematic bokeh, 8k");
  const [testModelId, setTestModelId] = useState("imagen-3");
  const [testRunning, setTestRunning] = useState(false);
  const [testResult, setTestResult] = useState<{
    imageUrl: string;
    latency: number;
    modelName: string;
    rawJson: any;
  } | null>(null);

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

  // Load keys from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("aistudio_api_keys");
      if (saved) setKeys(JSON.parse(saved));
    } catch {}
  }, []);

  const saveKeys = (updated: ApiKeyItem[]) => {
    setKeys(updated);
    try {
      localStorage.setItem("aistudio_api_keys", JSON.stringify(updated));
    } catch {}
  };

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const prefix = newKeyEnv === "live" ? "sk_live_" : "sk_test_";
    const randomHex = Array.from({ length: 24 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    const fullKey = `${prefix}${randomHex}`;

    const newKey: ApiKeyItem = {
      id: `key-${Date.now()}`,
      name: newKeyName.trim(),
      key: fullKey,
      env: newKeyEnv,
      created: "Just now",
      lastUsed: "Never",
    };

    saveKeys([newKey, ...keys]);
    setGeneratedModalKey(fullKey);
    setNewKeyName("");
  };

  const handleDeleteKey = (id: string) => {
    if (confirm("Revoke this secret key immediately? Connected clients will lose access.")) {
      saveKeys(keys.filter((k) => k.id !== id));
    }
  };

  const handleCopyKey = (keyString: string, id: string) => {
    navigator.clipboard.writeText(keyString);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  // Ping Local Worker
  const handleTestWorkerPing = () => {
    setWorkerPingStatus("testing");
    setTimeout(() => {
      setWorkerPingStatus("connected");
      setWorkerLatencyMs(Math.floor(Math.random() * 12) + 8);
    }, 600);
  };

  // Run Test Harness Image Generation (Admin Sandbox)
  const handleRunAdminTest = () => {
    if (!testPrompt.trim() || testRunning) return;
    setTestRunning(true);
    setTestResult(null);

    const startTime = Date.now();
    setTimeout(() => {
      const elapsed = Math.round((Date.now() - startTime) / 10) / 100;
      const modelObj = imageModels.find((m) => m.id === testModelId) || imageModels[0];
      setTestResult({
        imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop",
        latency: elapsed + 1.2,
        modelName: modelObj.name,
        rawJson: {
          job_id: `admin-test-${Date.now()}`,
          status: "COMPLETED",
          model_id: testModelId,
          inference_time_sec: elapsed + 1.2,
          resolution: "1344x768 (16:9)",
          pipeline: modelObj.type,
          escrow_bypass: true,
          admin_signature: "verified_root",
        },
      });
      setTestRunning(false);
    }, 1400);
  };

  // Update base credit cost for an image model
  const handleUpdateCost = (id: string, newCost: number) => {
    setImageModels((prev) =>
      prev.map((m) => (m.id === id ? { ...m, cost: Math.max(1, newCost) } : m))
    );
  };

  // Toggle model enable/disable
  const handleToggleModel = (id: string) => {
    setImageModels((prev) =>
      prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-neutral-900 flex flex-col antialiased">
      
      {/* =========================================================================
          DEDICATED DEVELOPER & ADMIN TOP NAVIGATION (NOT inside workspace)
         ========================================================================= */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40 shadow-xs">
        <div className="w-full max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Brand + Console Badge */}
          <div className="flex items-center gap-4">
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
              <span>Developer & Admin Console</span>
            </div>

            {/* Environment Toggle */}
            <div className="hidden md:flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setEnvMode("local")}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  envMode === "local" ? "bg-white text-neutral-950 shadow-xs font-bold" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Local Gateway (Port 8100)
              </button>
              <button
                onClick={() => setEnvMode("cloud")}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  envMode === "cloud" ? "bg-white text-neutral-950 shadow-xs font-bold" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Google Cloud Run (Live)
              </button>
            </div>
          </div>

          {/* Right: Core Status, Jump to Studio, Admin Identity */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-neutral-800">Imagen 3 & Local FLUX Online</span>
              <span className="text-neutral-400">|</span>
              <span className="text-neutral-500 font-mono text-[11px]">0.02% Err</span>
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
                <div className="font-bold text-neutral-900">Admin Account</div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Root Privileges</div>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* =========================================================================
          MAIN WORKSPACE LAYOUT (Dedicated Console Sidebar + Control Area)
         ========================================================================= */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto flex flex-col md:flex-row overflow-hidden">
        
        {/* Dedicated Console Sidebar */}
        <aside className="w-full md:w-64 bg-white border-r border-neutral-200 p-4 space-y-6 shrink-0">
          
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
              AI Engines & Pipelines
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
                <Sparkles className="w-4 h-4" />
                <span>Image AI Engine</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                activeSection === "image-ai" ? "bg-neutral-800 text-neutral-200" : "bg-blue-50 text-blue-700"
              }`}>
                5 Models
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
                <Cpu className="w-4 h-4" />
                <span>Local GPU & ComfyUI</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </button>
          </div>

          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
              Developer Platform
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
              <span>Inference Telemetry</span>
            </button>
          </div>

          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
              Deployment & Cloud
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

          {/* Quick System Telemetry pill */}
          <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs space-y-1.5 mt-8">
            <div className="flex items-center justify-between font-bold text-neutral-800">
              <span>Two-Phase Escrow</span>
              <span className="text-emerald-600 font-extrabold">Active</span>
            </div>
            <p className="text-[11px] text-neutral-500">
              Credits held in atomic lock; released on successful 200 render.
            </p>
          </div>

        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto space-y-8">
          
          {/* =========================================================================
              SECTION 1: IMAGE AI ENGINE CONTROLS (User's Primary Focus)
             ========================================================================= */}
          {activeSection === "image-ai" && (
            <div className="space-y-8 animate-spring">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-neutral-950 flex items-center gap-2.5">
                    <span>Image AI Engine & Model Management</span>
                  </h2>
                  <p className="text-xs text-neutral-500 mt-1 max-w-2xl">
                    Configure official generation models, manage credit multipliers, adjust guidance thresholds, and run diagnostic test renders directly.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
                    Primary: Google Imagen 3
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                    Fast: FLUX.1 Schnell
                  </span>
                </div>
              </div>

              {/* Models Matrix Table with Live Price Tuning */}
              <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-neutral-100 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-950">Active Image Generation Roster</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Adjust base credit costs and toggle model availability in real time.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">
                    {imageModels.filter((m) => m.enabled).length} of {imageModels.length} Models Active
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-50 text-neutral-500 font-bold uppercase tracking-wider text-[10px] border-b border-neutral-200">
                      <tr>
                        <th className="py-3 px-5">Model Name & ID</th>
                        <th className="py-3 px-4">Backend Infrastructure</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">P95 Latency</th>
                        <th className="py-3 px-4">Base Credit Cost</th>
                        <th className="py-3 px-5 text-right">Enable / Disable</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {imageModels.map((model) => (
                        <tr key={model.id} className="hover:bg-neutral-50/50 transition-colors">
                          <td className="py-4 px-5">
                            <div className="font-bold text-neutral-950 text-sm">{model.name}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <code className="text-[11px] font-mono text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
                                {model.id}
                              </code>
                              <span className="text-[11px] text-neutral-400">&bull;</span>
                              <span className="text-[11px] text-neutral-500">{model.version}</span>
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <span className="font-semibold text-neutral-800">{model.backend}</span>
                            <div className="text-[11px] text-neutral-400 mt-0.5">{model.type}</div>
                          </td>

                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              model.status === "ACTIVE"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${model.status === "ACTIVE" ? "bg-emerald-500" : "bg-amber-500"}`} />
                              <span>{model.status}</span>
                            </span>
                          </td>

                          <td className="py-4 px-4 font-mono font-bold text-neutral-700">
                            {model.latency}
                          </td>

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
                              <span className="text-neutral-500 font-semibold">credits</span>
                            </div>
                          </td>

                          <td className="py-4 px-5 text-right">
                            <button
                              onClick={() => handleToggleModel(model.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                model.enabled
                                  ? "bg-neutral-950 text-white shadow-xs hover:bg-neutral-800"
                                  : "bg-neutral-100 text-neutral-500 hover:text-neutral-900"
                              }`}
                            >
                              {model.enabled ? "Online" : "Paused"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Two-Column Grid: Global Guardrails + Zero-Credit Test Harness */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. Global Generation Guardrails & Rules */}
                <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-5">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-blue-600" />
                      <h3 className="text-sm font-bold text-neutral-950">Generation Guardrails & Limits</h3>
                    </div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase">Engine Policy</span>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="font-bold text-neutral-700 flex justify-between">
                        <span>Max Allowed Canvas Resolution</span>
                        <span className="text-blue-600 font-mono">{maxResolution}</span>
                      </label>
                      <select
                        value={maxResolution}
                        onChange={(e) => setMaxResolution(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900 font-semibold focus:outline-none focus:border-neutral-950 cursor-pointer"
                      >
                        <option value="4K (3840×2160)">4K Master (3840 × 2160) - Highest Fidelity</option>
                        <option value="2K (2048×1152)">2K High Definition (2048 × 1152)</option>
                        <option value="1080p (1920×1080)">1080p Standard HD (1920 × 1080)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-bold text-neutral-700 flex justify-between">
                          <span>Default CFG Scale</span>
                          <span className="font-mono text-neutral-950">{defaultCfgScale.toFixed(1)}</span>
                        </label>
                        <input
                          type="range"
                          min={1}
                          max={15}
                          step={0.5}
                          value={defaultCfgScale}
                          onChange={(e) => setDefaultCfgScale(Number(e.target.value))}
                          className="w-full accent-neutral-950 pt-1"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-neutral-700 flex justify-between">
                          <span>Default Steps</span>
                          <span className="font-mono text-neutral-950">{defaultInferenceSteps}</span>
                        </label>
                        <input
                          type="range"
                          min={10}
                          max={50}
                          value={defaultInferenceSteps}
                          onChange={(e) => setDefaultInferenceSteps(Number(e.target.value))}
                          className="w-full accent-neutral-950 pt-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-neutral-700">Global Negative Prompt Filter</label>
                      <input
                        type="text"
                        value={globalNegativeFilter}
                        onChange={(e) => setGlobalNegativeFilter(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-950 font-medium"
                      />
                      <p className="text-[11px] text-neutral-400">
                        Automatically appended to all client image prompts to maintain commercial quality.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Zero-Credit Admin Test Sandbox */}
                <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Play className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-sm font-bold text-neutral-950">Diagnostic Test Harness</h3>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      Zero Credit Deductions
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center gap-2">
                      <select
                        value={testModelId}
                        onChange={(e) => setTestModelId(e.target.value)}
                        className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none cursor-pointer"
                      >
                        {imageModels.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.type})
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={handleRunAdminTest}
                        disabled={testRunning}
                        className="flex-1 py-2 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                      >
                        {testRunning ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Synthesizing Test...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" />
                            <span>Run Test Inference</span>
                          </>
                        )}
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      value={testPrompt}
                      onChange={(e) => setTestPrompt(e.target.value)}
                      placeholder="Enter test prompt..."
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs text-neutral-900 focus:outline-none focus:border-neutral-950 font-medium"
                    />

                    {/* Result Card */}
                    {testResult && (
                      <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2.5 animate-spring">
                        <div className="flex items-center justify-between text-[11px] text-neutral-600 font-semibold">
                          <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>HTTP 200 &bull; Render Successful</span>
                          </span>
                          <span className="font-mono">{testResult.latency}s total</span>
                        </div>

                        <div className="flex gap-3">
                          <img
                            src={testResult.imageUrl}
                            alt="Test"
                            className="w-20 h-20 rounded-xl object-cover border border-neutral-200"
                          />
                          <div className="flex-1 min-w-0 font-mono text-[10px] bg-neutral-900 text-neutral-200 p-2.5 rounded-xl overflow-x-auto leading-relaxed">
                            <pre>{JSON.stringify(testResult.rawJson, null, 2)}</pre>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* =========================================================================
              SECTION 2: LOCAL MODEL WORKER & COMFYUI BRIDGE
             ========================================================================= */}
          {activeSection === "local-worker" && (
            <div className="space-y-6 animate-spring">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-neutral-950">
                  Local GPU & ComfyUI Worker Bridge
                </h2>
                <p className="text-xs text-neutral-500 mt-1 max-w-2xl">
                  Connect your local machine's GPU (or private server) to the AI Studio backend. When users choose FLUX.1 or SD 3.5, the job routes directly to this worker.
                </p>
              </div>

              {/* Worker Status & Ping Tool */}
              <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-950">Worker Endpoint Connection</h3>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      FastAPI worker or ComfyUI WebSocket endpoint URL.
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      workerPingStatus === "connected"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${workerPingStatus === "connected" ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
                      <span>{workerPingStatus === "connected" ? `Connected (${workerLatencyMs}ms ping)` : "Offline"}</span>
                    </span>

                    <button
                      onClick={handleTestWorkerPing}
                      disabled={workerPingStatus === "testing"}
                      className="px-3 py-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-bold text-neutral-700 flex items-center gap-1.5 transition-all btn-tactile cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${workerPingStatus === "testing" ? "animate-spin" : ""}`} />
                      <span>Ping Worker</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-700">Worker URL / Tunnel Host</label>
                    <input
                      type="text"
                      value={workerUrl}
                      onChange={(e) => setWorkerUrl(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 font-mono text-neutral-900 focus:outline-none focus:border-neutral-950"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-700">Model Weights (.safetensors) Directory</label>
                    <input
                      type="text"
                      value={weightsDirectory}
                      onChange={(e) => setWeightsDirectory(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 font-mono text-neutral-900 focus:outline-none focus:border-neutral-950"
                    />
                  </div>
                </div>

                {/* GPU Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Compute Device</div>
                    <div className="text-xs font-bold text-neutral-900">{gpuDeviceName}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">CUDA Acceleration Ready</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">VRAM Allocation</div>
                    <div className="text-xs font-bold text-neutral-900">{vramAllocatedGb}</div>
                    <div className="text-[10px] text-neutral-500">FLUX.1 Schnell fp8 in memory</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Memory Management</div>
                    <div className="text-xs font-bold text-neutral-900">Auto-Offload to CPU</div>
                    <div className="text-[10px] text-neutral-500">Unloads VRAM after 5 mins idle</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              SECTION 3: API SECRET KEYS MANAGEMENT
             ========================================================================= */}
          {activeSection === "api-keys" && (
            <div className="space-y-6 animate-spring">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-neutral-950">
                  Developer Secret Keys & Authentication
                </h2>
                <p className="text-xs text-neutral-500 mt-1 max-w-2xl">
                  Generate scoped tokens to authenticate your REST calls. All requests debit credits directly from the master account using Two-Phase Escrow.
                </p>
              </div>

              {/* Create Key Card */}
              <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-neutral-950">Create New Key</h3>
                <form onSubmit={handleCreateKey} className="flex flex-wrap items-center gap-3">
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="Key description (e.g. Production iOS App, ComfyUI Remote Worker)"
                    className="flex-1 min-w-[260px] bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-neutral-950 font-medium"
                  />

                  <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setNewKeyEnv("live")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                        newKeyEnv === "live" ? "bg-white text-neutral-950 shadow-xs" : "text-neutral-500 hover:text-neutral-900"
                      }`}
                    >
                      Live Production
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewKeyEnv("test")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                        newKeyEnv === "test" ? "bg-white text-neutral-950 shadow-xs" : "text-neutral-500 hover:text-neutral-900"
                      }`}
                    >
                      Test Sandbox
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={!newKeyName.trim()}
                    className="px-5 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 transition-all btn-tactile cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Key</span>
                  </button>
                </form>
              </div>

              {/* Modal Banner if key newly generated */}
              {generatedModalKey && (
                <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2 animate-spring">
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span>Secret Key Generated</span>
                    <button onClick={() => setGeneratedModalKey(null)} className="underline cursor-pointer">
                      Dismiss
                    </button>
                  </div>
                  <p className="text-xs text-amber-800">
                    Store this key in your <code className="font-mono bg-white px-1 py-0.5 rounded">.env</code> file. It cannot be shown again:
                  </p>
                  <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-amber-200">
                    <code className="flex-1 font-mono text-xs text-neutral-900 break-all select-all font-bold">
                      {generatedModalKey}
                    </code>
                    <button
                      onClick={() => handleCopyKey(generatedModalKey, "modal")}
                      className="px-3 py-1.5 rounded-lg bg-neutral-950 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKeyId === "modal" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Key List */}
              <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden divide-y divide-neutral-100">
                {keys.map((k) => (
                  <div key={k.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-neutral-950">{k.name}</span>
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          {k.env}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded">
                          {visibleKeyIds[k.id] ? k.key : `${k.key.slice(0, 10)}••••••••••••${k.key.slice(-4)}`}
                        </code>
                        <button
                          onClick={() => setVisibleKeyIds((p) => ({ ...p, [k.id]: !p[k.id] }))}
                          className="p-1 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                        >
                          {visibleKeyIds[k.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyKey(k.key, k.id)}
                        className="px-3 py-1.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-50 flex items-center gap-1.5 transition-all btn-tactile cursor-pointer"
                      >
                        {copiedKeyId === k.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy</span>
                      </button>
                      <button
                        onClick={() => handleDeleteKey(k.id)}
                        className="p-2 rounded-xl border border-neutral-200 hover:bg-rose-50 hover:border-rose-200 text-neutral-400 hover:text-rose-600 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              SECTION 4: REST PLAYGROUND
             ========================================================================= */}
          {activeSection === "playground" && (
            <div className="space-y-6 animate-spring">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-neutral-950">
                  REST API Playground & Code Snippets
                </h2>
                <p className="text-xs text-neutral-500 mt-1 max-w-2xl">
                  Ready-to-use snippets to call our generation endpoints from Python, TypeScript, or bash.
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-500">Method:</span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-mono text-xs font-bold">
                      POST
                    </span>
                    <code className="text-xs font-mono text-neutral-800">/api/v1/jobs</code>
                  </div>

                  <div className="flex items-center gap-2">
                    {(["curl", "python", "typescript"] as const).map((l) => (
                      <button
                        key={l}
                        onClick={() => setCodeLang(l)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                          codeLang === l ? "bg-neutral-950 text-white" : "text-neutral-500 hover:text-neutral-900"
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-neutral-900 text-neutral-100 font-mono text-xs leading-relaxed overflow-x-auto">
                  <pre>
                    {codeLang === "curl" && `curl -X POST "http://localhost:8100/api/v1/jobs" \\
  -H "Authorization: Bearer sk_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model_id": "imagen-3",
    "task_type": "image_generation",
    "raw_prompt": "A majestic golden eagle soaring above snow-capped Alps, cinematic golden hour",
    "parameters": {
      "aspect_ratio": "16:9",
      "quality": "high",
      "sample_count": 1,
      "guidance_scale": 7.0,
      "steps": 25
    }
  }'`}
                    {codeLang === "python" && `import requests

res = requests.post(
    "http://localhost:8100/api/v1/jobs",
    headers={"Authorization": "Bearer sk_live_your_key_here"},
    json={
        "model_id": "imagen-3",
        "task_type": "image_generation",
        "raw_prompt": "A majestic golden eagle soaring above Alps, 8k",
        "parameters": {"aspect_ratio": "16:9", "steps": 25}
    }
)
job = res.json()
print("Job Queued ID:", job["id"])`}
                    {codeLang === "typescript" && `import axios from "axios";

const { data: job } = await axios.post(
  "http://localhost:8100/api/v1/jobs",
  {
    model_id: "imagen-3",
    task_type: "image_generation",
    raw_prompt: "A majestic golden eagle soaring above Alps, 8k",
    parameters: { aspect_ratio: "16:9", steps: 25 },
  },
  { headers: { Authorization: "Bearer sk_live_your_key_here" } }
);

console.log("Job status:", job.status);`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              SECTION 5: INFERENCE TELEMETRY
             ========================================================================= */}
          {activeSection === "telemetry" && (
            <div className="space-y-6 animate-spring">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-neutral-950">
                  Live Inference Telemetry & Request Stream
                </h2>
                <p className="text-xs text-neutral-500 mt-1 max-w-2xl">
                  Real-time monitoring of queue depth, worker latency, and atomic escrow settlements.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Total Generations</div>
                  <div className="text-2xl font-extrabold text-neutral-950">1,248</div>
                  <div className="text-[10px] text-emerald-600 font-bold">+18.4% today</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">P95 Image Latency</div>
                  <div className="text-2xl font-extrabold text-neutral-950">1.82s</div>
                  <div className="text-[10px] text-neutral-500">FLUX: 1.1s &bull; Imagen 3: 2.2s</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Success Rate</div>
                  <div className="text-2xl font-extrabold text-neutral-950">99.98%</div>
                  <div className="text-[10px] text-emerald-600 font-bold">Zero failed escrows</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Active Queue Depth</div>
                  <div className="text-2xl font-extrabold text-neutral-950">0 jobs</div>
                  <div className="text-[10px] text-emerald-600 font-bold">Workers warm & waiting</div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              SECTION 6: GOOGLE CLOUD DEPLOYMENT BLUEPRINT
             ========================================================================= */}
          {activeSection === "gcp-deploy" && (
            <div className="space-y-6 animate-spring">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-neutral-950">
                  Google Cloud Deployment Blueprint
                </h2>
                <p className="text-xs text-neutral-500 mt-1 max-w-2xl">
                  Cost-optimized production roadmap for deploying your frontend, FastAPI gateway, and Vertex AI Imagen 3 integration to Google Cloud.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-neutral-950">
                  <Cloud className="w-5 h-5 text-blue-600" />
                  <span>Cloud Run + Vertex AI Architecture</span>
                </div>

                <div className="space-y-3 text-xs text-neutral-600 leading-relaxed">
                  <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
                    <strong className="text-neutral-950 block">1. Deploy FastAPI & Next.js to Cloud Run</strong>
                    <span>
                      Both containers deploy to Cloud Run with scale-to-zero enabled. During idle hours, cost is $0.00. First 2 million requests per month are free.
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
                    <strong className="text-neutral-950 block">2. Vertex AI (Imagen 3 & Veo 2) Native Binding</strong>
                    <span>
                      No GPU servers required for Google models. The Cloud Run backend authenticates using standard Google Cloud Application Default Credentials (ADC) or service account keys.
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
                    <strong className="text-neutral-950 block">3. Local PC / Remote GPU Hybrid Worker</strong>
                    <span>
                      For local models (FLUX.1, SD 3.5), your local worker polls the cloud queue via WebSocket or Cloudflare Tunnel, eliminating the need to rent a $1,000/mo cloud A100.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
