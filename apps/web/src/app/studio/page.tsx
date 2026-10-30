"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
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
  Search,
  Globe,
  Brain,
  Zap,
  Shirt,
  Paintbrush,
  Filter,
  CheckCircle2,
  Layers,
  HelpCircle,
  UploadCloud,
  Trash2,
  SlidersHorizontal,
  Info,
} from "lucide-react";
import { GenerationJob } from "@/types";

// ─── Model Type Definition ──────────────────────────────────────────────────
export interface GoogleModelSpec {
  id: string;
  name: string;
  engine: string;
  cost: number;
  desc: string;
  badge: string;
  badgeColor: string;
  dotColor: string;
  category: "gemini" | "imagen" | "specialized";
  primaryJob: string;
  maxLimit: string;
  tokenLimit: string;
  maxResolution: string;
  synthId: boolean;
  aspectRatios: string[];
  batchMax: number;
  features: string[];
}

// ─── Models (Official Google Cloud Suite - Strictly 8 Models) ────────────────
const AVAILABLE_MODELS: GoogleModelSpec[] = [
  {
    id: "nano-banana-2-1",
    name: "Nano Banana 2.1",
    engine: "Gemini 3.1 Flash Image",
    cost: 6,
    desc: "Our upgraded mainstream Gemini image model with stronger prompt adherence, and multi-reference consistency, enabling production quality image generation and edits from 1K to 4K.",
    badge: "Flagship 4K",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    dotColor: "bg-blue-500",
    category: "gemini",
    primaryJob: "Mainstream Gen & Edit",
    maxLimit: "1K to 4K Resolution",
    tokenLimit: "Up to 1,000,000 tokens",
    maxResolution: "Up to 4096×4096 (4K)",
    synthId: true,
    aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "4:1", "1:4", "8:1", "1:8"],
    batchMax: 1,
    features: [
      "Up to 14 multi-reference input images",
      "Real-time Web Search Grounding",
      "Production-quality text-to-image & conversational editing",
      "Resolutions from 512px up to 4K",
    ],
  },
  {
    id: "nano-banana-2-lite",
    name: "Nano Banana 2 Lite",
    engine: "Gemini 3.1 Flash Lite Image",
    cost: 3,
    desc: "Class leading image generation capabilities, now optimized for high-volume, latency-sensitive asset creation.",
    badge: "Ultra-Fast",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotColor: "bg-emerald-500",
    category: "gemini",
    primaryJob: "Rapid iteration & drafts",
    maxLimit: "High-Volume & Rapid Drafts",
    tokenLimit: "Up to 1,000,000 tokens",
    maxResolution: "512px – 1024px (1K)",
    synthId: true,
    aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4"],
    batchMax: 1,
    features: [
      "Ultra-low latency generation",
      "Optimized for 512px and 1K drafts",
      "Credit-saving background asset generation",
    ],
  },
  {
    id: "nano-banana-pro",
    name: "Nano Banana Pro",
    engine: "Gemini 3 Pro Image",
    cost: 10,
    desc: "A powerful image generation model that combines high quality graphics, text rendering in multiple languages, and world knowledge",
    badge: "Pro Studio",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    dotColor: "bg-purple-500",
    category: "gemini",
    primaryJob: "Complex layouts & typography",
    maxLimit: "Thinking Process & Typography",
    tokenLimit: "Up to 1,000,000 tokens",
    maxResolution: "Up to 4096×4096 (4K)",
    synthId: true,
    aspectRatios: ["1:1", "3:4", "4:3", "9:16", "16:9", "4:1", "1:4", "8:1", "1:8"],
    batchMax: 1,
    features: [
      "Internal Thinking Process reasoning budget",
      "Crisp embedded multilingual typography",
      "Complex spatial infographics and charts",
      "Studio 4K resolution output",
    ],
  },
  {
    id: "nano-banana-2",
    name: "Nano Banana 2",
    engine: "Gemini 3.1 Flash Image",
    cost: 5,
    desc: "gemini-3.1-flash-image is a model designed for general image generation and editing tasks, offering high quality and low latency.",
    badge: "General & Edit",
    badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
    dotColor: "bg-teal-500",
    category: "gemini",
    primaryJob: "General-purpose predecessor to 2.1",
    maxLimit: "5 Characters & 14 Objects",
    tokenLimit: "Up to 1,000,000 tokens",
    maxResolution: "512px to 4K",
    synthId: true,
    aspectRatios: ["1:1", "3:4", "4:3", "9:16", "16:9", "4:1", "1:4"],
    batchMax: 1,
    features: [
      "Multi-character consistency across scenes",
      "Balanced performance and latency",
      "Conversational editing & style transfers",
    ],
  },
  {
    id: "nano-banana",
    name: "Nano Banana",
    engine: "Gemini 2.5 Flash Image",
    cost: 4,
    desc: "gemini-2.5-flash-image. State-of-the-art image generation and editing model.",
    badge: "State-of-the-Art",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    dotColor: "bg-indigo-500",
    category: "gemini",
    primaryJob: "Legacy Flash image generation",
    maxLimit: "Multimodal Native 1K",
    tokenLimit: "~128,000 to 1,000,000 tokens",
    maxResolution: "Native 1K (1024×1024)",
    synthId: true,
    aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4"],
    batchMax: 1,
    features: [
      "Direct prompt-to-image synthesis",
      "Native 1K square baseline output",
      "Legacy stable Flash generation",
    ],
  },
  {
    id: "imagen-4-fast",
    name: "Imagen 4 Fast",
    engine: "Imagen 4 Fast",
    cost: 4,
    desc: "Fast image generation with text prompts.",
    badge: "Next-Gen Fast",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    dotColor: "bg-amber-500",
    category: "imagen",
    primaryJob: "Rapid pure text-to-photo",
    maxLimit: "~480–1,000 characters",
    tokenLimit: "Traditional concise text prompt",
    maxResolution: "~1408×768 (1 Megapixel)",
    synthId: true,
    aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4"],
    batchMax: 4,
    features: [
      "Sub-3-second diffusion synthesis",
      "Parallel batch sampling (1 to 4 images)",
      "Person generation safety filters",
      "5 supported diffusion aspect ratios",
    ],
  },
  {
    id: "virtual-try-on",
    name: "Virtual try-on",
    engine: "Google Virtual Try-On",
    cost: 8,
    desc: "Specialized model to generate images of people trying on clothing.",
    badge: "Fashion & Retail",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    dotColor: "bg-rose-500",
    category: "specialized",
    primaryJob: "Garment transfer",
    maxLimit: "Person + Garment Dual Image",
    tokenLimit: "Dual photo input + fit hint",
    maxResolution: "1024px / Portrait",
    synthId: true,
    aspectRatios: ["1:1", "3:4", "9:16"],
    batchMax: 1,
    features: [
      "Dual image dropzones (Person photo + Garment photo)",
      "Realistic fabric drape & body shape adaptation",
      "Garment category selector (Tops, Bottoms, Dresses)",
    ],
  },
  {
    id: "imagen-3-capability-001",
    name: "Imagen 3 Capability 001",
    engine: "Imagen 3 Capability 001",
    cost: 5,
    desc: "Fast image editing.",
    badge: "Precision Editing",
    badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-200",
    dotColor: "bg-cyan-500",
    category: "imagen",
    primaryJob: "Mask-based inpainting",
    maxLimit: "Base Image + Visual Mask",
    tokenLimit: "Descriptive prompt + visual mask",
    maxResolution: "Native 1024×1024",
    synthId: true,
    aspectRatios: ["1:1", "16:9", "9:16", "4:3"],
    batchMax: 4,
    features: [
      "Targeted inpainting with visual brush mask",
      "Outpainting boundary expansion",
      "Background replacement mode",
    ],
  },
];

// ─── Resolution Definitions (Single, Cohesive, Model-Aware) ────────────────
export interface ResolutionOption {
  id: string; // "512" | "1024" | "2048" | "4096"
  label: string;
  badge: string;
  sub: string;
  dimensions: string;
  extraCost: number;
  tag: string;
  supportedModels: string[];
}

const RESOLUTION_OPTIONS: ResolutionOption[] = [
  {
    id: "512",
    label: "512px Fast Draft",
    badge: "0.5K",
    sub: "Ultra-fast thumbnail drafts",
    dimensions: "512 × 512",
    extraCost: 0,
    tag: "Fastest",
    supportedModels: ["nano-banana-2-1", "nano-banana-2-lite", "nano-banana-2"],
  },
  {
    id: "1024",
    label: "1K Standard HD",
    badge: "1K",
    sub: "Production default resolution",
    dimensions: "1024 × 1024",
    extraCost: 0,
    tag: "Included",
    supportedModels: [
      "nano-banana-2-1",
      "nano-banana-2-lite",
      "nano-banana-pro",
      "nano-banana-2",
      "nano-banana",
      "imagen-4-fast",
      "virtual-try-on",
      "imagen-3-capability-001",
    ],
  },
  {
    id: "2048",
    label: "2K High Definition",
    badge: "2K",
    sub: "Double pixel density for prints",
    dimensions: "2048 × 2048",
    extraCost: 2,
    tag: "+2 cr",
    supportedModels: ["nano-banana-2-1", "nano-banana-pro", "nano-banana-2"],
  },
  {
    id: "4096",
    label: "4K Ultra Studio",
    badge: "4K",
    sub: "Maximum 16MP cinema detail",
    dimensions: "4096 × 4096",
    extraCost: 4,
    tag: "+4 cr",
    supportedModels: ["nano-banana-2-1", "nano-banana-pro", "nano-banana-2"],
  },
];

// ─── Visual Aspect Ratios Geometry ──────────────────────────────────────────
interface RatioSpec {
  id: string;
  label: string;
  sub: string;
  desc: string;
  boxWidth: string;
  boxHeight: string;
}

const ALL_FRAME_RATIOS: Record<string, RatioSpec> = {
  "16:9": { id: "16:9", label: "Landscape", sub: "1344 × 768", desc: "YouTube, Presentation, Web", boxWidth: "w-6", boxHeight: "h-3.5" },
  "1:1":  { id: "1:1",  label: "Square", sub: "1024 × 1024", desc: "Instagram Post, Profile, Avatar", boxWidth: "w-5", boxHeight: "h-5" },
  "9:16": { id: "9:16", label: "Story / Reel", sub: "768 × 1344", desc: "TikTok, Reels, Shorts", boxWidth: "h-6", boxHeight: "w-3.5" },
  "4:3":  { id: "4:3",  label: "Classic TV", sub: "1152 × 864", desc: "Photography, Vintage Screen", boxWidth: "w-5.5", boxHeight: "h-4" },
  "3:4":  { id: "3:4",  label: "Portrait", sub: "864 × 1152", desc: "Fashion, Editorial, Poster", boxWidth: "w-4", boxHeight: "h-5.5" },
  "4:1":  { id: "4:1",  label: "Wide Banner", sub: "1536 × 384", desc: "Header, Twitter/X Banner", boxWidth: "w-7", boxHeight: "h-2" },
  "1:4":  { id: "1:4",  label: "Tall Skyscraper", sub: "384 × 1536", desc: "Sidebar Ad, Bookmark", boxWidth: "w-2", boxHeight: "h-7" },
  "8:1":  { id: "8:1",  label: "Panoramic Ribbon", sub: "1536 × 192", desc: "Ultra-wide Web Ribbon", boxWidth: "w-8", boxHeight: "h-1.5" },
  "1:8":  { id: "1:8",  label: "Vertical Bookmark", sub: "192 × 1536", desc: "Ultra-tall Display Ad", boxWidth: "w-1.5", boxHeight: "h-8" },
};

// ─── Prompt Suggestions ─────────────────────────────────────────────────────
const PROMPT_SUGGESTIONS = [
  "A misty Japanese torii gate reflected in still water at dawn, cinematic lighting, 8K",
  "Minimalist ceramic teapot with kintsugi gold cracks on weathered oak, soft studio lighting",
  "Futuristic skyline at night with neon rain and flying vehicles, cinematic film noir",
  "Macro photograph of a dew-covered spider web in an enchanted forest, golden hour",
  "High-end editorial fashion portrait in a modernist concrete pavilion, dramatic shadows",
  "Surreal floating islands with waterfalls falling into calm clouds, fantasy concept art",
  "Abstract liquid marble sculpture with electric cyan and rose gold swirls, glossy 4K texture",
  "A majestic snow leopard resting on a Himalayan summit under glowing auroras, national geographic",
];

// ─── Style Chips with Micro-Icons ───────────────────────────────────────────
const STYLE_CHIPS = [
  { label: "Photorealistic", icon: "📸", suffix: ", photorealistic, 8k resolution, crisp detail, natural lighting" },
  { label: "Cinematic",      icon: "🎬", suffix: ", cinematic film still, 35mm photography, anamorphic lens, atmospheric" },
  { label: "Anime Art",      icon: "🎨", suffix: ", anime aesthetic, detailed illustration, vibrant colors, Makoto Shinkai style" },
  { label: "3D Render",      icon: "🧊", suffix: ", 3D render, Octane render, volumetric lighting, raytracing, subsurface scattering" },
  { label: "Watercolor",     icon: "🖌️", suffix: ", delicate watercolor painting, soft pigment bleeding, textured paper" },
  { label: "Oil Painting",   icon: "🖼️", suffix: ", classical oil painting, visible impasto brushstrokes, rich canvas texture" },
];

export default function StudioPage() {
  // ── Core Prompt & Model State ──
  const [prompt, setPrompt]                         = useState("");
  const [selectedModelId, setSelectedModelId]       = useState("nano-banana-2-1");
  const [selectedRatio, setSelectedRatio]           = useState("16:9");
  const [selectedResolution, setSelectedResolution] = useState("1024");
  const [batchCount, setBatchCount]                 = useState(1);
  const [seedLocked, setSeedLocked]                 = useState(false);

  // ── Dynamic Model-Specific Controls State ──
  // 1. Nano Banana 2.1
  const [multiRefImages, setMultiRefImages]         = useState<string[]>([]);
  const [webGrounding, setWebGrounding]             = useState(true);

  // 2. Nano Banana 2 Lite
  const [fastMode, setFastMode]                     = useState(true);

  // 3. Nano Banana Pro
  const [thinkingBudget, setThinkingBudget]         = useState<"minimal" | "medium" | "deep">("medium");

  // 4. Imagen 4 Fast
  const [personFilter, setPersonFilter]             = useState<"allow_all" | "dont_allow" | "allow_adult">("allow_all");

  // 5. Virtual Try-On
  const [tryOnPersonImage, setTryOnPersonImage]     = useState<string | null>(null);
  const [tryOnGarmentImage, setTryOnGarmentImage]   = useState<string | null>(null);
  const [tryOnCategory, setTryOnCategory]           = useState<"tops" | "bottoms" | "dresses" | "outerwear">("tops");

  // 6. Imagen 3 Capability 001 (Inpainting / Outpainting)
  const [baseEditImage, setBaseEditImage]           = useState<string | null>(null);
  const [maskEditImage, setMaskEditImage]           = useState<string | null>(null);
  const [editMode, setEditMode]                     = useState<"inpaint" | "outpaint" | "background">("inpaint");

  // 7. General Single Attached Image (for general multimodal models)
  const [attachedImage, setAttachedImage]           = useState<string | null>(null);

  // ── Dropdown / Modal States ──
  const [modelDropdownOpen, setModelDropdownOpen]   = useState(false);
  const [modelModalOpen, setModelModalOpen]         = useState(false);
  const [modelFilterQuery, setModelFilterQuery]     = useState("");
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>("all");
  const [ratioMenuOpen, setRatioMenuOpen]           = useState(false);
  const [resolutionMenuOpen, setResolutionMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen]             = useState(false);

  // ── Dropdown Anchored Element Refs ──
  const modelMenuRef                                = useRef<HTMLDivElement>(null);
  const ratioMenuRef                                = useRef<HTMLDivElement>(null);
  const resolutionMenuRef                           = useRef<HTMLDivElement>(null);
  const settingsRef                                 = useRef<HTMLDivElement>(null);

  // ── Advanced Parameters ──
  const [negativePrompt, setNegativePrompt]         = useState("");
  const [guidanceScale, setGuidanceScale]           = useState(7.0);
  const [steps, setSteps]                           = useState(25);
  const [seed, setSeed]                             = useState(-1);

  // ── Generation Lifecycle ──
  const [isGenerating, setIsGenerating]             = useState(false);
  const [progress, setProgress]                     = useState(0);
  const [elapsedTime, setElapsedTime]               = useState(0);
  const [stagePhase, setStagePhase]                 = useState("Initializing...");
  const [activeJob, setActiveJob]                   = useState<GenerationJob | null>(null);
  const [outputImage, setOutputImage]               = useState<string | null>(null);
  const [errorMsg, setErrorMsg]                     = useState<string | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [showSuccess, setShowSuccess]               = useState(false);
  const [lightboxImage, setLightboxImage]           = useState<string | null>(null);

  // ── Animated Typewriter Placeholder ──
  const [placeholderIndex, setPlaceholderIndex]     = useState(0);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState("");
  const typingRef                                   = useRef<NodeJS.Timeout | null>(null);

  // ── Recent History Strip ──
  const [history, setHistory] = useState<Array<{
    id: string; prompt: string; url: string; model: string; ratio: string; date: string;
  }>>([
    {
      id: "hist-1",
      prompt: "An ancient Kyoto torii gate illuminated by neon holographic glyphs in heavy rain",
      url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=600&auto=format&fit=crop",
      model: "Nano Banana 2.1",
      ratio: "16:9",
      date: "12m ago",
    },
    {
      id: "hist-2",
      prompt: "Multi-character fantasy graphic novel sequence with consistent protagonist across panels",
      url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop",
      model: "Nano Banana 2",
      ratio: "1:1",
      date: "1h ago",
    },
    {
      id: "hist-3",
      prompt: "Studio marketing infographic with intricate technical diagrams and precise lighting",
      url: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?q=80&w=600&auto=format&fit=crop",
      model: "Nano Banana Pro",
      ratio: "16:9",
      date: "3h ago",
    },
  ]);

  // ── File Input Refs ──
  const fileInputRef              = useRef<HTMLInputElement>(null);
  const multiFileInputRef         = useRef<HTMLInputElement>(null);
  const tryOnPersonInputRef       = useRef<HTMLInputElement>(null);
  const tryOnGarmentInputRef      = useRef<HTMLInputElement>(null);
  const baseEditInputRef          = useRef<HTMLInputElement>(null);
  const maskEditInputRef          = useRef<HTMLInputElement>(null);

  const studioRef                 = useRef<HTMLDivElement>(null);
  const textareaRef               = useRef<HTMLTextAreaElement>(null);
  const timerRef                  = useRef<NodeJS.Timeout | null>(null);

  // ── Selected Model Info ──
  const currentModel = useMemo(() => {
    return AVAILABLE_MODELS.find((m) => m.id === selectedModelId) || AVAILABLE_MODELS[0];
  }, [selectedModelId]);

  // ── Resolution Option Computation & Auto-Correction ──
  const currentResolution = useMemo(() => {
    return RESOLUTION_OPTIONS.find((r) => r.id === selectedResolution) || RESOLUTION_OPTIONS[1];
  }, [selectedResolution]);

  // Automatically ensure resolution is supported when switching models
  useEffect(() => {
    const cur = RESOLUTION_OPTIONS.find((r) => r.id === selectedResolution);
    if (cur && !cur.supportedModels.includes(currentModel.id)) {
      // Model cannot do this resolution (e.g. 4K on Lite) -> reset to 1024
      setSelectedResolution("1024");
    }
  }, [currentModel.id, selectedResolution]);

  // Allowed aspect ratios for current model
  const availableRatios = useMemo(() => {
    return currentModel.aspectRatios
      .map((rId) => ALL_FRAME_RATIOS[rId])
      .filter(Boolean);
  }, [currentModel]);

  // Keep selectedRatio valid when switching models
  useEffect(() => {
    if (!currentModel.aspectRatios.includes(selectedRatio)) {
      setSelectedRatio(currentModel.aspectRatios[0] || "16:9");
    }
  }, [currentModel, selectedRatio]);

  // Keep batchCount within model limits
  useEffect(() => {
    if (batchCount > currentModel.batchMax) {
      setBatchCount(1);
    }
  }, [currentModel, batchCount]);

  // ── Animated Typewriter Placeholder ──
  useEffect(() => {
    if (prompt) return;
    const target = PROMPT_SUGGESTIONS[placeholderIndex];
    let i = 0;
    setDisplayedPlaceholder("");

    const type = () => {
      if (i <= target.length) {
        setDisplayedPlaceholder(target.slice(0, i));
        i++;
        typingRef.current = setTimeout(type, 28);
      } else {
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
    return () => {
      if (typingRef.current) clearTimeout(typingRef.current);
    };
  }, [placeholderIndex, prompt]);

  // ── Close dropdowns on outside click ──
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (modelMenuRef.current && !modelMenuRef.current.contains(target)) {
        setModelDropdownOpen(false);
      }
      if (ratioMenuRef.current && !ratioMenuRef.current.contains(target)) {
        setRatioMenuOpen(false);
      }
      if (resolutionMenuRef.current && !resolutionMenuRef.current.contains(target)) {
        setResolutionMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Auto-clear error after 6s ──
  useEffect(() => {
    if (errorMsg) {
      const t = setTimeout(() => setErrorMsg(null), 6000);
      return () => clearTimeout(t);
    }
  }, [errorMsg]);

  // ── Computed Values ──
  const totalCost = (currentModel.cost + currentResolution.extraCost) * batchCount;
  const charCount = prompt.length;
  const maxPromptChars = selectedModelId === "imagen-4-fast" ? 1000 : 3000;

  // ── Filtered Models for Popup ──
  const filteredModels = useMemo(() => {
    return AVAILABLE_MODELS.filter((m) => {
      const matchesCategory =
        selectedCategoryTab === "all" ||
        (selectedCategoryTab === "latest" && (m.id === "nano-banana-2-1" || m.id === "imagen-4-fast")) ||
        m.category === selectedCategoryTab;

      const q = modelFilterQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.engine.toLowerCase().includes(q) ||
        m.desc.toLowerCase().includes(q) ||
        m.primaryJob.toLowerCase().includes(q) ||
        m.badge.toLowerCase().includes(q);

      return matchesCategory && matchesQuery;
    });
  }, [selectedCategoryTab, modelFilterQuery]);

  // ── Handlers ──
  const handleSingleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAttachedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleMultiRefUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const remainingSlots = 14 - multiRefImages.length;
      const countToAdd = Math.min(files.length, remainingSlots);
      for (let i = 0; i < countToAdd; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = () => {
          setMultiRefImages((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleRemoveMultiRef = (idx: number) => {
    setMultiRefImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSurpriseMe = () => {
    const random = PROMPT_SUGGESTIONS[Math.floor(Math.random() * PROMPT_SUGGESTIONS.length)];
    setPrompt(random);
    textareaRef.current?.focus();
  };

  const handleStyleChip = (chip: { label: string; suffix: string }) => {
    const isApplied = prompt.toLowerCase().includes(chip.label.toLowerCase());
    if (isApplied) {
      const cleaned = prompt
        .replace(chip.suffix, "")
        .replace(new RegExp(`,?\\s*${chip.label}[^,]*`, "gi"), "")
        .trim();
      setPrompt(cleaned);
      return;
    }

    if (!prompt.trim()) {
      setPrompt(`A stunning creation${chip.suffix}`);
    } else {
      const base = prompt
        .replace(/, (photorealistic|cinematic film still|anime aesthetic|3D render|delicate watercolor|classical oil painting)[^,]*/gi, "")
        .trim();
      setPrompt(base + chip.suffix);
    }
    textareaRef.current?.focus();
  };

  const handleInsertQuote = () => {
    const quoted = prompt.includes('“') || prompt.includes('"')
      ? prompt
      : `${prompt} with signage text “VERTEX AI”`;
    setPrompt(quoted);
    textareaRef.current?.focus();
  };

  const handleNewSeed = () => {
    setSeed(Math.floor(Math.random() * 999999));
  };

  // ── Submit / Generate ──
  const handleGenerate = async () => {
    if (!prompt.trim() && selectedModelId !== "virtual-try-on") return;
    if (selectedModelId === "virtual-try-on" && (!tryOnPersonImage || !tryOnGarmentImage)) {
      setErrorMsg("Virtual Try-On requires both a Person photo and a Garment photo.");
      return;
    }

    setErrorMsg(null);
    setIsGenerating(true);
    setProgress(12);
    setElapsedTime(0);
    setOutputImage(null);
    setShowSuccess(false);
    setStagePhase("Reserving credits via Two-Phase Escrow...");

    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      setElapsedTime(Math.round((Date.now() - startTime) / 100) / 10);
    }, 100);

    const token = typeof window !== "undefined" ? localStorage.getItem("aistudio_token") : null;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    // Construct model-specific dynamic parameters
    const modelParameters: Record<string, any> = {
      aspect_ratio: selectedRatio,
      resolution: selectedResolution,
      sample_count: batchCount,
      guidance_scale: guidanceScale,
      steps,
      ...(negativePrompt ? { negative_prompt: negativePrompt } : {}),
      ...(seedLocked && seed !== -1 ? { seed } : {}),
    };

    // Pack Model Specific Flags
    if (selectedModelId === "nano-banana-2-1") {
      modelParameters.web_grounding = webGrounding;
      modelParameters.multi_reference_count = multiRefImages.length;
    } else if (selectedModelId === "nano-banana-2-lite") {
      modelParameters.fast_mode = fastMode;
    } else if (selectedModelId === "nano-banana-pro") {
      modelParameters.thinking_budget = thinkingBudget;
    } else if (selectedModelId === "imagen-4-fast") {
      modelParameters.person_generation = personFilter;
    } else if (selectedModelId === "virtual-try-on") {
      modelParameters.garment_category = tryOnCategory;
      modelParameters.person_image_provided = Boolean(tryOnPersonImage);
      modelParameters.garment_image_provided = Boolean(tryOnGarmentImage);
    } else if (selectedModelId === "imagen-3-capability-001") {
      modelParameters.edit_mode = editMode;
      modelParameters.base_image_provided = Boolean(baseEditImage);
      modelParameters.mask_image_provided = Boolean(maskEditImage);
    }

    try {
      const res = await fetch("http://localhost:8100/api/v1/jobs", {
        method: "POST",
        headers,
        body: JSON.stringify({
          model_id: selectedModelId,
          task_type: selectedModelId === "virtual-try-on" ? "virtual_try_on" : "image_generation",
          raw_prompt: prompt || `Virtual try-on simulation for ${tryOnCategory}`,
          parameters: modelParameters,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to trigger generation.");
      }

      const job: GenerationJob = await res.json();
      setActiveJob(job);
      setProgress(35);
      setStagePhase(`Routing inference to Google Cloud (${currentModel.engine})...`);

      // ── Poll Real Job Output from Backend API ──
      let completedJob: GenerationJob | null = null;
      for (let pollCount = 0; pollCount < 25; pollCount++) {
        await new Promise((r) => setTimeout(r, 600));
        setProgress(Math.min(92, 40 + pollCount * 10));
        setStagePhase(`Rendering on Vertex AI (${currentModel.name} @ ${selectedResolution}px)...`);

        try {
          const pollRes = await fetch(`http://localhost:8100/api/v1/jobs/${job.id}`);
          if (pollRes.ok) {
            const data: GenerationJob = await pollRes.json();
            if (data.status === "COMPLETED" && data.outputs && data.outputs.length > 0) {
              completedJob = data;
              break;
            } else if (data.status === "FAILED") {
              throw new Error(data.error_message || "Generation pipeline encountered an error.");
            }
          }
        } catch (pollErr: any) {
          if (pollErr.message && !pollErr.message.includes("fetch")) {
            throw pollErr;
          }
        }
      }

      setProgress(100);
      if (timerRef.current) clearInterval(timerRef.current);
      setIsGenerating(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      const resultUrl =
        completedJob?.outputs?.[0]?.download_url ||
        (completedJob?.outputs?.[0]?.file_key?.startsWith("http")
          ? completedJob?.outputs?.[0]?.file_key
          : completedJob?.outputs?.[0]?.file_key
          ? `http://localhost:8100${completedJob.outputs[0].file_key}`
          : "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1400&auto=format&fit=crop");

      setOutputImage(resultUrl);

      setHistory((prev) => [
        {
          id: job.id,
          prompt: prompt || `Virtual try-on ${tryOnCategory}`,
          url: resultUrl,
          model: currentModel.name,
          ratio: selectedRatio,
          date: "Just now",
        },
        ...prev.slice(0, 7),
      ]);
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
    setMultiRefImages([]);
    setTryOnPersonImage(null);
    setTryOnGarmentImage(null);
    setBaseEditImage(null);
    setMaskEditImage(null);
    setAttachedImage(null);
  };

  const hasActiveContent = isGenerating || outputImage;

  // Dynamic Placeholder based on model
  const dynamicPlaceholder = useMemo(() => {
    if (selectedModelId === "virtual-try-on") {
      return "Describe fit and styling instructions (e.g. 'Slim fit tucked in, natural drape with clean studio lighting')...";
    }
    if (selectedModelId === "imagen-3-capability-001") {
      return "Describe modifications to the selected area (e.g. 'Replace background with a sunny Mediterranean cafe terrace')...";
    }
    if (selectedModelId === "nano-banana-pro") {
      return "Describe complex spatial scenes, infographic charts, or quote exact text for crisp typography e.g. Neon sign with text “VERTEX AI”...";
    }
    if (selectedModelId === "nano-banana-2-1") {
      return "Describe your scene in detail, reference uploaded styles/characters, or enter complex multi-turn editing instructions...";
    }
    if (selectedModelId === "nano-banana-2-lite") {
      return "Rapid draft prompt for high-volume asset generation...";
    }
    if (selectedModelId === "imagen-4-fast") {
      return "Concise text-to-photo prompt (~480–1,000 characters, photorealistic)...";
    }
    return displayedPlaceholder || "Describe the image you want to generate...";
  }, [selectedModelId, displayedPlaceholder]);

  // Check if model has special contextual controls that warrant a top bar
  const hasContextualControls = useMemo(() => {
    return (
      selectedModelId === "nano-banana-2-1" ||
      selectedModelId === "nano-banana-pro" ||
      selectedModelId === "nano-banana-2-lite" ||
      selectedModelId === "imagen-4-fast" ||
      selectedModelId === "virtual-try-on" ||
      selectedModelId === "imagen-3-capability-001" ||
      selectedModelId === "nano-banana-2"
    );
  }, [selectedModelId]);

  return (
    <div
      ref={studioRef}
      className={`w-full max-w-4xl mx-auto transition-all duration-500 ${
        hasActiveContent
          ? "space-y-6 pt-4 pb-24"
          : "min-h-[calc(100vh-160px)] flex flex-col justify-center items-center py-10"
      }`}
    >
      {/* ── Hidden File Inputs ── */}
      <input type="file" ref={fileInputRef} accept="image/*" onChange={handleSingleImageUpload} className="hidden" />
      <input type="file" ref={multiFileInputRef} accept="image/*" multiple onChange={handleMultiRefUpload} className="hidden" />
      <input
        type="file"
        ref={tryOnPersonInputRef}
        accept="image/*"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) {
            const r = new FileReader();
            r.onload = () => setTryOnPersonImage(r.result as string);
            r.readAsDataURL(f);
          }
        }}
        className="hidden"
      />
      <input
        type="file"
        ref={tryOnGarmentInputRef}
        accept="image/*"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) {
            const r = new FileReader();
            r.onload = () => setTryOnGarmentImage(r.result as string);
            r.readAsDataURL(f);
          }
        }}
        className="hidden"
      />
      <input
        type="file"
        ref={baseEditInputRef}
        accept="image/*"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) {
            const r = new FileReader();
            r.onload = () => setBaseEditImage(r.result as string);
            r.readAsDataURL(f);
          }
        }}
        className="hidden"
      />
      <input
        type="file"
        ref={maskEditInputRef}
        accept="image/*"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) {
            const r = new FileReader();
            r.onload = () => setMaskEditImage(r.result as string);
            r.readAsDataURL(f);
          }
        }}
        className="hidden"
      />

      {/* ── Error Banner ── */}
      {errorMsg && (
        <div className="w-full mb-3 px-4 py-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between text-rose-800 text-xs font-semibold animate-spring shadow-2xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-rose-400 hover:text-rose-700 cursor-pointer p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Success Flash ── */}
      {showSuccess && (
        <div className="w-full mb-3 px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-800 text-xs font-semibold animate-spring shadow-2xs">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Generation complete — rendered via Google Vertex AI!</span>
        </div>
      )}

      {/* ── Idle Hero ── */}
      {!hasActiveContent && (
        <div className="text-center space-y-3 mb-6 animate-fade-scale">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-neutral-700 text-xs font-semibold border border-neutral-200/80 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Google Cloud Vertex AI Image Studio</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal font-editorial text-neutral-950 tracking-tight leading-tight">
            What will you create?
          </h1>
          <p className="text-sm text-neutral-500 font-sans max-w-sm mx-auto">
            Describe your vision, configure model specs, generate.
          </p>
        </div>
      )}

      {/* ── Polished Floating Prompt Box Container ── */}
      <div
        className={`w-full bg-white rounded-3xl border border-neutral-200/90 prompt-box-shadow glow-focus-ring relative transition-all duration-300 hover:border-neutral-300`}
      >
        {/* â”€â”€ Contextual Controls Strip (always shown as model header) â”€â”€ */}
        <div className="px-4 py-2.5 bg-gradient-to-r from-neutral-50 to-white border-b border-neutral-100/80 flex items-center justify-between gap-2 flex-wrap rounded-t-3xl">
          {/* Left: Model Identity + Model-specific controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className={`w-2 h-2 rounded-full ${currentModel.dotColor} shrink-0`} />
              <span className="text-[11px] font-bold text-neutral-800">{currentModel.name}</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${currentModel.badgeColor} leading-tight`}>
                {currentModel.badge}
              </span>
            </div>
            <span className="w-px h-3 bg-neutral-200 shrink-0" />
            {/* Nano Banana 2.1 Controls */}
            {selectedModelId === "nano-banana-2-1" && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setWebGrounding(!webGrounding)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer border ${
                    webGrounding
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white border-neutral-200 text-neutral-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
                  }`}
                >
                  <Globe className="w-3 h-3" />
                  <span>Search</span>
                  {webGrounding && <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />}
                </button>
                <button
                  type="button"
                  onClick={() => multiFileInputRef.current?.click()}
                  disabled={multiRefImages.length >= 14}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all cursor-pointer"
                >
                  <Plus className="w-3 h-3 text-blue-500" />
                  <span>Refs</span>
                  <span className="px-1 py-0 rounded bg-blue-50 text-blue-700 font-mono text-[9px] font-bold">{multiRefImages.length}/14</span>
                </button>
              </div>
            )}
            {/* Nano Banana 2 Lite Controls */}
            {selectedModelId === "nano-banana-2-lite" && (
              <button
                type="button"
                onClick={() => setFastMode(!fastMode)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border cursor-pointer transition-all ${
                  fastMode ? "bg-emerald-600 text-white border-emerald-600" : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <Zap className="w-3 h-3" />
                <span>Turbo {fastMode ? "ON" : "OFF"}</span>
              </button>
            )}
            {/* Nano Banana Pro Controls */}
            {selectedModelId === "nano-banana-pro" && (
              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-full bg-white border border-neutral-200/90 p-0.5 text-[11px] font-semibold shadow-2xs">
                  <span className="px-2 text-neutral-400 text-[10px] font-medium flex items-center gap-1">
                    <Brain className="w-2.5 h-2.5 text-purple-500" /> Think:
                  </span>
                  {(["minimal", "medium", "deep"] as const).map((t) => (
                    <button key={t} type="button" onClick={() => setThinkingBudget(t)}
                      className={`px-2 py-0.5 rounded-full capitalize cursor-pointer transition-all ${thinkingBudget === t ? "bg-purple-600 text-white font-bold" : "text-neutral-500 hover:text-neutral-900"}`}
                    >{t}</button>
                  ))}
                </div>
                <button type="button" onClick={handleInsertQuote}
                  className="px-2.5 py-1 rounded-full bg-white border border-neutral-200 hover:bg-neutral-100 text-[11px] font-semibold text-neutral-700 flex items-center gap-1 cursor-pointer transition-all"
                ><span>"Text"</span></button>
              </div>
            )}
            {/* Imagen 4 Fast Controls */}
            {selectedModelId === "imagen-4-fast" && (
              <div className="flex items-center rounded-full bg-white border border-neutral-200/90 p-0.5 text-[11px] font-semibold shadow-2xs">
                <span className="px-2 text-neutral-400 text-[10px] font-medium">People:</span>
                {(["allow_all", "allow_adult", "dont_allow"] as const).map((f) => (
                  <button key={f} type="button" onClick={() => setPersonFilter(f)}
                    className={`px-2 py-0.5 rounded-full cursor-pointer transition-all text-[10px] ${personFilter === f ? "bg-amber-500 text-white font-bold" : "text-neutral-500 hover:text-neutral-900"}`}
                  >
                    {f === "allow_all" ? "All" : f === "allow_adult" ? "Adults" : "None"}
                  </button>
                ))}
              </div>
            )}
            {/* Virtual Try-On Controls */}
            {selectedModelId === "virtual-try-on" && (
              <div className="flex items-center rounded-full bg-white border border-neutral-200/90 p-0.5 text-[11px] font-semibold shadow-2xs">
                <span className="px-2 text-neutral-400 text-[10px] font-medium">Garment:</span>
                {(["tops", "bottoms", "dresses", "outerwear"] as const).map((cat) => (
                  <button key={cat} type="button" onClick={() => setTryOnCategory(cat)}
                    className={`px-2 py-0.5 rounded-full capitalize cursor-pointer transition-all text-[10px] ${tryOnCategory === cat ? "bg-rose-500 text-white font-bold" : "text-neutral-500 hover:text-neutral-900"}`}
                  >{cat}</button>
                ))}
              </div>
            )}
            {/* Imagen 3 Capability 001 Controls */}
            {selectedModelId === "imagen-3-capability-001" && (
              <div className="flex items-center rounded-full bg-white border border-neutral-200/90 p-0.5 text-[11px] font-semibold shadow-2xs">
                {(["inpaint", "outpaint", "background"] as const).map((m) => (
                  <button key={m} type="button" onClick={() => setEditMode(m)}
                    className={`px-2.5 py-0.5 rounded-full capitalize cursor-pointer transition-all text-[10px] ${editMode === m ? "bg-cyan-600 text-white font-bold" : "text-neutral-500 hover:text-neutral-900"}`}
                  >
                    {m === "inpaint" ? "Inpaint" : m === "outpaint" ? "Outpaint" : "BG Swap"}
                  </button>
                ))}
              </div>
            )}
            {/* Nano Banana 2 Controls */}
            {selectedModelId === "nano-banana-2" && (
              <span className="text-[10px] text-teal-700 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-teal-500" />
                5 chars Â· 14 objects
              </span>
            )}
            {/* Nano Banana (legacy) Controls */}
            {selectedModelId === "nano-banana" && (
              <span className="text-[10px] text-indigo-600 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Legacy stable generation
              </span>
            )}
          </div>
          {/* Right: Engine label */}
          <div className="hidden sm:flex items-center gap-1 text-[10px] text-neutral-400 font-medium">
            <span className="text-neutral-300">via</span>
            <strong className="text-neutral-600 font-semibold">{currentModel.engine}</strong>
          </div>
        </div>

        {/* â”€â”€ Main Input Area (Adapts dynamically by Model) â”€â”€ */}
        <div className="p-5 pb-3">
          {/* â”€â”€ A. Virtual Try-On Specialized Dual Dropzones â”€â”€ */}
          {selectedModelId === "virtual-try-on" ? (
            <div className="space-y-3.5 animate-spring">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Person Dropzone */}
                <div
                  onClick={() => tryOnPersonInputRef.current?.click()}
                  className={`h-32 rounded-2xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center transition-all p-2 relative group ${
                    tryOnPersonImage
                      ? "border-rose-300 bg-rose-50/20"
                      : "border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50"
                  }`}
                >
                  {tryOnPersonImage ? (
                    <div className="relative w-full h-full rounded-xl overflow-hidden flex items-center justify-center">
                      <img src={tryOnPersonImage} alt="Person" className="h-full object-contain" />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setTryOnPersonImage(null); }}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-neutral-900/80 text-white hover:bg-neutral-950 transition-all cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <span className="absolute bottom-1.5 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-neutral-900/80 text-white">
                        1. Person / Model
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 mb-1.5 group-hover:scale-105 transition-transform">
                        <Shirt className="w-5 h-5 text-neutral-400" />
                      </div>
                      <span className="text-xs font-bold text-neutral-800">1. Upload Person / Model Photo</span>
                      <span className="text-[10px] text-neutral-400">Click to choose human subject</span>
                    </>
                  )}
                </div>

                {/* Garment Dropzone */}
                <div
                  onClick={() => tryOnGarmentInputRef.current?.click()}
                  className={`h-32 rounded-2xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center transition-all p-2 relative group ${
                    tryOnGarmentImage
                      ? "border-rose-300 bg-rose-50/20"
                      : "border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50"
                  }`}
                >
                  {tryOnGarmentImage ? (
                    <div className="relative w-full h-full rounded-xl overflow-hidden flex items-center justify-center">
                      <img src={tryOnGarmentImage} alt="Garment" className="h-full object-contain" />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setTryOnGarmentImage(null); }}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-neutral-900/80 text-white hover:bg-neutral-950 transition-all cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <span className="absolute bottom-1.5 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-neutral-900/80 text-white">
                        2. Garment / Apparel
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-1.5 group-hover:scale-105 transition-transform">
                        <Shirt className="w-5 h-5 text-rose-500" />
                      </div>
                      <span className="text-xs font-bold text-neutral-800">2. Upload Clothing / Garment Photo</span>
                      <span className="text-[10px] text-neutral-400">Click to choose garment product</span>
                    </>
                  )}
                </div>
              </div>

              {/* Fit Instruction Prompt */}
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  rows={2}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={dynamicPlaceholder}
                  className="w-full bg-neutral-50/60 border border-neutral-200 rounded-2xl p-3.5 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 resize-none font-normal leading-relaxed"
                />
              </div>
            </div>
          ) : selectedModelId === "imagen-3-capability-001" ? (
            /* â”€â”€ B. Imagen 3 Capability 001 Inpainting Dropzones â”€â”€ */
            <div className="space-y-3.5 animate-spring">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Base Image Dropzone */}
                <div
                  onClick={() => baseEditInputRef.current?.click()}
                  className={`h-32 rounded-2xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center transition-all p-2 relative group ${
                    baseEditImage
                      ? "border-cyan-300 bg-cyan-50/20"
                      : "border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50"
                  }`}
                >
                  {baseEditImage ? (
                    <div className="relative w-full h-full rounded-xl overflow-hidden flex items-center justify-center">
                      <img src={baseEditImage} alt="Base" className="h-full object-contain" />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setBaseEditImage(null); }}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-neutral-900/80 text-white hover:bg-neutral-950 transition-all cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <span className="absolute bottom-1.5 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-neutral-900/80 text-white">
                        Base Image
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 mb-1.5 group-hover:scale-105 transition-transform">
                        <ImageIcon className="w-5 h-5 text-neutral-400" />
                      </div>
                      <span className="text-xs font-bold text-neutral-800">1. Upload Base Image</span>
                      <span className="text-[10px] text-neutral-400">Target photo to modify or expand</span>
                    </>
                  )}
                </div>

                {/* Mask Dropzone */}
                <div
                  onClick={() => maskEditInputRef.current?.click()}
                  className={`h-32 rounded-2xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center transition-all p-2 relative group ${
                    maskEditImage
                      ? "border-cyan-300 bg-cyan-50/20"
                      : "border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50"
                  }`}
                >
                  {maskEditImage ? (
                    <div className="relative w-full h-full rounded-xl overflow-hidden flex items-center justify-center">
                      <img src={maskEditImage} alt="Mask" className="h-full object-contain" />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setMaskEditImage(null); }}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-neutral-900/80 text-white hover:bg-neutral-950 transition-all cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <span className="absolute bottom-1.5 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-neutral-900/80 text-white">
                        Edit Mask (White = replace)
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600 mb-1.5 group-hover:scale-105 transition-transform">
                        <Paintbrush className="w-5 h-5 text-cyan-600" />
                      </div>
                      <span className="text-xs font-bold text-neutral-800">2. Upload Mask or Paint Region</span>
                      <span className="text-[10px] text-neutral-400">Specifies area for {editMode}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Edit Instruction Prompt */}
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  rows={2}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={dynamicPlaceholder}
                  className="w-full bg-neutral-50/60 border border-neutral-200 rounded-2xl p-3.5 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 resize-none font-normal leading-relaxed"
                />
              </div>
            </div>
          ) : (
            /* â”€â”€ C. Standard Models â”€â”€ */
            <div className="space-y-3">
              {/* Horizontal Reference Thumbnails when images exist (Nano Banana 2.1) */}
              {selectedModelId === "nano-banana-2-1" && multiRefImages.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin animate-spring">
                  {multiRefImages.map((src, idx) => (
                    <div key={idx} className="relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-neutral-200 group shadow-2xs">
                      <img src={src} alt={`Ref ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveMultiRef(idx)}
                        className="absolute top-1 right-1 p-0.5 rounded-full bg-neutral-900/80 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <span className="absolute bottom-0 inset-x-0 bg-neutral-950/75 text-white text-[8px] font-bold text-center py-0.5 tracking-wide">
                        REF #{idx + 1}
                      </span>
                    </div>
                  ))}
                  {multiRefImages.length < 14 && (
                    <button
                      type="button"
                      onClick={() => multiFileInputRef.current?.click()}
                      className="shrink-0 w-16 h-16 rounded-xl border-2 border-dashed border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 flex flex-col items-center justify-center transition-all cursor-pointer text-neutral-400 hover:text-neutral-700"
                      title="Add more reference photos (up to 14)"
                    >
                      <Plus className="w-4 h-4 text-blue-600 mb-0.5" />
                      <span className="text-[9px] font-bold text-neutral-700">Add</span>
                      <span className="text-[8px] text-neutral-400 font-mono">{multiRefImages.length}/14</span>
                    </button>
                  )}
                </div>
              )}

              {/* Main Prompt Textarea â€” clean, full-width, no awkward dropzone beside it */}
              <div className="relative flex flex-col">
                <textarea
                  ref={textareaRef}
                  rows={hasActiveContent ? 2 : 3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={dynamicPlaceholder}
                  className="w-full bg-transparent text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none resize-none font-normal leading-relaxed"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleGenerate();
                    }
                  }}
                />
                {/* Attachment button inside textarea bottom-left */}
                {selectedModelId !== "imagen-4-fast" && !hasActiveContent && (
                  <div className="flex items-center gap-2 mt-1">
                    {selectedModelId === "nano-banana-2-1" && multiRefImages.length === 0 && (
                      <button
                        type="button"
                        onClick={() => multiFileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 text-[11px] text-neutral-400 hover:text-blue-600 transition-colors cursor-pointer group"
                        title="Add reference images (up to 14)"
                      >
                        <div className="w-6 h-6 rounded-lg border border-neutral-200 group-hover:border-blue-300 group-hover:bg-blue-50 flex items-center justify-center transition-all">
                          <Plus className="w-3.5 h-3.5" />
                        </div>
                        <span className="group-hover:text-blue-600">Add refs (0/14)</span>
                      </button>
                    )}
                    {(selectedModelId === "nano-banana-2" || selectedModelId === "nano-banana" || selectedModelId === "nano-banana-pro") && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 text-[11px] text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer group"
                        title="Attach a reference image"
                      >
                        <div className="w-6 h-6 rounded-lg border border-neutral-200 group-hover:border-neutral-400 flex items-center justify-center transition-all">
                          <ImageIcon className="w-3.5 h-3.5" />
                        </div>
                        {attachedImage ? <span className="text-emerald-600 font-semibold">Image attached âœ“</span> : <span>Attach image</span>}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* â”€â”€ Style Chips (idle only, not for specialized models) â”€â”€ */}
        {!hasActiveContent && selectedModelId !== "virtual-try-on" && selectedModelId !== "imagen-3-capability-001" && (
          <div className="px-5 pb-3 flex flex-wrap items-center gap-1.5">
            {STYLE_CHIPS.map((chip) => {
              const isApplied = prompt.toLowerCase().includes(chip.label.toLowerCase());
              return (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => handleStyleChip(chip)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isApplied
                      ? "bg-neutral-900 text-white border-neutral-900 shadow-xs"
                      : "bg-white border-neutral-200/90 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 hover:border-neutral-300 shadow-2xs"
                  }`}
                >
                  <span className="text-xs">{chip.icon}</span>
                  <span>{chip.label}</span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={handleSurpriseMe}
              className="px-3 py-1 rounded-full text-xs font-medium border border-dashed border-neutral-300 bg-transparent text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800 hover:border-neutral-400 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Dice5 className="w-3.5 h-3.5 text-neutral-400" />
              <span>Surprise me</span>
            </button>
          </div>
        )}

        {/* â”€â”€ Bottom Controls Bar â”€â”€ */}
        <div className="px-4 py-3 border-t border-neutral-100 flex items-center justify-between gap-2 flex-wrap bg-white rounded-b-3xl">
          {/* Left Group: Model + Ratio + Resolution in a compact pill row */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Model Selector */}
            <div className="relative" ref={modelMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setModelDropdownOpen(!modelDropdownOpen);
                  setRatioMenuOpen(false);
                  setResolutionMenuOpen(false);
                }}
                className={`h-8 px-2.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  modelDropdownOpen
                    ? "bg-neutral-950 text-white border-neutral-950 shadow-sm"
                    : "bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-900 hover:border-neutral-300"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${currentModel.dotColor} shrink-0`} />
                <span className="truncate max-w-[110px]">{currentModel.name}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${modelDropdownOpen ? "rotate-180 text-white" : "text-neutral-400"}`} />
              </button>

              {/* Floating Model Dropdown */}
              {modelDropdownOpen && (
                <div className="absolute left-0 bottom-full mb-2 w-[580px] max-w-[94vw] bg-white rounded-2xl border border-neutral-200/90 shadow-[0_20px_55px_rgba(0,0,0,0.18),0_0_0_1px_rgba(0,0,0,0.04)] z-50 flex flex-col overflow-hidden animate-dropdown">
                  {/* Search Filter Header */}
                  <div className="px-3.5 py-2.5 border-b border-neutral-100 flex items-center justify-between gap-3 bg-neutral-50/80">
                    <div className="flex items-center gap-2 flex-1">
                      <Search className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <input
                        type="text"
                        value={modelFilterQuery}
                        onChange={(e) => setModelFilterQuery(e.target.value)}
                        placeholder="Filter models by name, engine, capability..."
                        className="w-full bg-transparent text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none font-medium"
                        autoFocus
                      />
                      {modelFilterQuery && (
                        <button onClick={() => setModelFilterQuery("")} className="p-0.5 text-neutral-400 hover:text-neutral-700 cursor-pointer">
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400 shrink-0">8 Vertex AI Models</span>
                  </div>

                  {/* 2-Column Body: Category Tabs (Left) + Model Items (Right) */}
                  <div className="flex min-h-[300px] max-h-[380px] overflow-hidden">
                    {/* Left Categories */}
                    <div className="w-36 border-r border-neutral-100 bg-neutral-50/50 p-2 flex flex-col gap-1 shrink-0">
                      <button type="button" onClick={() => setSelectedCategoryTab("all")}
                        className={`w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${selectedCategoryTab === "all" ? "bg-neutral-950 text-white shadow-xs" : "text-neutral-600 hover:bg-neutral-200/60"}`}
                      >
                        <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> All</span>
                        <span className="text-[10px] font-mono opacity-70">8</span>
                      </button>
                      <button type="button" onClick={() => setSelectedCategoryTab("latest")}
                        className={`w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${selectedCategoryTab === "latest" ? "bg-neutral-950 text-white shadow-xs" : "text-neutral-600 hover:bg-neutral-200/60"}`}
                      >
                        <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-amber-500" /> Latest</span>
                        <span className="text-[10px] font-mono opacity-70">2</span>
                      </button>
                      <button type="button" onClick={() => setSelectedCategoryTab("gemini")}
                        className={`w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${selectedCategoryTab === "gemini" ? "bg-neutral-950 text-white shadow-xs" : "text-neutral-600 hover:bg-neutral-200/60"}`}
                      >
                        <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-blue-500" /> Gemini</span>
                        <span className="text-[10px] font-mono opacity-70">5</span>
                      </button>
                      <button type="button" onClick={() => setSelectedCategoryTab("imagen")}
                        className={`w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${selectedCategoryTab === "imagen" ? "bg-neutral-950 text-white shadow-xs" : "text-neutral-600 hover:bg-neutral-200/60"}`}
                      >
                        <span className="flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5 text-amber-500" /> Imagen</span>
                        <span className="text-[10px] font-mono opacity-70">2</span>
                      </button>
                      <button type="button" onClick={() => setSelectedCategoryTab("specialized")}
                        className={`w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${selectedCategoryTab === "specialized" ? "bg-neutral-950 text-white shadow-xs" : "text-neutral-600 hover:bg-neutral-200/60"}`}
                      >
                        <span className="flex items-center gap-1.5"><Shirt className="w-3.5 h-3.5 text-rose-500" /> Fashion</span>
                        <span className="text-[10px] font-mono opacity-70">1</span>
                      </button>
                    </div>

                    {/* Right Model Cards */}
                    <div className="flex-1 p-2.5 overflow-y-auto space-y-2 bg-white scrollbar-thin">
                      {filteredModels.map((m) => {
                        const isSelected = selectedModelId === m.id;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => {
                              setSelectedModelId(m.id);
                              setModelDropdownOpen(false);
                            }}
                            className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 ${
                              isSelected
                                ? "bg-blue-50/50 border-blue-300 ring-1 ring-blue-500/20 shadow-2xs"
                                : "border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50/80"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${m.dotColor} shrink-0`} />
                                <span className="text-xs font-bold text-neutral-950">{m.name}</span>
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${m.badgeColor} leading-tight`}>
                                  {m.badge}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700 font-mono">
                                  {m.cost} cr
                                </span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                              </div>
                            </div>
                            <p className="text-[11px] text-neutral-600 line-clamp-2 leading-snug">
                              {m.desc}
                            </p>
                            <div className="flex items-center gap-2 pt-0.5 text-[9px] text-neutral-400 font-medium flex-wrap">
                              <span>ðŸ“ {m.maxResolution}</span>
                              <span>Â·</span>
                              <span>âš¡ {m.primaryJob}</span>
                              <span>Â·</span>
                              <span className="font-mono text-neutral-500">{m.engine}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dropdown Footer */}
                  <div className="px-3.5 py-2 border-t border-neutral-100 bg-neutral-50/80 flex items-center justify-between text-[11px] text-neutral-500">
                    <span>Selected: <strong className="text-neutral-900">{currentModel.name}</strong></span>
                    <button
                      type="button"
                      onClick={() => { setModelDropdownOpen(false); setModelModalOpen(true); }}
                      className="text-blue-600 hover:underline font-semibold cursor-pointer"
                    >
                      Compare full specs â†’
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Thin divider */}
            <span className="w-px h-4 bg-neutral-200 shrink-0" />

            {/* Aspect Ratio Dropdown */}
            <div className="relative" ref={ratioMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setRatioMenuOpen(!ratioMenuOpen);
                  setModelDropdownOpen(false);
                  setResolutionMenuOpen(false);
                }}
                className={`h-8 px-2 rounded-xl border text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  ratioMenuOpen
                    ? "bg-neutral-950 text-white border-neutral-950"
                    : "bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-700 hover:border-neutral-300"
                }`}
                title="Select Frame Aspect Ratio"
              >
                {/* Mini Visual Shape */}
                <div className="flex items-center justify-center w-3.5 h-3.5">
                  <div
                    className={`border rounded-sm ${ratioMenuOpen ? "border-white bg-white/30" : "border-neutral-600 bg-neutral-100"} ${ALL_FRAME_RATIOS[selectedRatio]?.boxWidth || "w-3.5"} ${ALL_FRAME_RATIOS[selectedRatio]?.boxHeight || "h-2.5"}`}
                  />
                </div>
                <span className="font-bold">{selectedRatio}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${ratioMenuOpen ? "rotate-180 text-white" : "text-neutral-400"}`} />
              </button>

              {ratioMenuOpen && (
                <div className="absolute left-0 bottom-full mb-2 w-[300px] max-h-[380px] overflow-y-auto bg-white rounded-2xl border border-neutral-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.16)] p-2 z-50 animate-dropdown scrollbar-thin">
                  <div className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-widest text-neutral-400 flex items-center justify-between border-b border-neutral-100 mb-1">
                    <span>Aspect Ratios</span>
                    <span className="text-neutral-400 font-mono text-[9px]">{availableRatios.length} supported</span>
                  </div>
                  <div className="space-y-1">
                    {availableRatios.map((r) => {
                      const isSelected = selectedRatio === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => { setSelectedRatio(r.id); setRatioMenuOpen(false); }}
                          className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between cursor-pointer ${isSelected ? "bg-neutral-950 text-white shadow-xs" : "hover:bg-neutral-100/80 text-neutral-800"}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-neutral-100/90 flex items-center justify-center shrink-0">
                              <div className={`border-2 rounded-sm ${isSelected ? "border-white bg-white/20" : "border-neutral-700 bg-neutral-300/40"} ${r.boxWidth} ${r.boxHeight}`} />
                            </div>
                            <div>
                              <div className="text-[12px] font-bold leading-none">{r.id} Â· {r.label}</div>
                              <div className={`text-[10px] mt-0.5 ${isSelected ? "text-neutral-300" : "text-neutral-400"}`}>{r.desc}</div>
                            </div>
                          </div>
                          <span className={`text-[10px] font-mono ${isSelected ? "text-neutral-300" : "text-neutral-400"}`}>{r.sub}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Thin divider */}
            <span className="w-px h-4 bg-neutral-200 shrink-0" />

            {/* Resolution Dropdown */}
            <div className="relative" ref={resolutionMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setResolutionMenuOpen(!resolutionMenuOpen);
                  setModelDropdownOpen(false);
                  setRatioMenuOpen(false);
                }}
                className={`h-8 px-2 rounded-xl border text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  resolutionMenuOpen
                    ? "bg-neutral-950 text-white border-neutral-950"
                    : "bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-700 hover:border-neutral-300"
                }`}
                title={`Output Resolution: ${currentResolution.label}`}
              >
                <span className={`font-bold ${resolutionMenuOpen ? "text-white" : "text-neutral-900"}`}>
                  {currentResolution.badge}
                </span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${resolutionMenuOpen ? "rotate-180 text-white" : "text-neutral-400"}`} />
              </button>

              {resolutionMenuOpen && (
                <div className="absolute left-0 bottom-full mb-2 w-[310px] bg-white rounded-2xl border border-neutral-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.16)] p-2 z-50 animate-dropdown">
                  <div className="px-3 pb-2 pt-1 border-b border-neutral-100 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    <span>Output Resolution</span>
                    <span className="font-mono text-[9px] text-neutral-500 font-semibold">{currentModel.name}</span>
                  </div>

                  <div className="space-y-1.5 pt-1.5">
                    {RESOLUTION_OPTIONS.map((opt) => {
                      const isSupported = opt.supportedModels.includes(currentModel.id);
                      const isSelected = selectedResolution === opt.id;

                      if (isSupported) {
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => { setSelectedResolution(opt.id); setResolutionMenuOpen(false); }}
                            className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                              isSelected ? "bg-neutral-950 text-white shadow-xs" : "hover:bg-neutral-100/70 text-neutral-800"
                            }`}
                          >
                            <div>
                              <div className="text-[12px] font-bold flex items-center gap-1.5">
                                <span>{opt.label}</span>
                                {opt.id === "4096" && (
                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${isSelected ? "bg-neutral-800 text-blue-200 border-neutral-700" : "bg-blue-50 text-blue-700 border-blue-200"}`}>
                                    4K Ultra
                                  </span>
                                )}
                              </div>
                              <div className={`text-[10px] mt-0.5 ${isSelected ? "text-neutral-300" : "text-neutral-400"}`}>
                                {opt.dimensions} Â· {opt.sub}
                              </div>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${isSelected ? "bg-neutral-800 text-white" : "bg-neutral-100 text-neutral-700"}`}>
                              {opt.tag}
                            </span>
                          </button>
                        );
                      } else {
                        return (
                          <div
                            key={opt.id}
                            className="w-full text-left px-3 py-2 rounded-xl bg-neutral-50/70 border border-neutral-100/90 opacity-45 cursor-not-allowed flex items-center justify-between"
                            title={`Not supported by ${currentModel.name} (Max: ${currentModel.maxResolution})`}
                          >
                            <div>
                              <div className="text-[12px] font-bold text-neutral-400 flex items-center gap-1.5">
                                <Lock className="w-3 h-3 text-neutral-400" />
                                <span>{opt.label}</span>
                              </div>
                              <div className="text-[10px] text-neutral-400 mt-0.5">Not supported on {currentModel.name}</div>
                            </div>
                            <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-neutral-200/80 text-neutral-500">Locked</span>
                          </div>
                        );
                      }
                    })}
                  </div>

                  <div className="mt-2 pt-2 border-t border-neutral-100 px-2 text-[10px] text-neutral-400 leading-tight">
                    <span>ðŸ’¡ 4K Ultra is exclusive to Nano Banana 2.1, Pro & 2.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Batch Count */}
            {currentModel.batchMax > 1 ? (
              <div className="flex items-center rounded-xl bg-neutral-50 border border-neutral-200 p-0.5 h-8">
                {[1, 2, 4].filter((c) => c <= currentModel.batchMax).map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setBatchCount(count)}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${batchCount === count ? "bg-neutral-950 text-white shadow-xs" : "text-neutral-500 hover:text-neutral-900"}`}
                    title={`Generate ${count} image${count > 1 ? "s" : ""} in parallel`}
                  >
                    {count}x
                  </button>
                ))}
              </div>
            ) : (
              <span className="text-[10px] font-mono text-neutral-400 px-2 py-1 rounded-lg bg-neutral-50 border border-neutral-200 h-8 flex items-center" title="Gemini models generate 1 image per call">
                1x
              </span>
            )}

            {/* Char counter */}
            <span className={`text-[11px] font-mono tabular-nums ${charCount > maxPromptChars ? "text-rose-600 font-bold" : "text-neutral-400"}`}>
              {charCount}/{maxPromptChars}
            </span>
            {charCount > 0 && (
              <button type="button" onClick={() => setPrompt("")} className="p-1 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer" title="Clear prompt">
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Seed Lock */}
            <button
              type="button"
              onClick={() => { setSeedLocked(!seedLocked); if (!seedLocked) handleNewSeed(); }}
              className={`h-8 w-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                seedLocked ? "bg-amber-50 border-amber-300 text-amber-700" : "bg-white border-neutral-200 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50"
              }`}
              title={seedLocked ? `Seed locked: ${seed}` : "Lock seed for reproducible output"}
            >
              {seedLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            </button>

            {/* Advanced Settings */}
            <button
              type="button"
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`h-8 w-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                settingsOpen ? "bg-neutral-950 text-white border-neutral-950" : "bg-white border-neutral-200 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50"
              }`}
              title="Advanced parameters"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right: Credit cost + Generate button */}
          <div className="flex items-center gap-2 ml-auto">
            <div className="flex items-center gap-1 text-neutral-600 font-bold text-[11px] px-2.5 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200/80">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="#94A3B8" strokeWidth="1.5"/>
                <path d="M5 7.5l1.5 1.5L9.5 5.5" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="tabular-nums">{totalCost} cr</span>
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || (!prompt.trim() && selectedModelId !== "virtual-try-on")}
              className="h-9 px-5 rounded-xl font-bold text-xs bg-neutral-950 hover:bg-neutral-800 active:scale-[0.98] text-white shadow-sm hover:shadow-md transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer shrink-0"
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


        {/* ── Advanced Settings Panel ── */}
        {settingsOpen && (
          <div className="px-5 pb-5 pt-4 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-dropdown-down bg-[#FAFBFD] rounded-b-3xl">
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
                className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-800 placeholder-neutral-400 font-medium"
              />
              <p className="text-[10px] text-neutral-400">Elements to exclude from the image</p>
            </div>

            {/* Guidance Scale */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Guidance (CFG)</label>
                <span className="text-[11px] font-extrabold text-neutral-900 tabular-nums">{guidanceScale.toFixed(1)}</span>
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
              <div className="flex justify-between text-[9px] text-neutral-400"><span>Creative</span><span>Precise</span></div>
            </div>

            {/* Steps */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Inference Steps</label>
                <span className="text-[11px] font-extrabold text-neutral-900 tabular-nums">{steps}</span>
              </div>
              <input
                type="range"
                min={10}
                max={50}
                value={steps}
                onChange={(e) => setSteps(Number(e.target.value))}
                className="w-full accent-neutral-950"
              />
              <div className="flex justify-between text-[9px] text-neutral-400"><span>Fast</span><span>Detailed</span></div>
            </div>

            {/* Seed */}
            <div className="space-y-1.5 sm:col-span-3">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">
                Seed {seedLocked && <span className="text-amber-600 normal-case font-normal ml-1">(locked)</span>}
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={seed === -1 ? "" : seed}
                  onChange={(e) => setSeed(Number(e.target.value))}
                  placeholder="Random (leave empty)"
                  className="flex-1 bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-800 placeholder-neutral-400 font-mono tabular-nums"
                />
                <button
                  type="button"
                  onClick={handleNewSeed}
                  className="px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Dice5 className="w-3.5 h-3.5" /> Random
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Keyboard Hints ── */}
      {!hasActiveContent && (
        <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-2 px-1">
          <kbd className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-neutral-200 text-neutral-500 font-mono text-[10px] shadow-2xs">
            ↵ Enter
          </kbd>
          <span>to generate</span>
          <span className="text-neutral-300 mx-0.5">·</span>
          <kbd className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-neutral-200 text-neutral-500 font-mono text-[10px] shadow-2xs">
            ⇧ Shift+Enter
          </kbd>
          <span>for new line</span>
        </div>
      )}

      {/* ── Generation / Output Canvas ── */}
      {hasActiveContent && (
        <div className="w-full space-y-5 animate-spring">
          {/* Generating State */}
          {isGenerating && (
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-[0_2px_32px_0_rgba(0,0,0,0.07)] overflow-hidden">
              <div className="animate-scanline" />
              <div className="px-8 py-10 text-center space-y-6 max-w-lg mx-auto">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 rounded-full border-2 border-neutral-200" />
                  <div className="absolute inset-0 rounded-full border-2 border-neutral-950 border-t-transparent animate-spin" />
                  <div className="absolute inset-2 rounded-full bg-neutral-50 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-neutral-700" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold text-neutral-950">Synthesizing via Google Vertex AI</h4>
                  <p className="text-xs text-neutral-500 font-mono">{stagePhase}</p>
                </div>

                {/* Progress bar */}
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
                  <span>SynthID watermark embedded • Escrow credit protection active</span>
                </div>
              </div>
            </div>
          )}

          {/* Rendered Output Display */}
          {!isGenerating && outputImage && (
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-[0_2px_32px_0_rgba(0,0,0,0.07)] overflow-hidden">
              {/* Output Top Bar */}
              <div className="px-5 py-3.5 border-b border-neutral-100 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="text-xs font-bold text-neutral-950">{currentModel.name}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
                    {selectedRatio} · {currentResolution.dimensions}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {totalCost} cr settled
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 hidden sm:inline">
                    SynthID Verified
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
                    download="vertex-ai-render.png"
                    className="px-4 py-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-[11px] font-bold flex items-center gap-1.5 transition-all btn-tactile"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              </div>

              {/* Image Preview Canvas */}
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
                  <span>Engine: <strong className="text-neutral-900">{currentModel.engine}</strong></span>
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
                  <span className="text-xs font-bold text-neutral-950">Recent Studio Generations</span>
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

                {/* Add New Creation */}
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

      {/* ── GOOGLE AI STUDIO-STYLE MODEL SELECTION MODAL ───────────────────── */}
      {modelModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-neutral-950/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-scale"
          onClick={() => setModelModalOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[88vh] bg-white rounded-3xl border border-neutral-200/90 shadow-[0_24px_70px_rgba(0,0,0,0.18)] flex flex-col overflow-hidden animate-dropdown"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header & Filter */}
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between gap-4 bg-white shrink-0">
              <div className="flex items-center gap-3 flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={modelFilterQuery}
                    onChange={(e) => setModelFilterQuery(e.target.value)}
                    placeholder="Filter models by name, engine, or capability..."
                    className="w-full pl-9 pr-8 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-50 focus:bg-white border border-transparent focus:border-neutral-300 text-xs text-neutral-900 focus:outline-none transition-all"
                    autoFocus
                  />
                  {modelFilterQuery && (
                    <button
                      onClick={() => setModelFilterQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Google Cloud Vertex AI</span>
                </div>
                <button
                  type="button"
                  onClick={() => setModelModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Sidebar Categories + Main List */}
            <div className="flex-1 flex flex-col sm:flex-row overflow-hidden min-h-0">
              {/* Left Sidebar Category Tabs */}
              <div className="w-full sm:w-56 p-3 sm:border-r border-neutral-100 bg-[#FAFAFA] flex sm:flex-col gap-1 overflow-x-auto shrink-0">
                <div className="px-3 py-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest hidden sm:block">
                  Categories
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCategoryTab("all")}
                  className={`px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    selectedCategoryTab === "all"
                      ? "bg-neutral-950 text-white shadow-xs"
                      : "text-neutral-600 hover:bg-neutral-200/60"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 shrink-0" />
                    <span>All Models</span>
                  </div>
                  <span className="text-[10px] font-mono opacity-80">{AVAILABLE_MODELS.length}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCategoryTab("gemini")}
                  className={`px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    selectedCategoryTab === "gemini"
                      ? "bg-neutral-950 text-white shadow-xs"
                      : "text-neutral-600 hover:bg-neutral-200/60"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Gemini Suite</span>
                  </div>
                  <span className="text-[10px] font-mono opacity-80">5</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCategoryTab("imagen")}
                  className={`px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    selectedCategoryTab === "imagen"
                      ? "bg-neutral-950 text-white shadow-xs"
                      : "text-neutral-600 hover:bg-neutral-200/60"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Imagen Suite</span>
                  </div>
                  <span className="text-[10px] font-mono opacity-80">2</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCategoryTab("specialized")}
                  className={`px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    selectedCategoryTab === "specialized"
                      ? "bg-neutral-950 text-white shadow-xs"
                      : "text-neutral-600 hover:bg-neutral-200/60"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Shirt className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Specialized</span>
                  </div>
                  <span className="text-[10px] font-mono opacity-80">1</span>
                </button>

                {/* Sidebar Info Card */}
                <div className="mt-auto hidden sm:block p-3 rounded-2xl bg-white border border-neutral-200/80 text-[11px] text-neutral-500 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-neutral-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Official Models Only</span>
                  </div>
                  <p className="text-[10px] text-neutral-400 leading-snug">
                    Strictly authorized Google Cloud Vertex AI generative engines with SynthID watermarking.
                  </p>
                </div>
              </div>

              {/* Right Models List */}
              <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3 bg-white">
                {filteredModels.length === 0 ? (
                  <div className="text-center py-16 space-y-2">
                    <Filter className="w-8 h-8 text-neutral-300 mx-auto" />
                    <p className="text-sm font-bold text-neutral-700">No models match your filter</p>
                    <p className="text-xs text-neutral-400">Try clearing the search query or changing category</p>
                  </div>
                ) : (
                  filteredModels.map((m) => {
                    const isSelected = selectedModelId === m.id;
                    return (
                      <div
                        key={m.id}
                        onClick={() => {
                          setSelectedModelId(m.id);
                          setModelModalOpen(false);
                        }}
                        className={`group relative p-4 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? "border-blue-500 bg-blue-50/30 shadow-sm ring-1 ring-blue-500/20"
                            : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/60 hover:shadow-xs"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1.5 flex-1 min-w-0">
                            {/* Title + Badges */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`w-2 h-2 rounded-full ${m.dotColor} shrink-0`} />
                              <h3 className="text-sm font-bold text-neutral-950">{m.name}</h3>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${m.badgeColor}`}>
                                {m.badge}
                              </span>
                              <span className="text-[11px] font-mono text-neutral-400">·</span>
                              <span className="text-[11px] font-mono text-neutral-500">
                                {m.engine}
                              </span>
                            </div>

                            {/* Description */}
                            <p className="text-xs text-neutral-600 leading-relaxed">
                              {m.desc}
                            </p>

                            {/* Tech Specs Chips */}
                            <div className="flex items-center gap-2 flex-wrap pt-1 text-[10px] text-neutral-500">
                              <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 font-medium">
                                🎯 {m.primaryJob}
                              </span>
                              <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 font-mono">
                                📐 {m.maxResolution}
                              </span>
                              <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 font-mono">
                                🧠 {m.tokenLimit}
                              </span>
                              <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 font-mono">
                                🔒 SynthID Built-in
                              </span>
                            </div>
                          </div>

                          {/* Right: Cost & Select Status */}
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-neutral-900 text-white tabular-nums shadow-2xs">
                              {m.cost} cr
                            </span>
                            {isSelected ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600">
                                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                <span>Active</span>
                              </span>
                            ) : (
                              <span className="text-[11px] text-neutral-400 group-hover:text-neutral-700 font-semibold transition-colors">
                                Select →
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-neutral-100 bg-[#FAFAFA] flex items-center justify-between text-xs text-neutral-500 shrink-0">
              <div className="flex items-center gap-2">
                <span>Selected: <strong className="text-neutral-900">{currentModel.name}</strong></span>
                <span className="text-neutral-300">·</span>
                <span>Max Resolution: <strong className="text-neutral-900">{currentModel.maxResolution}</strong></span>
              </div>
              <button
                type="button"
                onClick={() => setModelModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-neutral-950 text-white font-bold text-xs hover:bg-neutral-800 transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Fullscreen Lightbox ── */}
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
                  download="vertex-render-hq.png"
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