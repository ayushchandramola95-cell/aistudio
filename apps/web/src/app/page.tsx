"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  Wand2,
  Download,
  Share2,
  RefreshCw,
  Image as ImageIcon,
  Check,
  AlertCircle
} from "lucide-react";
import { Model, GenerationJob } from "@/types";

const STYLE_PRESETS = [
  { id: "photorealistic", name: "Photorealistic", icon: "📸" },
  { id: "cinematic", name: "Cinematic", icon: "🎬" },
  { id: "anime", name: "Anime / Manga", icon: "🎨" },
  { id: "3d_render", name: "3D Digital Art", icon: "🔮" },
  { id: "cyberpunk", name: "Cyberpunk", icon: "🌃" },
  { id: "fantasy", name: "Dark Fantasy", icon: "🐉" },
];

const ASPECT_RATIOS = [
  { label: "1:1 Square", value: "1:1", desc: "1024x1024" },
  { label: "16:9 Landscape", value: "16:9", desc: "1344x768" },
  { label: "9:16 Portrait", value: "9:16", desc: "768x1344" },
  { label: "4:3 Classic", value: "4:3", desc: "1152x864" },
];

export default function ImageStudioPage() {
  const [prompt, setPrompt] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState("photorealistic");
  const [selectedRatio, setSelectedRatio] = useState("1:1");
  const [batchCount, setBatchCount] = useState(1);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModelId, setSelectedModelId] = useState("imagen-3");
  const [isAdvanced, setIsAdvanced] = useState(false);
  
  // Advanced parameters
  const [negativePrompt, setNegativePrompt] = useState("");
  const [steps, setSteps] = useState(25);
  const [guidanceScale, setGuidanceScale] = useState(7.0);
  const [seed, setSeed] = useState(-1);

  // Job generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeJob, setActiveJob] = useState<GenerationJob | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch models on load
  useEffect(() => {
    fetch("http://localhost:8100/api/v1/models")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.models) {
          const imageModels = data.models.filter((m: Model) =>
            m.supported_tasks.includes("text-to-image")
          );
          setModels(imageModels);
          if (imageModels.length > 0) {
            setSelectedModelId(imageModels[0].id);
          }
        }
      })
      .catch(() => {});
  }, []);

  const selectedModel = models.find((m) => m.id === selectedModelId);
  const estimatedCost = (selectedModel?.base_credit_cost || 8) * batchCount;

  // Simulate prompt enhancement
  const handleEnhancePrompt = () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    setTimeout(() => {
      const enhanced = `${prompt.trim()}, breathtaking cinematic composition, 8k resolution, photorealistic details, volumetric natural lighting, highly intricate textures, trending on ArtStation`;
      setEnhancedPrompt(enhanced);
      setIsEnhancing(false);
    }, 700);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setErrorMsg(null);
    setIsGenerating(true);

    try {
      const res = await fetch("http://localhost:8100/api/v1/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model_id: selectedModelId,
          task_type: "image_generation",
          raw_prompt: enhancedPrompt || prompt,
          parameters: {
            aspect_ratio: selectedRatio,
            sample_count: batchCount,
            style_preset: selectedStyle,
            ...(isAdvanced ? { negative_prompt: negativePrompt, steps, guidance_scale: guidanceScale, seed } : {})
          },
          auto_enhance: !!enhancedPrompt
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to trigger generation.");
      }

      const job: GenerationJob = await res.json();
      setActiveJob(job);
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred during submission.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-studio-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-accent-purple/20 text-accent-purple">
              <ImageIcon className="w-5 h-5" />
            </span>
            Image Generation Studio
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Create ultra-realistic art, illustrations, and digital media using Google Imagen 3 and FLUX.
          </p>
        </div>

        {/* Beginner vs Advanced Mode Toggle */}
        <button
          onClick={() => setIsAdvanced(!isAdvanced)}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            isAdvanced
              ? "bg-accent-purple text-white border-accent-purple shadow-sm shadow-purple-500/30"
              : "bg-studio-800 text-slate-300 border-studio-700 hover:text-white"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{isAdvanced ? "Advanced Mode (ON)" : "Switch to Advanced Mode"}</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center gap-3 text-rose-200 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Creation Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Prompt Section */}
          <div className="glass-panel p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Generation Prompt
              </label>
              <button
                onClick={handleEnhancePrompt}
                disabled={isEnhancing || !prompt.trim()}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-accent-purple/20 to-accent-indigo/20 border border-purple-500/30 text-purple-300 hover:text-white hover:border-purple-500 transition-all disabled:opacity-50"
              >
                <Sparkles className="w-3 h-3 text-accent-purple" />
                <span>{isEnhancing ? "Enhancing..." : "✨ Enhance Prompt"}</span>
              </button>
            </div>

            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A mystical Japanese torii gate standing inside an enchanted bioluminescent forest, glowing mist, high quality..."
              className="w-full bg-studio-950/80 border border-studio-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent-purple transition-all resize-none"
            />

            {enhancedPrompt && (
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs text-purple-200 flex flex-col gap-1.5">
                <div className="flex items-center justify-between font-semibold text-[11px] text-purple-400">
                  <span>✨ AI Enhanced Version:</span>
                  <button
                    onClick={() => setEnhancedPrompt("")}
                    className="text-slate-400 hover:text-white"
                  >
                    Discard
                  </button>
                </div>
                <p className="leading-relaxed">{enhancedPrompt}</p>
              </div>
            )}
          </div>

          {/* Model Selection */}
          <div className="glass-panel p-5 rounded-2xl space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              AI Generation Model
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {models.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedModelId(m.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedModelId === m.id
                      ? "bg-accent-purple/15 border-accent-purple shadow-sm"
                      : "bg-studio-950/60 border-studio-800 hover:border-studio-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-white">{m.display_name}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-studio-800 text-slate-400">
                      {m.backend_type === "hosted_api" ? "Cloud API" : "GPU Worker"}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                    <span>Base: {m.base_credit_cost} Credits</span>
                    <span className="text-emerald-400 font-medium">Ready</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Style Presets */}
          <div className="glass-panel p-5 rounded-2xl space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Artistic Style Preset
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {STYLE_PRESETS.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                    selectedStyle === style.id
                      ? "bg-accent-purple/20 border-accent-purple text-white shadow-sm"
                      : "bg-studio-950/60 border-studio-800 text-slate-300 hover:border-studio-700 hover:text-white"
                  }`}
                >
                  <span className="text-base">{style.icon}</span>
                  <span>{style.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio & Batch Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-panel p-4 rounded-2xl space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ASPECT_RATIOS.map((ratio) => (
                  <button
                    key={ratio.value}
                    onClick={() => setSelectedRatio(ratio.value)}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      selectedRatio === ratio.value
                        ? "bg-accent-purple/20 border-accent-purple text-white"
                        : "bg-studio-950/60 border-studio-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <div className="text-xs font-semibold">{ratio.label}</div>
                    <div className="text-[10px] text-slate-500">{ratio.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-panel p-4 rounded-2xl space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Outputs (Batch Count)
              </label>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {[1, 2, 4].map((count) => (
                  <button
                    key={count}
                    onClick={() => setBatchCount(count)}
                    className={`py-3 rounded-xl border text-center font-bold text-sm transition-all ${
                      batchCount === count
                        ? "bg-accent-purple/20 border-accent-purple text-white"
                        : "bg-studio-950/60 border-studio-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {count}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Advanced Controls Accordion */}
          {isAdvanced && (
            <div className="glass-panel p-5 rounded-2xl space-y-4 border-accent-purple/40">
              <div className="text-xs font-semibold uppercase tracking-wider text-accent-purple flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Advanced Parameters</span>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-400">Negative Prompt (What to exclude)</label>
                <input
                  type="text"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="blurry, distorted, bad hands, low quality, oversaturated"
                  className="w-full bg-studio-950 border border-studio-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-purple"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Inference Steps</span>
                    <span className="text-white font-medium">{steps}</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={50}
                    value={steps}
                    onChange={(e) => setSteps(Number(e.target.value))}
                    className="w-full accent-accent-purple"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Guidance Scale (CFG)</span>
                    <span className="text-white font-medium">{guidanceScale.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={15}
                    step={0.5}
                    value={guidanceScale}
                    onChange={(e) => setGuidanceScale(Number(e.target.value))}
                    className="w-full accent-accent-purple"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-slate-300">
              <span>Cost: </span>
              <span className="font-bold text-white text-base">💎 {estimatedCost} Credits</span>
              <span className="text-xs text-slate-500 ml-1.5">(Two-phase safe escrow)</span>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-accent-purple to-accent-indigo hover:from-purple-600 hover:to-indigo-600 text-white shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Submitting to Queue...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Generate Images</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Canvas & Output Stage */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center min-h-[460px] border border-studio-800 text-center relative overflow-hidden">
            {activeJob ? (
              <div className="space-y-4 w-full text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-studio-800 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                  <Check className="w-3.5 h-3.5" />
                  <span>Job Queued Successfully</span>
                </div>
                <div className="text-xs text-slate-400 font-mono">Job ID: {activeJob.id}</div>
                <div className="p-4 rounded-xl bg-studio-950/80 border border-studio-800 text-left text-xs text-slate-300 space-y-1">
                  <div className="font-semibold text-white">Submitted Prompt:</div>
                  <p className="line-clamp-3 italic text-slate-400">"{activeJob.raw_prompt}"</p>
                  <div className="pt-2 flex justify-between text-[11px] text-slate-500">
                    <span>Model: {activeJob.model_id}</span>
                    <span>Reserved: {activeJob.credits_reserved} Credits</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  Worker is ready for Phase 3 real inference pipeline dispatch.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-w-xs text-center">
                <div className="w-16 h-16 rounded-2xl bg-studio-950/80 border border-studio-800 flex items-center justify-center mx-auto text-slate-500">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-sm text-slate-200">Interactive Canvas Stage</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enter your prompt on the left, pick an artistic preset, and click Generate to see your outputs rendered here.
                </p>
              </div>
            )}
          </div>

          {/* Quick Tip for Vibe Coding */}
          <div className="p-4 rounded-xl bg-studio-950/60 border border-studio-800 text-xs text-slate-400 space-y-1">
            <span className="font-semibold text-slate-300">💡 Vibe Coder Tip:</span>
            <p>
              You are currently on port <strong>3100</strong>. Your credit balance updates live from the backend API running on port <strong>8100</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
