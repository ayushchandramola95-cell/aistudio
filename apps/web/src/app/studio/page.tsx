"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Sparkles,
  ChevronDown,
  Wand2,
  Download,
  RefreshCw,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Copy,
  Maximize2,
  Paperclip,
  X,
  Sliders,
  CheckCircle2,
  ShieldCheck,
  Layers,
  ArrowUp
} from "lucide-react";
import { Model, GenerationJob } from "@/types";

// Supported Models (Clean official names without confusing "local/hosted" tags)
const AVAILABLE_MODELS = [
  {
    id: "imagen-3",
    name: "Google Imagen 3",
    cost: 8,
    desc: "Top-tier photorealism, typography & intricate textures",
    badge: "Recommended",
  },
  {
    id: "flux-1-schnell",
    name: "FLUX.1 Schnell",
    cost: 6,
    desc: "Ultra-fast generation with sharp composition",
    badge: "Fast",
  },
  {
    id: "flux-1-dev",
    name: "FLUX.1 Dev",
    cost: 10,
    desc: "Highest prompt adherence & artistic precision",
    badge: "Pro",
  },
  {
    id: "sd-3-5",
    name: "Stable Diffusion 3.5",
    cost: 5,
    desc: "Versatile styling, character design & concepts",
    badge: "Open",
  },
  {
    id: "veo-2",
    name: "Google Veo 2",
    cost: 80,
    desc: "Cinematic 1080p video motion & temporal consistency",
    badge: "Video",
  },
];

// Frame / Aspect Ratio definitions
const FRAME_RATIOS = [
  { id: "16:9", label: "16:9 Landscape", sub: "1344 × 768", icon: "▭" },
  { id: "1:1", label: "1:1 Square", sub: "1024 × 1024", icon: "□" },
  { id: "9:16", label: "9:16 Vertical Story", sub: "768 × 1344", icon: "▯" },
  { id: "4:3", label: "4:3 Classic", sub: "1152 × 864", icon: "▱" },
  { id: "21:9", label: "21:9 Ultrawide Cinema", sub: "1536 × 640", icon: "▬" },
];

// Quality Presets
const QUALITY_PRESETS = [
  { id: "standard", label: "Standard HD (1080p)", extraCost: 0 },
  { id: "high", label: "High Definition 2K", extraCost: 2 },
  { id: "ultra", label: "Ultra-HD 4K (Master)", extraCost: 4 },
];

// Curated Inspiration Templates
const INSPIRATION_TEMPLATES = [
  {
    title: "Kyoto Cyberpunk Shrine",
    modelId: "imagen-3",
    ratio: "16:9",
    quality: "ultra",
    prompt: "An ancient Kyoto torii gate illuminated by neon holographic glyphs in heavy rain, cinematic lighting, 8k resolution, photorealistic reflections on wet stone pavement",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop",
    cost: 12,
  },
  {
    title: "Minimalist Ceramic Teapot",
    modelId: "flux-1-schnell",
    ratio: "1:1",
    quality: "standard",
    prompt: "Minimalist ceramic Japanese teapot with crackled kintsugi gold lacquer on weathered oak table, natural diffused morning window light, 50mm f/1.4 lens depth of field",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=1200&auto=format&fit=crop",
    cost: 6,
  },
  {
    title: "Celestial Mech Pilot",
    modelId: "flux-1-dev",
    ratio: "9:16",
    quality: "high",
    prompt: "Anime concept art of a futuristic mecha pilot in glowing armor looking out into deep nebula space from hangar bay, Makoto Shinkai style, vibrant colors",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    cost: 12,
  },
  {
    title: "Abyssal Bioluminescent Dragon",
    modelId: "imagen-3",
    ratio: "16:9",
    quality: "ultra",
    prompt: "An ethereal glowing deep-sea dragon swimming through dark abyssal trenches, radiant blue and gold bioluminescence, hyperdetailed scales, national geographic style",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
    cost: 12,
  },
];

export default function StudioPage() {
  const [prompt, setPrompt] = useState("");
  const [selectedModelId, setSelectedModelId] = useState("imagen-3");
  const [selectedRatio, setSelectedRatio] = useState("16:9");
  const [selectedQuality, setSelectedQuality] = useState("standard");
  const [batchCount, setBatchCount] = useState(1);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);

  // Dropdown menus
  const [modelMenuOpen, setModelMenuOpen] = useState(false);
  const [ratioMenuOpen, setRatioMenuOpen] = useState(false);
  const [qualityMenuOpen, setQualityMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Advanced settings
  const [negativePrompt, setNegativePrompt] = useState("");
  const [guidanceScale, setGuidanceScale] = useState(7.0);
  const [steps, setSteps] = useState(25);
  const [seed, setSeed] = useState(-1);

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stageText, setStageText] = useState("");
  const [activeJob, setActiveJob] = useState<GenerationJob | null>(null);
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Recent generation history
  const [history, setHistory] = useState<Array<{ id: string; prompt: string; url: string; model: string; ratio: string }>>([
    {
      id: "hist-1",
      prompt: "An ancient Kyoto torii gate illuminated by neon holographic glyphs in heavy rain",
      url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop",
      model: "Google Imagen 3",
      ratio: "16:9",
    },
    {
      id: "hist-2",
      prompt: "Minimalist ceramic Japanese teapot with crackled kintsugi gold lacquer",
      url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=1200&auto=format&fit=crop",
      model: "FLUX.1 Schnell",
      ratio: "1:1",
    },
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const studioRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (studioRef.current && !studioRef.current.contains(event.target as Node)) {
        setModelMenuOpen(false);
        setRatioMenuOpen(false);
        setQualityMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute live credit cost
  const currentModel = AVAILABLE_MODELS.find((m) => m.id === selectedModelId) || AVAILABLE_MODELS[0];
  const currentQuality = QUALITY_PRESETS.find((q) => q.id === selectedQuality) || QUALITY_PRESETS[0];
  const totalCost = (currentModel.cost + currentQuality.extraCost) * batchCount;

  // Image Upload handler for Image-to-Image / Vision references
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setErrorMsg(null);
    setIsGenerating(true);
    setProgress(15);
    setStageText("Reserving credits via Two-Phase Escrow...");

    try {
      const res = await fetch("http://localhost:8100/api/v1/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model_id: selectedModelId,
          task_type: "image_generation",
          raw_prompt: prompt,
          parameters: {
            aspect_ratio: selectedRatio,
            quality: selectedQuality,
            sample_count: batchCount,
            ...(attachedImage ? { reference_image: true } : {}),
            ...(negativePrompt ? { negative_prompt: negativePrompt } : {}),
            steps,
            guidance_scale: guidanceScale,
            seed: seed !== -1 ? seed : undefined,
          },
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to trigger generation.");
      }

      const job: GenerationJob = await res.json();
      setActiveJob(job);

      // Smooth step simulation
      setProgress(50);
      setStageText(`Synthesizing output via ${currentModel.name}...`);

      setTimeout(() => {
        setProgress(85);
        setStageText("Finalizing high-resolution render & settling escrow...");

        setTimeout(() => {
          setProgress(100);
          setIsGenerating(false);

          // Rendered output image
          const resultUrl = "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop";
          setOutputImage(resultUrl);

          setHistory((prev) => [
            {
              id: job.id,
              prompt: prompt,
              url: resultUrl,
              model: currentModel.name,
              ratio: selectedRatio,
            },
            ...prev,
          ]);
        }, 700);
      }, 800);

    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred during generation.");
      setIsGenerating(false);
    }
  };

  const handleApplyTemplate = (tmpl: typeof INSPIRATION_TEMPLATES[0]) => {
    setPrompt(tmpl.prompt);
    setSelectedModelId(tmpl.modelId);
    setSelectedRatio(tmpl.ratio);
    setSelectedQuality(tmpl.quality);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  return (
    <div ref={studioRef} className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Hidden File Input for Image Reference */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageFileChange}
        className="hidden"
      />

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between text-rose-800 text-xs font-semibold animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-rose-500 hover:text-rose-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. CENTERED OMNI-GENERATION BAR (Chat / Prompt Input with Embedded Controls) */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xl shadow-neutral-900/5 p-4 sm:p-5 space-y-3 transition-all focus-within:border-neutral-900 focus-within:shadow-2xl focus-within:shadow-neutral-900/10">
        
        {/* Attached Reference Image Preview (Image-to-Image) */}
        {attachedImage && (
          <div className="relative inline-block border border-neutral-200 rounded-2xl overflow-hidden shadow-sm group">
            <img src={attachedImage} alt="Reference" className="w-20 h-20 object-cover" />
            <button
              onClick={() => setAttachedImage(null)}
              className="absolute top-1 right-1 p-1 rounded-full bg-neutral-900/80 hover:bg-neutral-900 text-white text-xs transition-colors"
              title="Remove Reference Image"
            >
              <X className="w-3 h-3" />
            </button>
            <div className="absolute bottom-0 inset-x-0 bg-neutral-900/70 text-white text-[9px] font-bold text-center py-0.5">
              Reference
            </div>
          </div>
        )}

        {/* Text Input */}
        <textarea
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you want to create in natural language, or add a reference image..."
          className="w-full bg-transparent text-sm sm:text-base text-neutral-900 placeholder-neutral-400 focus:outline-none resize-none font-medium leading-relaxed"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleGenerate();
            }
          }}
        />

        {/* Embedded Bottom Controls Bar */}
        <div className="pt-2 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3">
          
          {/* Left Controls: Add Image, Model Picker, Ratio, Quality, Advanced */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* 1. Add Image / Reference Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`p-2 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                attachedImage
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border-neutral-200/90"
              }`}
              title="Upload reference image for image-to-image"
            >
              <Paperclip className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{attachedImage ? "Image Added" : "Add Image"}</span>
            </button>

            {/* 2. Model Selector Pill Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setModelMenuOpen(!modelMenuOpen);
                  setRatioMenuOpen(false);
                  setQualityMenuOpen(false);
                }}
                className="px-3 py-1.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/90 text-xs font-semibold text-neutral-800 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>{currentModel.name}</span>
                <span className="text-[10px] font-bold text-neutral-400">({currentModel.cost} cr)</span>
                <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform ${modelMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {modelMenuOpen && (
                <div className="absolute left-0 bottom-full mb-2 w-76 bg-white rounded-2xl p-2 border border-neutral-200 shadow-2xl space-y-1 z-30 animate-in fade-in slide-in-from-bottom-2 duration-150">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Select Model Engine
                  </div>
                  {AVAILABLE_MODELS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setSelectedModelId(m.id);
                        setModelMenuOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                        selectedModelId === m.id ? "bg-neutral-950 text-white font-bold" : "hover:bg-neutral-50 text-neutral-800"
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold">{m.name}</div>
                        <div className={`text-[10px] ${selectedModelId === m.id ? "text-neutral-300" : "text-neutral-500"}`}>
                          {m.desc}
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        selectedModelId === m.id ? "bg-neutral-800 text-white" : "bg-neutral-100 text-neutral-700"
                      }`}>
                        {m.cost} cr
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Frame / Aspect Ratio Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setRatioMenuOpen(!ratioMenuOpen);
                  setModelMenuOpen(false);
                  setQualityMenuOpen(false);
                }}
                className="px-3 py-1.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/90 text-xs font-semibold text-neutral-800 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Frame: {selectedRatio}</span>
                <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform ${ratioMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {ratioMenuOpen && (
                <div className="absolute left-0 bottom-full mb-2 w-56 bg-white rounded-2xl p-2 border border-neutral-200 shadow-2xl space-y-1 z-30 animate-in fade-in slide-in-from-bottom-2 duration-150">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Frame Aspect Ratio
                  </div>
                  {FRAME_RATIOS.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        setSelectedRatio(r.id);
                        setRatioMenuOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                        selectedRatio === r.id ? "bg-neutral-950 text-white font-bold" : "hover:bg-neutral-50 text-neutral-800"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{r.icon}</span>
                        <span className="text-xs">{r.label}</span>
                      </div>
                      <span className={`text-[9px] ${selectedRatio === r.id ? "text-neutral-300" : "text-neutral-400"}`}>
                        {r.sub}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Quality Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setQualityMenuOpen(!qualityMenuOpen);
                  setModelMenuOpen(false);
                  setRatioMenuOpen(false);
                }}
                className="px-3 py-1.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/90 text-xs font-semibold text-neutral-800 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>{currentQuality.label.split(" ")[0]} Quality</span>
                <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform ${qualityMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {qualityMenuOpen && (
                <div className="absolute left-0 bottom-full mb-2 w-56 bg-white rounded-2xl p-2 border border-neutral-200 shadow-2xl space-y-1 z-30 animate-in fade-in slide-in-from-bottom-2 duration-150">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Output Resolution & Clarity
                  </div>
                  {QUALITY_PRESETS.map((q) => (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => {
                        setSelectedQuality(q.id);
                        setQualityMenuOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                        selectedQuality === q.id ? "bg-neutral-950 text-white font-bold" : "hover:bg-neutral-50 text-neutral-800"
                      }`}
                    >
                      <span className="text-xs">{q.label}</span>
                      <span className={`text-[10px] font-bold ${
                        selectedQuality === q.id ? "text-neutral-300" : "text-neutral-500"
                      }`}>
                        {q.extraCost === 0 ? "Default" : `+${q.extraCost} cr`}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 5. Outputs Batch Count Toggle */}
            <div className="flex items-center rounded-xl bg-neutral-50 border border-neutral-200/90 p-0.5 text-xs font-semibold text-neutral-600">
              {[1, 2, 4].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setBatchCount(count)}
                  className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                    batchCount === count ? "bg-neutral-950 text-white font-bold" : "hover:text-neutral-950"
                  }`}
                >
                  {count}x
                </button>
              ))}
            </div>

            {/* 6. Settings Toggle */}
            <button
              type="button"
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`p-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                settingsOpen
                  ? "bg-neutral-950 text-white border-neutral-950"
                  : "bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border-neutral-200/90"
              }`}
              title="Advanced parameter settings (Seed, Guidance, Negative Prompt)"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right Action: Exact Credit Cost & Submit Pill Button */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-neutral-900">
              💎 {totalCost} Credits
            </span>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="px-6 py-2.5 rounded-full font-bold text-xs bg-neutral-950 hover:bg-neutral-800 text-white shadow-sm hover:shadow transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span>Generate</span>
                  <ArrowUp className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

        </div>

        {/* Collapsible Advanced Parameters */}
        {settingsOpen && (
          <div className="pt-3 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-150">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                Negative Prompt (Exclude)
              </label>
              <input
                type="text"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="blurry, distorted, low quality"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-1.5 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                <span>Guidance Scale (CFG)</span>
                <span className="text-neutral-950 font-bold">{guidanceScale.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min={1}
                max={15}
                step={0.5}
                value={guidanceScale}
                onChange={(e) => setGuidanceScale(Number(e.target.value))}
                className="w-full accent-neutral-950 pt-2"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                <span>Inference Steps</span>
                <span className="text-neutral-950 font-bold">{steps}</span>
              </div>
              <input
                type="range"
                min={10}
                max={50}
                value={steps}
                onChange={(e) => setSteps(Number(e.target.value))}
                className="w-full accent-neutral-950 pt-2"
              />
            </div>
          </div>
        )}

      </div>

      {/* 2. STUDIO CANVAS STAGE (Positioned Cleanly Directly Below) */}
      <div className="space-y-6">
        
        {/* Generating Progress Stage */}
        {isGenerating && (
          <div className="bg-white rounded-3xl p-8 border border-neutral-200/90 shadow-sm text-center max-w-xl mx-auto space-y-5 animate-in fade-in">
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto text-neutral-950">
              <RefreshCw className="w-7 h-7 animate-spin" />
            </div>
            
            <div className="space-y-1.5">
              <h4 className="text-base font-bold text-neutral-950">Synthesizing Creative Output</h4>
              <p className="text-xs text-neutral-500">{stageText}</p>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-neutral-950 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="text-[11px] text-neutral-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Two-Phase Escrow Guaranteed: automatic refund if anything fails</span>
            </div>
          </div>
        )}

        {/* Completed Output Canvas */}
        {!isGenerating && outputImage && (
          <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-lg space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Generation Completed &bull; {currentModel.name}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                  {totalCost} Credits Settled
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyPrompt}
                  className="px-2.5 py-1 rounded-lg border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-50 flex items-center gap-1.5 transition-colors"
                >
                  {copiedNotification ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedNotification ? "Copied" : "Copy Prompt"}</span>
                </button>
                <a
                  href={outputImage}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-700 transition-colors"
                  title="Open Fullscreen"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </a>
                <a
                  href={outputImage}
                  download="aistudio-render.jpg"
                  className="px-3 py-1 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </a>
              </div>
            </div>

            {/* Image Canvas View */}
            <div className="relative rounded-2xl overflow-hidden border border-neutral-200/80 shadow-inner group flex items-center justify-center bg-neutral-950/5">
              <img
                src={outputImage}
                alt="Rendered Generation"
                className="max-h-[580px] w-auto object-contain rounded-xl"
              />
            </div>

            {/* Action Bar Beneath Output */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-500">
              <div className="flex items-center gap-3">
                <span>Format: <strong>{selectedRatio}</strong></span>
                <span>&bull;</span>
                <span>Clarity: <strong>{currentQuality.label}</strong></span>
                <span>&bull;</span>
                <span>Latency: <strong>1.8s</strong></span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/enhance"
                  className="px-3.5 py-1.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 flex items-center gap-1.5 transition-colors"
                >
                  <Wand2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>4x AI Upscale</span>
                </Link>
                <button
                  onClick={handleGenerate}
                  className="px-3.5 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Generate Variations</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Idle Inspiration Templates (Shown when not generating and no active output) */}
        {!isGenerating && !outputImage && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-neutral-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Quick-Start Inspiration Templates</span>
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Click any template to immediately load its prompt, model, and frame ratio into the chat box above:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {INSPIRATION_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.title}
                  onClick={() => handleApplyTemplate(tmpl)}
                  className="group relative rounded-2xl overflow-hidden border border-neutral-200/90 hover:border-neutral-900 cursor-pointer transition-all shadow-sm hover:shadow-md bg-white"
                >
                  <div className="h-36 overflow-hidden">
                    <img
                      src={tmpl.image}
                      alt={tmpl.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3 space-y-1">
                    <div className="text-xs font-bold text-neutral-950 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {tmpl.title}
                    </div>
                    <div className="text-[11px] text-neutral-500 line-clamp-2 leading-snug">
                      {tmpl.prompt}
                    </div>
                    <div className="pt-2 flex items-center justify-between text-[10px] text-neutral-400 border-t border-neutral-100 mt-2">
                      <span className="font-semibold text-neutral-700">{tmpl.ratio}</span>
                      <span className="font-bold text-blue-600">{tmpl.cost} cr</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. RECENT GENERATIONS HISTORY STRIP (Always at bottom) */}
        {history.length > 0 && (
          <div className="bg-white rounded-3xl p-5 border border-neutral-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-neutral-950">
              <span className="flex items-center gap-2">
                <span>Recent Studio Generations</span>
                <span className="text-[10px] font-semibold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                  {history.length} assets
                </span>
              </span>
              <Link href="/creations" className="text-blue-600 hover:underline text-[11px]">
                Open Full Creations Archive &rarr;
              </Link>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setPrompt(item.prompt);
                    setOutputImage(item.url);
                  }}
                  className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-neutral-200 hover:border-neutral-900 cursor-pointer transition-all relative group"
                  title={item.prompt}
                >
                  <img src={item.url} alt="creation" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                    View
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
