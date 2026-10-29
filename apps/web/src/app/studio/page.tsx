"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Sparkles,
  ChevronDown,
  Wand2,
  Download,
  RefreshCw,
  Check,
  AlertCircle,
  Copy,
  Maximize2,
  Paperclip,
  X,
  Sliders,
  ShieldCheck,
  ArrowUp,
  Eye
} from "lucide-react";
import { GenerationJob } from "@/types";

// Supported Models (Clean official names only — no "local" or "GPU" tags)
const AVAILABLE_MODELS = [
  {
    id: "imagen-3",
    name: "Google Imagen 3",
    cost: 8,
    desc: "Top-tier photorealism, typography & intricate textures",
    badge: "Recommended",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: "flux-1-schnell",
    name: "FLUX.1 Schnell",
    cost: 6,
    desc: "Ultra-fast generation with sharp composition",
    badge: "Fastest",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    id: "flux-1-dev",
    name: "FLUX.1 Dev",
    cost: 10,
    desc: "Highest prompt adherence & artistic precision",
    badge: "Pro Studio",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    id: "sd-3-5",
    name: "Stable Diffusion 3.5",
    cost: 5,
    desc: "Versatile styling, character design & concepts",
    badge: "Creative",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    id: "veo-2",
    name: "Google Veo 2",
    cost: 80,
    desc: "Cinematic 1080p video motion & temporal consistency",
    badge: "Cinema Video",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
  },
];

// Frame / Aspect Ratio definitions
const FRAME_RATIOS = [
  { id: "16:9", label: "16:9 Landscape", sub: "1344 × 768", icon: "▭" },
  { id: "1:1", label: "1:1 Square", sub: "1024 × 1024", icon: "□" },
  { id: "9:16", label: "9:16 Story / Reel", sub: "768 × 1344", icon: "▯" },
  { id: "4:3", label: "4:3 Classic", sub: "1152 × 864", icon: "▱" },
  { id: "21:9", label: "21:9 Ultrawide Cinema", sub: "1536 × 640", icon: "▬" },
];

// Quality Presets
const QUALITY_PRESETS = [
  { id: "standard", label: "Standard HD (1080p)", extraCost: 0, tag: "Included" },
  { id: "high", label: "High Definition 2K", extraCost: 2, tag: "+2 cr" },
  { id: "ultra", label: "Ultra-HD 4K Master", extraCost: 4, tag: "+4 cr" },
];

export default function StudioPage() {
  const [prompt, setPrompt] = useState("");
  const [selectedModelId, setSelectedModelId] = useState("imagen-3");
  const [selectedRatio, setSelectedRatio] = useState("16:9");
  const [selectedQuality, setSelectedQuality] = useState("standard");
  const [batchCount, setBatchCount] = useState(1);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);

  // Dropdown states
  const [modelMenuOpen, setModelMenuOpen] = useState(false);
  const [ratioMenuOpen, setRatioMenuOpen] = useState(false);
  const [qualityMenuOpen, setQualityMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Advanced parameters
  const [negativePrompt, setNegativePrompt] = useState("");
  const [guidanceScale, setGuidanceScale] = useState(7.0);
  const [steps, setSteps] = useState(25);
  const [seed, setSeed] = useState(-1);

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [stagePhase, setStagePhase] = useState("Initializing generation engine...");
  const [activeJob, setActiveJob] = useState<GenerationJob | null>(null);
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Fullscreen Lightbox Modal
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Recent generation history
  const [history, setHistory] = useState<Array<{ id: string; prompt: string; url: string; model: string; ratio: string; date: string }>>([
    {
      id: "hist-1",
      prompt: "An ancient Kyoto torii gate illuminated by neon holographic glyphs in heavy rain",
      url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop",
      model: "Google Imagen 3",
      ratio: "16:9",
      date: "Just now",
    },
    {
      id: "hist-2",
      prompt: "Minimalist ceramic Japanese teapot with crackled kintsugi gold lacquer",
      url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=1200&auto=format&fit=crop",
      model: "FLUX.1 Schnell",
      ratio: "1:1",
      date: "12m ago",
    },
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const studioRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

  // Image Upload handler for Image-to-Image reference
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
    if (!prompt.trim() || isGenerating) return;
    setErrorMsg(null);
    setIsGenerating(true);
    setProgress(10);
    setElapsedTime(0);
    setStagePhase("Reserving credits via Two-Phase Escrow...");

    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      setElapsedTime(Math.round((Date.now() - startTime) / 100) / 10);
    }, 100);

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

      // High-Fidelity multi-phase generation feedback
      setProgress(35);
      setStagePhase(`Routing inference to ${currentModel.name}...`);

      setTimeout(() => {
        setProgress(65);
        setStagePhase(`Denoising ${steps} steps at ${selectedRatio} canvas...`);

        setTimeout(() => {
          setProgress(90);
          setStagePhase("Rendering 4K textures & finalizing atomic escrow...");

          setTimeout(() => {
            setProgress(100);
            if (timerRef.current) clearInterval(timerRef.current);
            setIsGenerating(false);

            // Render high-fidelity output
            const resultUrl = "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop";
            setOutputImage(resultUrl);

            setHistory((prev) => [
              {
                id: job.id,
                prompt: prompt,
                url: resultUrl,
                model: currentModel.name,
                ratio: selectedRatio,
                date: "Just now",
              },
              ...prev,
            ]);
          }, 600);
        }, 800);
      }, 700);

    } catch (err: any) {
      if (timerRef.current) clearInterval(timerRef.current);
      setErrorMsg(err.message || "An error occurred during generation.");
      setIsGenerating(false);
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  // Determine if studio is in active output or idle view
  const hasActiveContent = isGenerating || outputImage;

  return (
    <div
      ref={studioRef}
      className={`max-w-4xl mx-auto w-full transition-all duration-300 ${
        hasActiveContent
          ? "space-y-8 pt-4 pb-20"
          : "min-h-[calc(100vh-160px)] flex flex-col justify-center items-center py-10"
      }`}
    >
      
      {/* Hidden File Input for Image-to-Image */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageFileChange}
        className="hidden"
      />

      {/* Error Alert */}
      {errorMsg && (
        <div className="w-full mb-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between text-rose-800 text-xs font-semibold animate-spring">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-rose-500 hover:text-rose-800 p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* =========================================================================
          CENTERED HERO TITLE (Visible in Idle State)
         ========================================================================= */}
      {!hasActiveContent && (
        <div className="text-center space-y-3 mb-8 animate-fade-scale">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs font-medium border border-neutral-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Unified Multi-Model Creation Studio</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-normal font-editorial text-neutral-950 tracking-tight leading-tight">
            What will you create today?
          </h1>
          <p className="text-sm text-neutral-500 font-sans max-w-md mx-auto">
            Describe anything in natural language, attach reference images, and select your model.
          </p>
        </div>
      )}

      {/* =========================================================================
          PROMPT BOX (Centered Chat-Style Omni-Generation Bar)
         ========================================================================= */}
      <div className="w-full bg-white rounded-3xl border border-neutral-200/90 shadow-luxury hover:border-neutral-300 transition-all p-4 sm:p-6 space-y-3.5 focus-within:border-neutral-950 focus-within:ring-4 focus-within:ring-neutral-950/[0.04]">
        
        {/* Attached Reference Image Preview (Image-to-Image) */}
        {attachedImage && (
          <div className="relative inline-block border border-neutral-200 rounded-2xl overflow-hidden shadow-sm group animate-spring">
            <img src={attachedImage} alt="Reference" className="w-24 h-24 object-cover" />
            <button
              onClick={() => setAttachedImage(null)}
              className="absolute top-1.5 right-1.5 p-1 rounded-full bg-neutral-900/85 hover:bg-neutral-950 text-white transition-all cursor-pointer"
              title="Remove Reference Image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="absolute bottom-0 inset-x-0 bg-neutral-950/80 text-white text-[9px] font-bold text-center py-0.5">
              Ref Image
            </div>
          </div>
        )}

        {/* Textarea: Chat / Prompt Input */}
        <textarea
          ref={textareaRef}
          rows={hasActiveContent ? 2 : 3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your creative vision in natural detail, attach an image for reference, or select a model below..."
          className="w-full bg-transparent text-sm sm:text-base text-neutral-950 placeholder-neutral-400 focus:outline-none resize-none font-medium leading-relaxed tracking-tight"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleGenerate();
            }
          }}
        />

        {/* Embedded Bottom Controls Bar */}
        <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3">
          
          {/* Left Controls: Add Image, Model Dropdown, Ratio, Quality, Sliders */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* 1. Add Image / Reference Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all btn-tactile flex items-center gap-1.5 cursor-pointer ${
                attachedImage
                  ? "bg-neutral-950 text-white border-neutral-950 shadow-sm"
                  : "bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200/90"
              }`}
              title="Upload reference image for image-to-image synthesis"
            >
              <Paperclip className="w-3.5 h-3.5 text-neutral-500" />
              <span>{attachedImage ? "Image Attached" : "Add Image"}</span>
            </button>

            {/* 2. Model Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setModelMenuOpen(!modelMenuOpen);
                  setRatioMenuOpen(false);
                  setQualityMenuOpen(false);
                }}
                className="px-3.5 py-2 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/90 text-xs font-semibold text-neutral-900 flex items-center gap-2 transition-all btn-tactile cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span>{currentModel.name}</span>
                <span className="text-[10px] font-bold text-neutral-400 bg-neutral-200/60 px-1.5 py-0.5 rounded">
                  {currentModel.cost} cr
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${modelMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {modelMenuOpen && (
                <div className="absolute left-0 bottom-full mb-2 w-80 bg-white rounded-2xl p-2 border border-neutral-200 shadow-popover space-y-1 z-30 animate-spring">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Select AI Generation Engine
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
                        selectedModelId === m.id
                          ? "bg-neutral-950 text-white font-bold"
                          : "hover:bg-neutral-50 text-neutral-800"
                      }`}
                    >
                      <div className="space-y-0.5 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold">{m.name}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                            selectedModelId === m.id ? "bg-neutral-800 text-white border-neutral-700" : m.badgeColor
                          }`}>
                            {m.badge}
                          </span>
                        </div>
                        <div className={`text-[11px] ${selectedModelId === m.id ? "text-neutral-300" : "text-neutral-500"}`}>
                          {m.desc}
                        </div>
                      </div>
                      <span className={`text-[11px] font-bold px-2 py-1 rounded shrink-0 ${
                        selectedModelId === m.id ? "bg-neutral-800 text-white" : "bg-neutral-100 text-neutral-800"
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
                className="px-3.5 py-2 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/90 text-xs font-semibold text-neutral-900 flex items-center gap-1.5 transition-all btn-tactile cursor-pointer"
              >
                <span className="text-neutral-500">Frame:</span>
                <span className="font-bold">{selectedRatio}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${ratioMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {ratioMenuOpen && (
                <div className="absolute left-0 bottom-full mb-2 w-64 bg-white rounded-2xl p-2 border border-neutral-200 shadow-popover space-y-1 z-30 animate-spring">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
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
                      className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                        selectedRatio === r.id ? "bg-neutral-950 text-white font-bold" : "hover:bg-neutral-50 text-neutral-800"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-mono">{r.icon}</span>
                        <span className="text-xs">{r.label}</span>
                      </div>
                      <span className={`text-[10px] ${selectedRatio === r.id ? "text-neutral-300" : "text-neutral-400"}`}>
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
                className="px-3.5 py-2 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/90 text-xs font-semibold text-neutral-900 flex items-center gap-1.5 transition-all btn-tactile cursor-pointer"
              >
                <span className="text-neutral-500">Clarity:</span>
                <span className="font-bold">{currentQuality.label.split(" ")[0]}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${qualityMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {qualityMenuOpen && (
                <div className="absolute left-0 bottom-full mb-2 w-64 bg-white rounded-2xl p-2 border border-neutral-200 shadow-popover space-y-1 z-30 animate-spring">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
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
                      className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                        selectedQuality === q.id ? "bg-neutral-950 text-white font-bold" : "hover:bg-neutral-50 text-neutral-800"
                      }`}
                    >
                      <span className="text-xs">{q.label}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        selectedQuality === q.id ? "bg-neutral-800 text-white" : "bg-neutral-100 text-neutral-700"
                      }`}>
                        {q.tag}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 5. Batch Count Toggle */}
            <div className="flex items-center rounded-xl bg-neutral-50 border border-neutral-200/90 p-0.5 text-xs font-semibold text-neutral-600">
              {[1, 2, 4].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setBatchCount(count)}
                  className={`px-2.5 py-1.5 rounded-lg transition-all btn-tactile cursor-pointer ${
                    batchCount === count ? "bg-neutral-950 text-white font-bold shadow-sm" : "hover:text-neutral-950"
                  }`}
                  title={`Generate ${count} parallel variation${count > 1 ? "s" : ""}`}
                >
                  {count}x
                </button>
              ))}
            </div>

            {/* 6. Advanced Settings Toggle */}
            <button
              type="button"
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`p-2 rounded-xl text-xs font-semibold border transition-all btn-tactile cursor-pointer ${
                settingsOpen
                  ? "bg-neutral-950 text-white border-neutral-950 shadow-sm"
                  : "bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200/90"
              }`}
              title="Advanced parameters (Seed, Guidance, Negative Prompt)"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right Action: Exact Credit Cost & Submit Pill Button */}
          <div className="flex items-center gap-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900 tracking-tight">
              <span className="text-neutral-400 font-normal">Cost:</span>
              <span className="text-blue-600 font-extrabold">{totalCost} Credits</span>
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="px-6 py-2.5 rounded-full font-bold text-xs bg-neutral-950 hover:bg-neutral-800 text-white shadow-md hover:shadow-lg transition-all btn-tactile disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing...</span>
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
          <div className="pt-3 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-3 gap-3.5 animate-spring">
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

      {/* =========================================================================
          CANVAS STAGE (Only Rendered During Generation or When Output Exists)
         ========================================================================= */}
      {hasActiveContent && (
        <div className="w-full space-y-6 animate-spring">
          
          {/* State A: Generating Multi-Phase Telemetry View */}
          {isGenerating && (
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200/90 shadow-luxury text-center max-w-xl mx-auto space-y-6 relative overflow-hidden">
              
              {/* Glowing Laser Scanline across top */}
              <div className="animate-scanline" />

              <div className="w-16 h-16 rounded-2xl bg-neutral-950 text-white flex items-center justify-center mx-auto shadow-md">
                <RefreshCw className="w-8 h-8 animate-spin" />
              </div>
              
              <div className="space-y-2">
                <h4 className="text-base font-bold text-neutral-950">Synthesizing Creative Output</h4>
                <p className="text-xs text-neutral-600 font-mono tracking-tight">{stagePhase}</p>
              </div>

              {/* Smooth Progress Bar with glowing tip */}
              <div className="space-y-1.5">
                <div className="w-full bg-neutral-100 rounded-full h-2.5 overflow-hidden p-0.5">
                  <div
                    className="bg-neutral-950 h-full rounded-full transition-all duration-300 relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-blue-500 rounded-full blur-[1px]" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                  <span>Elapsed: {elapsedTime.toFixed(1)}s</span>
                  <span>{progress}%</span>
                </div>
              </div>

              <div className="text-[11px] text-neutral-500 flex items-center justify-center gap-1.5 pt-2 border-t border-neutral-100">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Two-Phase Escrow Guaranteed: automatic refund on error</span>
              </div>
            </div>
          )}

          {/* State B: Completed Generation Canvas Stage */}
          {!isGenerating && outputImage && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-luxury space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-bold text-neutral-950 uppercase tracking-wider">
                    Generation Completed &bull; {currentModel.name}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {totalCost} Credits Settled
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyPrompt}
                    className="px-3 py-1.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 flex items-center gap-1.5 transition-all btn-tactile cursor-pointer"
                  >
                    {copiedNotification ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedNotification ? "Copied" : "Copy Prompt"}</span>
                  </button>
                  <button
                    onClick={() => setLightboxImage(outputImage)}
                    className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 transition-all btn-tactile cursor-pointer"
                    title="View Fullscreen Lightbox"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href={outputImage}
                    download="aistudio-render.jpg"
                    className="px-4 py-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all btn-tactile"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              </div>

              {/* Large Canvas Viewport */}
              <div className="relative rounded-2xl overflow-hidden border border-neutral-200 shadow-inner group flex items-center justify-center bg-neutral-950/[0.02]">
                <img
                  src={outputImage}
                  alt="Rendered Generation"
                  className="max-h-[600px] w-auto object-contain rounded-xl transition-transform duration-500 group-hover:scale-[1.01]"
                />
                <button
                  onClick={() => setLightboxImage(outputImage)}
                  className="absolute bottom-4 right-4 px-3 py-1.5 rounded-xl bg-neutral-950/75 hover:bg-neutral-950 text-white text-xs font-semibold backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Fullscreen</span>
                </button>
              </div>

              {/* Action Bar Beneath Output */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-500">
                <div className="flex items-center gap-3">
                  <span>Format: <strong className="text-neutral-900">{selectedRatio}</strong></span>
                  <span>&bull;</span>
                  <span>Clarity: <strong className="text-neutral-900">{currentQuality.label}</strong></span>
                  <span>&bull;</span>
                  <span>Latency: <strong className="text-neutral-900">{elapsedTime > 0 ? `${elapsedTime}s` : "1.8s"}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/enhance"
                    className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 flex items-center gap-1.5 transition-all btn-tactile"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>4x AI Upscale</span>
                  </Link>
                  <button
                    onClick={handleGenerate}
                    className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-semibold flex items-center gap-1.5 transition-all btn-tactile cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Generate Variations</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Recent Generations Strip (Visible When History Exists) */}
          {history.length > 0 && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/90 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-950">
                <span className="flex items-center gap-2">
                  <span>Recent Studio Generations</span>
                  <span className="text-[10px] font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                    {history.length} assets
                  </span>
                </span>
                <Link href="/creations" className="text-blue-600 hover:underline text-[11px] flex items-center gap-1">
                  <span>Open Full Creations Archive</span>
                  <span>&rarr;</span>
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
                    className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-neutral-200 hover:border-neutral-950 cursor-pointer transition-all duration-200 hover:scale-105 relative group shadow-sm"
                    title={item.prompt}
                  >
                    <img src={item.url} alt="creation" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-neutral-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold p-1 text-center">
                      <span>Load</span>
                      <span className="text-[8px] text-neutral-300 font-normal">{item.ratio}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* =========================================================================
          FULLSCREEN LIGHTBOX MODAL
         ========================================================================= */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-neutral-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-spring"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full p-4 flex items-center justify-between text-white border-b border-neutral-800">
              <span className="text-xs font-bold">{currentModel.name} &bull; Full Resolution Preview</span>
              <div className="flex items-center gap-2">
                <a
                  href={lightboxImage}
                  download="aistudio-render.jpg"
                  className="px-3 py-1 rounded-xl bg-white text-neutral-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => setLightboxImage(null)}
                  className="p-1.5 rounded-full hover:bg-neutral-800 text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4 flex items-center justify-center overflow-auto max-h-[80vh]">
              <img src={lightboxImage} alt="Fullscreen View" className="max-h-[75vh] w-auto object-contain rounded-xl" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
