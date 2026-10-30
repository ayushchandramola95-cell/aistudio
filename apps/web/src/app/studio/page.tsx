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
  SlidersHorizontal,
  Info,
  Undo2,
  Compass,
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

// ─── Models Catalog (Strictly 8 High-Performance Engines) ───────────────────
const AVAILABLE_MODELS: GoogleModelSpec[] = [
  {
    id: "nano-banana-2-1",
    name: "Nano Banana 2.1",
    engine: "gemini-3.1-flash-image",
    cost: 6,
    desc: "Our upgraded mainstream image engine with stronger prompt adherence, and multi-reference consistency, enabling production quality image generation and edits from 1K to 4K.",
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
    engine: "gemini-3.1-flash-lite-image",
    cost: 3,
    desc: "Class leading image generation capabilities, optimized for high-volume, latency-sensitive asset creation and instant drafts.",
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
    engine: "gemini-3-pro-image",
    cost: 10,
    desc: "A powerful image generation model that combines high quality graphics, text rendering in multiple languages, and world knowledge.",
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
    engine: "gemini-3.1-flash-image",
    cost: 5,
    desc: "Designed for general image generation and editing tasks, offering balanced high quality and low latency.",
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
    engine: "gemini-2.5-flash-image",
    cost: 4,
    desc: "Stable legacy generative image model offering direct prompt-to-image synthesis with native 1K resolution.",
    badge: "Stable Flash",
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
    engine: "imagen-4.0-fast",
    cost: 4,
    desc: "Sub-3-second diffusion synthesis optimized for rapid text-to-photo generation with parallel batch sampling.",
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
    engine: "virtual-try-on-v1",
    cost: 8,
    desc: "Specialized model to generate realistic images of people trying on clothing, drape matching, and body shape adaptation.",
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
    engine: "imagen-3.0-capability-001",
    cost: 5,
    desc: "High-precision image editing with mask-based inpainting, outpainting boundary expansion, and background replacement.",
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

// ─── Resolution Definitions ──────────────────────────────────────────────────
export interface ResolutionOption {
  id: string;
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

// ─── Style Chips with Micro-Icons & Rich Suffixes ────────────────────────────
interface StyleChip {
  id: string;
  label: string;
  icon: string;
  suffix: string;
  color: string;
}

const STYLE_CHIPS: StyleChip[] = [
  { id: "photo", label: "Photorealistic", icon: "📸", suffix: ", photorealistic studio photography, 8k resolution, crisp detail, natural diffused lighting", color: "hover:border-blue-300" },
  { id: "cinema", label: "Cinematic 35mm", icon: "🎬", suffix: ", cinematic film still, shot on 35mm anamorphic lens, atmospheric haze, volumetric rim lighting", color: "hover:border-amber-300" },
  { id: "anime", label: "Anime Art", icon: "🎨", suffix: ", anime aesthetic, detailed illustration, vibrant dramatic skies, Makoto Shinkai style, crisp lineart", color: "hover:border-rose-300" },
  { id: "octane", label: "3D Octane", icon: "🧊", suffix: ", 3D render, Octane render, raytracing, subsurface scattering, glossy volumetric lighting", color: "hover:border-cyan-300" },
  { id: "cyber", label: "Cyberpunk", icon: "🌆", suffix: ", cyberpunk aesthetic, neon glow, holographic overlays, dark rainy night, chromatic aberration", color: "hover:border-purple-300" },
  { id: "water", label: "Watercolor", icon: "🖌️", suffix: ", delicate traditional watercolor, soft wet-on-wet pigment bleeding, textured cold-press cotton paper", color: "hover:border-emerald-300" },
  { id: "fashion", label: "Editorial Fashion", icon: "💎", suffix: ", high-fashion editorial magazine, avant-garde styling, studio flash lighting, pristine composition", color: "hover:border-indigo-300" },
  { id: "fantasy", label: "Dark Fantasy", icon: "🔮", suffix: ", dark fantasy concept art, ethereal magical glow, moody chiaroscuro shadows, painterly texture", color: "hover:border-pink-300" },
];

// ─── Typewriter Placeholder Suggestions ─────────────────────────────────────
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

export default function StudioPage() {
  // ── Core Prompt & Model State ──
  const [prompt, setPrompt]                         = useState("");
  const [originalPrompt, setOriginalPrompt]         = useState<string | null>(null);
  const [selectedModelId, setSelectedModelId]       = useState("nano-banana-2-1");
  const [selectedRatio, setSelectedRatio]           = useState("16:9");
  const [selectedResolution, setSelectedResolution] = useState("1024");
  const [batchCount, setBatchCount]                 = useState(1);
  const [seedLocked, setSeedLocked]                 = useState(false);
  const [activeStyleId, setActiveStyleId]           = useState<string | null>(null);

  // ── Prompt Enhancement State ──
  const [isEnhancing, setIsEnhancing]               = useState(false);
  const [enhancementNotice, setEnhancementNotice]   = useState<string | null>(null);
  const [suggestedModelNotice, setSuggestedModelNotice] = useState<string | null>(null);

  // ── Dynamic Model-Specific Controls State ──
  const [multiRefImages, setMultiRefImages]         = useState<string[]>([]);
  const [webGrounding, setWebGrounding]             = useState(true);
  const [fastMode, setFastMode]                     = useState(true);
  const [thinkingBudget, setThinkingBudget]         = useState<"minimal" | "medium" | "deep">("medium");
  const [personFilter, setPersonFilter]             = useState<"allow_all" | "dont_allow" | "allow_adult">("allow_all");
  const [tryOnPersonImage, setTryOnPersonImage]     = useState<string | null>(null);
  const [tryOnGarmentImage, setTryOnGarmentImage]   = useState<string | null>(null);
  const [tryOnCategory, setTryOnCategory]           = useState<"tops" | "bottoms" | "dresses" | "outerwear">("tops");
  const [baseEditImage, setBaseEditImage]           = useState<string | null>(null);
  const [maskEditImage, setMaskEditImage]           = useState<string | null>(null);
  const [editMode, setEditMode]                     = useState<"inpaint" | "outpaint" | "background">("inpaint");
  const [attachedImage, setAttachedImage]           = useState<string | null>(null);

  // ── Dropdown / Modal States ──
  const [modelModalOpen, setModelModalOpen]         = useState(false);
  const [modelFilterQuery, setModelFilterQuery]     = useState("");
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>("all");
  const [ratioMenuOpen, setRatioMenuOpen]           = useState(false);
  const [resolutionMenuOpen, setResolutionMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen]             = useState(false);
  const [metadataOpen, setMetadataOpen]             = useState(false);

  // ── DOM Element Refs ──
  const studioRef                                   = useRef<HTMLDivElement>(null);
  const textareaRef                                 = useRef<HTMLTextAreaElement>(null);
  const fileInputRef                                = useRef<HTMLInputElement>(null);
  const multiFileInputRef                           = useRef<HTMLInputElement>(null);
  const tryOnPersonInputRef                         = useRef<HTMLInputElement>(null);
  const tryOnGarmentInputRef                        = useRef<HTMLInputElement>(null);
  const baseEditInputRef                            = useRef<HTMLInputElement>(null);
  const maskEditInputRef                            = useRef<HTMLInputElement>(null);
  const timerRef                                    = useRef<NodeJS.Timeout | null>(null);

  const ratioMenuRef                                = useRef<HTMLDivElement>(null);
  const resolutionMenuRef                           = useRef<HTMLDivElement>(null);

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
  const [stageStep, setStageStep]                   = useState<number>(1);
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
      prompt: "Minimalist ceramic teapot with kintsugi gold cracks on weathered oak, soft studio lighting",
      url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop",
      model: "Imagen 4 Fast",
      ratio: "1:1",
      date: "25m ago",
    },
    {
      id: "hist-3",
      prompt: "A majestic snow leopard resting on a Himalayan summit under glowing auroras",
      url: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?q=80&w=600&auto=format&fit=crop",
      model: "Nano Banana Pro",
      ratio: "16:9",
      date: "1h ago",
    },
  ]);

  // Current active model & resolution specs
  const currentModel = useMemo(() => {
    return AVAILABLE_MODELS.find((m) => m.id === selectedModelId) || AVAILABLE_MODELS[0];
  }, [selectedModelId]);

  const currentResolution = useMemo(() => {
    const found = RESOLUTION_OPTIONS.find((r) => r.id === selectedResolution);
    if (found && found.supportedModels.includes(currentModel.id)) {
      return found;
    }
    return RESOLUTION_OPTIONS.find((r) => r.id === "1024") || RESOLUTION_OPTIONS[1];
  }, [selectedResolution, currentModel]);

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

  // Keyboard shortcut for closing modal with Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && modelModalOpen) {
        setModelModalOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modelModalOpen]);

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

  // ── Auto-clear notifications after 6s ──
  useEffect(() => {
    if (errorMsg) {
      const t = setTimeout(() => setErrorMsg(null), 6000);
      return () => clearTimeout(t);
    }
  }, [errorMsg]);

  useEffect(() => {
    if (enhancementNotice) {
      const t = setTimeout(() => setEnhancementNotice(null), 5000);
      return () => clearTimeout(t);
    }
  }, [enhancementNotice]);

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

  // ── Prompt Enhancer (Live Gemini LLM) ──
  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) {
      setErrorMsg("Please enter a basic prompt before enhancing.");
      return;
    }

    setIsEnhancing(true);
    setEnhancementNotice(null);
    setSuggestedModelNotice(null);

    try {
      const activeChip = STYLE_CHIPS.find((c) => c.id === activeStyleId);
      const res = await fetch("http://localhost:8100/api/v1/jobs/enhance-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt,
          style: activeChip?.label || null,
          model_id: selectedModelId,
        }),
      });

      if (!res.ok) {
        throw new Error("Prompt enhancement service currently unavailable.");
      }

      const data = await res.json();
      if (data.enhanced_prompt) {
        setOriginalPrompt(prompt);
        setPrompt(data.enhanced_prompt);
        setEnhancementNotice("✨ Prompt enriched with cinematic lighting & textures!");

        if (data.suggested_model && data.suggested_model !== selectedModelId) {
          const suggestedSpec = AVAILABLE_MODELS.find((m) => m.id === data.suggested_model);
          if (suggestedSpec) {
            setSuggestedModelNotice(suggestedSpec.id);
          }
        }
      }
    } catch (e: any) {
      // Local graceful fallback
      setOriginalPrompt(prompt);
      const enriched = `${prompt}, photorealistic studio photography, 8k resolution, volumetric cinematic lighting with soft diffused shadows, shot on 35mm anamorphic lens with gentle depth of field, intricate micro-textures`;
      setPrompt(enriched);
      setEnhancementNotice("✨ Prompt enriched with cinematic aesthetic parameters!");
    } finally {
      setIsEnhancing(false);
      textareaRef.current?.focus();
    }
  };

  const handleUndoEnhance = () => {
    if (originalPrompt) {
      setPrompt(originalPrompt);
      setOriginalPrompt(null);
      setEnhancementNotice("↩ Restored original prompt");
    }
  };

  // ── Style Chips Toggle ──
  const handleToggleStyle = (chip: StyleChip) => {
    if (activeStyleId === chip.id) {
      setActiveStyleId(null);
      const cleaned = prompt.replace(chip.suffix, "").trim();
      setPrompt(cleaned);
      return;
    }

    let cleaned = prompt;
    STYLE_CHIPS.forEach((c) => {
      cleaned = cleaned.replace(c.suffix, "");
    });
    cleaned = cleaned.trim();

    setActiveStyleId(chip.id);
    if (!cleaned) {
      setPrompt(`A captivating creation${chip.suffix}`);
    } else {
      setPrompt(`${cleaned}${chip.suffix}`);
    }
    textareaRef.current?.focus();
  };

  // ── File Upload Handlers ──
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

  const handleInsertQuote = () => {
    const quoted = prompt.includes('“') || prompt.includes('"')
      ? prompt
      : `${prompt} with signage text “AI STUDIO”`;
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
    setStageStep(1);
    setStagePhase("Reserving credits via Two-Phase Escrow...");

    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      setElapsedTime(Math.round((Date.now() - startTime) / 100) / 10);
    }, 100);

    const token = typeof window !== "undefined" ? localStorage.getItem("aistudio_token") : null;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const modelParameters: Record<string, any> = {
      aspect_ratio: selectedRatio,
      resolution: selectedResolution,
      sample_count: batchCount,
      guidance_scale: guidanceScale,
      steps,
      ...(negativePrompt ? { negative_prompt: negativePrompt } : {}),
      ...(seedLocked && seed !== -1 ? { seed } : {}),
    };

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
      setStageStep(2);
      setStagePhase(`Routing inference to generative pipeline (${currentModel.engine})...`);

      let completedJob: GenerationJob | null = null;
      for (let pollCount = 0; pollCount < 25; pollCount++) {
        await new Promise((r) => setTimeout(r, 600));
        setProgress(Math.min(92, 40 + pollCount * 10));

        if (pollCount === 2) {
          setStageStep(3);
          setStagePhase(`Rendering diffusion latent frames on ${currentModel.name}...`);
        } else if (pollCount === 5) {
          setStageStep(4);
          setStagePhase(`Embedding SynthID digital fingerprint & finalizing...`);
        }

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
      setTimeout(() => setShowSuccess(false), 3500);

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
    setOriginalPrompt(null);
    setActiveJob(null);
    setProgress(0);
    setElapsedTime(0);
    setMultiRefImages([]);
    setTryOnPersonImage(null);
    setTryOnGarmentImage(null);
    setBaseEditImage(null);
    setMaskEditImage(null);
    setAttachedImage(null);
    setActiveStyleId(null);
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
      return "Describe complex spatial scenes, infographic charts, or quote exact text for crisp typography e.g. Neon sign with text “AI STUDIO”...";
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

  return (
    <div
      ref={studioRef}
      className={`w-full max-w-5xl mx-auto transition-all duration-500 ${
        hasActiveContent
          ? "space-y-6 pt-2 pb-24"
          : "min-h-[calc(100vh-140px)] flex flex-col justify-center items-center py-6"
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

      {/* ── Enhancement / Success Notification ── */}
      {enhancementNotice && (
        <div className="w-full mb-3 px-4 py-2.5 rounded-2xl bg-blue-50/90 border border-blue-200/90 flex items-center justify-between text-blue-900 text-xs font-semibold animate-spring shadow-2xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 animate-pulse" />
            <span>{enhancementNotice}</span>
          </div>
          {originalPrompt && (
            <button
              onClick={handleUndoEnhance}
              className="px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-blue-700 hover:bg-blue-100 flex items-center gap-1 text-[11px] font-bold cursor-pointer transition-all"
            >
              <Undo2 className="w-3 h-3" />
              <span>Undo</span>
            </button>
          )}
        </div>
      )}

      {/* ── Suggested Model Recommendation Notice ── */}
      {suggestedModelNotice && (
        <div className="w-full mb-3 px-4 py-2.5 rounded-2xl bg-purple-50/90 border border-purple-200/90 flex items-center justify-between text-purple-900 text-xs font-semibold animate-spring shadow-2xs">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-600 shrink-0" />
            <span>
              Recommendation: <strong>{AVAILABLE_MODELS.find(m => m.id === suggestedModelNotice)?.name}</strong> is optimal for this prompt!
            </span>
          </div>
          <button
            onClick={() => {
              setSelectedModelId(suggestedModelNotice);
              setSuggestedModelNotice(null);
            }}
            className="px-3 py-1 rounded-lg bg-purple-600 text-white hover:bg-purple-700 text-[11px] font-bold cursor-pointer transition-all shadow-xs"
          >
            Apply Model
          </button>
        </div>
      )}

      {/* ── Success Flash ── */}
      {showSuccess && (
        <div className="w-full mb-3 px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-800 text-xs font-semibold animate-spring shadow-2xs">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Generation complete — rendered in ultra-high resolution!</span>
        </div>
      )}

      {/* ── Idle Hero Banner ── */}
      {!hasActiveContent && (
        <div className="text-center space-y-3 mb-6 animate-fade-scale">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-neutral-800 text-xs font-semibold border border-neutral-200/80 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span>AI Studio Omni-Canvas · 8 High-Performance Engines</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal font-editorial text-neutral-950 tracking-tight leading-tight">
            What will you create?
          </h1>
          <p className="text-sm text-neutral-500 font-sans max-w-md mx-auto">
            Describe your vision, enhance prompts with AI, and generate ultra-high-definition imagery.
          </p>
        </div>
      )}

      {/* ── Centerpiece Floating Prompt Box ── */}
      <div
        className={`w-full bg-white rounded-3xl border border-neutral-200/90 prompt-box-shadow glow-focus-ring relative transition-all duration-300 hover:border-neutral-300`}
      >
        {/* Model Identity Header Strip */}
        <div className="px-4 py-2.5 bg-gradient-to-r from-neutral-50 via-white to-neutral-50 border-b border-neutral-100 flex items-center justify-between gap-2 flex-wrap rounded-t-3xl">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setModelModalOpen(true)}
              className="flex items-center gap-1.5 shrink-0 px-2 py-1 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer group"
              title="Click to view all 8 models"
            >
              <span className={`w-2 h-2 rounded-full ${currentModel.dotColor} shrink-0`} />
              <span className="text-[11px] font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">{currentModel.name}</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${currentModel.badgeColor} leading-tight`}>
                {currentModel.badge}
              </span>
            </button>
            <span className="w-px h-3 bg-neutral-200 shrink-0" />

            {/* Model Specific Dynamic Toggles */}
            {selectedModelId === "nano-banana-2-1" && (
              <button
                type="button"
                onClick={() => setWebGrounding(!webGrounding)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer border ${
                  webGrounding
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white border-neutral-200 text-neutral-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
                }`}
                title="Ground generations with live Google Web Search knowledge"
              >
                <Globe className="w-3 h-3" />
                <span>Web Grounding</span>
                {webGrounding && <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />}
              </button>
            )}

            {selectedModelId === "nano-banana-2-lite" && (
              <button
                type="button"
                onClick={() => setFastMode(!fastMode)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border cursor-pointer transition-all ${
                  fastMode ? "bg-emerald-600 text-white border-emerald-600 shadow-xs" : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <Zap className="w-3 h-3" />
                <span>Turbo {fastMode ? "Active" : "Standard"}</span>
              </button>
            )}

            {selectedModelId === "nano-banana-pro" && (
              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-full bg-white border border-neutral-200/90 p-0.5 text-[11px] font-semibold shadow-2xs">
                  <span className="px-2 text-neutral-400 text-[10px] font-medium flex items-center gap-1">
                    <Brain className="w-2.5 h-2.5 text-purple-500" /> Think:
                  </span>
                  {(["minimal", "medium", "deep"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setThinkingBudget(t)}
                      className={`px-2 py-0.5 rounded-full capitalize cursor-pointer transition-all ${
                        thinkingBudget === t ? "bg-purple-600 text-white font-bold" : "text-neutral-500 hover:text-neutral-900"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleInsertQuote}
                  className="px-2.5 py-1 rounded-full bg-white border border-neutral-200 hover:bg-neutral-100 text-[11px] font-semibold text-neutral-700 flex items-center gap-1 cursor-pointer transition-all"
                  title="Add exact quoted typography"
                >
                  <span>"Signage Text"</span>
                </button>
              </div>
            )}

            {selectedModelId === "imagen-4-fast" && (
              <div className="flex items-center rounded-full bg-white border border-neutral-200/90 p-0.5 text-[11px] font-semibold shadow-2xs">
                <span className="px-2 text-neutral-400 text-[10px] font-medium">People:</span>
                {(["allow_all", "allow_adult", "dont_allow"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setPersonFilter(f)}
                    className={`px-2 py-0.5 rounded-full cursor-pointer transition-all text-[10px] ${
                      personFilter === f ? "bg-amber-500 text-white font-bold" : "text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    {f === "allow_all" ? "All" : f === "allow_adult" ? "Adults" : "None"}
                  </button>
                ))}
              </div>
            )}

            {selectedModelId === "virtual-try-on" && (
              <div className="flex items-center rounded-full bg-white border border-neutral-200/90 p-0.5 text-[11px] font-semibold shadow-2xs">
                <span className="px-2 text-neutral-400 text-[10px] font-medium">Garment:</span>
                {(["tops", "bottoms", "dresses", "outerwear"] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setTryOnCategory(cat)}
                    className={`px-2 py-0.5 rounded-full capitalize cursor-pointer transition-all text-[10px] ${
                      tryOnCategory === cat ? "bg-rose-500 text-white font-bold" : "text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {selectedModelId === "imagen-3-capability-001" && (
              <div className="flex items-center rounded-full bg-white border border-neutral-200/90 p-0.5 text-[11px] font-semibold shadow-2xs">
                {(["inpaint", "outpaint", "background"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setEditMode(m)}
                    className={`px-2.5 py-0.5 rounded-full capitalize cursor-pointer transition-all text-[10px] ${
                      editMode === m ? "bg-cyan-600 text-white font-bold" : "text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    {m === "inpaint" ? "Inpaint" : m === "outpaint" ? "Outpaint" : "BG Swap"}
                  </button>
                ))}
              </div>
            )}

            {selectedModelId === "nano-banana-2" && (
              <span className="text-[10px] text-teal-700 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-teal-500" />
                5 chars · 14 objects supported
              </span>
            )}
          </div>

          {/* Right Engine Label */}
          <div className="hidden sm:flex items-center gap-1 text-[10px] text-neutral-400 font-medium">
            <span className="text-neutral-300">Engine:</span>
            <strong className="text-neutral-600 font-semibold font-mono">{currentModel.engine}</strong>
          </div>
        </div>

        {/* Main Input Area */}
        <div className="p-5 pb-3">
          {/* Virtual Try-On Dual Dropzones */}
          {selectedModelId === "virtual-try-on" ? (
            <div className="space-y-3.5 animate-spring">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
            /* Inpainting Dropzones */
            <div className="space-y-3.5 animate-spring">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
            /* Standard Full-Width Prompt Textarea */
            <div className="space-y-3">
              {/* Horizontal Reference Thumbnails (Nano Banana 2.1) */}
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

              {/* Textarea container */}
              <div className="relative flex flex-col">
                <textarea
                  ref={textareaRef}
                  rows={hasActiveContent ? 2 : 3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={dynamicPlaceholder}
                  className="w-full bg-transparent text-sm sm:text-base text-neutral-900 placeholder-neutral-400 focus:outline-none resize-none font-normal leading-relaxed"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleGenerate();
                    }
                  }}
                />

                {/* Sub-Textarea Action Ribbon: Attach Image + Enhance Prompt */}
                <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-neutral-100/70">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Attachment buttons */}
                    {selectedModelId === "nano-banana-2-1" && (
                      <button
                        type="button"
                        onClick={() => multiFileInputRef.current?.click()}
                        disabled={multiRefImages.length >= 14}
                        className="inline-flex items-center gap-1.5 text-xs text-neutral-600 hover:text-blue-600 transition-colors cursor-pointer group"
                      >
                        <div className="w-6 h-6 rounded-lg border border-neutral-200 group-hover:border-blue-300 group-hover:bg-blue-50 flex items-center justify-center transition-all">
                          <Plus className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-medium text-[11px]">
                          {multiRefImages.length === 0 ? "Add Reference Photos (0/14)" : `Refs (${multiRefImages.length}/14)`}
                        </span>
                      </button>
                    )}

                    {(selectedModelId === "nano-banana-2" || selectedModelId === "nano-banana" || selectedModelId === "nano-banana-pro") && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer group"
                      >
                        <div className="w-6 h-6 rounded-lg border border-neutral-200 group-hover:border-neutral-400 flex items-center justify-center transition-all">
                          <ImageIcon className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-medium text-[11px]">
                          {attachedImage ? <span className="text-emerald-600 font-semibold">Image Attached ✓</span> : "Attach Reference"}
                        </span>
                      </button>
                    )}

                    {/* Surprise Me / Dice */}
                    <button
                      type="button"
                      onClick={handleSurpriseMe}
                      className="inline-flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-neutral-50 border border-transparent hover:border-neutral-200"
                      title="Generate a creative random prompt"
                    >
                      <Dice5 className="w-3.5 h-3.5 text-amber-500" />
                      <span>Surprise Me</span>
                    </button>
                  </div>

                  {/* Sparkle Enhance Prompt Action */}
                  <div className="flex items-center gap-2">
                    {originalPrompt && (
                      <button
                        type="button"
                        onClick={handleUndoEnhance}
                        className="inline-flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-neutral-100"
                        title="Revert to original prompt"
                      >
                        <Undo2 className="w-3 h-3" />
                        <span>Revert</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleEnhancePrompt}
                      disabled={isEnhancing || !prompt.trim()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 border border-blue-200 text-xs font-bold transition-all shadow-2xs hover:shadow-xs active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      title="Enrich prompt with cinematic lighting, camera specs & textures via Gemini"
                    >
                      <Sparkles className={`w-3.5 h-3.5 text-blue-600 ${isEnhancing ? "animate-spin" : ""}`} />
                      <span>{isEnhancing ? "Enhancing..." : "✨ Enhance"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Visual Style Chips Carousel Tray ── */}
        <div className="px-4 py-2 border-t border-neutral-100 bg-neutral-50/60 flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest shrink-0 pr-1 flex items-center gap-1">
            <Compass className="w-3 h-3" /> Styles:
          </span>
          {STYLE_CHIPS.map((chip) => {
            const isActive = activeStyleId === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => handleToggleStyle(chip)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 cursor-pointer border ${
                  isActive
                    ? "bg-neutral-950 text-white border-neutral-950 shadow-2xs"
                    : `bg-white border-neutral-200/80 text-neutral-700 ${chip.color} hover:bg-neutral-50`
                }`}
              >
                <span>{chip.icon}</span>
                <span>{chip.label}</span>
                {isActive && <Check className="w-3 h-3 text-white ml-0.5" />}
              </button>
            );
          })}
        </div>

        {/* ── Bottom Controls Toolbar ── */}
        <div className="px-4 py-3 border-t border-neutral-100 flex items-center justify-between gap-2 flex-wrap bg-white rounded-b-3xl">
          {/* Left Group: Model + Ratio + Resolution + Batch + Seed + Advanced */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Model Selector Button -> Opens Big Modal Directly */}
            <button
              type="button"
              onClick={() => {
                setModelModalOpen(true);
                setRatioMenuOpen(false);
                setResolutionMenuOpen(false);
              }}
              className="h-8 px-3 rounded-xl border text-[11px] font-bold flex items-center gap-2 transition-all cursor-pointer bg-neutral-50 hover:bg-neutral-100 border-neutral-200/90 text-neutral-900 hover:border-neutral-300 shadow-2xs"
              title="Click to select model engine"
            >
              <span className={`w-2 h-2 rounded-full ${currentModel.dotColor} shrink-0`} />
              <span className="truncate max-w-[130px]">{currentModel.name}</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-200/70 text-neutral-700">
                {currentModel.cost} cr
              </span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            <span className="w-px h-4 bg-neutral-200 shrink-0" />

            {/* Aspect Ratio Selector */}
            <div className="relative" ref={ratioMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setRatioMenuOpen(!ratioMenuOpen);
                  setResolutionMenuOpen(false);
                }}
                className={`h-8 px-2.5 rounded-xl border text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  ratioMenuOpen
                    ? "bg-neutral-950 text-white border-neutral-950"
                    : "bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-700 hover:border-neutral-300"
                }`}
                title="Select Frame Aspect Ratio"
              >
                <div className="flex items-center justify-center w-3.5 h-3.5">
                  <div
                    className={`border rounded-xs ${
                      ratioMenuOpen ? "border-white bg-white/30" : "border-neutral-600 bg-neutral-100"
                    } ${ALL_FRAME_RATIOS[selectedRatio]?.boxWidth || "w-3.5"} ${ALL_FRAME_RATIOS[selectedRatio]?.boxHeight || "h-2.5"}`}
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
                          className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                            isSelected ? "bg-neutral-950 text-white shadow-xs" : "hover:bg-neutral-100/80 text-neutral-800"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-neutral-100/90 flex items-center justify-center shrink-0">
                              <div className={`border-2 rounded-xs ${isSelected ? "border-white bg-white/20" : "border-neutral-700 bg-neutral-300/40"} ${r.boxWidth} ${r.boxHeight}`} />
                            </div>
                            <div>
                              <div className="text-[12px] font-bold leading-none">{r.id} · {r.label}</div>
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

            <span className="w-px h-4 bg-neutral-200 shrink-0" />

            {/* Resolution Selector */}
            <div className="relative" ref={resolutionMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setResolutionMenuOpen(!resolutionMenuOpen);
                  setRatioMenuOpen(false);
                }}
                className={`h-8 px-2.5 rounded-xl border text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
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
                                {opt.dimensions} · {opt.sub}
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
                    <span>💡 4K Ultra resolution is exclusive to Nano Banana 2.1, Pro & 2.</span>
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
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      batchCount === count ? "bg-neutral-950 text-white shadow-xs" : "text-neutral-500 hover:text-neutral-900"
                    }`}
                    title={`Generate ${count} image${count > 1 ? "s" : ""} in parallel`}
                  >
                    {count}x
                  </button>
                ))}
              </div>
            ) : (
              <span className="text-[10px] font-mono text-neutral-400 px-2 py-1 rounded-lg bg-neutral-50 border border-neutral-200 h-8 flex items-center" title="Engine renders 1 image per inference">
                1x
              </span>
            )}

            {/* Character counter */}
            <span className={`text-[11px] font-mono tabular-nums ${charCount > maxPromptChars ? "text-rose-600 font-bold" : "text-neutral-400"}`}>
              {charCount}/{maxPromptChars}
            </span>
            {charCount > 0 && (
              <button
                type="button"
                onClick={() => { setPrompt(""); setOriginalPrompt(null); }}
                className="p-1 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                title="Clear prompt"
              >
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

            {/* Advanced Settings Drawer Toggle */}
            <button
              type="button"
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`h-8 w-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                settingsOpen ? "bg-neutral-950 text-white border-neutral-950" : "bg-white border-neutral-200 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50"
              }`}
              title="Advanced generation parameters"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right Group: Credit Cost Pill + Generate Button */}
          <div className="flex items-center gap-2 ml-auto">
            <div className="flex items-center gap-1.5 text-neutral-700 font-bold text-[11px] px-2.5 py-1.5 rounded-xl bg-neutral-50 border border-neutral-200/90 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
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

        {/* Advanced Settings Collapsible Accordion */}
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
                placeholder="blurry, distorted, low quality, duplicate..."
                className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-800 placeholder-neutral-400 font-medium shadow-2xs"
              />
              <p className="text-[10px] text-neutral-400">Tokens/elements to exclude</p>
            </div>

            {/* Guidance Scale (CFG) */}
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
              <div className="flex justify-between text-[9px] text-neutral-400"><span>Creative (1.0)</span><span>Prompt Adherent (15.0)</span></div>
            </div>

            {/* Inference Steps */}
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
              <div className="flex justify-between text-[9px] text-neutral-400"><span>Draft (10)</span><span>Cinema Detail (50)</span></div>
            </div>

            {/* Numerical Seed */}
            <div className="space-y-1.5 sm:col-span-3">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">
                Seed Number {seedLocked && <span className="text-amber-600 normal-case font-normal ml-1">(Locked for deterministic variations)</span>}
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={seed === -1 ? "" : seed}
                  onChange={(e) => setSeed(Number(e.target.value))}
                  placeholder="Random (leave blank)"
                  className="flex-1 bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-800 placeholder-neutral-400 font-mono tabular-nums shadow-2xs"
                />
                <button
                  type="button"
                  onClick={handleNewSeed}
                  className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Dice5 className="w-3.5 h-3.5" /> Randomize
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Keyboard Shortcuts Hint */}
      {!hasActiveContent && (
        <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-2 px-1">
          <kbd className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-neutral-600 font-mono text-[10px] shadow-2xs">
            ↵ Enter
          </kbd>
          <span>to generate</span>
          <span className="text-neutral-300 mx-0.5">·</span>
          <kbd className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-neutral-600 font-mono text-[10px] shadow-2xs">
            ⇧ Shift+Enter
          </kbd>
          <span>for new line</span>
        </div>
      )}

      {/* ── Generation & Output Canvas ── */}
      {hasActiveContent && (
        <div className="w-full space-y-6 animate-spring">
          {/* Generating State with 4-Step Telemetry */}
          {isGenerating && (
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-[0_2px_32px_0_rgba(0,0,0,0.07)] overflow-hidden relative">
              <div className="animate-scanline" />
              <div className="px-8 py-10 text-center space-y-6 max-w-lg mx-auto">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 rounded-full border-2 border-neutral-200" />
                  <div className="absolute inset-0 rounded-full border-2 border-neutral-950 border-t-transparent animate-spin" />
                  <div className="absolute inset-2 rounded-full bg-neutral-50 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-neutral-700 animate-pulse" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-base font-bold text-neutral-950">Synthesizing via AI Studio Core Engine</h4>
                  <p className="text-xs text-neutral-500 font-mono">{stagePhase}</p>
                </div>

                {/* Multi-step Telemetry Progress List */}
                <div className="grid grid-cols-2 gap-2 text-left bg-neutral-50 p-3.5 rounded-2xl border border-neutral-100 text-[11px]">
                  <div className="flex items-center gap-2">
                    {stageStep >= 1 ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-neutral-300 inline-block" />
                    )}
                    <span className={stageStep >= 1 ? "font-bold text-neutral-900" : "text-neutral-400"}>
                      1. Escrow Reservation
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {stageStep >= 2 ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-neutral-300 inline-block" />
                    )}
                    <span className={stageStep >= 2 ? "font-bold text-neutral-900" : "text-neutral-400"}>
                      2. Generative Inference Worker
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {stageStep >= 3 ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-neutral-300 inline-block" />
                    )}
                    <span className={stageStep >= 3 ? "font-bold text-neutral-900" : "text-neutral-400"}>
                      3. Latent Synthesis
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {stageStep >= 4 ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-neutral-300 inline-block" />
                    )}
                    <span className={stageStep >= 4 ? "font-bold text-neutral-900" : "text-neutral-400"}>
                      4. SynthID Fingerprint
                    </span>
                  </div>
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

          {/* Rendered Output Display Canvas */}
          {!isGenerating && outputImage && (
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-[0_2px_32px_0_rgba(0,0,0,0.07)] overflow-hidden">
              {/* Output Top Bar */}
              <div className="px-5 py-3.5 border-b border-neutral-100 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
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
                    download="aistudio-render-hq.jpg"
                    className="px-4 py-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-[11px] font-bold flex items-center gap-1.5 transition-all btn-tactile shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              </div>

              {/* High-Res Studio Image Canvas with Ambient Backdrop */}
              <div className="relative group bg-[#F7F7F8] flex items-center justify-center min-h-[360px] p-4 sm:p-6 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-15 scale-110 pointer-events-none"
                  style={{ backgroundImage: `url(${outputImage})` }}
                />
                <img
                  src={outputImage}
                  alt="Generated output"
                  className="relative z-10 max-h-[620px] w-auto object-contain rounded-2xl shadow-luxury transition-transform duration-500 group-hover:scale-[1.008]"
                />
                <button
                  onClick={() => setLightboxImage(outputImage)}
                  className="absolute bottom-6 right-6 z-20 px-3.5 py-1.5 rounded-xl bg-neutral-950/80 backdrop-blur-sm text-white text-[11px] font-semibold flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-md"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Fullscreen View
                </button>
              </div>

              {/* Action Ribbon & Metadata Inspection */}
              <div className="px-5 py-3.5 border-t border-neutral-100 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3 text-[11px] text-neutral-500">
                  <span>Latency: <strong className="text-neutral-900">{elapsedTime > 0 ? `${elapsedTime.toFixed(1)}s` : "1.8s"}</strong></span>
                  <span className="text-neutral-300">·</span>
                  <span>Engine: <strong className="text-neutral-900 font-mono">{currentModel.engine}</strong></span>
                  <button
                    onClick={() => setMetadataOpen(!metadataOpen)}
                    className="text-blue-600 hover:underline font-semibold flex items-center gap-1 ml-2 cursor-pointer"
                  >
                    <Info className="w-3 h-3" />
                    <span>{metadataOpen ? "Hide Specs" : "Inspect Specs"}</span>
                  </button>
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
                    4x AI Upscale
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

              {/* Expandable Technical Metadata Inspector */}
              {metadataOpen && (
                <div className="px-5 py-4 bg-[#F8FAFC] border-t border-neutral-100 text-xs animate-dropdown-down space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Generation Metadata Audit</span>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold">Two-Phase Settlement Confirmed</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[11px]">
                    <div className="p-2.5 rounded-xl bg-white border border-neutral-200/80">
                      <span className="text-neutral-400 text-[9px] block uppercase font-sans">Model Identifier</span>
                      <span className="font-bold text-neutral-800">{selectedModelId}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-neutral-200/80">
                      <span className="text-neutral-400 text-[9px] block uppercase font-sans">Seed</span>
                      <span className="font-bold text-neutral-800">{seedLocked && seed !== -1 ? seed : "Deterministic Latent"}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-neutral-200/80">
                      <span className="text-neutral-400 text-[9px] block uppercase font-sans">Aspect Ratio & Res</span>
                      <span className="font-bold text-neutral-800">{selectedRatio} ({currentResolution.dimensions})</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-neutral-200/80">
                      <span className="text-neutral-400 text-[9px] block uppercase font-sans">SynthID Watermark</span>
                      <span className="font-bold text-blue-600">DeepMind Embedded</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-neutral-200/80 space-y-1">
                    <span className="text-neutral-400 text-[9px] block uppercase font-sans">Prompt Executed</span>
                    <p className="text-neutral-800 text-[11px] font-sans leading-relaxed">{prompt}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recent History Carousel Strip */}
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
                  View all in gallery →
                </Link>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => { setPrompt(item.prompt); setOutputImage(item.url); }}
                    className="group relative w-[96px] h-[96px] shrink-0 rounded-2xl overflow-hidden border border-neutral-200 hover:border-neutral-400 cursor-pointer transition-all duration-200 hover:shadow-md"
                    title={item.prompt}
                  >
                    <img src={item.url} alt="history" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-neutral-950/65 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold gap-0.5 p-1 text-center">
                      <ImageIcon className="w-4 h-4 mb-0.5" />
                      <span>Load</span>
                      <span className="text-[8px] text-neutral-300 font-normal">{item.ratio}</span>
                    </div>
                    <div className="absolute bottom-1.5 right-1.5">
                      <span className="text-[8px] font-bold bg-neutral-950/75 text-white px-1.5 py-0.5 rounded-full backdrop-blur-xs">
                        {item.date}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Add New Creation Card */}
                <div
                  onClick={handleReset}
                  className="w-[96px] h-[96px] shrink-0 rounded-2xl border-2 border-dashed border-neutral-200 hover:border-neutral-400 cursor-pointer transition-all flex flex-col items-center justify-center text-neutral-400 hover:text-neutral-700 gap-1 group bg-neutral-50/50 hover:bg-neutral-50"
                >
                  <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-semibold">New</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── PROFESSIONAL MODEL SELECTION POPUP MODAL ───────────────────────── */}
      {modelModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-scale"
          onClick={() => setModelModalOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[88vh] bg-white rounded-3xl border border-neutral-200/90 shadow-[0_24px_80px_rgba(0,0,0,0.22)] flex flex-col overflow-hidden animate-dropdown"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header & Filter */}
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between gap-4 bg-white shrink-0">
              <div className="flex items-center gap-3 flex-1 max-w-lg">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={modelFilterQuery}
                    onChange={(e) => setModelFilterQuery(e.target.value)}
                    placeholder="Search 8 generative engines by name, engine, or capability..."
                    className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-neutral-400 text-xs text-neutral-900 focus:outline-none transition-all font-medium placeholder-neutral-400 shadow-2xs"
                    autoFocus
                  />
                  {modelFilterQuery && (
                    <button
                      onClick={() => setModelFilterQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-neutral-700 bg-neutral-100 px-3 py-1.5 rounded-full border border-neutral-200/80 font-bold font-mono">
                  8 Certified Models
                </span>
                <button
                  type="button"
                  onClick={() => setModelModalOpen(false)}
                  className="p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-800 transition-colors cursor-pointer"
                  title="Close (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Sidebar Categories + Main List */}
            <div className="flex-1 flex flex-col sm:flex-row overflow-hidden min-h-0">
              <div className="w-full sm:w-60 p-3 sm:border-r border-neutral-100 bg-[#FAFAFA] flex sm:flex-col gap-1.5 overflow-x-auto shrink-0">
                <div className="px-3 py-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest hidden sm:block">
                  Engines Suite
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCategoryTab("all")}
                  className={`px-3 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    selectedCategoryTab === "all"
                      ? "bg-neutral-950 text-white shadow-xs"
                      : "text-neutral-600 hover:bg-neutral-200/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 shrink-0" />
                    <span>All Models</span>
                  </div>
                  <span className="text-[10px] font-mono opacity-80">{AVAILABLE_MODELS.length}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCategoryTab("gemini")}
                  className={`px-3 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    selectedCategoryTab === "gemini"
                      ? "bg-neutral-950 text-white shadow-xs"
                      : "text-neutral-600 hover:bg-neutral-200/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Gemini Suite</span>
                  </div>
                  <span className="text-[10px] font-mono opacity-80">5</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCategoryTab("imagen")}
                  className={`px-3 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    selectedCategoryTab === "imagen"
                      ? "bg-neutral-950 text-white shadow-xs"
                      : "text-neutral-600 hover:bg-neutral-200/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ImageIcon className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Imagen Suite</span>
                  </div>
                  <span className="text-[10px] font-mono opacity-80">2</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCategoryTab("specialized")}
                  className={`px-3 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    selectedCategoryTab === "specialized"
                      ? "bg-neutral-950 text-white shadow-xs"
                      : "text-neutral-600 hover:bg-neutral-200/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Shirt className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Specialized (Try-On)</span>
                  </div>
                  <span className="text-[10px] font-mono opacity-80">1</span>
                </button>

                <div className="mt-auto hidden sm:block p-3.5 rounded-2xl bg-white border border-neutral-200/80 text-[11px] text-neutral-500 space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-1.5 font-bold text-neutral-900">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>AI Studio Verified</span>
                  </div>
                  <p className="text-[10px] text-neutral-400 leading-relaxed">
                    Zero hardware overhead. Built-in SynthID digital watermarking with two-phase transactional escrow protection.
                  </p>
                </div>
              </div>

              {/* Right Models List */}
              <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3 bg-white scrollbar-thin">
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
                            ? "border-neutral-950 bg-neutral-50/80 shadow-sm ring-1 ring-neutral-950"
                            : "border-neutral-200/90 hover:border-neutral-400 hover:bg-neutral-50/50 hover:shadow-2xs"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1.5 flex-1 min-w-0">
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

                            <p className="text-xs text-neutral-600 leading-relaxed">
                              {m.desc}
                            </p>

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

                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-neutral-900 text-white tabular-nums shadow-2xs font-mono">
                              {m.cost} cr
                            </span>
                            {isSelected ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-neutral-900 bg-white border border-neutral-300 px-2.5 py-0.5 rounded-lg shadow-2xs">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Active</span>
                              </span>
                            ) : (
                              <span className="text-[11px] text-neutral-500 group-hover:text-neutral-950 font-bold transition-colors">
                                Select Model →
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
            <div className="px-6 py-3.5 border-t border-neutral-100 bg-neutral-50/90 flex items-center justify-between text-xs text-neutral-600 shrink-0">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${currentModel.dotColor}`} />
                <span>Active Model: <strong className="text-neutral-950 font-bold">{currentModel.name}</strong></span>
                <span className="text-neutral-300">·</span>
                <span>Max Resolution: <strong className="text-neutral-900">{currentModel.maxResolution}</strong></span>
              </div>
              <button
                type="button"
                onClick={() => setModelModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-neutral-950 text-white font-bold text-xs hover:bg-neutral-800 transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirm & Close</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Fullscreen High-Definition Lightbox ── */}
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
                <span className="text-xs font-bold">{currentModel.name} · Full Resolution Canvas</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400">
                  {selectedRatio}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={lightboxImage}
                  download="aistudio-hq-render.jpg"
                  className="px-3.5 py-1.5 rounded-xl bg-white text-neutral-950 font-bold text-xs flex items-center gap-1.5 hover:bg-neutral-100 transition-all"
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
            <div className="flex-1 flex items-center justify-center p-4 overflow-auto bg-neutral-950">
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