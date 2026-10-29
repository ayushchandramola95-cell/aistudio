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

export default function StudioPage() {
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

  // Prompt enhancement
  const handleEnhancePrompt = () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    setTimeout(() => {
      const enhanced = `${prompt.trim()}, breathtaking cinematic composition, 8k resolution, photorealistic details, volumetric natural lighting, highly intricate textures, trending on ArtStation`;
      setEnhancedPrompt(enhanced);
      setIsEnhancing(false);
    }, 600);
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <ImageIcon className="w-5 h-5" />
            </span>
            Image Generation Studio
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create high-fidelity visuals using Google Imagen 3 and FLUX.1.
          </p>
        </div>

        {/* Mode Switcher */}
        <button
          onClick={() => setIsAdvanced(!isAdvanced)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
            isAdvanced
              ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20"
              : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{isAdvanced ? "Advanced Mode (ON)" : "Switch to Advanced Mode"}</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Creation Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Prompt Section */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Generation Prompt
              </label>
              <button
                onClick={handleEnhancePrompt}
                disabled={isEnhancing || !prompt.trim()}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition-all disabled:opacity-50"
              >
                <Sparkles className="w-3 h-3 text-indigo-600" />
                <span>{isEnhancing ? "Enhancing..." : "✨ Enhance Prompt"}</span>
              </button>
            </div>

            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A mystical Japanese torii gate standing inside an enchanted bioluminescent forest, glowing mist, high quality..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all resize-none font-medium"
            />

            {enhancedPrompt && (
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 flex flex-col gap-1.5">
                <div className="flex items-center justify-between font-bold text-[11px] text-indigo-700">
                  <span>✨ AI Enhanced Version:</span>
                  <button
                    onClick={() => setEnhancedPrompt("")}
                    className="text-slate-500 hover:text-slate-800"
                  >
                    Discard
                  </button>
                </div>
                <p className="leading-relaxed">{enhancedPrompt}</p>
              </div>
            )}
          </div>

          {/* Model Selection */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              AI Generation Model
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {models.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedModelId(m.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedModelId === m.id
                      ? "bg-indigo-50/60 border-indigo-600 ring-2 ring-indigo-600/20 shadow-sm"
                      : "bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">{m.display_name}</span>
                    <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700">
                      {m.backend_type === "hosted_api" ? "Cloud API" : "GPU Worker"}
                    </span>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Base: {m.base_credit_cost} Credits</span>
                    <span className="text-emerald-600 font-bold">Ready</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Style Presets */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Artistic Style Preset
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {STYLE_PRESETS.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left text-xs font-bold transition-all ${
                    selectedStyle === style.id
                      ? "bg-indigo-50 border-indigo-600 text-indigo-900 shadow-sm"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-white"
                  }`}
                >
                  <span className="text-lg">{style.icon}</span>
                  <span>{style.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio & Batch Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ASPECT_RATIOS.map((ratio) => (
                  <button
                    key={ratio.value}
                    onClick={() => setSelectedRatio(ratio.value)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      selectedRatio === ratio.value
                        ? "bg-indigo-50 border-indigo-600 text-indigo-900 font-bold"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-white"
                    }`}
                  >
                    <div className="text-xs font-bold">{ratio.label}</div>
                    <div className="text-[10px] text-slate-400">{ratio.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Outputs (Batch Count)
              </label>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {[1, 2, 4].map((count) => (
                  <button
                    key={count}
                    onClick={() => setBatchCount(count)}
                    className={`py-3.5 rounded-xl border text-center font-extrabold text-sm transition-all ${
                      batchCount === count
                        ? "bg-indigo-50 border-indigo-600 text-indigo-900 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-white"
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
            <div className="bg-white p-6 rounded-3xl border border-indigo-200 shadow-sm space-y-4">
              <div className="text-xs font-extrabold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Advanced Parameters</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Negative Prompt (Exclude)</label>
                <input
                  type="text"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="blurry, distorted, bad hands, low quality"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Inference Steps</span>
                    <span className="text-indigo-600 font-bold">{steps}</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={50}
                    value={steps}
                    onChange={(e) => setSteps(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Guidance Scale (CFG)</span>
                    <span className="text-indigo-600 font-bold">{guidanceScale.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={15}
                    step={0.5}
                    value={guidanceScale}
                    onChange={(e) => setGuidanceScale(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-slate-600 font-medium">
              <span>Required: </span>
              <span className="font-extrabold text-slate-900 text-base">💎 {estimatedCost} Credits</span>
              <span className="text-xs text-slate-400 ml-1.5">(Safe two-phase escrow)</span>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="px-8 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-xl shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Reserving & Queuing...</span>
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
          <div className="bg-white p-8 rounded-3xl flex flex-col items-center justify-center min-h-[460px] border border-slate-200/90 shadow-sm text-center relative overflow-hidden">
            {activeJob ? (
              <div className="space-y-4 w-full text-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-xs font-bold text-emerald-700 border border-emerald-200">
                  <Check className="w-3.5 h-3.5" />
                  <span>Job Dispatched to Asynchronous Queue</span>
                </div>
                <div className="text-xs text-slate-400 font-mono">Job ID: {activeJob.id}</div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs text-slate-700 space-y-1">
                  <div className="font-bold text-slate-900">Submitted Prompt:</div>
                  <p className="line-clamp-3 italic text-slate-600">"{activeJob.raw_prompt}"</p>
                  <div className="pt-2 flex justify-between text-[11px] text-slate-400 border-t border-slate-200 mt-2">
                    <span>Model: <strong>{activeJob.model_id}</strong></span>
                    <span>Reserved: <strong>{activeJob.credits_reserved} Credits</strong></span>
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  Ready for Phase 3 real inference pipeline dispatch.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-w-xs text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-indigo-600">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Interactive Canvas Stage</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Enter your prompt on the left, pick an artistic preset, and click Generate to see your rendered output.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
