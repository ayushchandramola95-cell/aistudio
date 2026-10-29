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
    name: "Staging & CI/CD",
    key: "sk_test_7f1c9902b3e4a55812d04",
    env: "test",
    created: "Oct 28, 2026",
    lastUsed: "Yesterday",
  },
];

const CODE_EXAMPLES = {
  generate: {
    curl: `curl -X POST "http://localhost:8100/api/v1/jobs" \\
  -H "Authorization: Bearer sk_live_your_api_key_here" \\
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
  }'`,
    python: `import requests

API_URL = "http://localhost:8100/api/v1/jobs"
API_KEY = "sk_live_your_api_key_here"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

payload = {
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
}

response = requests.post(API_URL, json=payload, headers=headers)
job = response.json()
print(f"Job Queued: {job['id']}, Status: {job['status']}")
`,
    typescript: `import axios from "axios";

const API_KEY = "sk_live_your_api_key_here";

async function generateImage() {
  const { data: job } = await axios.post(
    "http://localhost:8100/api/v1/jobs",
    {
      model_id: "imagen-3",
      task_type: "image_generation",
      raw_prompt: "A majestic golden eagle soaring above snow-capped Alps, cinematic golden hour",
      parameters: {
        aspect_ratio: "16:9",
        quality: "high",
        sample_count: 1,
        guidance_scale: 7.0,
        steps: 25,
      },
    },
    {
      headers: {
        Authorization: \`Bearer \${API_KEY}\`,
        "Content-Type": "application/json",
      },
    }
  );

  console.log(\`Job Queued: \${job.id}, Status: \${job.status}\`);
  return job;
}

generateImage();
`,
  },
  poll: {
    curl: `curl -X GET "http://localhost:8100/api/v1/jobs/YOUR_JOB_ID" \\
  -H "Authorization: Bearer sk_live_your_api_key_here"`,
    python: `import requests, time

job_id = "YOUR_JOB_ID"
API_URL = f"http://localhost:8100/api/v1/jobs/{job_id}"
API_KEY = "sk_live_your_api_key_here"

while True:
    res = requests.get(API_URL, headers={"Authorization": f"Bearer {API_KEY}"}).json()
    status = res.get("status")
    print(f"Status: {status} ({res.get('progress')}%)")
    
    if status == "COMPLETED":
        print(f"Render URL: {res['outputs'][0]['file_url']}")
        break
    elif status == "FAILED":
        print("Generation failed; credits refunded.")
        break
        
    time.sleep(1.5)
`,
    typescript: `async function pollJob(jobId: string) {
  const url = \`http://localhost:8100/api/v1/jobs/\${jobId}\`;
  
  while (true) {
    const res = await fetch(url, {
      headers: { Authorization: "Bearer sk_live_your_api_key_here" },
    });
    const job = await res.json();
    
    if (job.status === "COMPLETED") {
      console.log("Success! Image URL:", job.outputs[0]?.file_url);
      return job.outputs[0]?.file_url;
    }
    if (job.status === "FAILED") {
      throw new Error("Job failed");
    }
    
    await new Promise((r) => setTimeout(r, 1500));
  }
}
`,
  },
  models: {
    curl: `curl -X GET "http://localhost:8100/api/v1/models" \\
  -H "Authorization: Bearer sk_live_your_api_key_here"`,
    python: `import requests

res = requests.get(
    "http://localhost:8100/api/v1/models",
    headers={"Authorization": "Bearer sk_live_your_api_key_here"}
)

models = res.json()["models"]
for m in models:
    print(f"{m['name']} ({m['id']}) - {m['base_credit_cost']} credits")
`,
    typescript: `const res = await fetch("http://localhost:8100/api/v1/models", {
  headers: { Authorization: "Bearer sk_live_your_api_key_here" },
});
const { models } = await res.json();
console.table(models);
`,
  },
};

const SUPPORTED_MODELS_DOC = [
  {
    id: "imagen-3",
    name: "Google Imagen 3",
    category: "Image Synthesis",
    cost: "8 cr / img",
    latency: "~2.2s",
    params: "aspect_ratio, quality, steps, guidance_scale, reference_image",
  },
  {
    id: "flux-1-schnell",
    name: "FLUX.1 Schnell",
    category: "Fast Image",
    cost: "6 cr / img",
    latency: "~1.1s",
    params: "aspect_ratio, steps (4-12), seed",
  },
  {
    id: "flux-1-dev",
    name: "FLUX.1 Dev",
    category: "Pro Image Studio",
    cost: "10 cr / img",
    latency: "~3.8s",
    params: "aspect_ratio, guidance_scale, steps (20-50), seed",
  },
  {
    id: "sd-3-5",
    name: "Stable Diffusion 3.5",
    category: "Creative Illustration",
    cost: "5 cr / img",
    latency: "~1.8s",
    params: "aspect_ratio, negative_prompt, steps, guidance_scale",
  },
  {
    id: "veo-2",
    name: "Google Veo 2",
    category: "Cinematic Video",
    cost: "80 cr / clip",
    latency: "~18s",
    params: "resolution, duration_sec, camera_motion, fps",
  },
  {
    id: "kokoro-tts",
    name: "Kokoro TTS",
    category: "Voice Synthesis",
    cost: "2 cr / 1k chars",
    latency: "~0.4s",
    params: "voice_id, speed, pitch, language",
  },
];

export default function DevelopersPage() {
  const [activeTab, setActiveTab] = useState<"quickstart" | "keys" | "reference" | "models">("quickstart");
  const [codeLang, setCodeLang] = useState<"curl" | "python" | "typescript">("curl");
  const [codeEndpoint, setCodeEndpoint] = useState<"generate" | "poll" | "models">("generate");
  const [copiedCode, setCopiedCode] = useState(false);

  // API Key Management state
  const [keys, setKeys] = useState<ApiKeyItem[]>(DEFAULT_KEYS);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyEnv, setNewKeyEnv] = useState<"live" | "test">("live");
  const [generatedModalKey, setGeneratedModalKey] = useState<string | null>(null);
  const [visibleKeyIds, setVisibleKeyIds] = useState<Record<string, boolean>>({});
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Load keys from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("aistudio_api_keys");
      if (saved) {
        setKeys(JSON.parse(saved));
      }
    } catch {
      // fallback to defaults
    }
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
    if (confirm("Are you sure you want to revoke this API key? This action is immediate and cannot be undone.")) {
      saveKeys(keys.filter((k) => k.id !== id));
    }
  };

  const handleCopyCode = () => {
    const code = CODE_EXAMPLES[codeEndpoint][codeLang];
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyKey = (keyString: string, id: string) => {
    navigator.clipboard.writeText(keyString);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeyIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-6xl mx-auto w-full space-y-8 pb-20">
      
      {/* ── Page Header & System Telemetry ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/90 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs font-semibold border border-neutral-200">
            <Terminal className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Studio Developer Platform</span>
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
            <span className="text-neutral-500 font-mono text-[11px]">v1.0.4 REST</span>
          </div>
          <h1 className="text-3xl font-extrabold text-neutral-950 tracking-tight font-sans">
            Developer APIs & Integration
          </h1>
          <p className="text-sm text-neutral-500 max-w-xl">
            Integrate Google Imagen 3, FLUX.1, Veo 2, and Kokoro directly into your applications with programmatic access and atomic escrow billing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-2xl bg-white border border-neutral-200 shadow-sm flex items-center gap-2.5 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-neutral-900 font-bold">API Online</span>
            <span className="text-neutral-400 font-normal">|</span>
            <span className="text-neutral-500 font-mono text-[11px]">8100/v1</span>
          </div>

          <Link
            href="/admin"
            className="px-4 py-2 rounded-2xl bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all btn-tactile shadow-sm"
          >
            <Server className="w-3.5 h-3.5" />
            <span>GPU Telemetry</span>
          </Link>
        </div>
      </div>

      {/* ── Subnav Tabs ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-px overflow-x-auto">
        {[
          { id: "quickstart", label: "Quickstart & Playground", icon: Code2 },
          { id: "keys", label: `API Secret Keys (${keys.length})`, icon: Key },
          { id: "models", label: "Supported Models & Costs", icon: Layers },
          { id: "reference", label: "Architecture & Escrow SLA", icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-neutral-950 text-white shadow-sm"
                  : "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          TAB 1: QUICKSTART & INTERACTIVE CODE PLAYGROUND
         ========================================================================= */}
      {activeTab === "quickstart" && (
        <div className="space-y-8 animate-spring">
          
          {/* 3-Step Onboarding Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 font-black text-xs flex items-center justify-center border border-blue-100">
                1
              </div>
              <h3 className="text-sm font-bold text-neutral-950">Generate API Key</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Create a scoped <code className="text-neutral-800 bg-neutral-100 px-1 py-0.5 rounded text-[11px]">sk_live_...</code> secret key in the Keys tab below.
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 font-black text-xs flex items-center justify-center border border-purple-100">
                2
              </div>
              <h3 className="text-sm font-bold text-neutral-950">Submit Generation Job</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Send a <code className="text-neutral-800 bg-neutral-100 px-1 py-0.5 rounded text-[11px]">POST /jobs</code> request with your prompt, chosen model ID, and canvas ratio.
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 font-black text-xs flex items-center justify-center border border-emerald-100">
                3
              </div>
              <h3 className="text-sm font-bold text-neutral-950">Receive 4K Render</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Poll status or receive webhook events. Credits settle only when the asset is rendered cleanly.
              </p>
            </div>
          </div>

          {/* Interactive Code Playground */}
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-luxury overflow-hidden">
            
            {/* Header controls for language & endpoint */}
            <div className="p-4 sm:p-5 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-3 bg-neutral-50/50">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Endpoint:</span>
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-neutral-200 shadow-sm">
                  {[
                    { id: "generate", label: "POST /jobs (Generate)", method: "POST" },
                    { id: "poll", label: "GET /jobs/:id (Poll)", method: "GET" },
                    { id: "models", label: "GET /models (Catalog)", method: "GET" },
                  ].map((ep) => (
                    <button
                      key={ep.id}
                      onClick={() => setCodeEndpoint(ep.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        codeEndpoint === ep.id
                          ? "bg-neutral-950 text-white shadow-xs"
                          : "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100"
                      }`}
                    >
                      {ep.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language switcher */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
                  {(["curl", "python", "typescript"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setCodeLang(lang)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all uppercase tracking-wide cursor-pointer ${
                        codeLang === lang
                          ? "bg-white text-neutral-950 shadow-xs"
                          : "text-neutral-500 hover:text-neutral-900"
                      }`}
                    >
                      {lang === "typescript" ? "TypeScript" : lang}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-all btn-tactile cursor-pointer shadow-xs"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Code Block Container (High contrast readable syntax) */}
            <div className="p-5 sm:p-6 bg-neutral-900 text-neutral-100 font-mono text-xs sm:text-[13px] leading-relaxed overflow-x-auto">
              <pre className="selection:bg-neutral-800">
                <code>{CODE_EXAMPLES[codeEndpoint][codeLang]}</code>
              </pre>
            </div>

            {/* Response Preview footer */}
            <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <span className="font-bold text-neutral-900">Base URL:</span>
                <code className="bg-white border border-neutral-200 px-2 py-0.5 rounded text-[11px] font-mono text-blue-600">
                  http://localhost:8100/api/v1
                </code>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Response Format: <strong>JSON (application/json)</strong></span>
                <span>&bull;</span>
                <span>Idempotency: <strong>Supported</strong></span>
              </div>
            </div>

          </div>

          {/* Error Codes Reference */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-neutral-950 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-neutral-500" />
              <span>Standard API HTTP Status Codes</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
                <div className="text-xs font-bold text-emerald-700">202 Accepted</div>
                <div className="text-[11px] text-neutral-500">Job received & queued. Credits held in atomic escrow.</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
                <div className="text-xs font-bold text-blue-700">200 OK</div>
                <div className="text-[11px] text-neutral-500">Query successful, job finished or model catalog returned.</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
                <div className="text-xs font-bold text-amber-700">402 Payment Required</div>
                <div className="text-[11px] text-neutral-500">Insufficient balance to reserve required credit cost.</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
                <div className="text-xs font-bold text-rose-700">429 Rate Limit</div>
                <div className="text-[11px] text-neutral-500">Tier quota exceeded (Default: 60 requests/minute).</div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 2: API KEY GENERATOR & VAULT
         ========================================================================= */}
      {activeTab === "keys" && (
        <div className="space-y-6 animate-spring">
          
          {/* Create Key Form */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-luxury space-y-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-950">Create New Secret Key</h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Generate an authorization token to authenticate your REST calls or SDK instances.
              </p>
            </div>

            <form onSubmit={handleCreateKey} className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="Key label (e.g. Production iOS Client, Backend Worker)"
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
                  Live Mode
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
                className="px-5 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center gap-1.5 transition-all btn-tactile cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Key</span>
              </button>
            </form>
          </div>

          {/* New Key Generated Modal Banner */}
          {generatedModalKey && (
            <div className="p-5 rounded-3xl bg-amber-50/90 border border-amber-200/90 text-amber-900 space-y-3 animate-spring">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span className="text-xs font-bold">Secret Key Created — Save It Safely</span>
                </div>
                <button
                  onClick={() => setGeneratedModalKey(null)}
                  className="text-xs text-amber-700 hover:underline cursor-pointer font-bold"
                >
                  Dismiss
                </button>
              </div>
              <p className="text-xs text-amber-800/90">
                This key will not be shown again in full. Copy it now and store it in your environment variables:
              </p>
              <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-amber-200">
                <code className="flex-1 font-mono text-xs text-neutral-900 break-all select-all font-bold">
                  {generatedModalKey}
                </code>
                <button
                  onClick={() => handleCopyKey(generatedModalKey, "modal")}
                  className="px-3 py-1.5 rounded-lg bg-neutral-950 text-white text-xs font-bold flex items-center gap-1 btn-tactile cursor-pointer"
                >
                  {copiedKeyId === "modal" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKeyId === "modal" ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>
          )}

          {/* Active Keys Table */}
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Active Secret Keys
                </h4>
                <div className="text-xs text-neutral-400 mt-0.5">
                  Never commit your keys to client-side bundles or public GitHub repositories.
                </div>
              </div>
              <span className="text-xs font-bold text-neutral-700 bg-neutral-100 px-2.5 py-1 rounded-full">
                {keys.length} of 10 Used
              </span>
            </div>

            <div className="divide-y divide-neutral-100">
              {keys.map((k) => {
                const isVisible = visibleKeyIds[k.id];
                const displayKey = isVisible
                  ? k.key
                  : `${k.key.slice(0, 10)}••••••••••••••••${k.key.slice(-4)}`;

                return (
                  <div key={k.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/60 transition-colors">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-neutral-950">{k.name}</span>
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                            k.env === "live"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-neutral-100 text-neutral-600 border-neutral-200"
                          }`}
                        >
                          {k.env}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded select-all">
                          {displayKey}
                        </code>
                        <button
                          onClick={() => toggleKeyVisibility(k.id)}
                          className="p-1 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                          title={isVisible ? "Hide secret" : "Reveal secret"}
                        >
                          {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                        <span>Created: {k.created}</span>
                        <span>&bull;</span>
                        <span>Last used: {k.lastUsed}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleCopyKey(k.key, k.id)}
                        className="px-3 py-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-xs font-semibold text-neutral-700 flex items-center gap-1.5 transition-all btn-tactile cursor-pointer"
                      >
                        {copiedKeyId === k.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKeyId === k.id ? "Copied" : "Copy Key"}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteKey(k.id)}
                        className="p-2 rounded-xl border border-neutral-200 hover:bg-rose-50 hover:border-rose-200 text-neutral-400 hover:text-rose-600 transition-all cursor-pointer"
                        title="Revoke key"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 3: MODELS & PRICING SPECIFICATION
         ========================================================================= */}
      {activeTab === "models" && (
        <div className="space-y-6 animate-spring">
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-luxury overflow-hidden">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-neutral-950">Inference Endpoints & Credit Multipliers</h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Exact string identifiers to pass in the <code className="bg-neutral-100 px-1 py-0.5 rounded text-[11px]">model_id</code> request field.
                </p>
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                Two-Phase Escrow Guaranteed
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50/80 text-neutral-500 font-bold uppercase tracking-wider text-[10px] border-b border-neutral-200">
                  <tr>
                    <th className="py-3 px-5">Model Name</th>
                    <th className="py-3 px-4 font-mono">model_id</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Base Cost</th>
                    <th className="py-3 px-4">P95 Latency</th>
                    <th className="py-3 px-5">Key Parameters</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {SUPPORTED_MODELS_DOC.map((m) => (
                    <tr key={m.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3.5 px-5 font-bold text-neutral-950">{m.name}</td>
                      <td className="py-3.5 px-4 font-mono text-blue-600 bg-blue-50/40 rounded px-1.5 font-bold">
                        {m.id}
                      </td>
                      <td className="py-3.5 px-4 text-neutral-600">{m.category}</td>
                      <td className="py-3.5 px-4 font-bold text-neutral-900">{m.cost}</td>
                      <td className="py-3.5 px-4 text-neutral-500 font-mono">{m.latency}</td>
                      <td className="py-3.5 px-5 text-neutral-500 font-mono text-[11px] truncate max-w-xs" title={m.params}>
                        {m.params}
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
          TAB 4: ARCHITECTURE & TWO-PHASE ESCROW SPEC
         ========================================================================= */}
      {activeTab === "reference" && (
        <div className="space-y-6 animate-spring">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Escrow Billing Specification */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-neutral-950">
                  Two-Phase Escrow Billing Engine
                </h3>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                To guarantee zero wasted spend for developers, our API never charges your account upfront. 
                Instead, transactions are processed in two atomic phases:
              </p>
              <div className="space-y-2.5 text-xs text-neutral-700">
                <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
                  <strong className="text-neutral-950 block">Phase 1: Escrow Reservation (Status: 202)</strong>
                  <span className="text-neutral-500">
                    Required credits are atomically locked with a unique idempotency key when the job is accepted into the queue.
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
                  <strong className="text-neutral-950 block">Phase 2: Final Settlement or Auto-Refund</strong>
                  <span className="text-neutral-500">
                    If inference renders successfully with valid HTTP 200 outputs, credits settle permanently. If a GPU worker OOMs or cloud API fails, credits instantly release back to your balance.
                  </span>
                </div>
              </div>
            </div>

            {/* Production Architecture & Webhooks */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-neutral-950">
                  Webhooks & Async Ingestion
                </h3>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Avoid long polling loops by registering an HTTPS webhook endpoint. Our dispatcher posts an HMAC-signed event when your output finishes rendering:
              </p>

              <div className="p-3.5 rounded-2xl bg-neutral-900 text-neutral-100 font-mono text-[11px] leading-relaxed">
                <div className="text-neutral-400">// Webhook POST payload</div>
                <div>{`{`}</div>
                <div className="pl-4">{`"event": "job.completed",`}</div>
                <div className="pl-4">{`"job_id": "84c8a2-...",`}</div>
                <div className="pl-4">{`"model_id": "imagen-3",`}</div>
                <div className="pl-4">{`"output_url": "https://storage.googleapis.com/...",`}</div>
                <div className="pl-4">{`"credits_charged": 8.0`}</div>
                <div>{`}`}</div>
              </div>

              <div className="text-[11px] text-neutral-500 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-neutral-400" />
                <span>Verify signatures using header: <code className="bg-neutral-100 px-1 py-0.5 rounded text-neutral-800">X-AIStudio-Signature</code></span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
