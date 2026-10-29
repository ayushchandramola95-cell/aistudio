"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  AlertCircle,
  Video,
  Mic,
  FileText,
  Copy,
  Maximize2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Play,
  ArrowRight
} from "lucide-react";
import { Model, GenerationJob } from "@/types";

const STYLE_PRESETS = [
  { id: "photorealistic", name: "Photorealistic", icon: "📸", promptAdd: "photorealistic, 8k resolution, shot on 35mm lens, natural lighting" },
  { id: "cinematic", name: "Cinematic", icon: "🎬", promptAdd: "cinematic film still, Arri Alexa 65, dramatic rim lighting, depth of field" },
  { id: "anime", name: "Anime / Manga", icon: "🎨", promptAdd: "anime aesthetic, Makoto Shinkai style, vibrant colors, detailed line art" },
  { id: "3d_render", name: "3D Digital Art", icon: "🔮", promptAdd: "stylized 3D render, Pixar aesthetic, soft raytraced ambient occlusion" },
  { id: "cyberpunk", name: "Cyberpunk", icon: "🌃", promptAdd: "neon holographic reflections, rainy Tokyo street, high-tech dystopian atmosphere" },
  { id: "product", name: "Studio Product", icon: "📦", promptAdd: "commercial product photography, studio marble pedestal, softbox diffused lighting" },
  { id: "fantasy", name: "Dark Fantasy", icon: "🐉", promptAdd: "dark fantasy concept art, ethereal atmospheric fog, volumetric lighting" },
];

const ASPECT_RATIOS = [
  { label: "16:9", sub: "Landscape", value: "16:9", desc: "1344x768" },
  { label: "1:1", sub: "Square", value: "1:1", desc: "1024x1024" },
  { label: "9:16", sub: "Story", value: "9:16", desc: "768x1344" },
  { label: "4:3", sub: "Classic", value: "4:3", desc: "1152x864" },
];

const INSPIRATION_PRESETS = [
  {
    title: "Kyoto Cyberpunk Shrine",
    model: "Google Imagen 3",
    modelId: "imagen-3",
    ratio: "16:9",
    style: "cinematic",
    prompt: "An ancient Kyoto torii gate illuminated by neon holographic glyphs in heavy rain, cinematic lighting, 8k resolution, photorealistic reflections on wet stone pavement",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop",
    credits: 8,
  },
  {
    title: "Minimalist Ceramic Teapot",
    model: "FLUX.1 Schnell",
    modelId: "flux-1-schnell",
    ratio: "1:1",
    style: "photorealistic",
    prompt: "Minimalist ceramic Japanese teapot with crackled kintsugi gold lacquer on weathered oak table, natural diffused morning window light, 50mm f/1.4 lens depth of field",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=1200&auto=format&fit=crop",
    credits: 6,
  },
  {
    title: "Celestial Mech Pilot",
    model: "FLUX.1 Dev",
    modelId: "flux-1-schnell",
    ratio: "9:16",
    style: "anime",
    prompt: "Anime concept art of a futuristic mecha pilot in glowing armor looking out into deep nebula space from hangar bay, Makoto Shinkai style, vibrant colors",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    credits: 6,
  },
  {
    title: "Bioluminescent Dragon",
    model: "Google Imagen 3",
    modelId: "imagen-3",
    ratio: "16:9",
    style: "fantasy",
    prompt: "An ethereal glowing deep-sea creature swimming through dark abyssal trenches, radiant blue and gold bioluminescence, hyperdetailed scales, national geographic style",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
    credits: 8,
  },
];

export default function StudioPage() {
  const [activeStudioTab, setActiveStudioTab] = useState<"image" | "video" | "audio" | "text" | "enhance">("image");
  const [prompt, setPrompt] = useState(
    "A mystical Japanese torii gate standing inside an enchanted bioluminescent forest, glowing mist, high quality photorealistic, 8k resolution"
  );
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState("photorealistic");
  const [selectedRatio, setSelectedRatio] = useState("16:9");
  const [batchCount, setBatchCount] = useState(1);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModelId, setSelectedModelId] = useState("imagen-3");
  const [isAdvanced, setIsAdvanced] = useState(false);
  
  // Advanced parameters
  const [negativePrompt, setNegativePrompt] = useState("blurry, bad anatomy, low quality, artifacting, extra limbs");
  const [steps, setSteps] = useState(25);
  const [guidanceScale, setGuidanceScale] = useState(7.0);
  const [seed, setSeed] = useState(-1);

  // Job generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeJob, setActiveJob] = useState<GenerationJob | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStageText, setCurrentStageText] = useState("");
  const [generatedOutputUrl, setGeneratedOutputUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);
  
  // Recent generations history strip
  const [recentCreations, setRecentCreations] = useState<Array<{ id: string; prompt: string; url: string; model: string; ratio: string }>>([
    {
      id: "demo-1",
      prompt: "A mystical Japanese torii gate inside an enchanted bioluminescent forest",
      url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop",
      model: "Google Imagen 3",
      ratio: "16:9"
    },
    {
      id: "demo-2",
      prompt: "Minimalist ceramic Japanese teapot with crackled kintsugi gold lacquer",
      url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=1200&auto=format&fit=crop",
      model: "FLUX.1 Schnell",
      ratio: "1:1"
    }
  ]);

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
    }, 500);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setErrorMsg(null);
    setIsGenerating(true);
    setGenerationProgress(15);
    setCurrentStageText("1/3 Reserving credits via Two-Phase Escrow...");

    try {
      // 1. Submit job to FastAPI
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

      // Simulated smooth progress while queue worker processes
      setGenerationProgress(45);
      setCurrentStageText("2/3 Connecting to Google Cloud Vertex AI Imagen 3 API...");

      setTimeout(() => {
        setGenerationProgress(80);
        setCurrentStageText("3/3 Synthesizing 1344x768 photoreal output & settling escrow...");

        setTimeout(() => {
          setGenerationProgress(100);
          setIsGenerating(false);

          // Simulated high-fidelity preview render
          const resultUrl = "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop";
          setGeneratedOutputUrl(resultUrl);

          // Add to recent creation strip
          setRecentCreations((prev) => [
            {
              id: job.id,
              prompt: prompt,
              url: resultUrl,
              model: selectedModel?.display_name || "Google Imagen 3",
              ratio: selectedRatio
            },
            ...prev
          ]);
        }, 800);
      }, 900);

    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred during submission.");
      setIsGenerating(false);
    }
  };

  const handleApplyPreset = (preset: typeof INSPIRATION_PRESETS[0]) => {
    setPrompt(preset.prompt);
    setSelectedRatio(preset.ratio);
    setSelectedStyle(preset.style);
    setSelectedModelId(preset.modelId);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* 1. Modality Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-neutral-200">
        <div className="flex flex-wrap items-center gap-1.5 bg-neutral-100/90 p-1.5 rounded-2xl border border-neutral-200/80">
          {[
            { id: "image", icon: ImageIcon, label: "Image Studio", badge: "Live" },
            { id: "video", icon: Video, label: "Video Studio", badge: "Veo 2" },
            { id: "audio", icon: Mic, label: "Voice & Audio", badge: "Kokoro" },
            { id: "text", icon: FileText, label: "Script Enhancer", badge: "Gemini 2.0" },
            { id: "enhance", icon: Wand2, label: "4K Upscaler", badge: "Real-ESRGAN" },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeStudioTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveStudioTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-white text-neutral-950 shadow-sm border border-neutral-200/80"
                    : "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200/60"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-neutral-950" : "text-neutral-400"}`} />
                <span>{tab.label}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                  isActive ? "bg-neutral-100 text-neutral-800" : "bg-neutral-200 text-neutral-600"
                }`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mode Switcher */}
        <button
          onClick={() => setIsAdvanced(!isAdvanced)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
            isAdvanced
              ? "bg-neutral-950 text-white border-neutral-950 shadow-sm"
              : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{isAdvanced ? "Advanced Controls (ON)" : "Switch to Advanced Controls"}</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-800 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 2. Main Studio Ergonomic Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Generation Command Center (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Prompt Section */}
          <div className="bg-white p-5 rounded-3xl border border-neutral-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <span>Prompt Specification</span>
                <span className="text-[10px] text-blue-600 font-semibold">• Natural Language</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyPrompt}
                  className="text-xs font-medium text-neutral-500 hover:text-neutral-900 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg"
                >
                  {copiedNotification ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedNotification ? "Copied" : "Copy"}</span>
                </button>

                <button
                  onClick={handleEnhancePrompt}
                  disabled={isEnhancing || !prompt.trim()}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  <span>{isEnhancing ? "Optimizing..." : "✨ Enhance with Gemini"}</span>
                </button>
              </div>
            </div>

            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to create in plain English..."
              className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl p-4 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition-all resize-none font-medium leading-relaxed"
            />

            {enhancedPrompt && (
              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs text-blue-950 flex flex-col gap-1.5">
                <div className="flex items-center justify-between font-bold text-[11px] text-blue-700">
                  <span>✨ Gemini 2.0 Flash Enhanced Prompt:</span>
                  <button
                    onClick={() => setEnhancedPrompt("")}
                    className="text-neutral-500 hover:text-neutral-800 text-[11px]"
                  >
                    Discard
                  </button>
                </div>
                <p className="leading-relaxed font-normal">{enhancedPrompt}</p>
              </div>
            )}

            {/* Quick Prompt Tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mr-1">Add Detail:</span>
              {[
                "+ 8k resolution",
                "+ volumetric sunlight",
                "+ cinematic lighting",
                "+ highly detailed",
                "+ 50mm f/1.4 bokeh",
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => setPrompt((prev) => prev ? `${prev}, ${chip.replace("+ ", "")}` : chip.replace("+ ", ""))}
                  className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Model & Configuration Strip */}
          <div className="bg-white p-5 rounded-3xl border border-neutral-200/90 shadow-sm space-y-4">
            
            {/* Model Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Model Engine
                </label>
                <span className="text-[11px] font-semibold text-neutral-500">
                  {selectedModelId === "imagen-3" ? "Google Cloud Vertex AI (Hosted)" : "Dedicated GPU Worker"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "imagen-3", name: "Google Imagen 3", type: "Cloud API", cost: "8 cr", note: "Best for photorealism & text" },
                  { id: "flux-1-schnell", name: "FLUX.1 Schnell", type: "GPU Worker", cost: "6 cr", note: "Ultra-fast 4-step generation" },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModelId(m.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedModelId === m.id
                        ? "bg-neutral-950 text-white border-neutral-950 shadow-md"
                        : "bg-neutral-50/70 border-neutral-200 hover:bg-white text-neutral-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{m.name}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        selectedModelId === m.id ? "bg-neutral-800 text-white" : "bg-neutral-200 text-neutral-700"
                      }`}>
                        {m.cost}
                      </span>
                    </div>
                    <div className={`text-[10px] mt-1 font-normal ${
                      selectedModelId === m.id ? "text-neutral-300" : "text-neutral-500"
                    }`}>
                      {m.note}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio & Batch Count Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-100">
              {/* Aspect Ratio */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                  Aspect Ratio
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {ASPECT_RATIOS.map((ratio) => (
                    <button
                      key={ratio.value}
                      onClick={() => setSelectedRatio(ratio.value)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedRatio === ratio.value
                          ? "bg-neutral-900 text-white border-neutral-900 font-bold"
                          : "bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-white"
                      }`}
                    >
                      <div className="text-xs font-bold">{ratio.label}</div>
                      <div className="text-[9px] opacity-75">{ratio.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Batch Count */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                  Batch Output Count
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[1, 2, 4].map((count) => (
                    <button
                      key={count}
                      onClick={() => setBatchCount(count)}
                      className={`py-2 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                        batchCount === count
                          ? "bg-neutral-900 text-white border-neutral-900 font-bold shadow-sm"
                          : "bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-white"
                      }`}
                    >
                      {count} Output{count > 1 ? "s" : ""}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Style Presets */}
            <div className="pt-2 border-t border-neutral-100">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                Artistic Style Preset
              </label>
              <div className="flex flex-wrap gap-1.5">
                {STYLE_PRESETS.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => {
                      setSelectedStyle(style.id);
                      if (!prompt.includes(style.promptAdd)) {
                        setPrompt((prev) => `${prev.replace(/, (photorealistic|cinematic film still|anime aesthetic|stylized 3D render|neon holographic|commercial product|dark fantasy)[^,]*/gi, "")}, ${style.promptAdd}`);
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      selectedStyle === style.id
                        ? "bg-neutral-950 text-white border-neutral-950 shadow-sm"
                        : "bg-neutral-50 border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:bg-white"
                    }`}
                  >
                    <span>{style.icon}</span>
                    <span>{style.name}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Advanced Controls Accordion (Collapsible) */}
          {isAdvanced && (
            <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                  <span>Advanced Parameters</span>
                </span>
                <span className="text-[11px] font-normal text-neutral-500">Fine-tune guidance & sampling</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-600">Negative Prompt (Exclude)</label>
                <input
                  type="text"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="blurry, distorted, bad hands, low quality"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-neutral-600">
                    <span>Inference Steps</span>
                    <span className="text-blue-600 font-bold">{steps}</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={50}
                    value={steps}
                    onChange={(e) => setSteps(Number(e.target.value))}
                    className="w-full accent-neutral-950"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-neutral-600">
                    <span>Guidance Scale (CFG)</span>
                    <span className="text-blue-600 font-bold">{guidanceScale.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={15}
                    step={0.5}
                    value={guidanceScale}
                    onChange={(e) => setGuidanceScale(Number(e.target.value))}
                    className="w-full accent-neutral-950"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Primary Generation Action Bar (Always Visible & Prominent) */}
          <div className="bg-white p-5 rounded-3xl border border-neutral-200/90 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                <span>Estimated Cost:</span>
                <span className="text-base font-extrabold text-blue-600">💎 {estimatedCost} Credits</span>
              </div>
              <div className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Protected by Two-Phase Escrow (Auto-refund on failure)</span>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full sm:w-auto px-9 py-3.5 rounded-full font-bold text-sm bg-neutral-950 hover:bg-neutral-800 text-white shadow-md hover:shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating {batchCount}x Assets...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Generate Images ({estimatedCost} cr)</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Right Column: Live Interactive Canvas Stage (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white p-6 rounded-3xl border border-neutral-200/90 shadow-sm min-h-[520px] flex flex-col justify-between relative overflow-hidden">
            
            {/* Top Stage Bar */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isGenerating ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`}></span>
                <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  {isGenerating ? "Synthesizing Asset..." : generatedOutputUrl ? "Generation Completed" : "Studio Canvas Stage"}
                </span>
              </div>

              {generatedOutputUrl && (
                <div className="flex items-center gap-2">
                  <a
                    href={generatedOutputUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                    title="Fullscreen Zoom"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={generatedOutputUrl}
                    download="aistudio-render.jpg"
                    className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                    title="Download Asset"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Stage Body */}
            <div className="my-auto py-6">
              
              {/* Generating Animation State */}
              {isGenerating ? (
                <div className="space-y-6 text-center max-w-sm mx-auto">
                  <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto text-neutral-950 animate-pulse">
                    <RefreshCw className="w-8 h-8 animate-spin" />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-neutral-950">Generating Your Visual</h4>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      {currentStageText}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-neutral-950 h-full rounded-full transition-all duration-300"
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>

                  <div className="text-[11px] text-neutral-400">
                    Two-Phase Escrow active &bull; Latency tracking engaged
                  </div>
                </div>
              ) : generatedOutputUrl ? (
                /* Completed Render Output Stage */
                <div className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden border border-neutral-200 shadow-sm group">
                    <img
                      src={generatedOutputUrl}
                      alt="Generated Creation"
                      className="w-full h-72 sm:h-80 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                      {selectedModel?.display_name || "Google Imagen 3"} &bull; {selectedRatio}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Settled: {estimatedCost} Credits</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <Link
                        href="/enhance"
                        className="px-3 py-1.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 flex items-center gap-1.5 transition-colors"
                      >
                        <Wand2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>4x AI Upscale</span>
                      </Link>
                      <button
                        onClick={handleGenerate}
                        className="px-3 py-1.5 rounded-xl bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 flex items-center gap-1.5 transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Remix</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Idle State: Quick-Start Inspiration Presets */
                <div className="space-y-4 text-left">
                  <div>
                    <h4 className="text-sm font-bold text-neutral-950 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span>Instant 1-Click Inspirations</span>
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Click any creation to immediately load its prompt, model, and ratio into the studio:
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {INSPIRATION_PRESETS.map((preset) => (
                      <div
                        key={preset.title}
                        onClick={() => handleApplyPreset(preset)}
                        className="group relative rounded-2xl overflow-hidden border border-neutral-200/90 hover:border-neutral-900 cursor-pointer transition-all shadow-sm"
                      >
                        <img
                          src={preset.image}
                          alt={preset.title}
                          className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent p-2.5 flex flex-col justify-end text-white">
                          <div className="text-[11px] font-bold line-clamp-1">{preset.title}</div>
                          <div className="text-[9px] text-neutral-300 flex items-center justify-between mt-0.5">
                            <span>{preset.model}</span>
                            <span className="font-bold">{preset.credits} cr</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 text-center">
                    <button
                      onClick={handleGenerate}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                    >
                      <span>Or generate with current prompt above</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom History Strip */}
            <div className="pt-4 border-t border-neutral-100">
              <div className="flex items-center justify-between text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                <span>Recent Studio Generations</span>
                <Link href="/creations" className="text-blue-600 hover:underline normal-case">
                  View All &rarr;
                </Link>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {recentCreations.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setPrompt(item.prompt);
                      setGeneratedOutputUrl(item.url);
                    }}
                    className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-neutral-200 hover:border-neutral-900 cursor-pointer transition-all relative group"
                    title={item.prompt}
                  >
                    <img src={item.url} alt="creation" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
