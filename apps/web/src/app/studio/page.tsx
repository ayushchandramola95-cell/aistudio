"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
  Eye,
  Dice5,
  Lock,
  Unlock,
  Plus,
  ImageIcon,
  Star,
  RotateCcw,
} from "lucide-react";
import { GenerationJob } from "@/types";

// ─── Models ────────────────────────────────────────────────────────────────
const AVAILABLE_MODELS = [
  {
    id: "imagen-3",
    name: "Google Imagen 3",
    cost: 8,
    desc: "Top-tier photorealism, typography & intricate textures",
    badge: "Recommended",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    dotColor: "bg-blue-500",
  },
  {
    id: "flux-1-schnell",
    name: "FLUX.1 Schnell",
    cost: 6,
    desc: "Ultra-fast generation with sharp composition",
    badge: "Fastest",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotColor: "bg-emerald-500",
  },
  {
    id: "flux-1-dev",
    name: "FLUX.1 Dev",
    cost: 10,
    desc: "Highest prompt adherence & artistic precision",
    badge: "Pro Studio",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    dotColor: "bg-purple-500",
  },
  {
    id: "sd-3-5",
    name: "Stable Diffusion 3.5",
    cost: 5,
    desc: "Versatile styling, character design & concepts",
    badge: "Creative",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    dotColor: "bg-amber-500",
  },
  {
    id: "gemini-2-flash",
    name: "Gemini 2.0 Flash",
    cost: 7,
    desc: "Multimodal understanding with native image generation",
    badge: "Multimodal",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    dotColor: "bg-indigo-500",
  },
];

// ─── Frame Ratios ───────────────────────────────────────────────────────────
const FRAME_RATIOS = [
  { id: "16:9",  label: "Landscape",         sub: "1344 × 768",  icon: "▭", desc: "YouTube, Presentation" },
  { id: "1:1",   label: "Square",            sub: "1024 × 1024", icon: "□", desc: "Instagram Post, Profile" },
  { id: "9:16",  label: "Story / Reel",      sub: "768 × 1344",  icon: "▯", desc: "TikTok, Instagram Reel" },
  { id: "4:3",   label: "Classic",           sub: "1152 × 864",  icon: "▱", desc: "Print, Presentation" },
  { id: "21:9",  label: "Ultrawide Cinema",  sub: "1536 × 640",  icon: "▬", desc: "Film, Wallpaper" },
];

// ─── Quality Presets ────────────────────────────────────────────────────────
const QUALITY_PRESETS = [
  { id: "standard", label: "Standard HD",  res: "1080p",  extraCost: 0, tag: "Included" },
  { id: "high",     label: "High 2K",      res: "1440p",  extraCost: 2, tag: "+2 cr" },
  { id: "ultra",    label: "Ultra 4K",     res: "4K",     extraCost: 4, tag: "+4 cr" },
];

// ─── Prompt Suggestions ─────────────────────────────────────────────────────
const PROMPT_SUGGESTIONS = [
  "A misty Japanese torii gate reflected in still water at dawn, cinematic light, 8K",
  "Minimalist ceramic teapot with kintsugi gold cracks on weathered oak, studio lighting",
  "Futuristic city skyline at night with neon-lit rain and flying vehicles, film noir",
  "Macro photograph of a dew-covered spider web in an enchanted forest, golden hour",
  "Elegant editorial fashion portrait in a modernist architectural setting, soft shadows",
  "Surreal floating islands with waterfalls above a calm ocean, fantasy concept art",
  "Abstract fluid art with electric blue and rose gold gradients, 4K glossy texture",
  "A lone wolf on a snowy mountain peak under the northern lights, dramatic sky",
];

// ─── Style Chips ────────────────────────────────────────────────────────────
const STYLE_CHIPS = [
  { label: "Photorealistic", suffix: ", photorealistic, DSLR quality, 8K" },
  { label: "Cinematic",      suffix: ", cinematic lighting, film grain, anamorphic lens" },
  { label: "Anime",          suffix: ", anime art style, detailed illustration, vibrant" },
  { label: "3D Render",      suffix: ", 3D render, Octane, subsurface scattering, 4K" },
  { label: "Watercolor",     suffix: ", watercolor painting, soft edges, artistic" },
  { label: "Oil Painting",   suffix: ", oil painting, textured brushstrokes, classic art" },
];

export default function StudioPage() {
  const [prompt, setPrompt]             = useState("");
  const [selectedModelId, setSelectedModelId] = useState("imagen-3");
  const [selectedRatio, setSelectedRatio]     = useState("16:9");
  const [selectedQuality, setSelectedQuality] = useState("standard");
  const [batchCount, setBatchCount]           = useState(1);
  const [attachedImage, setAttachedImage]     = useState<string | null>(null);
  const [seedLocked, setSeedLocked]           = useState(false);

  // Dropdown states
  const [modelMenuOpen, setModelMenuOpen]     = useState(false);
  const [ratioMenuOpen, setRatioMenuOpen]     = useState(false);
  const [qualityMenuOpen, setQualityMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen]       = useState(false);

  // Advanced params
  const [negativePrompt, setNegativePrompt]   = useState("");
  const [guidanceScale, setGuidanceScale]     = useState(7.0);
  const [steps, setSteps]                     = useState(25);
  const [seed, setSeed]                       = useState(-1);

  // Generation
  const [isGenerating, setIsGenerating]       = useState(false);
  const [progress, setProgress]               = useState(0);
  const [elapsedTime, setElapsedTime]         = useState(0);
  const [stagePhase, setStagePhase]           = useState("Initializing...");
  const [activeJob, setActiveJob]             = useState<GenerationJob | null>(null);
  const [outputImage, setOutputImage]         = useState<string | null>(null);
  const [errorMsg, setErrorMsg]               = useState<string | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [showSuccess, setShowSuccess]         = useState(false);

  // Lightbox
  const [lightboxImage, setLightboxImage]     = useState<string | null>(null);

  // Animated placeholder
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState("");
  const [isTyping, setIsTyping]               = useState(true);
  const typingRef                             = useRef<NodeJS.Timeout | null>(null);

  // History
  const [history, setHistory] = useState<Array<{
    id: string; prompt: string; url: string; model: string; ratio: string; date: string;
  }>>([
    {
      id: "hist-1",
      prompt: "An ancient Kyoto torii gate illuminated by neon holographic glyphs in heavy rain",
      url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=600&auto=format&fit=crop",
      model: "Google Imagen 3",
      ratio: "16:9",
      date: "12m ago",
    },
    {
      id: "hist-2",
      prompt: "Minimalist ceramic teapot with crackled kintsugi gold lacquer on weathered oak",
      url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop",
      model: "FLUX.1 Schnell",
      ratio: "1:1",
      date: "1h ago",
    },
    {
      id: "hist-3",
      prompt: "Surreal floating islands above an ocean, fantasy concept art, cinematic",
      url: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?q=80&w=600&auto=format&fit=crop",
      model: "FLUX.1 Dev",
      ratio: "16:9",
      date: "3h ago",
    },
  ]);

  const fileInputRef  = useRef<HTMLInputElement>(null);
  const studioRef     = useRef<HTMLDivElement>(null);
  const textareaRef   = useRef<HTMLTextAreaElement>(null);
  const timerRef      = useRef<NodeJS.Timeout | null>(null);

  // ─── Animated typewriter placeholder ──────────────────────────────────────
  useEffect(() => {
    if (prompt) return; // don't animate when user typed something
    const target = PROMPT_SUGGESTIONS[placeholderIndex];
    let i = 0;
    setIsTyping(true);
    setDisplayedPlaceholder("");

    const type = () => {
      if (i <= target.length) {
        setDisplayedPlaceholder(target.slice(0, i));
        i++;
        typingRef.current = setTimeout(type, 28);
      } else {
        setIsTyping(false);
        // pause then erase then move to next
        typingRef.current = setTimeout(() => {
          const erase = () => {
            if (i > 0) {
              i--;
              setDisplayedPlaceholder(target.slice(0, i));
              typingRef.current = setTimeout(erase, 14);
            } else {
              setPlaceholderIndex((prev) => (prev + 1) % PROMPT_SUGGESTIONS.length);
            }
          };
          erase();
        }, 2800);
      }
    };
    typingRef.current = setTimeout(type, 300);
    return () => { if (typingRef.current) clearTimeout(typingRef.current); };
  }, [placeholderIndex, prompt]);

  // ─── Close dropdowns on outside click ────────────────────────────────────
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

  // ─── Auto-clear error after 6s ───────────────────────────────────────────
  useEffect(() => {
    if (errorMsg) {
      const t = setTimeout(() => setErrorMsg(null), 6000);
      return () => clearTimeout(t);
    }
  }, [errorMsg]);

  // ─── Computed values ───────────────────────────────────────────────────────
  const currentModel   = AVAILABLE_MODELS.find((m) => m.id === selectedModelId) || AVAILABLE_MODELS[0];
  const currentQuality = QUALITY_PRESETS.find((q) => q.id === selectedQuality) || QUALITY_PRESETS[0];
  const currentRatio   = FRAME_RATIOS.find((r) => r.id === selectedRatio) || FRAME_RATIOS[0];
  const totalCost      = (currentModel.cost + currentQuality.extraCost) * batchCount;
  const charCount      = prompt.length;

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAttachedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSurpriseMe = () => {
    const random = PROMPT_SUGGESTIONS[Math.floor(Math.random() * PROMPT_SUGGESTIONS.length)];
    setPrompt(random);
    textareaRef.current?.focus();
  };

  const handleStyleChip = (suffix: string) => {
    if (!prompt.trim()) return;
    // remove existing style suffix first
    const base = prompt.replace(/, (photorealistic|cinematic|anime|3D render|watercolor|oil painting)[^,]*/gi, "").trim();
    setPrompt(base + suffix);
  };

  const handleNewSeed = () => {
    setSeed(Math.floor(Math.random() * 999999));
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setErrorMsg(null);
    setIsGenerating(true);
    setProgress(10);
    setElapsedTime(0);
    setOutputImage(null);
    setShowSuccess(false);
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
            seed: seedLocked && seed !== -1 ? seed : undefined,
          },
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to trigger generation.");
      }

      const job: GenerationJob = await res.json();
      setActiveJob(job);

      setProgress(35);
      setStagePhase(`Routing to ${currentModel.name}...`);

      setTimeout(() => {
        setProgress(65);
        setStagePhase(`Denoising ${steps} steps at ${selectedRatio}...`);

        setTimeout(() => {
          setProgress(90);
          setStagePhase("Rendering final textures & settling escrow...");

          setTimeout(() => {
            setProgress(100);
            if (timerRef.current) clearInterval(timerRef.current);
            setIsGenerating(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);

            const resultUrl =
              "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1400&auto=format&fit=crop";
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
              ...prev.slice(0, 7),
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

  const handleReset = () => {
    setOutputImage(null);
    setPrompt("");
    setActiveJob(null);
    setProgress(0);
    setElapsedTime(0);
  };

  const hasActiveContent = isGenerating || outputImage;

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      ref={studioRef}
      className={`w-full max-w-4xl mx-auto transition-all duration-500 ${
        hasActiveContent
          ? "space-y-6 pt-4 pb-24"
          : "min-h-[calc(100vh-160px)] flex flex-col justify-center items-center py-10"
      }`}
    >
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageFileChange}
        className="hidden"
      />

      {/* ── Error Banner ──────────────────────────────────────────────────── */}
      {errorMsg && (
        <div className="w-full mb-2 px-4 py-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between text-rose-800 text-xs font-semibold animate-spring">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-rose-400 hover:text-rose-700 cursor-pointer p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Success Flash ─────────────────────────────────────────────────── */}
      {showSuccess && (
        <div className="w-full mb-2 px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-800 text-xs font-semibold animate-spring">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Generation complete — your image is ready below!</span>
        </div>
      )}

      {/* ── Idle Hero ─────────────────────────────────────────────────────── */}
      {!hasActiveContent && (
        <div className="text-center space-y-4 mb-6 animate-fade-scale">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-600 text-xs font-medium border border-neutral-200 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Multi-Model Image Generation Studio</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal font-editorial text-neutral-950 tracking-tight leading-tight">
            What will you create?
          </h1>
          <p className="text-sm text-neutral-400 font-sans max-w-sm mx-auto">
            Describe your vision, pick a model, generate.
          </p>
        </div>
      )}

      {/* ── Prompt Box — Fotor-style layout ──────────────────────────────── */}
      <div
        className={`w-full bg-white rounded-2xl border transition-all duration-300
          border-neutral-200 shadow-[0_2px_24px_0_rgba(0,0,0,0.06)]
          hover:border-neutral-300
          focus-within:border-neutral-400 focus-within:shadow-[0_0_0_3px_rgba(0,0,0,0.05),0_2px_24px_0_rgba(0,0,0,0.08)]`}
      >
        {/* ── Top area: image drop zone + textarea side by side ── */}
        <div className="flex items-stretch gap-0 p-4 pb-3">

          {/* Left: Image drop zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`shrink-0 w-[88px] h-[88px] rounded-xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center transition-all group mr-4 ${
              attachedImage
                ? "border-neutral-300 bg-neutral-50"
                : "border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50"
            }`}
            title="Drop or click to add reference image"
          >
            {attachedImage ? (
              <div className="relative w-full h-full rounded-[10px] overflow-hidden">
                <img src={attachedImage} alt="Reference" className="w-full h-full object-cover" />
                <button
                  onClick={(e) => { e.stopPropagation(); setAttachedImage(null); }}
                  className="absolute top-1 right-1 p-0.5 rounded-full bg-neutral-900/80 text-white hover:bg-neutral-950 transition-all cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="absolute bottom-0 inset-x-0 bg-neutral-950/70 text-white text-[8px] font-bold text-center py-0.5 tracking-wide">
                  REF
                </div>
              </div>
            ) : (
              <>
                <div className="w-9 h-10 mb-1 opacity-25 group-hover:opacity-40 transition-opacity">
                  {/* Document-with-image icon */}
                  <svg viewBox="0 0 36 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="1" width="26" height="34" rx="3" stroke="#555" strokeWidth="2" fill="#F5F5F5"/>
                    <rect x="6" y="8" width="18" height="14" rx="2" fill="#D4D4D4"/>
                    <path d="M6 18l5-5 4 4 3-3 6 6H6z" fill="#A3A3A3"/>
                    <circle cx="14" cy="13" r="2" fill="#A3A3A3"/>
                    <rect x="6" y="26" width="12" height="2" rx="1" fill="#D4D4D4"/>
                  </svg>
                </div>
                <span className="text-[10px] text-neutral-400 font-medium text-center leading-tight px-1">
                  Add image
                </span>
              </>
            )}
          </div>

          {/* Right: Textarea */}
          <div className="flex-1 relative flex flex-col justify-center">
            <textarea
              ref={textareaRef}
              rows={hasActiveContent ? 2 : 3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={prompt ? "" : displayedPlaceholder || "Describe the image you want to generate, or drop your reference images"}
              className="w-full bg-transparent text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none resize-none font-normal leading-relaxed"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
            />
          </div>
        </div>

        {/* ── Style Chips (idle only) ── */}
        {!hasActiveContent && (
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {STYLE_CHIPS.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => handleStyleChip(chip.suffix)}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800 hover:border-neutral-300 transition-all cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
            <button
              type="button"
              onClick={handleSurpriseMe}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium border border-dashed border-neutral-300 bg-transparent text-neutral-400 hover:bg-neutral-50 hover:text-neutral-700 hover:border-neutral-400 transition-all cursor-pointer flex items-center gap-1"
            >
              <Dice5 className="w-3 h-3" />
              Surprise me
            </button>
          </div>
        )}

        {/* ── Bottom Controls Bar (inside box, separated by a line) ── */}
        <div className="px-4 py-2.5 border-t border-neutral-100 flex items-center justify-between gap-2 flex-wrap">

          {/* Left: Model, Ratio, Quality, Batch, Seed, Settings */}
          <div className="flex items-center gap-1.5 flex-wrap">

            {/* Model Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => { setModelMenuOpen(!modelMenuOpen); setRatioMenuOpen(false); setQualityMenuOpen(false); }}
                className="h-8 px-3 rounded-lg bg-white hover:bg-neutral-50 border border-neutral-200 text-[11px] font-semibold text-neutral-800 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${currentModel.dotColor} shrink-0`} />
                <span>{currentModel.name}</span>
                <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform ${modelMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {modelMenuOpen && (
                <div className="absolute left-0 bottom-full mb-2 w-[320px] bg-white rounded-2xl border border-neutral-200 shadow-[0_8px_40px_rgba(0,0,0,0.12)] p-2 z-40 animate-spring">
                  <div className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    AI Generation Model
                  </div>
                  {AVAILABLE_MODELS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => { setSelectedModelId(m.id); setModelMenuOpen(false); }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-start justify-between gap-2 cursor-pointer ${
                        selectedModelId === m.id ? "bg-neutral-950 text-white" : "hover:bg-neutral-50 text-neutral-800"
                      }`}
                    >
                      <div className="flex items-start gap-2.5 flex-1 min-w-0">
                        <span className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${selectedModelId === m.id ? "bg-white" : m.dotColor}`} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[12px] font-bold leading-none">{m.name}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border leading-none ${
                              selectedModelId === m.id ? "bg-neutral-800 text-neutral-200 border-neutral-700" : m.badgeColor
                            }`}>{m.badge}</span>
                          </div>
                          <p className={`text-[11px] mt-0.5 leading-tight ${selectedModelId === m.id ? "text-neutral-300" : "text-neutral-500"}`}>
                            {m.desc}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[11px] font-bold px-2 py-1 rounded-lg shrink-0 tabular-nums ${
                        selectedModelId === m.id ? "bg-neutral-800 text-white" : "bg-neutral-100 text-neutral-700"
                      }`}>{m.cost} cr</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Divider */}
            <span className="w-px h-4 bg-neutral-200 shrink-0" />

            {/* Frame Ratio */}
            <div className="relative">
              <button
                type="button"
                onClick={() => { setRatioMenuOpen(!ratioMenuOpen); setModelMenuOpen(false); setQualityMenuOpen(false); }}
                className="h-8 px-2.5 rounded-lg bg-white hover:bg-neutral-50 border border-neutral-200 text-[11px] font-semibold text-neutral-700 flex items-center gap-1 transition-all cursor-pointer"
              >
                {/* Ratio icon */}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-neutral-500">
                  <rect x="1" y="1" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                  <line x1="1" y1="5" x2="13" y2="5" stroke="currentColor" strokeWidth="1"/>
                  <line x1="5" y1="1" x2="5" y2="13" stroke="currentColor" strokeWidth="1"/>
                </svg>
                <span>{selectedRatio}</span>
                <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform ${ratioMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {ratioMenuOpen && (
                <div className="absolute left-0 bottom-full mb-2 w-[240px] bg-white rounded-2xl border border-neutral-200 shadow-[0_8px_40px_rgba(0,0,0,0.12)] p-2 z-40 animate-spring">
                  <div className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    Aspect Ratio
                  </div>
                  {FRAME_RATIOS.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => { setSelectedRatio(r.id); setRatioMenuOpen(false); }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                        selectedRatio === r.id ? "bg-neutral-950 text-white" : "hover:bg-neutral-50 text-neutral-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-base font-mono w-5 text-center">{r.icon}</span>
                        <div>
                          <div className="text-[12px] font-bold leading-none">{r.id} · {r.label}</div>
                          <div className={`text-[10px] mt-0.5 ${selectedRatio === r.id ? "text-neutral-300" : "text-neutral-400"}`}>{r.desc}</div>
                        </div>
                      </div>
                      <span className={`text-[10px] font-mono ${selectedRatio === r.id ? "text-neutral-300" : "text-neutral-400"}`}>{r.sub}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Char count + clear */}
            <span className="text-[11px] text-neutral-400 font-mono tabular-nums">{charCount}/3000</span>
            {charCount > 0 && (
              <button
                type="button"
                onClick={() => setPrompt("")}
                className="p-1 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                title="Clear prompt"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Divider */}
            <span className="w-px h-4 bg-neutral-200 shrink-0" />

            {/* Quality */}
            <div className="relative">
              <button
                type="button"
                onClick={() => { setQualityMenuOpen(!qualityMenuOpen); setModelMenuOpen(false); setRatioMenuOpen(false); }}
                className="h-8 px-2.5 rounded-lg bg-white hover:bg-neutral-50 border border-neutral-200 text-[11px] font-semibold text-neutral-700 flex items-center gap-1 transition-all cursor-pointer"
              >
                <span className="text-neutral-400 text-[10px]">HD</span>
                <span>{currentQuality.res}</span>
                <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform ${qualityMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {qualityMenuOpen && (
                <div className="absolute left-0 bottom-full mb-2 w-[210px] bg-white rounded-2xl border border-neutral-200 shadow-[0_8px_40px_rgba(0,0,0,0.12)] p-2 z-40 animate-spring">
                  <div className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    Output Resolution
                  </div>
                  {QUALITY_PRESETS.map((q) => (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => { setSelectedQuality(q.id); setQualityMenuOpen(false); }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                        selectedQuality === q.id ? "bg-neutral-950 text-white" : "hover:bg-neutral-50 text-neutral-800"
                      }`}
                    >
                      <div>
                        <div className="text-[12px] font-bold">{q.label}</div>
                        <div className={`text-[10px] ${selectedQuality === q.id ? "text-neutral-300" : "text-neutral-400"}`}>{q.res}</div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                        selectedQuality === q.id ? "bg-neutral-800 text-white" : "bg-neutral-100 text-neutral-700"
                      }`}>{q.tag}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Batch Count */}
            <div className="flex items-center rounded-lg bg-neutral-50 border border-neutral-200 p-0.5 h-8">
              {[1, 2, 4].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setBatchCount(count)}
                  className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    batchCount === count ? "bg-neutral-950 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-900"
                  }`}
                  title={`Generate ${count} image${count > 1 ? "s" : ""}`}
                >
                  {count}x
                </button>
              ))}
            </div>

            {/* Seed Lock */}
            <button
              type="button"
              onClick={() => { setSeedLocked(!seedLocked); if (!seedLocked) handleNewSeed(); }}
              className={`h-8 w-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                seedLocked
                  ? "bg-amber-50 border-amber-300 text-amber-700"
                  : "bg-white border-neutral-200 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50"
              }`}
              title={seedLocked ? `Seed locked: ${seed}` : "Lock seed for reproducible output"}
            >
              {seedLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            </button>

            {/* Advanced Settings */}
            <button
              type="button"
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`h-8 w-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                settingsOpen
                  ? "bg-neutral-950 text-white border-neutral-950"
                  : "bg-white border-neutral-200 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50"
              }`}
              title="Advanced parameters"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right: Credit cost badge + Generate button */}
          <div className="flex items-center gap-2.5 ml-auto">
            {/* Credit icon + count */}
            <div className="flex items-center gap-1 text-neutral-500">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="#A3A3A3" strokeWidth="1.5"/>
                <path d="M5 7.5l1.5 1.5L9.5 5.5" stroke="#A3A3A3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[11px] font-semibold tabular-nums">{totalCost}</span>
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="h-9 px-5 rounded-xl font-bold text-[13px] bg-neutral-950 hover:bg-neutral-800 active:scale-[0.97] text-white shadow-sm hover:shadow-md transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer shrink-0"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Advanced Settings Panel */}
        {settingsOpen && (
          <div className="px-4 pb-4 pt-3 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-spring">
            {/* Negative Prompt */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">
                Negative Prompt
              </label>
              <input
                type="text"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="blurry, distorted, low quality..."
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-800 placeholder-neutral-400 font-medium"
              />
              <p className="text-[10px] text-neutral-400">Things to exclude from the output</p>
            </div>

            {/* Guidance Scale */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Guidance (CFG)</label>
                <span className="text-[11px] font-extrabold text-neutral-900 tabular-nums">{guidanceScale.toFixed(1)}</span>
              </div>
              <input type="range" min={1} max={15} step={0.5} value={guidanceScale}
                onChange={(e) => setGuidanceScale(Number(e.target.value))} className="w-full accent-neutral-950" />
              <div className="flex justify-between text-[9px] text-neutral-400"><span>Creative</span><span>Precise</span></div>
            </div>

            {/* Steps */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Steps</label>
                <span className="text-[11px] font-extrabold text-neutral-900 tabular-nums">{steps}</span>
              </div>
              <input type="range" min={10} max={50} value={steps}
                onChange={(e) => setSteps(Number(e.target.value))} className="w-full accent-neutral-950" />
              <div className="flex justify-between text-[9px] text-neutral-400"><span>Fast</span><span>Detailed</span></div>
            </div>

            {/* Seed */}
            <div className="space-y-1.5 sm:col-span-3">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">
                Seed {seedLocked && <span className="text-amber-600 normal-case font-normal ml-1">(locked)</span>}
              </label>
              <div className="flex gap-2">
                <input type="number" value={seed === -1 ? "" : seed}
                  onChange={(e) => setSeed(Number(e.target.value))}
                  placeholder="Random (leave empty)"
                  className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-800 placeholder-neutral-400 font-mono tabular-nums"
                />
                <button type="button" onClick={handleNewSeed}
                  className="px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer">
                  <Dice5 className="w-3.5 h-3.5" /> Random
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Keyboard hints — outside the box ─────────────────────────────── */}
      {!hasActiveContent && (
        <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-1 px-1">
          <kbd className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-neutral-200 text-neutral-500 font-mono text-[10px] shadow-sm">
            ↵ Enter
          </kbd>
          <span>to generate</span>
          <span className="text-neutral-300 mx-0.5">·</span>
          <kbd className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-neutral-200 text-neutral-500 font-mono text-[10px] shadow-sm">
            ⇧ Shift+Enter
          </kbd>
          <span>for new line</span>
        </div>
      )}

      {/* ── Generation / Output Canvas ──────────────────────────────────── */}
      {hasActiveContent && (
        <div className="w-full space-y-5 animate-spring">

          {/* Generating State */}
          {isGenerating && (
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-[0_2px_32px_0_rgba(0,0,0,0.07)] overflow-hidden">
              {/* Laser scanline */}
              <div className="animate-scanline" />

              <div className="px-8 py-10 text-center space-y-6 max-w-lg mx-auto">
                {/* Spinner */}
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 rounded-full border-2 border-neutral-200" />
                  <div className="absolute inset-0 rounded-full border-2 border-neutral-950 border-t-transparent animate-spin" />
                  <div className="absolute inset-2 rounded-full bg-neutral-50 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-neutral-700" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold text-neutral-950">Synthesizing your image</h4>
                  <p className="text-xs text-neutral-500 font-mono">{stagePhase}</p>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-neutral-950 rounded-full transition-all duration-500 relative overflow-hidden"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute inset-0 animate-shimmer" />
                    </div>
                  </div>
                  <div className="flex justify-between text-[11px] text-neutral-400 font-mono tabular-nums">
                    <span>{elapsedTime.toFixed(1)}s elapsed</span>
                    <span>{progress}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Credits held in escrow — auto-refunded on failure</span>
                </div>
              </div>
            </div>
          )}

          {/* Output */}
          {!isGenerating && outputImage && (
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-[0_2px_32px_0_rgba(0,0,0,0.07)] overflow-hidden">

              {/* Top bar */}
              <div className="px-5 py-3.5 border-b border-neutral-100 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="text-xs font-bold text-neutral-950">{currentModel.name}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
                    {selectedRatio} · {currentQuality.res}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {totalCost} cr settled
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyPrompt}
                    className="px-3 py-1.5 rounded-xl border border-neutral-200 text-[11px] font-semibold text-neutral-700 hover:bg-neutral-50 flex items-center gap-1.5 transition-all btn-tactile cursor-pointer"
                  >
                    {copiedNotification ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedNotification ? "Copied!" : "Copy Prompt"}</span>
                  </button>
                  <button
                    onClick={() => setLightboxImage(outputImage)}
                    className="p-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-600 transition-all btn-tactile cursor-pointer"
                    title="View fullscreen"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href={outputImage}
                    download="aistudio-render.jpg"
                    className="px-4 py-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-[11px] font-bold flex items-center gap-1.5 transition-all btn-tactile"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              </div>

              {/* Image Canvas */}
              <div className="relative group bg-[#F9F9F9] flex items-center justify-center min-h-[300px] p-4">
                <img
                  src={outputImage}
                  alt="Generated output"
                  className="max-h-[600px] w-auto object-contain rounded-2xl shadow-sm transition-transform duration-500 group-hover:scale-[1.005]"
                />
                <button
                  onClick={() => setLightboxImage(outputImage)}
                  className="absolute bottom-5 right-5 px-3 py-1.5 rounded-xl bg-neutral-950/80 backdrop-blur-sm text-white text-[11px] font-semibold flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Fullscreen
                </button>
              </div>

              {/* Action Footer */}
              <div className="px-5 py-3.5 border-t border-neutral-100 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-4 text-[11px] text-neutral-500">
                  <span>Latency: <strong className="text-neutral-900">{elapsedTime > 0 ? `${elapsedTime.toFixed(1)}s` : "—"}</strong></span>
                  <span>Model: <strong className="text-neutral-900">{currentModel.name}</strong></span>
                  {seedLocked && <span>Seed: <strong className="text-neutral-900 font-mono">{seed}</strong></span>}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReset}
                    className="px-3.5 py-2 rounded-xl border border-neutral-200 text-[11px] font-semibold text-neutral-700 hover:bg-neutral-50 flex items-center gap-1.5 transition-all btn-tactile cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    New Creation
                  </button>
                  <Link
                    href="/enhance"
                    className="px-3.5 py-2 rounded-xl border border-neutral-200 text-[11px] font-semibold text-neutral-700 hover:bg-neutral-50 flex items-center gap-1.5 transition-all btn-tactile"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-blue-600" />
                    4x Upscale
                  </Link>
                  <button
                    onClick={handleGenerate}
                    className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-[11px] font-semibold flex items-center gap-1.5 transition-all btn-tactile cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Variations
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Recent History Strip */}
          {history.length > 0 && (
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-[0_2px_20px_0_rgba(0,0,0,0.05)] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-950">Recent Generations</span>
                  <span className="text-[10px] text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full font-semibold">
                    {history.length}
                  </span>
                </div>
                <Link href="/creations" className="text-[11px] text-blue-600 hover:underline font-semibold flex items-center gap-1">
                  View all →
                </Link>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => { setPrompt(item.prompt); setOutputImage(item.url); }}
                    className="group relative w-[88px] h-[88px] shrink-0 rounded-2xl overflow-hidden border border-neutral-200 hover:border-neutral-400 cursor-pointer transition-all duration-200 hover:shadow-md"
                    title={item.prompt}
                  >
                    <img src={item.url} alt="history" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-neutral-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold gap-0.5">
                      <ImageIcon className="w-4 h-4 mb-0.5" />
                      <span>Load</span>
                      <span className="text-[9px] text-neutral-300 font-normal">{item.ratio}</span>
                    </div>
                    <div className="absolute bottom-1.5 right-1.5">
                      <span className="text-[8px] font-bold bg-neutral-950/75 text-white px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                        {item.date}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Add New */}
                <div
                  onClick={handleReset}
                  className="w-[88px] h-[88px] shrink-0 rounded-2xl border-2 border-dashed border-neutral-200 hover:border-neutral-400 cursor-pointer transition-all flex flex-col items-center justify-center text-neutral-400 hover:text-neutral-700 gap-1 group"
                >
                  <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-semibold">New</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Fullscreen Lightbox ────────────────────────────────────────────── */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-neutral-950/92 backdrop-blur-md flex items-center justify-center p-4 animate-spring"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-3.5 flex items-center justify-between text-white border-b border-neutral-800">
              <div className="flex items-center gap-2.5">
                <Star className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold">{currentModel.name} · Full Resolution</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400">
                  {selectedRatio}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={lightboxImage}
                  download="aistudio-render.jpg"
                  className="px-3 py-1.5 rounded-xl bg-white text-neutral-950 font-bold text-xs flex items-center gap-1.5 hover:bg-neutral-100 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </a>
                <button
                  onClick={() => setLightboxImage(null)}
                  className="p-1.5 rounded-full hover:bg-neutral-800 text-white cursor-pointer transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
              <img
                src={lightboxImage}
                alt="Fullscreen View"
                className="max-h-[78vh] w-auto object-contain rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
