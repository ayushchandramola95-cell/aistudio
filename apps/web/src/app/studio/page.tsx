"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  Sparkles,
  Wand2,
  Image as ImageIcon,
  Sliders,
  Brain,
  ChevronDown,
  Layers,
  Zap,
  Check,
  CheckCircle2,
  Copy,
  Download,
  Share2,
  X,
  Search,
  Dice5,
  Undo2,
  Globe,
  Star,
  Info,
  Clock,
  Shirt,
  RefreshCw,
  HelpCircle,
  BookOpen,
  Keyboard,
  MoreHorizontal,
  ChevronRight,
  ChevronLeft,
  Heart,
  Maximize2,
  LayoutGrid,
  List,
  Eye,
  SlidersHorizontal,
  ShieldCheck,
  RotateCcw,
  Plus,
  Compass,
  ArrowRight,
  History,
  Trash2,
  CornerDownLeft,
  Paintbrush,
  Expand,
  Palette,
  UserCheck,
  Coins,
  FolderKanban
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// DATA TYPES & INTERFACES
// ─────────────────────────────────────────────────────────────────────────────

type AspectRatioId =
  | "1:1"
  | "16:9"
  | "9:16"
  | "4:3"
  | "3:4"
  | "3:2"
  | "2:3"
  | "5:4"
  | "4:5"
  | "21:9"
  | "4:1"
  | "1:4"
  | "8:1"
  | "1:8";

interface ModelDef {
  id: string;
  name: string;
  provider: string;
  engine: string;
  badge: string;
  badgeColor: string;
  cost: number;
  desc: string;
  maxResolution: string;
  aspectRatios: AspectRatioId[];
  category: "nano" | "imagen" | "specialized" | "local" | "all";
  isRecommended?: boolean;
  avatarIcon?: string;
  iconBg?: string;

  // Dynamic engine capabilities
  maxPromptLength: number;
  maxReferences: number;
  supportedResolutions: ("0.5K" | "1K" | "2K" | "4K")[];
  maxOutputs: number;
  supportedQualityTiers: ("draft" | "standard" | "high")[];
  supportsNegativePrompt: boolean;
  supportsWebGrounding?: boolean;
  estimatedRenderTime: string;
  supportedCreationModes: string[];
}

interface StylePreset {
  id: string;
  label: string;
  image: string;
  promptSuffix: string;
}

interface FeedItem {
  id: string;
  title: string;
  prompt: string;
  modelName: string;
  cost: number;
  image: string;
  timestamp: string;
  aspectRatio: string;
  resolution: string;
  isFavorite?: boolean;
}

interface GenerationJob {
  id: string;
  task_type: string;
  model_id: string;
  status: "QUEUED" | "RUNNING" | "COMPLETED" | "FAILED";
  progress_percent: number;
  outputs?: string[];
  error_message?: string;
  duration_seconds?: number;
  credits_debited?: number;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// ASPECT RATIO VECTOR PREVIEWS
// ─────────────────────────────────────────────────────────────────────────────

const ASPECT_RATIO_PREVIEWS = [
  {
    id: "1:1" as const,
    name: "Square",
    svg: (active: boolean) => (
      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="none">
        <rect
          x="2"
          y="2"
          width="12"
          height="12"
          rx="2"
          stroke={active ? "#2563eb" : "#737373"}
          strokeWidth="1.5"
          fill={active ? "#dbeafe" : "none"}
        />
      </svg>
    ),
  },
  {
    id: "16:9" as const,
    name: "Landscape Wide",
    svg: (active: boolean) => (
      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="none">
        <rect
          x="1"
          y="4"
          width="14"
          height="8"
          rx="1.5"
          stroke={active ? "#2563eb" : "#737373"}
          strokeWidth="1.5"
          fill={active ? "#dbeafe" : "none"}
        />
      </svg>
    ),
  },
  {
    id: "9:16" as const,
    name: "Portrait Story",
    svg: (active: boolean) => (
      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="none">
        <rect
          x="4"
          y="1"
          width="8"
          height="14"
          rx="1.5"
          stroke={active ? "#2563eb" : "#737373"}
          strokeWidth="1.5"
          fill={active ? "#dbeafe" : "none"}
        />
      </svg>
    ),
  },
  {
    id: "4:3" as const,
    name: "Standard Landscape",
    svg: (active: boolean) => (
      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="none">
        <rect
          x="1"
          y="3"
          width="14"
          height="10"
          rx="1.5"
          stroke={active ? "#2563eb" : "#737373"}
          strokeWidth="1.5"
          fill={active ? "#dbeafe" : "none"}
        />
      </svg>
    ),
  },
  {
    id: "3:4" as const,
    name: "Tall Portrait",
    svg: (active: boolean) => (
      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="none">
        <rect
          x="3"
          y="1"
          width="10"
          height="14"
          rx="1.5"
          stroke={active ? "#2563eb" : "#737373"}
          strokeWidth="1.5"
          fill={active ? "#dbeafe" : "none"}
        />
      </svg>
    ),
  },
  {
    id: "3:2" as const,
    name: "Classic Photo",
    svg: (active: boolean) => (
      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="none">
        <rect
          x="1"
          y="3.5"
          width="14"
          height="9.3"
          rx="1.5"
          stroke={active ? "#2563eb" : "#737373"}
          strokeWidth="1.5"
          fill={active ? "#dbeafe" : "none"}
        />
      </svg>
    ),
  },
  {
    id: "2:3" as const,
    name: "Vertical Photo",
    svg: (active: boolean) => (
      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="none">
        <rect
          x="3.5"
          y="1"
          width="9.3"
          height="14"
          rx="1.5"
          stroke={active ? "#2563eb" : "#737373"}
          strokeWidth="1.5"
          fill={active ? "#dbeafe" : "none"}
        />
      </svg>
    ),
  },
  {
    id: "5:4" as const,
    name: "Medium Landscape",
    svg: (active: boolean) => (
      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="none">
        <rect
          x="1.5"
          y="2.8"
          width="13"
          height="10.4"
          rx="1.5"
          stroke={active ? "#2563eb" : "#737373"}
          strokeWidth="1.5"
          fill={active ? "#dbeafe" : "none"}
        />
      </svg>
    ),
  },
  {
    id: "4:5" as const,
    name: "Social Portrait",
    svg: (active: boolean) => (
      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="none">
        <rect
          x="2.8"
          y="1.5"
          width="10.4"
          height="13"
          rx="1.5"
          stroke={active ? "#2563eb" : "#737373"}
          strokeWidth="1.5"
          fill={active ? "#dbeafe" : "none"}
        />
      </svg>
    ),
  },
  {
    id: "21:9" as const,
    name: "Ultrawide Banner",
    svg: (active: boolean) => (
      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="none">
        <rect
          x="0.5"
          y="4.8"
          width="15"
          height="6.4"
          rx="1.5"
          stroke={active ? "#2563eb" : "#737373"}
          strokeWidth="1.5"
          fill={active ? "#dbeafe" : "none"}
        />
      </svg>
    ),
  },
  {
    id: "4:1" as const,
    name: "Panoramic Ribbon",
    svg: (active: boolean) => (
      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="none">
        <rect
          x="0.5"
          y="6"
          width="15"
          height="4"
          rx="1"
          stroke={active ? "#2563eb" : "#737373"}
          strokeWidth="1.5"
          fill={active ? "#dbeafe" : "none"}
        />
      </svg>
    ),
  },
  {
    id: "1:4" as const,
    name: "Vertical Skyscraper",
    svg: (active: boolean) => (
      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="none">
        <rect
          x="6"
          y="0.5"
          width="4"
          height="15"
          rx="1"
          stroke={active ? "#2563eb" : "#737373"}
          strokeWidth="1.5"
          fill={active ? "#dbeafe" : "none"}
        />
      </svg>
    ),
  },
  {
    id: "8:1" as const,
    name: "Extreme Panorama",
    svg: (active: boolean) => (
      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="none">
        <rect
          x="0"
          y="7"
          width="16"
          height="2"
          rx="0.5"
          stroke={active ? "#2563eb" : "#737373"}
          strokeWidth="1.5"
          fill={active ? "#dbeafe" : "none"}
        />
      </svg>
    ),
  },
  {
    id: "1:8" as const,
    name: "Extreme Vertical",
    svg: (active: boolean) => (
      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="none">
        <rect
          x="7"
          y="0"
          width="2"
          height="16"
          rx="0.5"
          stroke={active ? "#2563eb" : "#737373"}
          strokeWidth="1.5"
          fill={active ? "#dbeafe" : "none"}
        />
      </svg>
    ),
  },
];

const PRIMARY_RATIO_IDS: AspectRatioId[] = ["1:1", "16:9", "9:16", "4:3"];


// ─────────────────────────────────────────────────────────────────────────────
// MODELS REPOSITORY (With Dynamic Engine Capabilities)
// ─────────────────────────────────────────────────────────────────────────────

const STUDIO_MODELS: ModelDef[] = [
  {
    id: "nano-banana-2-1",
    name: "Nano Banana 2.1",
    provider: "Google Vertex AI",
    engine: "gemini-3.1-flash-image",
    badge: "Flagship",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    cost: 6,
    desc: "Upgraded mainstream Gemini model with stronger prompt adherence, 1M token context, 14 reference images, and real-time Web Search Grounding.",
    maxResolution: "Up to 4096×4096 (4K)",
    aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9"],
    category: "nano",
    isRecommended: true,
    avatarIcon: "🍌",
    iconBg: "bg-blue-50 border-blue-200 text-blue-600",
    maxPromptLength: 50000,
    maxReferences: 14,
    supportedResolutions: ["0.5K", "1K", "2K", "4K"],
    maxOutputs: 4,
    supportedQualityTiers: [],
    supportsNegativePrompt: true,
    supportsWebGrounding: true,
    estimatedRenderTime: "1.4s",
    supportedCreationModes: ["text-to-image", "image-to-image", "inpainting", "outpainting", "style-transfer", "character-consistency"],
  },
  {
    id: "nano-banana-2-lite",
    name: "Nano Banana 2 Lite",
    provider: "Google Vertex AI",
    engine: "gemini-3.1-flash-lite-image",
    badge: "Ultra-Fast",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cost: 3,
    desc: "Class-leading generation optimized for high-volume creation and rapid drafting with sub-second latency.",
    maxResolution: "1024×1024 (1K)",
    aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "2:3", "4:5"],
    category: "nano",
    isRecommended: true,
    avatarIcon: "⚡",
    iconBg: "bg-emerald-50 border-emerald-200 text-emerald-600",
    maxPromptLength: 4000,
    maxReferences: 2,
    supportedResolutions: ["0.5K", "1K"],
    maxOutputs: 1,
    supportedQualityTiers: [],
    supportsNegativePrompt: true,
    supportsWebGrounding: true,
    estimatedRenderTime: "0.8s",
    supportedCreationModes: ["text-to-image", "image-to-image"],
  },
  {
    id: "nano-banana-pro",
    name: "Nano Banana Pro",
    provider: "Google Vertex AI",
    engine: "gemini-3-pro-image",
    badge: "Pro Studio",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    cost: 10,
    desc: "Internal Thinking Process reasoning budget, multilingual crisp typography, and complex infographics in studio 4K.",
    maxResolution: "Up to 4096×4096 (4K)",
    aspectRatios: ["1:1", "3:4", "4:3", "9:16", "16:9", "4:1", "1:4", "8:1", "1:8"],
    category: "nano",
    isRecommended: true,
    avatarIcon: "💎",
    iconBg: "bg-purple-50 border-purple-200 text-purple-600",
    maxPromptLength: 10000,
    maxReferences: 10,
    supportedResolutions: ["1K", "2K", "4K"],
    maxOutputs: 2,
    supportedQualityTiers: [],
    supportsNegativePrompt: true,
    supportsWebGrounding: true,
    estimatedRenderTime: "2.6s",
    supportedCreationModes: ["text-to-image", "image-to-image", "inpainting", "outpainting", "style-transfer", "character-consistency"],
  },
  {
    id: "nano-banana-2",
    name: "Nano Banana 2",
    provider: "Google Vertex AI",
    engine: "gemini-3.1-flash-image",
    badge: "Balanced",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    cost: 5,
    desc: "General image generation and editing tasks offering balanced high visual quality and low latency.",
    maxResolution: "Up to 4096×4096 (4K)",
    aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "4:1", "1:4", "8:1", "1:8"],
    category: "nano",
    isRecommended: false,
    avatarIcon: "🌟",
    iconBg: "bg-amber-50 border-amber-200 text-amber-600",
    maxPromptLength: 10000,
    maxReferences: 14,
    supportedResolutions: ["0.5K", "1K", "2K", "4K"],
    maxOutputs: 4,
    supportedQualityTiers: [],
    supportsNegativePrompt: true,
    supportsWebGrounding: true,
    estimatedRenderTime: "1.2s",
    supportedCreationModes: ["text-to-image", "image-to-image", "character-consistency"],
  },
  {
    id: "nano-banana",
    name: "Nano Banana",
    provider: "Google Vertex AI",
    engine: "gemini-2.5-flash-image",
    badge: "Foundation",
    badgeColor: "bg-yellow-50 text-yellow-700 border-yellow-200",
    cost: 4,
    desc: "gemini-2.5-flash-image. State-of-the-art native multimodal image generation with direct prompt synthesis baseline.",
    maxResolution: "1024×1024 (1K)",
    aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9"],
    category: "nano",
    isRecommended: false,
    avatarIcon: "🍌",
    iconBg: "bg-yellow-50 border-yellow-200 text-yellow-600",
    maxPromptLength: 4000,
    maxReferences: 3,
    supportedResolutions: ["1K"],
    maxOutputs: 1,
    supportedQualityTiers: [],
    supportsNegativePrompt: true,
    supportsWebGrounding: false,
    estimatedRenderTime: "1.1s",
    supportedCreationModes: ["text-to-image", "image-to-image"],
  },
  {
    id: "imagen-4-fast",
    name: "Imagen 4 Fast",
    provider: "Google Vertex AI",
    engine: "imagen-4.0-fast",
    badge: "Rapid Diffusion",
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    cost: 4,
    desc: "Sub-second diffusion generation for rapid pure text-to-image concepting and exploration.",
    maxResolution: "1408×768 (1K Fast)",
    aspectRatios: ["1:1", "16:9", "9:16", "4:3"],
    category: "imagen",
    isRecommended: false,
    avatarIcon: "⚡",
    iconBg: "bg-sky-50 border-sky-200 text-sky-600",
    maxPromptLength: 2000,
    maxReferences: 0,
    supportedResolutions: ["1K"],
    maxOutputs: 4,
    supportedQualityTiers: ["draft", "standard"],
    supportsNegativePrompt: true,
    supportsWebGrounding: false,
    estimatedRenderTime: "0.9s",
    supportedCreationModes: ["text-to-image"],
  },
  {
    id: "imagen-3-capability-001",
    name: "Imagen 3 Precision",
    provider: "Google Vertex AI",
    engine: "imagen-3.0-capability-001",
    badge: "Inpainting Pro",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    cost: 8,
    desc: "Specialized inpainting and outpainting engine with boundary-aware generative fill.",
    maxResolution: "2048×2048 (2K)",
    aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4"],
    category: "imagen",
    isRecommended: false,
    avatarIcon: "🖌️",
    iconBg: "bg-indigo-50 border-indigo-200 text-indigo-600",
    maxPromptLength: 3000,
    maxReferences: 1,
    supportedResolutions: ["1K", "2K"],
    maxOutputs: 2,
    supportedQualityTiers: ["standard", "high"],
    supportsNegativePrompt: true,
    supportsWebGrounding: false,
    estimatedRenderTime: "2.4s",
    supportedCreationModes: ["inpainting", "outpainting"],
  },
  {
    id: "virtual-try-on-v1",
    name: "Try-On Studio v1",
    provider: "Google Cloud / FitEngine",
    engine: "virtual-try-on-001",
    badge: "E-Commerce",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    cost: 12,
    desc: "Specialized garment drape and fitting engine for e-commerce apparel visualization.",
    maxResolution: "1024×1024 (1K)",
    aspectRatios: ["3:4", "9:16", "1:1"],
    category: "specialized",
    isRecommended: false,
    avatarIcon: "👗",
    iconBg: "bg-rose-50 border-rose-200 text-rose-600",
    maxPromptLength: 2000,
    maxReferences: 2,
    supportedResolutions: ["1K"],
    maxOutputs: 1,
    supportedQualityTiers: ["standard", "high"],
    supportsNegativePrompt: false,
    supportsWebGrounding: false,
    estimatedRenderTime: "3.2s",
    supportedCreationModes: ["character-consistency", "image-to-image"],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// VISUAL STYLE PRESETS
// ─────────────────────────────────────────────────────────────────────────────

const STYLE_PRESETS: StylePreset[] = [
  {
    id: "auto",
    label: "Auto",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80",
    promptSuffix: "",
  },
  {
    id: "photorealistic",
    label: "Photorealistic",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&auto=format&fit=crop&q=80",
    promptSuffix: ", photorealistic 8k, raw photographic textures, Hasselblad 80mm lens, natural daylight, hyper-detailed",
  },
  {
    id: "cinematic",
    label: "Cinematic",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80",
    promptSuffix: ", 35mm anamorphic film still, cinematic dramatic lighting, shallow depth of field, color graded, Panavision",
  },
  {
    id: "anime",
    label: "Anime Art",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&auto=format&fit=crop&q=80",
    promptSuffix: ", modern Kyoto Animation anime style, vibrant cel shaded, intricate hair physics, emotive eyes, 4k",
  },
  {
    id: "3d-animation",
    label: "3D Animation",
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=300&auto=format&fit=crop&q=80",
    promptSuffix: ", Pixar 3D animated render, Octane render 8k, subsurface scattering, soft ambient occlusion, stylized character",
  },
  {
    id: "cyberpunk",
    label: "Cyberpunk",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&auto=format&fit=crop&q=80",
    promptSuffix: ", cyberpunk neo-noir aesthetic, vibrant magenta and cyan neon reflections, rainy asphalt, holographic HUD",
  },
  {
    id: "watercolor",
    label: "Watercolor",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300&auto=format&fit=crop&q=80",
    promptSuffix: ", traditional wet-on-wet watercolor painting, cold press textured paper, expressive soft pigment washes",
  },
  {
    id: "illustration",
    label: "Illustration",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=300&auto=format&fit=crop&q=80",
    promptSuffix: ", master digital concept art illustration, clean lineart, rich color palette, ArtStation trending",
  },
  {
    id: "editorial",
    label: "Editorial",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    promptSuffix: ", Vogue studio fashion editorial portrait, high fashion styling, rim lighting, minimalist backdrop",
  },
  {
    id: "dark-fantasy",
    label: "Dark Fantasy",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80",
    promptSuffix: ", dark fantasy grim gothic atmosphere, ethereal mist, ancient stone ruins, moody chiaroscuro illumination",
  },
  {
    id: "product-photo",
    label: "Product Photo",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80",
    promptSuffix: ", commercial studio product photography, clean reflective acrylic surface, softbox diffusion, crisp macro detail",
  },
  {
    id: "architecture",
    label: "Architecture",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&auto=format&fit=crop&q=80",
    promptSuffix: ", architectural digest modern residential villa, architectural photography, golden hour ambient light, clean glass lines",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CREATION MODES
// ─────────────────────────────────────────────────────────────────────────────

interface CreationModeDef {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
  color: string;
  desc: string;
}

const CREATION_MODES: CreationModeDef[] = [
  {
    id: "text-to-image",
    label: "Text to Image",
    icon: Wand2,
    badge: "Prompt-driven",
    color: "text-blue-600",
    desc: "Generate artwork entirely from text description",
  },
  {
    id: "image-to-image",
    label: "Image to Image",
    icon: ImageIcon,
    badge: "Reference-based",
    color: "text-emerald-600",
    desc: "Transform and re-imagine existing source images",
  },
  {
    id: "inpainting",
    label: "Inpainting",
    icon: Paintbrush,
    badge: "Brush & Erase",
    color: "text-amber-600",
    desc: "Brush and redraw or erase specific image regions",
  },
  {
    id: "outpainting",
    label: "Outpainting",
    icon: Expand,
    badge: "Canvas Expansion",
    color: "text-indigo-600",
    desc: "Extend canvas borders in any direction",
  },
  {
    id: "style-transfer",
    label: "Style Transfer",
    icon: Palette,
    badge: "Aesthetic Extraction",
    color: "text-rose-600",
    desc: "Apply artistic styles and color palettes",
  },
  {
    id: "character-consistency",
    label: "Character Consistency",
    icon: UserCheck,
    badge: "Face & ID Lock",
    color: "text-purple-600",
    desc: "Lock face and persona identity across scenes",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// INITIAL SHOWCASE FEED ITEMS (from ChatGPT mockup)
// ─────────────────────────────────────────────────────────────────────────────

const INITIAL_FEED_ITEMS: FeedItem[] = [];
const INITIAL_REFERENCES: { id: string; name: string; url: string }[] = [];

// ─────────────────────────────────────────────────────────────────────────────
// OFFICIAL MODEL LOGO RENDERER
// ─────────────────────────────────────────────────────────────────────────────

function renderOfficialLogo(modelId: string, className = "w-8 h-8") {
  if (modelId.startsWith("nano-banana")) {
    // Official Google 4-Color 'G' Logo
    return (
      <div className={`${className} rounded-xl bg-white border border-neutral-200/90 shadow-2xs flex items-center justify-center shrink-0 p-1.5 relative`}>
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
      </div>
    );
  }

  if (modelId === "imagen-4-fast") {
    // Official Google Imagen 4 Fast Icon (Sub-second diffusion)
    return (
      <div className={`${className} rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 shadow-2xs flex items-center justify-center shrink-0 p-1.5 text-white border border-sky-400/30`}>
        <svg viewBox="0 0 24 24" className="w-full h-full fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          <circle cx="12" cy="12" r="3" fill="currentColor" />
        </svg>
      </div>
    );
  }

  if (modelId === "virtual-try-on") {
    // Official Google Virtual Try-On Fashion AI Icon
    return (
      <div className={`${className} rounded-xl bg-gradient-to-tr from-rose-500 to-pink-600 shadow-2xs flex items-center justify-center shrink-0 p-1.5 text-white border border-rose-400/30`}>
        <svg viewBox="0 0 24 24" className="w-full h-full fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
        </svg>
      </div>
    );
  }

  if (modelId === "imagen-3-capability-001") {
    // Official Google Imagen 3 Capability Brush & Inpainting Icon
    return (
      <div className={`${className} rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-2xs flex items-center justify-center shrink-0 p-1.5 text-white border border-indigo-400/30`}>
        <svg viewBox="0 0 24 24" className="w-full h-full fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m14 12-8.5 8.5a2.12 2.12 0 1 1-3-3L11 9" />
          <path d="M15 13 9 7l4-4 6 6-4 4Z" />
          <path d="m18 3 3 3" />
        </svg>
      </div>
    );
  }

  // Fallback Google icon
  return (
    <div className={`${className} rounded-xl bg-neutral-900 text-white shadow-2xs flex items-center justify-center shrink-0 p-1.5`}>
      <Sparkles className="w-full h-full text-blue-400" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function StudioPage() {
  // Model state
  const [modelFilter, setModelFilter] = useState<string>("all");
  const [selectedModelId, setSelectedModelId] = useState<string>("nano-banana-2-1");
  const [favoriteModels, setFavoriteModels] = useState<string[]>(["nano-banana-2-1", "nano-banana-pro", "imagen-4-fast"]);

  // Creation mode
  const [creationMode, setCreationMode] = useState<string>("text-to-image");

  // Mode working states
  const [inpaintBrushSize, setInpaintBrushSize] = useState<number>(24);
  const [inpaintMode, setInpaintMode] = useState<string>("replace");
  const [outpaintScale, setOutpaintScale] = useState<string>("1.5x");
  const [outpaintDirection, setOutpaintDirection] = useState<string>("all");
  const [styleStrength, setStyleStrength] = useState<string>("balanced");
  const [characterName, setCharacterName] = useState<string>("Elena, Cyber Sorceress");
  const [copiedPromptId, setCopiedPromptId] = useState<number | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<boolean>(false);

  // Prompt & Enhancer
  const [prompt, setPrompt] = useState<string>(
    "A majestic dragon flying over snow-covered mountains at sunrise, cinematic lighting, ultra detailed, realistic, epic fantasy, volumetric clouds, 8k"
  );
  const [originalPrompt, setOriginalPrompt] = useState<string>("");
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [promptHistory, setPromptHistory] = useState<string[]>([
    "A majestic dragon flying over snow-covered mountains at sunrise, cinematic lighting, ultra detailed, realistic, epic fantasy, volumetric clouds, 8k",
    "Futuristic sports supercar racing through rainy neo-Tokyo street, neon reflections on wet asphalt",
    "Minimalist architectural glass villa with infinity pool at dusk, warm interior glow",
  ]);
  const [promptHistoryOpen, setPromptHistoryOpen] = useState<boolean>(false);
  const promptHistoryRef = useRef<HTMLDivElement | null>(null);

  const handleSelectCreationMode = (modeId: string) => {
    setCreationMode(modeId);
    if (modeId === "character-consistency") {
      setMaintainCharacter(true);
    }
  };

  // Close Prompt History dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        promptHistoryOpen &&
        promptHistoryRef.current &&
        !promptHistoryRef.current.contains(e.target as Node)
      ) {
        setPromptHistoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [promptHistoryOpen]);

  // References
  const [referenceImages, setReferenceImages] = useState(INITIAL_REFERENCES);
  const [imageInfluence, setImageInfluence] = useState<number>(50);
  const [maintainCharacter, setMaintainCharacter] = useState<boolean>(true);
  const refFileInputRef = useRef<HTMLInputElement | null>(null);

  // Style
  const [activeStyleId, setActiveStyleId] = useState<string>("photorealistic");

  // Generation Settings
  const [selectedRatio, setSelectedRatio] = useState<AspectRatioId>("16:9");
  const [selectedResolution, setSelectedResolution] = useState<"0.5K" | "1K" | "2K" | "4K">("1K");
  const [outputsCount, setOutputsCount] = useState<number>(1);
  const [qualityTier, setQualityTier] = useState<string>("standard");
  const [inlineMoreOpen, setInlineMoreOpen] = useState<boolean>(false);

  // Advanced Settings panel state (Collapsible Split-View)
  const [advancedPanelOpen, setAdvancedPanelOpen] = useState<boolean>(false);

  // Dynamic Google Cloud / Vertex AI Engine Parameters
  const [thinkingBudget, setThinkingBudget] = useState<"standard" | "deep">("standard");
  const [safetyFilterLevel, setSafetyFilterLevel] = useState<string>("block_medium_and_above");
  const [personGeneration, setPersonGeneration] = useState<string>("allow_adult");
  const [synthIdWatermark, setSynthIdWatermark] = useState<boolean>(true);
  const [webGrounding, setWebGrounding] = useState<boolean>(false);
  const [inpaintBoundaryFeather, setInpaintBoundaryFeather] = useState<number>(6);

  // Ratio rail sliding refs and states
  const ratioRailRef = useRef<HTMLDivElement>(null);
  const [canScrollRatioLeft, setCanScrollRatioLeft] = useState<boolean>(false);
  const [canScrollRatioRight, setCanScrollRatioRight] = useState<boolean>(true);

  // Live generation states
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [newlyGeneratedId, setNewlyGeneratedId] = useState<string | null>(null);
  const generationFeedRef = useRef<HTMLDivElement>(null);

  // Sidebar sync
  const sidebarWasCollapsedRef = useRef<boolean | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("aistudio_sidebar_collapsed");
      if (saved === "true") setSidebarCollapsed(true);
    } catch {}

    const handleSidebarChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ collapsed?: boolean }>;
      if (customEvent.detail?.collapsed !== undefined) {
        setSidebarCollapsed(customEvent.detail.collapsed);
      }
    };
    window.addEventListener("aistudio:sidebar-changed", handleSidebarChange);
    return () => window.removeEventListener("aistudio:sidebar-changed", handleSidebarChange);
  }, []);

  const handleToggleAdvancedPanel = (targetState?: boolean) => {
    const nextState = typeof targetState === "boolean" ? targetState : !advancedPanelOpen;
    setAdvancedPanelOpen(nextState);

    if (typeof window !== "undefined") {
      if (nextState) {
        sidebarWasCollapsedRef.current = sidebarCollapsed;
        window.dispatchEvent(new CustomEvent("aistudio:set-sidebar", { detail: { collapsed: true } }));
      } else {
        if (sidebarWasCollapsedRef.current !== null) {
          window.dispatchEvent(
            new CustomEvent("aistudio:set-sidebar", { detail: { collapsed: sidebarWasCollapsedRef.current } })
          );
          sidebarWasCollapsedRef.current = null;
        } else {
          window.dispatchEvent(new CustomEvent("aistudio:set-sidebar", { detail: { collapsed: false } }));
        }
      }
    }
  };

  const ratioTrackWidthClass = useMemo(() => {
    if (advancedPanelOpen) {
      return "w-[226px] sm:w-[286px] max-w-[286px]";
    }
    return "w-[226px] sm:w-[350px] md:w-[420px] lg:w-[490px] xl:w-[540px] max-w-[540px]";
  }, [advancedPanelOpen]);

  const checkRatioScroll = () => {
    if (!ratioRailRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = ratioRailRef.current;
    setCanScrollRatioLeft(scrollLeft > 2);
    setCanScrollRatioRight(scrollLeft < scrollWidth - clientWidth - 2);
  };
  const [steps, setSteps] = useState<number>(30);
  const [cfgScale, setCfgScale] = useState<number>(7.5);
  const [sampler, setSampler] = useState<string>("DPM++ 2M Karras");
  const [seedMode, setSeedMode] = useState<"random" | "custom">("random");
  const [seedValue, setSeedValue] = useState<number>(428192);
  const [negativePrompt, setNegativePrompt] = useState<string>("");
  const [highDetailMode, setHighDetailMode] = useState<boolean>(true);
  const [faceEnhancement, setFaceEnhancement] = useState<boolean>(true);
  const [textRendering, setTextRendering] = useState<boolean>(false);
  const [hdrLighting, setHdrLighting] = useState<boolean>(true);
  const [safeGeneration, setSafeGeneration] = useState<boolean>(true);

  // Recent feed state
  const [activeFeedTab, setActiveFeedTab] = useState<string>("recent");
  const [feedSearchQuery, setFeedSearchQuery] = useState<string>("");
  const [feedViewMode, setFeedViewMode] = useState<"grid" | "list">("grid");
  const [feedItems, setFeedItems] = useState<FeedItem[]>(INITIAL_FEED_ITEMS);

  // Generation / Job running state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [generationPhase, setGenerationPhase] = useState<string>("");
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modals state
  const [howItWorksOpen, setHowItWorksOpen] = useState<boolean>(false);
  const [promptGuideOpen, setPromptGuideOpen] = useState<boolean>(false);
  const [shortcutsOpen, setShortcutsOpen] = useState<boolean>(false);
  const [modelModalOpen, setModelModalOpen] = useState<boolean>(false);
  const [modalSearch, setModalSearch] = useState<string>("");
  const [modalCategory, setModalCategory] = useState<"all" | "nano" | "imagen" | "specialized">("all");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const modelScrollRef = useRef<HTMLDivElement | null>(null);
  const styleScrollRef = useRef<HTMLDivElement | null>(null);

  // Selected model lookup
  const currentModel = useMemo(() => {
    return STUDIO_MODELS.find((m) => m.id === selectedModelId) || STUDIO_MODELS[0];
  }, [selectedModelId]);

  // Auto-normalize settings when selectedModelId changes based on model capabilities
  useEffect(() => {
    // 1. Ratio
    if (!currentModel.aspectRatios.includes(selectedRatio)) {
      setSelectedRatio(currentModel.aspectRatios[0] || "1:1");
    }
    // 2. Resolution
    if (!currentModel.supportedResolutions.includes(selectedResolution)) {
      const highest = currentModel.supportedResolutions[currentModel.supportedResolutions.length - 1];
      setSelectedResolution(highest || "1K");
    }
    // 3. Outputs
    if (outputsCount > currentModel.maxOutputs) {
      setOutputsCount(currentModel.maxOutputs);
    }
    // 4. Quality Tier
    if (!currentModel.supportedQualityTiers.includes(qualityTier as "draft" | "standard" | "high")) {
      setQualityTier(currentModel.supportedQualityTiers[0] || "standard");
    }
    // 5. Creation Mode
    if (!currentModel.supportedCreationModes.includes(creationMode)) {
      setCreationMode(currentModel.supportedCreationModes[0] || "text-to-image");
    }
    // 6. Reference Images count limit
    if (currentModel.maxReferences === 0) {
      setReferenceImages([]);
    } else if (referenceImages.length > currentModel.maxReferences) {
      setReferenceImages((prev) => prev.slice(0, currentModel.maxReferences));
    }
  }, [selectedModelId, currentModel]);

  // Filtered models
  const visibleModels = useMemo(() => {
    if (modelFilter === "nano") return STUDIO_MODELS.filter((m) => m.category === "nano");
    if (modelFilter === "imagen") return STUDIO_MODELS.filter((m) => m.category === "imagen");
    if (modelFilter === "specialized") return STUDIO_MODELS.filter((m) => m.category === "specialized");
    if (modelFilter === "favorites") return STUDIO_MODELS.filter((m) => favoriteModels.includes(m.id));
    if (modelFilter === "recommended") return STUDIO_MODELS.filter((m) => m.isRecommended);
    return STUDIO_MODELS;
  }, [modelFilter, favoriteModels]);

  // Model Rail Scroll Navigation State
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

  const checkScrollability = useCallback(() => {
    const el = modelScrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = modelScrollRef.current;
    if (!el) return;

    const timer = setTimeout(checkScrollability, 50);
    el.addEventListener("scroll", checkScrollability, { passive: true });
    window.addEventListener("resize", checkScrollability);

    return () => {
      clearTimeout(timer);
      el.removeEventListener("scroll", checkScrollability);
      window.removeEventListener("resize", checkScrollability);
    };
  }, [checkScrollability, visibleModels]);

  // Buttery-smooth horizontal mouse wheel inertia scrolling for Model Rail
  useEffect(() => {
    const el = modelScrollRef.current;
    if (!el) return;

    let targetScroll = el.scrollLeft;
    let animId: number | null = null;

    const smoothStep = () => {
      if (!el) {
        animId = null;
        return;
      }
      const current = el.scrollLeft;
      const diff = targetScroll - current;

      if (Math.abs(diff) < 0.5) {
        el.scrollLeft = targetScroll;
        animId = null;
        return;
      }

      // Smooth lerp: 0.16 factor provides fluid, natural momentum without jitter
      el.scrollLeft = current + diff * 0.16;
      animId = requestAnimationFrame(smoothStep);
    };

    const handleWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth) return;

      // Support standard vertical mouse wheel and trackpad gestures
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 0.5) return;

      const maxScroll = el.scrollWidth - el.clientWidth;
      const canScrollLeft = el.scrollLeft > 0;
      const canScrollRight = el.scrollLeft < maxScroll - 1;

      // Intercept wheel when scrolling within bounds or while actively gliding
      if ((delta > 0 && canScrollRight) || (delta < 0 && canScrollLeft) || animId !== null) {
        e.preventDefault();

        // Start accumulation from current actual position if previously idle
        if (animId === null) {
          targetScroll = el.scrollLeft;
        }

        // Apply comfortable step multiplier and clamp to scroll bounds
        targetScroll = Math.max(0, Math.min(maxScroll, targetScroll + delta * 1.25));

        if (animId === null) {
          animId = requestAnimationFrame(smoothStep);
        }
      }
    };

    const syncScroll = () => {
      if (animId === null && el) {
        targetScroll = el.scrollLeft;
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    el.addEventListener("scroll", syncScroll, { passive: true });

    return () => {
      if (animId !== null) {
        cancelAnimationFrame(animId);
      }
      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("scroll", syncScroll);
    };
  }, [visibleModels]);

  const dynamicDimensions = useMemo(() => {
    const dimMap: Record<string, Record<string, string>> = {
      "0.5K": {
        "1:1": "512×512",
        "16:9": "680×384",
        "9:16": "384×680",
        "4:3": "592×444",
        "3:4": "444×592",
        "3:2": "624×416",
        "2:3": "416×624",
        "5:4": "572×458",
        "4:5": "458×572",
        "21:9": "784×336",
        "4:1": "1024×256",
        "1:4": "256×1024",
        "8:1": "1024×128",
        "1:8": "128×1024",
      },
      "1K": {
        "1:1": "1024×1024",
        "16:9": "1360×768",
        "9:16": "768×1360",
        "4:3": "1184×888",
        "3:4": "888×1184",
        "3:2": "1248×832",
        "2:3": "832×1248",
        "5:4": "1144×916",
        "4:5": "916×1144",
        "21:9": "1568×672",
        "4:1": "2048×512",
        "1:4": "512×2048",
        "8:1": "2048×256",
        "1:8": "256×2048",
      },
      "2K": {
        "1:1": "2048×2048",
        "16:9": "2720×1536",
        "9:16": "1536×2720",
        "4:3": "2368×1776",
        "3:4": "1776×2368",
        "3:2": "2496×1664",
        "2:3": "1664×2496",
        "5:4": "2288×1832",
        "4:5": "1832×2288",
        "21:9": "3136×1344",
        "4:1": "4096×1024",
        "1:4": "1024×4096",
        "8:1": "4096×512",
        "1:8": "512×4096",
      },
      "4K": {
        "1:1": "4096×4096",
        "16:9": "5440×3072",
        "9:16": "3072×5440",
        "4:3": "4736×3552",
        "3:4": "3552×4736",
        "3:2": "4992×3328",
        "2:3": "3328×4992",
        "5:4": "4576×3664",
        "4:5": "3664×4576",
        "21:9": "6272×2688",
        "4:1": "8192×2048",
        "1:4": "2048×8192",
        "8:1": "8192×1024",
        "1:8": "1024×8192",
      },
    };
    return dimMap[selectedResolution]?.[selectedRatio] || "1024×1024";
  }, [selectedResolution, selectedRatio]);

  // Calibrated cost calculator based on Google Vertex AI engine specifications
  const estimatedCost = useMemo(() => {
    let base = currentModel.cost;
    if (currentModel.id === "nano-banana-pro") {
      if (selectedResolution === "2K") base = 14;
      else if (selectedResolution === "4K") base = 20;
      else base = 10;
      if (thinkingBudget === "deep") base += 2;
    } else if (currentModel.id === "nano-banana-2") {
      if (selectedResolution === "0.5K") base = 3;
      else if (selectedResolution === "2K") base = 8;
      else if (selectedResolution === "4K") base = 15;
      else base = 5;
    } else if (currentModel.id === "nano-banana-2-1") {
      if (selectedResolution === "0.5K") base = 4;
      else if (selectedResolution === "2K") base = 10;
      else if (selectedResolution === "4K") base = 18;
      else base = 6;
    } else if (currentModel.id === "nano-banana-2-lite") {
      if (selectedResolution === "0.5K") base = 2;
      else base = 3;
    } else if (currentModel.id === "nano-banana") {
      base = 4;
    } else {
      if (qualityTier === "high") base += 1;
    }
    return base * outputsCount;
  }, [currentModel, qualityTier, outputsCount, selectedResolution, thinkingBudget]);

  // Toggle favorite model
  const toggleFavoriteModel = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteModels((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  // Select style preset
  const handleSelectStyle = (style: StylePreset) => {
    setActiveStyleId(style.id);
    let cleaned = prompt;
    STYLE_PRESETS.forEach((s) => {
      if (s.promptSuffix) cleaned = cleaned.replace(s.promptSuffix, "");
    });
    cleaned = cleaned.trim();
    if (!cleaned) {
      setPrompt(`A beautiful creative scene${style.promptSuffix}`);
    } else {
      setPrompt(`${cleaned}${style.promptSuffix}`);
    }
  };

  // Enhance prompt action
  const handleEnhancePrompt = async () => {
    if (!prompt.trim() || isEnhancing) return;
    setIsEnhancing(true);
    setOriginalPrompt(prompt);

    try {
      const res = await fetch("http://localhost:8100/api/v1/jobs/enhance-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          style: activeStyleId !== "auto" ? activeStyleId : "photorealistic",
          model_target: selectedModelId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.enhanced_prompt) {
          setPrompt(data.enhanced_prompt);
          setPromptHistory((prev) => [data.enhanced_prompt, ...prev.slice(0, 9)]);
        }
      } else {
        // Fallback enricher
        setPrompt((prev) => `${prev.trim()}, masterpiece 8k resolution, dramatic volumetric rim lighting, cinematic depth of field, hyper-refined surface textures`);
      }
    } catch {
      setPrompt((prev) => `${prev.trim()}, masterpiece 8k resolution, dramatic volumetric rim lighting, cinematic depth of field, hyper-refined surface textures`);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Surprise me random prompt
  const handleSurpriseMe = () => {
    const surprises = [
      "A majestic dragon flying over snow-covered mountains at sunrise, cinematic lighting, ultra detailed, realistic, epic fantasy, volumetric clouds, 8k",
      "Futuristic sports supercar racing through rainy neo-Tokyo street, neon reflections on wet asphalt, volumetric fog, 8k cinematic",
      "An ethereal cyber-samurai standing on a skyscraper rooftop overlooking a glowing megalopolis in a lightning storm",
      "Macro shot of an iridescent glass butterfly resting on a dew-covered neon lotus petal, ray-traced reflections",
      "Cozy autumnal coffeehouse interior in Paris, rain droplets on window pane, warm ambient chandelier glow, 35mm film",
    ];
    const picked = surprises[Math.floor(Math.random() * surprises.length)];
    setPrompt(picked);
    setPromptHistory((prev) => [picked, ...prev.slice(0, 9)]);
  };

  // Reference images upload
  const handleAddReference = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        const newRef = {
          id: `ref-${Date.now()}`,
          name: files[0].name,
          url: reader.result as string,
        };
        setReferenceImages((prev) => [...prev.slice(0, 3), newRef]);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleRemoveReference = (id: string) => {
    setReferenceImages((prev) => prev.filter((r) => r.id !== id));
  };

  // Load live past generations on mount
  useEffect(() => {
    const loadPastGenerations = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("aistudio_token") : null;
        const headers: Record<string, string> = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;
        const res = await fetch("http://localhost:8100/api/v1/jobs?task_type=image_generation&limit=20", { headers });
        if (res.ok) {
          const jobs: any[] = await res.json();
          const items: FeedItem[] = [];
          for (const j of jobs) {
            if (j.status === "succeeded" && j.result_urls?.length) {
              for (let idx = 0; idx < j.result_urls.length; idx++) {
                items.push({
                  id: `${j.id}-${idx}`,
                  title: (j.raw_prompt || "Generated Image").slice(0, 32),
                  prompt: j.raw_prompt || "",
                  modelName: j.model_id || "Vertex AI",
                  cost: j.credits_cost || 4,
                  image: j.result_urls[idx],
                  timestamp: "Recently",
                  aspectRatio: j.parameters?.aspect_ratio || "1:1",
                  resolution: j.parameters?.resolution || "1024×1024",
                  isFavorite: false,
                });
              }
            }
          }
          if (items.length > 0) {
            setFeedItems(items);
          }
        }
      } catch (err) {
        console.warn("Failed to load historical generations from backend:", err);
      }
    };
    loadPastGenerations();
  }, []);

  // Trigger Generation
  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setErrorMsg(null);
    setIsGenerating(true);
    setProgress(10);
    setElapsedSeconds(0);
    setGenerationPhase(`Connecting to Google Cloud Vertex AI (${currentModel.name})...`);

    // Live elapsed timer for generation animation
    const startTime = Date.now();
    const timerInterval = setInterval(() => {
      setElapsedSeconds(Number(((Date.now() - startTime) / 1000).toFixed(1)));
    }, 100);

    // Auto-scroll down smoothly to the generation feed
    setTimeout(() => {
      generationFeedRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);

    const token = typeof window !== "undefined" ? localStorage.getItem("aistudio_token") : null;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
      const res = await fetch("http://localhost:8100/api/v1/jobs", {
        method: "POST",
        headers,
        body: JSON.stringify({
          model_id: selectedModelId,
          task_type: "image_generation",
          raw_prompt: prompt.trim(),
          parameters: {
            aspect_ratio: selectedRatio,
            resolution: selectedResolution,
            sample_count: outputsCount,
            steps: currentModel.category === "local" ? steps : undefined,
            guidance_scale: currentModel.category === "imagen" || currentModel.category === "local" ? cfgScale : undefined,
            quality: qualityTier,
            negative_prompt: negativePrompt || undefined,
            web_search_grounding: currentModel.supportsWebGrounding ? webGrounding : false,
            seed: seedMode === "custom" ? seedValue : Math.floor(Math.random() * 999999),
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Generation submission failed on the server.");
      }

      const job: any = await res.json();
      setProgress(25);
      setGenerationPhase(`Synthesizing multimodal latents with ${currentModel.name}...`);

      // Poll for job completion with robust timeout (up to 90 * 800ms = 72 seconds for Vertex AI)
      let completed = false;
      for (let i = 0; i < 90; i++) {
        await new Promise((r) => setTimeout(r, 800));

        // Dynamic progress & phase simulation during backend processing
        setProgress((prev) => {
          if (prev < 45) return prev + 6;
          if (prev < 70) return prev + 4;
          if (prev < 90) return prev + 2;
          return Math.min(94, prev + 1);
        });

        if (i === 4) {
          setGenerationPhase(`Synthesizing multimodal image latents (${selectedRatio})...`);
        } else if (i === 10) {
          setGenerationPhase(`Decoding high-fidelity ${selectedResolution} canvas with Vertex AI...`);
        } else if (i === 16) {
          setGenerationPhase(`Applying SynthID digital watermark & finalizing output...`);
        }

        try {
          const pollRes = await fetch(`http://localhost:8100/api/v1/jobs/${job.id}`, { headers });
          if (pollRes.ok) {
            const pollData: any = await pollRes.json();
            if (pollData.status === "COMPLETED" && pollData.outputs && pollData.outputs.length > 0) {
              const newFeedItems: FeedItem[] = pollData.outputs.map((out: any, idx: number) => {
                const fullUrl = typeof out === "string"
                  ? (out.startsWith("http") ? out : `http://localhost:8100${out.startsWith("/") ? "" : "/"}${out}`)
                  : (out.download_url || (out.file_key?.startsWith("http") ? out.file_key : `http://localhost:8100${out.file_key?.startsWith("/") ? "" : "/"}${out.file_key}`));

                return {
                  id: `gen-${job.id}-${idx}`,
                  title: `${prompt.slice(0, 32)}... ${pollData.outputs.length > 1 ? `(${idx + 1}/${pollData.outputs.length})` : ""}`,
                  prompt,
                  modelName: currentModel.name,
                  cost: Math.round(estimatedCost / pollData.outputs.length),
                  image: fullUrl,
                  timestamp: "Just now",
                  aspectRatio: selectedRatio,
                  resolution: selectedResolution,
                  isFavorite: false,
                };
              });

              setFeedItems((prev) => [...newFeedItems, ...prev]);
              setNewlyGeneratedId(newFeedItems[0].id);
              completed = true;

              // Smoothly scroll to the newly generated image card
              setTimeout(() => {
                const targetEl = document.getElementById(`feed-card-${newFeedItems[0].id}`);
                if (targetEl) {
                  targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
                } else {
                  generationFeedRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }, 250);

              // Clear highlight badge after 7 seconds
              setTimeout(() => {
                setNewlyGeneratedId((current) => (current === newFeedItems[0].id ? null : current));
              }, 7000);

              break;
            } else if (pollData.status === "FAILED") {
              throw new Error(pollData.error_message || "Generation failed on Vertex AI engine.");
            }
          }
        } catch (pollErr: any) {
          if (pollErr.message && pollErr.message.includes("failed on Vertex AI")) {
            throw pollErr;
          }
          // otherwise continue polling
        }
      }

      if (!completed) {
        throw new Error("Generation timed out on Google Cloud. Please try again.");
      }

      setProgress(100);
      setGenerationPhase("Generation complete! Ready in high resolution.");
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 5000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to generate image. Please try again.");
    } finally {
      clearInterval(timerInterval);
      setIsGenerating(false);
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleGenerate();
      }
      if (e.key === "Escape") {
        setHowItWorksOpen(false);
        setPromptGuideOpen(false);
        setShortcutsOpen(false);
        setModelModalOpen(false);
        setLightboxImage(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prompt, isGenerating, selectedModelId, selectedRatio, selectedResolution]);

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* ── Studio Header Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-sm ring-4 ring-indigo-50">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 font-sans">
                AI Image Studio
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>8 Engines Online</span>
              </span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 font-normal">
            Create, edit and transform images with state-of-the-art AI models.
          </p>
        </div>

        {/* Quick Utility Header Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setHowItWorksOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200/90 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-700 shadow-2xs hover:shadow-xs hover:border-neutral-300 transition-all cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
            <span>How it works</span>
          </button>

          <button
            type="button"
            onClick={() => setPromptGuideOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200/90 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-700 shadow-2xs hover:shadow-xs hover:border-neutral-300 transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>Prompt Guide</span>
          </button>

          <button
            type="button"
            onClick={handleSurpriseMe}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200/90 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-700 shadow-2xs hover:shadow-xs hover:border-neutral-300 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Examples</span>
          </button>

          <button
            type="button"
            onClick={() => setShortcutsOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200/90 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-700 shadow-2xs hover:shadow-xs hover:border-neutral-300 transition-all cursor-pointer hidden sm:inline-flex"
          >
            <Keyboard className="w-3.5 h-3.5 text-neutral-400" />
            <span>Keyboard Shortcuts</span>
            <ChevronDown className="w-3 h-3 text-neutral-400" />
          </button>
        </div>
      </div>

      {/* ── Main Split View Container (Canvas + Optional Advanced Panel) ── */}
      <div className="flex gap-6 items-start">
        {/* Left / Center: Main Studio Creation Flow */}
        <div className="flex-1 min-w-0 space-y-7">
          {/* ══════════════════════════════════════════════════════════════════════
              1. CHOOSE A MODEL
          ══════════════════════════════════════════════════════════════════════ */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-neutral-950 font-sans">
                  1. Choose a Model
                </span>
                <span className="text-xs text-neutral-400 font-medium hidden sm:inline">
                  • {visibleModels.length} models
                </span>
              </div>

              {/* Category Filter Pills & Repositioned Navigation Arrows */}
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
                  {[
                    { id: "all", label: "All Models" },
                    { id: "nano", label: "Nano Banana" },
                    { id: "imagen", label: "Imagen Suite" },
                    { id: "specialized", label: "Specialized (Try-On)" },
                    { id: "favorites", label: "★ Favorites" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setModelFilter(tab.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                        modelFilter === tab.id
                          ? "bg-blue-600 text-white shadow-2xs"
                          : "bg-neutral-100 hover:bg-neutral-200/80 text-neutral-600"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Left & Right Chevron Navigation Controls in Header */}
                <div className="flex items-center gap-1 pl-2 border-l border-neutral-200 shrink-0">
                  <button
                    type="button"
                    onClick={() => modelScrollRef.current?.scrollBy({ left: -260, behavior: "smooth" })}
                    disabled={!canScrollLeft}
                    className={`w-7 h-7 rounded-lg border border-neutral-200/90 bg-white flex items-center justify-center transition-all ${
                      canScrollLeft
                        ? "text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 hover:border-neutral-300 shadow-2xs cursor-pointer active:scale-95"
                        : "text-neutral-300 border-neutral-150 bg-neutral-50/50 cursor-not-allowed opacity-40"
                    }`}
                    aria-label="Scroll models left"
                    title="Previous models"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => modelScrollRef.current?.scrollBy({ left: 260, behavior: "smooth" })}
                    disabled={!canScrollRight}
                    className={`w-7 h-7 rounded-lg border border-neutral-200/90 bg-white flex items-center justify-center transition-all ${
                      canScrollRight
                        ? "text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 hover:border-neutral-300 shadow-2xs cursor-pointer active:scale-95"
                        : "text-neutral-300 border-neutral-150 bg-neutral-50/50 cursor-not-allowed opacity-40"
                    }`}
                    aria-label="Scroll models right"
                    title="Next models"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Horizontal Scrollable Model Rail - Scrollbar completely hidden, Wheel & Header Arrows Enabled */}
            <div className="relative">
              <div
                ref={modelScrollRef}
                className="flex items-stretch gap-3.5 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              >
                {visibleModels.map((m) => {
                  const isSelected = selectedModelId === m.id;
                  const isFav = favoriteModels.includes(m.id);
                  return (
                    <div
                      key={m.id}
                      onClick={() => setSelectedModelId(m.id)}
                      className={`group relative h-[54px] min-w-[210px] sm:min-w-[220px] shrink-0 px-3.5 rounded-2xl border transition-all cursor-pointer bg-white flex items-center justify-between gap-3 hover:-translate-y-0.5 ${
                        isSelected
                          ? "border-blue-600 shadow-sm ring-2 ring-blue-500/20 bg-blue-50/20"
                          : "border-neutral-200/90 hover:border-neutral-300 hover:shadow-2xs"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {renderOfficialLogo(m.id)}

                        <div className="min-w-0">
                          <div className="text-xs font-bold text-neutral-950 truncate">
                            {m.name}
                          </div>
                          <div className="text-[10px] text-neutral-400 font-medium truncate flex items-center gap-1">
                            <span className="font-semibold text-neutral-600">{m.badge}</span>
                            <span>•</span>
                            <span className="text-amber-600 font-bold">{m.cost} cr</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => toggleFavoriteModel(m.id, e)}
                            className="p-1 text-neutral-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                            title="Add to Favorites"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-rose-500 text-rose-500 opacity-100" : ""}`} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Compact "More Models" Card Triggering the Big Modal */}
                <div
                  onClick={() => setModelModalOpen(true)}
                  className="group relative h-[54px] min-w-[145px] shrink-0 px-3 rounded-2xl border border-dashed border-neutral-300 hover:border-neutral-900 bg-neutral-50/50 hover:bg-white transition-all cursor-pointer flex items-center gap-2.5 hover:-translate-y-0.5"
                >
                  <div className="w-8 h-8 rounded-xl bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-white flex items-center justify-center transition-colors text-neutral-600 shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-neutral-950 truncate">More Models</h4>
                    <p className="text-[10px] text-blue-600 font-bold group-hover:underline flex items-center gap-0.5">
                      <span>View All</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════════
              2. DESCRIBE WHAT YOU WANT
          ══════════════════════════════════════════════════════════════════════ */}
          <div className="p-5 rounded-3xl bg-white border border-neutral-200/90 shadow-card-elevated space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-neutral-950 font-sans">
                  2. Describe What You Want
                </span>
                <span className="text-xs text-neutral-400 font-medium hidden sm:inline">
                  • {CREATION_MODES.find((m) => m.id === creationMode)?.badge || "Prompt-driven"}
                </span>
              </div>

              {/* Square Box Segmented Mode Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none bg-neutral-100/80 p-1 rounded-xl border border-neutral-200/60">
                {CREATION_MODES.map((mode) => {
                  const Icon = mode.icon;
                  const isActive = creationMode === mode.id;
                  const isSupported = currentModel.supportedCreationModes.includes(mode.id);
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      disabled={!isSupported}
                      onClick={() => isSupported && handleSelectCreationMode(mode.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 border ${
                        !isSupported
                          ? "opacity-35 cursor-not-allowed border-transparent text-neutral-400"
                          : isActive
                          ? "bg-white text-neutral-950 border-neutral-200/90 shadow-2xs font-bold ring-1 ring-neutral-900/5 cursor-pointer"
                          : "text-neutral-600 hover:text-neutral-900 hover:bg-white/50 border-transparent cursor-pointer"
                      }`}
                      title={isSupported ? mode.desc : `${mode.label} is not supported by ${currentModel.name}`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? mode.color : "text-neutral-400"}`} />
                      <span>{mode.label}</span>
                      {isActive && (
                        <span className={`w-1.5 h-1.5 rounded-full ${mode.color.replace("text-", "bg-")}`}></span>
                      )}
                      {!isSupported && (
                        <span className="text-[9px] font-mono text-neutral-400 bg-neutral-200/60 px-1 rounded">N/A</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mode-Specific Working Control Banners */}
            {creationMode === "image-to-image" && (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 text-xs text-emerald-950 animate-fadeIn">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-emerald-900">Image to Image Synthesis Active:</span>{" "}
                    <span className="text-emerald-800">Your prompt will transform the reference image selected below.</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-lg border border-emerald-200">
                    {imageInfluence}% Influence
                  </span>
                </div>
              </div>
            )}

            {creationMode === "inpainting" && (
              <div className="p-3 rounded-2xl bg-amber-50/50 border border-amber-200/70 text-xs text-amber-950 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-amber-900">
                    <Paintbrush className="w-4 h-4 text-amber-600" />
                    <span>Inpainting Precision Brush Tool</span>
                  </div>
                  <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    Mask editing active
                  </span>
                </div>
                <div className="flex items-center gap-4 flex-wrap text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-600 font-medium">Brush Size:</span>
                    <input
                      type="range"
                      min={8}
                      max={64}
                      value={inpaintBrushSize}
                      onChange={(e) => setInpaintBrushSize(Number(e.target.value))}
                      className="w-24 h-1.5 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                    />
                    <span className="font-mono text-[11px] font-bold text-amber-800">{inpaintBrushSize}px</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-neutral-600 font-medium">Mask Operation:</span>
                    {["replace", "erase", "fill"].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setInpaintMode(m)}
                        className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold capitalize transition-all cursor-pointer ${
                          inpaintMode === m
                            ? "bg-amber-600 text-white shadow-2xs"
                            : "bg-white border border-amber-200 text-amber-800 hover:bg-amber-100/50"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {creationMode === "outpainting" && (
              <div className="p-3 rounded-2xl bg-indigo-50/50 border border-indigo-200/70 text-xs text-indigo-950 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-indigo-900">
                    <Expand className="w-4 h-4 text-indigo-600" />
                    <span>Outpainting Canvas Extender</span>
                  </div>
                  <span className="text-[10px] font-semibold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded-full">
                    Extends beyond viewport
                  </span>
                </div>
                <div className="flex items-center gap-4 flex-wrap text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-neutral-600 font-medium">Expand Ratio:</span>
                    {["1.25x", "1.5x", "2.0x"].map((scale) => (
                      <button
                        key={scale}
                        type="button"
                        onClick={() => setOutpaintScale(scale)}
                        className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          outpaintScale === scale
                            ? "bg-indigo-600 text-white shadow-2xs"
                            : "bg-white border border-indigo-200 text-indigo-800 hover:bg-indigo-100/50"
                        }`}
                      >
                        {scale}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-neutral-600 font-medium">Direction:</span>
                    {["all", "horizontal", "vertical"].map((dir) => (
                      <button
                        key={dir}
                        type="button"
                        onClick={() => setOutpaintDirection(dir)}
                        className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold capitalize transition-all cursor-pointer ${
                          outpaintDirection === dir
                            ? "bg-indigo-600 text-white shadow-2xs"
                            : "bg-white border border-indigo-200 text-indigo-800 hover:bg-indigo-100/50"
                        }`}
                      >
                        {dir}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {creationMode === "style-transfer" && (
              <div className="p-3 rounded-2xl bg-rose-50/50 border border-rose-200/70 text-xs text-rose-950 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-rose-900">
                    <Palette className="w-4 h-4 text-rose-600" />
                    <span>Neural Style Transfer Active</span>
                  </div>
                  <span className="text-[10px] font-semibold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full">
                    Aesthetic preservation
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-neutral-600 font-medium">Style Blend:</span>
                  <div className="flex items-center gap-1">
                    {["Light", "Balanced", "Heavy"].map((str) => (
                      <button
                        key={str}
                        type="button"
                        onClick={() => setStyleStrength(str.toLowerCase())}
                        className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          styleStrength === str.toLowerCase()
                            ? "bg-rose-600 text-white shadow-2xs"
                            : "bg-white border border-rose-200 text-rose-800 hover:bg-rose-100/50"
                        }`}
                      >
                        {str}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {creationMode === "character-consistency" && (
              <div className="p-3 rounded-2xl bg-purple-50/50 border border-purple-200/70 text-xs text-purple-950 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-purple-900">
                    <UserCheck className="w-4 h-4 text-purple-600" />
                    <span>Subject & Persona Identity Anchoring</span>
                  </div>
                  <span className="text-[10px] font-semibold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse"></span>
                    Face & ID Locked
                  </span>
                </div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <label className="text-neutral-600 font-medium shrink-0">Character Persona Tag:</label>
                  <input
                    type="text"
                    value={characterName}
                    onChange={(e) => setCharacterName(e.target.value)}
                    placeholder="e.g. Elena, Cyber Sorceress"
                    className="px-3 py-1 text-xs bg-white border border-purple-200 rounded-lg text-purple-950 font-semibold placeholder-purple-300 focus:outline-none focus:border-purple-500 w-64 shadow-2xs"
                  />
                  <span className="text-[10px] text-purple-600 font-medium">Ensures facial features match between scenes</span>
                </div>
              </div>
            )}

            {/* Prompt Textarea Box */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <div className="flex items-center gap-2">
                  <label className="font-bold text-neutral-800">Prompt</label>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold transition-colors ${
                      prompt.length > currentModel.maxPromptLength
                        ? "bg-rose-100 text-rose-700 border border-rose-300 font-bold"
                        : prompt.length > currentModel.maxPromptLength * 0.85
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-neutral-100 text-neutral-500 border border-neutral-200/60"
                    }`}
                  >
                    {prompt.length} / {currentModel.maxPromptLength} chars
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleEnhancePrompt}
                    disabled={isEnhancing || !prompt.trim()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-xs hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isEnhancing ? "animate-spin" : ""}`} />
                    <span>{isEnhancing ? "Enhancing..." : "Enhance Prompt"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSurpriseMe}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200/90 bg-white text-xs font-semibold text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all cursor-pointer shadow-2xs"
                  >
                    <Dice5 className="w-3.5 h-3.5 text-purple-600" />
                    <span>Surprise Me</span>
                  </button>

                  {/* Prompt History Dropdown with Click-Outside Ref */}
                  <div className="relative" ref={promptHistoryRef}>
                    <button
                      type="button"
                      onClick={() => setPromptHistoryOpen(!promptHistoryOpen)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        promptHistoryOpen
                          ? "bg-blue-50 border-blue-300 text-blue-700 shadow-2xs"
                          : "border-neutral-200/90 bg-white hover:bg-neutral-50 hover:border-neutral-300 text-neutral-700 shadow-2xs"
                      }`}
                    >
                      <History className="w-3.5 h-3.5 text-blue-600" />
                      <span>Prompt History</span>
                      <span className="w-4 h-4 rounded-full bg-neutral-100 text-[10px] font-bold text-neutral-600 flex items-center justify-center">
                        {promptHistory.length}
                      </span>
                      <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform ${promptHistoryOpen ? "rotate-180" : ""}`} />
                    </button>

                    {promptHistoryOpen && (
                      <div className="absolute right-0 top-full mt-2 w-96 bg-white/95 backdrop-blur-md rounded-2xl border border-neutral-200/90 shadow-xl shadow-neutral-900/10 p-3 z-30 animate-dropdown space-y-2">
                        {/* Header */}
                        <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                          <div className="flex items-center gap-2">
                            <History className="w-4 h-4 text-blue-600" />
                            <span className="text-xs font-bold text-neutral-900">Recent Prompts</span>
                            <span className="text-[10px] font-semibold text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded-md">
                              {promptHistory.length} saved
                            </span>
                          </div>
                          {promptHistory.length > 0 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPromptHistory([]);
                              }}
                              className="text-[11px] font-semibold text-neutral-400 hover:text-rose-600 flex items-center gap-1 cursor-pointer transition-colors"
                              title="Clear all prompt history"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Clear</span>
                            </button>
                          )}
                        </div>

                        {/* List of prompts */}
                        <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1 [scrollbar-width:thin]">
                          {promptHistory.length === 0 ? (
                            <div className="py-6 text-center text-xs text-neutral-400 space-y-1">
                              <p className="font-semibold text-neutral-600">No prompt history</p>
                              <p className="text-[11px]">Generate or enhance prompts to view them here.</p>
                            </div>
                          ) : (
                            promptHistory.map((h, i) => (
                              <div
                                key={i}
                                className="group relative p-2.5 rounded-xl border border-neutral-150 hover:border-blue-200 bg-white hover:bg-blue-50/30 transition-all flex items-start gap-2.5 text-left cursor-pointer"
                                onClick={() => {
                                  setPrompt(h);
                                  setPromptHistoryOpen(false);
                                }}
                              >
                                <Clock className="w-3.5 h-3.5 text-neutral-400 group-hover:text-blue-600 shrink-0 mt-0.5" />
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs text-neutral-800 line-clamp-2 leading-relaxed font-sans">
                                    {h}
                                  </p>
                                  <div className="flex items-center justify-between mt-1 text-[10px] text-neutral-400">
                                    <span>#{promptHistory.length - i} • {h.length} chars</span>
                                    <span className="text-blue-600 font-semibold opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity">
                                      Use <CornerDownLeft className="w-2.5 h-2.5" />
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigator.clipboard.writeText(h);
                                      setCopiedPromptId(i);
                                      setTimeout(() => setCopiedPromptId(null), 1500);
                                    }}
                                    className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
                                    title="Copy prompt"
                                  >
                                    {copiedPromptId === i ? (
                                      <Check className="w-3 h-3 text-emerald-600" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setPromptHistory((prev) => prev.filter((_, idx) => idx !== i));
                                    }}
                                    className="p-1 rounded-md text-neutral-400 hover:text-rose-600 hover:bg-rose-50"
                                    title="Delete from history"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Footer Hint */}
                        <div className="pt-1.5 border-t border-neutral-100 text-[10px] text-neutral-400 text-center">
                          Click any prompt to load it into the editor
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Textarea with quick copy & clear actions */}
              <div className="relative group/prompt">
                <textarea
                  ref={textareaRef}
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={
                    currentModel.id === "virtual-try-on"
                      ? "Describe apparel styling, fabric drape, fit adjustments or model pose (e.g. 'Slim fit navy wool blazer with tailored cuffs')..."
                      : currentModel.id === "imagen-3-capability-001"
                      ? "Describe precision edits or inpainting to apply to the masked region (e.g. 'Replace background with sunlit Parisian cafe terrace')..."
                      : currentModel.id === "imagen-4-fast"
                      ? "Enter rapid diffusion text prompt (e.g. 'Golden hour portrait in glass studio, sharp focus, 8k cinematic lighting')..."
                      : currentModel.id === "nano-banana-pro"
                      ? "Enter detailed studio prompt with complex typography in quotes, reasoning, or layout composition..."
                      : "Describe your scene in detail, camera lighting, textures, composition..."
                  }
                  className="w-full bg-neutral-50/70 border border-neutral-200/90 rounded-2xl p-4 pr-24 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none leading-relaxed font-sans"
                />

                <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                  {prompt.trim().length > 0 && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(prompt);
                          setCopyFeedback(true);
                          setTimeout(() => setCopyFeedback(false), 1500);
                        }}
                        className="px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-[11px] font-semibold text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50 flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                        title="Copy prompt"
                      >
                        {copyFeedback ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-neutral-400" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setPrompt("")}
                        className="px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-[11px] font-semibold text-neutral-400 hover:text-rose-600 hover:bg-rose-50 flex items-center gap-0.5 shadow-2xs transition-all cursor-pointer"
                        title="Clear prompt text"
                      >
                        <X className="w-3 h-3" />
                        <span>Clear</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Reference Images Row */}
            <div className="pt-2 border-t border-neutral-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-neutral-700">
                    Reference Images <span className="text-neutral-400 font-normal">(Optional guidance)</span>
                  </span>
                  {currentModel.maxReferences === 0 && (
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      Not supported by {currentModel.name}
                    </span>
                  )}
                </div>
                <span className="text-xs text-neutral-500 font-mono bg-neutral-100 px-2 py-0.5 rounded-md border border-neutral-200/60 font-semibold">
                  {currentModel.maxReferences === 0 ? "0/0" : `${referenceImages.length}/${currentModel.maxReferences}`}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 flex-wrap">
                {/* Left Side: Reference Thumbnails & Dynamic Upload Button */}
                <div className="flex items-center gap-3 flex-wrap">
                  {currentModel.maxReferences === 0 ? (
                    <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-xs text-neutral-500 flex items-center gap-2.5 max-w-lg">
                      <Info className="w-4 h-4 text-neutral-400 shrink-0" />
                      <span>
                        <strong>{currentModel.name}</strong> operates exclusively as a pure text-to-image synthesis engine and does not accept reference image inputs.
                      </span>
                    </div>
                  ) : (
                    <>
                      {referenceImages.map((ref) => (
                        <div
                          key={ref.id}
                          className="relative w-28 h-20 rounded-xl overflow-hidden border border-neutral-200 group shadow-2xs shrink-0 animate-fadeIn"
                        >
                          <img src={ref.url} alt={ref.name} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveReference(ref.id)}
                            className="absolute top-1 right-1 p-1 rounded-full bg-neutral-950/80 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-neutral-950"
                            title="Remove reference"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <span className="absolute bottom-0 inset-x-0 bg-neutral-950/70 text-white text-[9px] font-bold text-center py-0.5 truncate px-1">
                            {ref.name}
                          </span>
                        </div>
                      ))}

                      {/* Upload Button: dynamically disabled when limit reached */}
                      {referenceImages.length < currentModel.maxReferences && (
                        <button
                          type="button"
                          onClick={() => refFileInputRef.current?.click()}
                          className="w-28 h-20 rounded-xl border-2 border-dashed border-neutral-300 hover:border-neutral-900 bg-neutral-50/60 hover:bg-neutral-100/60 flex flex-col items-center justify-center transition-all cursor-pointer text-neutral-500 hover:text-neutral-900 group shrink-0"
                        >
                          <Plus className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform mb-1" />
                          <span className="text-xs font-bold">Add Reference</span>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            ({referenceImages.length}/{currentModel.maxReferences})
                          </span>
                        </button>
                      )}
                      <input
                        ref={refFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAddReference}
                        className="hidden"
                      />
                    </>
                  )}
                </div>

                {/* Right-most Side: Image Influence & Maintain Character Controls */}
                {/* HIDE completely if there are NO reference images! */}
                {referenceImages.length > 0 && (
                  <div className="flex items-center gap-3 ml-auto shrink-0 flex-wrap animate-fadeIn">
                    {/* Sized Image Influence Card */}
                    <div className="w-56 h-20 p-2.5 rounded-xl bg-neutral-50/90 border border-neutral-200/80 flex flex-col justify-between shrink-0 shadow-2xs">
                      <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
                        <span>Image Influence</span>
                        <span className="font-mono text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                          {imageInfluence}%
                        </span>
                      </div>
                      <div className="space-y-1">
                        <input
                          type="range"
                          min={10}
                          max={100}
                          value={imageInfluence}
                          onChange={(e) => setImageInfluence(Number(e.target.value))}
                          className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex items-center justify-between text-[9px] text-neutral-400 font-medium px-0.5">
                          <span>Subtle</span>
                          <span>Balanced</span>
                          <span>Strong</span>
                        </div>
                      </div>
                    </div>

                    {/* Maintain Character Toggle Card */}
                    <div className="h-20 px-3.5 py-2.5 rounded-xl bg-neutral-50/90 border border-neutral-200/80 flex items-center gap-3 shrink-0 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setMaintainCharacter(!maintainCharacter)}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                          maintainCharacter ? "bg-blue-600" : "bg-neutral-300"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                            maintainCharacter ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-neutral-800 leading-tight">Maintain Character</div>
                        <div className="text-[10px] text-neutral-400 leading-tight">Keep same subject across gens</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════════
              3. GENERATION SETTINGS & ACTION BAR (One-Line Segmented Toolbar)
          ══════════════════════════════════════════════════════════════════════ */}
          <div className="p-5 rounded-3xl bg-white border border-neutral-200/90 shadow-card-elevated space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-base font-bold text-neutral-950 font-sans">
                  3. Generation Settings
                </span>
                <span className="text-xs text-neutral-400 font-medium hidden sm:inline">
                  • Engine: <span className="font-semibold text-neutral-700">{currentModel.name}</span>
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-semibold font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                    Max {currentModel.maxResolution}
                  </span>
                  <span className="text-[10px] font-semibold font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200/60">
                    {currentModel.maxReferences} Ref{currentModel.maxReferences === 1 ? "" : "s"}
                  </span>
                  <span className="text-[10px] font-semibold font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    Up to {currentModel.maxOutputs} Output{currentModel.maxOutputs === 1 ? "" : "s"}
                  </span>
                </div>
              </div>

              {/* Advanced Split Drawer Toggle */}
              <button
                type="button"
                onClick={() => handleToggleAdvancedPanel()}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  advancedPanelOpen
                    ? "bg-blue-50 border-blue-300 text-blue-700 shadow-2xs font-bold"
                    : "bg-neutral-50/80 border-neutral-200/90 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70"
                }`}
                title="Toggle split-view drawer for fine-grained engine parameters"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500" />
                <span>Advanced Drawer</span>
                <span
                  className={`w-2 h-2 rounded-full transition-colors ${
                    advancedPanelOpen ? "bg-blue-600 animate-pulse" : "bg-neutral-300"
                  }`}
                />
              </button>
            </div>

            {/* ── THE ONE-LINE SETTINGS TOOLBAR (Quick Settings + Toggable More) ── */}
            <div className="p-2 rounded-2xl bg-neutral-100/75 border border-neutral-200/75 flex flex-wrap items-center justify-between gap-2.5">
              {/* Quick Setting 1: Aspect Ratio Sliding Box (Responsive Width based on layout) */}
              <div className="flex items-center gap-1.5 shrink-0 min-w-0">
                <span className="text-xs font-bold text-neutral-700 pl-1 shrink-0">Ratio:</span>
                <div className="flex items-center gap-0.5 bg-white/95 p-1 rounded-xl border border-neutral-200/70 shadow-2xs shrink-0 min-w-0">
                  {/* Slide Left Button */}
                  <button
                    type="button"
                    disabled={!canScrollRatioLeft}
                    onClick={() => ratioRailRef.current?.scrollBy({ left: -140, behavior: "smooth" })}
                    className="w-5 h-7 rounded-lg hover:bg-neutral-100 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-all cursor-pointer shrink-0"
                    title="Slide ratios left"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  {/* Scrollable track of ratio buttons - dynamic width based on available space */}
                  <div
                    ref={ratioRailRef}
                    onScroll={checkRatioScroll}
                    className={`flex items-center gap-1 overflow-x-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth px-0.5 transition-all duration-300 ease-in-out ${ratioTrackWidthClass}`}
                  >
                    {currentModel.aspectRatios.map((id) => {
                      const ratio = ASPECT_RATIO_PREVIEWS.find((r) => r.id === id);
                      if (!ratio) return null;
                      const isSelected = selectedRatio === ratio.id;
                      return (
                        <button
                          key={ratio.id}
                          type="button"
                          onClick={() => setSelectedRatio(ratio.id)}
                          className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer border shrink-0 ${
                            isSelected
                              ? "bg-blue-50 text-blue-900 border-blue-200 shadow-2xs font-bold ring-1 ring-blue-500/20"
                              : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 border-transparent"
                          }`}
                          title={`${ratio.name} (${ratio.id})`}
                        >
                          {ratio.svg(isSelected)}
                          <span>{ratio.id}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Slide Right Button */}
                  <button
                    type="button"
                    disabled={!canScrollRatioRight}
                    onClick={() => ratioRailRef.current?.scrollBy({ left: 140, behavior: "smooth" })}
                    className="w-5 h-7 rounded-lg hover:bg-neutral-100 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-all cursor-pointer shrink-0"
                    title="Slide ratios right"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Vertical Divider */}
              <div className="h-6 w-px bg-neutral-200 hidden md:block shrink-0" />
              {/* Quick Setting 2: Resolution */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex flex-col pl-1">
                  <span className="text-xs font-bold text-neutral-700 leading-none">Res:</span>
                  <span className="text-[9px] font-mono text-neutral-400 font-medium leading-tight">{dynamicDimensions}</span>
                </div>
                <div className="flex items-center gap-1 bg-white/95 p-1 rounded-xl border border-neutral-200/70 shadow-2xs">
                  {(["0.5K", "1K", "2K", "4K"] as const).map((res) => {
                    const isSupported = currentModel.supportedResolutions.includes(res as any);
                    const isSelected = selectedResolution === res;
                    const badge =
                      res === "0.5K"
                        ? "Draft"
                        : res === "1K"
                        ? "Std"
                        : res === "2K"
                        ? "+3cr"
                        : "+10cr";
                    return (
                      <button
                        key={res}
                        type="button"
                        disabled={!isSupported}
                        onClick={() => setSelectedResolution(res)}
                        className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 border ${
                          !isSupported
                            ? "opacity-35 cursor-not-allowed text-neutral-400 border-transparent bg-neutral-50/50"
                            : isSelected
                            ? "bg-blue-50 text-blue-900 border-blue-200 shadow-2xs font-bold ring-1 ring-blue-500/20 cursor-pointer"
                            : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 border-transparent cursor-pointer"
                        }`}
                        title={isSupported ? `${res} (${badge})` : `Resolution ${res} not supported by ${currentModel.name}`}
                      >
                        <span>{res}</span>
                        <span className={`text-[9px] ${isSelected ? "text-blue-600 font-bold" : "text-neutral-400"}`}>
                          {badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Vertical Divider */}
              <div className="h-6 w-px bg-neutral-200 hidden md:block shrink-0" />

              {/* Quick Setting 3: Outputs */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-neutral-700 pl-1 shrink-0">Outputs:</span>
                <div className="flex items-center gap-1 bg-white/95 p-1 rounded-xl border border-neutral-200/70 shadow-2xs">
                  {[1, 2, 3, 4].map((num) => {
                    const isAllowed = num <= currentModel.maxOutputs;
                    const isSelected = outputsCount === num;
                    return (
                      <button
                        key={num}
                        type="button"
                        disabled={!isAllowed}
                        onClick={() => setOutputsCount(num)}
                        className={`w-7 h-6 rounded-lg text-xs font-semibold transition-all flex items-center justify-center border ${
                          !isAllowed
                            ? "opacity-30 cursor-not-allowed text-neutral-400 border-transparent bg-neutral-50/50"
                            : isSelected
                            ? "bg-blue-50 text-blue-900 border-blue-200 shadow-2xs font-bold ring-1 ring-blue-500/20 cursor-pointer"
                            : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 border-transparent cursor-pointer"
                        }`}
                        title={isAllowed ? `${num} output image${num > 1 ? "s" : ""}` : `Max ${currentModel.maxOutputs} on ${currentModel.name}`}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Toggable More Settings Button */}
              <button
                type="button"
                onClick={() => setInlineMoreOpen(!inlineMoreOpen)}
                className={`ml-auto px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-2xs ${
                  inlineMoreOpen
                    ? "bg-blue-600 text-white border-blue-600 shadow-xs font-bold"
                    : "bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-700 hover:text-neutral-900"
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>More Settings</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold capitalize ${
                  inlineMoreOpen ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-600"
                }`}>
                  {qualityTier}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${inlineMoreOpen ? "rotate-180" : ""}`} />
              </button>
            </div>

            {/* ── EXPANDABLE INLINE FINE-TUNING PANEL ── */}
            {inlineMoreOpen && (
              <div className="p-4 rounded-2xl bg-neutral-50/90 border border-neutral-200/80 space-y-3.5 animate-fadeIn">
                <div className="flex items-center justify-between text-xs border-b border-neutral-200/60 pb-2">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-3.5 h-3.5 text-blue-600" />
                    <span className="font-bold text-neutral-900">Fine-Tuning & Quality Controls</span>
                    <span className="text-[10px] text-neutral-400 font-mono">({currentModel.engine})</span>
                  </div>
                  <span className="text-[10px] text-neutral-500">
                    Changes apply immediately to this generation
                  </span>
                </div>

                {/* Quality Tier Selector inside More Settings */}
                <div className="bg-white p-3 rounded-xl border border-neutral-200/70 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-neutral-800">Quality Mode</span>
                    <span className="text-[10px] text-neutral-400 capitalize">{qualityTier} render tier</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-neutral-100/70 p-1 rounded-xl border border-neutral-200/60">
                    {[
                      { id: "draft", label: "Draft", hint: "Fast & lightweight" },
                      { id: "standard", label: "Standard", hint: "Optimal balance" },
                      { id: "high", label: "High", hint: "Ultra high fidelity" },
                    ].map((q) => {
                      const isSupported = currentModel.supportedQualityTiers.includes(q.id as any);
                      const isSelected = qualityTier === q.id;
                      return (
                        <button
                          key={q.id}
                          type="button"
                          disabled={!isSupported}
                          onClick={() => setQualityTier(q.id)}
                          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 border ${
                            !isSupported
                              ? "opacity-30 cursor-not-allowed text-neutral-400 border-transparent bg-neutral-50/50"
                              : isSelected
                              ? "bg-white text-neutral-950 border-neutral-200/90 shadow-2xs font-bold ring-1 ring-neutral-900/5 cursor-pointer"
                              : "text-neutral-600 hover:text-neutral-900 hover:bg-white/50 border-transparent cursor-pointer"
                          }`}
                        >
                          <span>{q.label}</span>
                          <span className={`text-[10px] ${isSelected ? "text-blue-600 font-bold" : "text-neutral-400"}`}>
                            ({q.hint})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {/* Sampling Steps */}
                  <div className="space-y-1.5 bg-white p-3 rounded-xl border border-neutral-200/70 shadow-2xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-neutral-700">Sampling Steps</span>
                      <span className="font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-[11px]">{steps}</span>
                    </div>
                    <input
                      type="range"
                      min={15}
                      max={50}
                      value={steps}
                      onChange={(e) => setSteps(Number(e.target.value))}
                      className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-[9px] text-neutral-400">
                      <span>15 (Fast)</span>
                      <span>30 (Standard)</span>
                      <span>50 (Max)</span>
                    </div>
                  </div>

                  {/* CFG Guidance Scale */}
                  <div className="space-y-1.5 bg-white p-3 rounded-xl border border-neutral-200/70 shadow-2xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-neutral-700">Guidance Scale (CFG)</span>
                      <span className="font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-[11px]">{cfgScale}</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={15}
                      step={0.5}
                      value={cfgScale}
                      onChange={(e) => setCfgScale(Number(e.target.value))}
                      className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-[9px] text-neutral-400">
                      <span>Creative (3.0)</span>
                      <span>Balanced (7.5)</span>
                      <span>Strict (12.0)</span>
                    </div>
                  </div>

                  {/* Seed Control */}
                  <div className="space-y-1.5 bg-white p-3 rounded-xl border border-neutral-200/70 shadow-2xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-neutral-700">Generation Seed</span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {seedMode === "random" ? "Randomized" : `#${seedValue}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSeedMode("random")}
                        className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-all border ${
                          seedMode === "random"
                            ? "bg-blue-50 text-blue-700 border-blue-200 font-bold"
                            : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100"
                        }`}
                      >
                        🎲 Random
                      </button>
                      <button
                        type="button"
                        onClick={() => setSeedMode("custom")}
                        className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-all border ${
                          seedMode === "custom"
                            ? "bg-blue-50 text-blue-700 border-blue-200 font-bold"
                            : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100"
                        }`}
                      >
                        Fixed
                      </button>
                      {seedMode === "custom" && (
                        <input
                          type="number"
                          value={seedValue}
                          onChange={(e) => setSeedValue(Number(e.target.value))}
                          className="w-20 px-2 py-0.5 text-xs border border-neutral-200 rounded-lg font-mono"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Negative Prompt Row (Dynamically adapts if model does not use negative prompts) */}
                <div className="bg-white p-3 rounded-xl border border-neutral-200/70 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-neutral-700">
                      <span>Negative Prompt (Avoid in image):</span>
                      {!currentModel.supportsNegativePrompt && (
                        <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          Not applicable for {currentModel.name}
                        </span>
                      )}
                    </div>
                    {currentModel.supportsNegativePrompt && (
                      <span className="text-[10px] text-neutral-400">Optional unwanted elements</span>
                    )}
                  </div>
                  {currentModel.supportsNegativePrompt ? (
                    <input
                      type="text"
                      value={negativePrompt}
                      onChange={(e) => setNegativePrompt(e.target.value)}
                      placeholder="e.g. blurry, low quality, bad anatomy, deformed limbs, artifacts..."
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-neutral-50 border border-neutral-200 focus:outline-none focus:bg-white focus:border-neutral-400"
                    />
                  ) : (
                    <p className="text-[11px] text-neutral-400 italic">
                      This flow-matching engine applies guidance directly through the positive prompt without negative conditioning.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Bottom Generation Action Ribbon */}
            <div className="pt-4 border-t border-neutral-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-wrap text-xs">
                {/* Cost Badge with gold coin */}
                <div
                  className="flex items-center gap-2 font-bold text-neutral-900 bg-amber-50/70 border border-amber-200/80 px-3.5 py-2 rounded-xl shadow-2xs"
                  title={`Cost breakdown: ${currentModel.cost} base × ${outputsCount} outputs + extras = ${estimatedCost} credits`}
                >
                  <Coins className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-neutral-700">Estimated Cost:</span>
                  <span className="text-amber-700 font-mono font-bold text-sm">~{estimatedCost} Credits</span>
                </div>

                <div className="flex items-center gap-1.5 text-neutral-500 font-medium">
                  <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>~{currentModel.estimatedRenderTime} render</span>
                </div>

                <div className="flex items-center gap-1.5 text-neutral-500 font-medium">
                  <FolderKanban className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>Save to:</span>
                  <span className="font-semibold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded-lg border border-neutral-200/60">
                    My Creations
                  </span>
                </div>
              </div>

              {/* Big Luxury Generate Images Button */}
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-extrabold text-sm shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2.5 active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0 whitespace-nowrap"
              >
                <Sparkles className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
                <span>{isGenerating ? "Synthesizing Images..." : "Generate Images"}</span>
                <kbd className="px-2 py-0.5 rounded-lg bg-white/20 text-white text-[10px] font-mono border border-white/20">
                  Ctrl ↵
                </kbd>
              </button>
            </div>

            {/* In-Flight Progress Bar */}
            {isGenerating && (
              <div className="space-y-2 pt-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    {generationPhase}
                  </span>
                  <span className="font-mono text-blue-600">{progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                  <div className="animate-scanline" />
                </div>
              </div>
            )}

            {/* Success Toast Banner */}
            {showSuccessToast && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-800 text-xs font-semibold animate-spring shadow-2xs">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Image generated successfully and added to your Recent Creations below!</span>
              </div>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            RIGHT COLLAPSIBLE PANEL: ADVANCED SETTINGS (Dynamic Google Cloud Suite)
        ══════════════════════════════════════════════════════════════════════ */}
        <div
          className={`shrink-0 transition-all duration-300 ease-in-out ${
            advancedPanelOpen
              ? "w-full lg:w-80 xl:w-96 opacity-100 translate-x-0"
              : "w-0 h-0 lg:h-auto opacity-0 overflow-hidden pointer-events-none translate-x-8"
          }`}
        >
          <aside className="w-full lg:w-80 xl:w-96 rounded-3xl bg-white border border-neutral-200/90 shadow-luxury p-5 space-y-5 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto scrollbar-thin">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-neutral-950">Advanced Settings</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {currentModel.category === "nano" ? (
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80">
                        {currentModel.id === "nano-banana-pro" ? "Google Gemini Reasoning Studio" : "Google Gemini Autoregressive"}
                      </span>
                    ) : currentModel.category === "imagen" ? (
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                        {currentModel.id === "imagen-3-capability-001" ? "Google Imagen Inpainting Engine" : "Google Imagen Latent"}
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200/80">
                        Google Vertex AI Specialized
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setQualityTier("standard");
                    setThinkingBudget("standard");
                    setInpaintBoundaryFeather(6);
                    setCfgScale(7.5);
                    setSeedMode("random");
                    setNegativePrompt("");
                    setSafetyFilterLevel("block_medium_and_above");
                    setPersonGeneration("allow_adult");
                    setSynthIdWatermark(true);
                    setWebGrounding(false);
                  }}
                  className="text-xs font-semibold text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
                  title="Reset to model recommended defaults"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleAdvancedPanel(false)}
                  className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-800 transition-colors cursor-pointer"
                  title="Close Advanced Settings"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Architecture Context Alert Card */}
            <div
              className={`p-3 rounded-2xl border text-xs space-y-1 transition-colors ${
                currentModel.category === "nano"
                  ? "bg-amber-50/60 border-amber-200/80 text-amber-900"
                  : currentModel.category === "imagen"
                  ? "bg-indigo-50/60 border-indigo-200/80 text-indigo-900"
                  : "bg-rose-50/60 border-rose-200/80 text-rose-900"
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {currentModel.id === "nano-banana-pro"
                    ? "Gemini Multimodal Reasoning & 4K Synthesis"
                    : currentModel.category === "nano"
                    ? "Multimodal Token Synthesis"
                    : currentModel.id === "imagen-3-capability-001"
                    ? "Vertex AI Precision Inpainting & Expansion"
                    : currentModel.category === "imagen"
                    ? "Vertex AI Cloud Latent Pipeline"
                    : "Vertex AI Apparel & Geometry Engine"}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-neutral-600">
                {currentModel.id === "nano-banana-pro"
                  ? "Gemini 3 Pro utilizes dynamic reasoning budgets to plan complex multilingual text, intricate reflections, and scene balance prior to autoregressive image generation."
                  : currentModel.category === "nano"
                  ? "Gemini synthesizes images directly via autoregressive multimodal token generation. Steering is achieved via prompt fidelity, Google Search grounding, and safety thresholds."
                  : currentModel.id === "imagen-3-capability-001"
                  ? "Google Imagen Inpainting pipeline isolates masked visual regions and denoises boundary edges with seamless background blend coherence."
                  : currentModel.category === "imagen"
                  ? "Google Imagen automates denoising step scheduling server-side for peak visual fidelity. Fine-tuning parameters include CFG Guidance Scale, Person Generation Policy, and SynthID."
                  : "Specialized multimodal vision model tailored for virtual try-on, ensuring photorealistic garment texture drape, lighting continuity, and accurate human body shape alignment."}
              </p>
            </div>

            {/* Quality Mode Tier Selector - Hidden for all Nano models */}
            {currentModel.category !== "nano" && (
            <div className="bg-neutral-50/80 p-3 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-neutral-800">Quality Mode</span>
                <span className="text-[10px] text-neutral-500 font-medium capitalize">
                  {qualityTier} render tier
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-neutral-100/70 p-1 rounded-xl border border-neutral-200/60">
                {[
                  { id: "draft", label: "Draft", hint: "Fast" },
                  { id: "standard", label: "Standard", hint: "Optimal" },
                  { id: "high", label: "High", hint: "+1cr" },
                ].map((q) => {
                  const isSupported = currentModel.supportedQualityTiers.includes(q.id as any);
                  const isSelected = qualityTier === q.id;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      disabled={!isSupported}
                      onClick={() => setQualityTier(q.id)}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 border ${
                        !isSupported
                          ? "opacity-30 cursor-not-allowed text-neutral-400 border-transparent bg-neutral-50/50"
                          : isSelected
                          ? "bg-white text-neutral-950 border-neutral-200/90 shadow-2xs font-bold ring-1 ring-neutral-900/5 cursor-pointer"
                          : "text-neutral-600 hover:text-neutral-900 hover:bg-white/50 border-transparent cursor-pointer"
                      }`}
                      title={isSupported ? `${q.label} tier: ${q.hint}` : `Not supported by ${currentModel.name}`}
                    >
                      <span>{q.label}</span>
                      <span className={`text-[9px] ${isSelected ? "text-blue-600 font-bold" : "text-neutral-400"}`}>
                        ({q.hint})
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-neutral-400 leading-normal">
                High quality mode allocates additional sampling compute and precision rendering (+1 credit).
              </p>
            </div>
            )}

            {/* ─── DYNAMIC PARAMETERS SECTION ─── */}

            {/* CASE A: NANO BANANA (GEMINI MULTIMODAL) */}
            {currentModel.category === "nano" && (
              <div className="space-y-4">
                <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Google Cloud Engine Controls</span>
                  <span className="text-[10px] text-amber-600 font-semibold bg-amber-100/70 px-1.5 py-0.5 rounded">Vertex AI</span>
                </div>

                {/* Exclusive Nano Banana Pro Feature: AI Reasoning & Thinking Budget */}
                {currentModel.id === "nano-banana-pro" && (
                  <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-purple-900 flex items-center gap-1.5">
                        <Brain className="w-3.5 h-3.5 text-purple-600" />
                        AI Reasoning & Thinking Budget
                      </span>
                      <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-100/80 px-1.5 py-0.5 rounded uppercase">
                        {thinkingBudget === "deep" ? "2,000 Tokens" : "1,000 Tokens"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: "standard", label: "Standard Reasoning", desc: "1,000 tokens planning" },
                        { id: "deep", label: "Deep Reasoning", desc: "2,000 tokens (text & physics)" },
                      ].map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setThinkingBudget(b.id as any)}
                          className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                            thinkingBudget === b.id
                              ? "bg-white text-purple-950 border-purple-300 shadow-2xs font-bold ring-1 ring-purple-500/10"
                              : "bg-purple-100/40 hover:bg-white/70 border-transparent text-purple-800"
                          }`}
                        >
                          <div className="text-xs font-bold">{b.label}</div>
                          <div className="text-[9px] text-purple-600/80">{b.desc}</div>
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-purple-700/80 leading-tight">
                      Allocates internal thinking budget prior to token synthesis for accurate hands, text rendering & geometry.
                    </p>
                  </div>
                )}

                {/* Google Web Search Grounding */}
                <div className="p-3 rounded-2xl bg-neutral-50/80 border border-neutral-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-600 shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-neutral-800">Google Search Grounding</span>
                        {!currentModel.supportsWebGrounding && (
                          <span className="ml-2 text-[9px] font-bold text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded">
                            Not supported by 2.5 Flash
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={!currentModel.supportsWebGrounding}
                      onClick={() => setWebGrounding(!webGrounding)}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                        webGrounding && currentModel.supportsWebGrounding ? "bg-blue-600" : "bg-neutral-300"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          webGrounding && currentModel.supportsWebGrounding ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-[10px] text-neutral-500 leading-normal">
                    Grounds generation with live Google Search index for current events, factual public figures, and latest world data.
                  </p>
                </div>

                {/* Vertex AI Safety Filter Level */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
                      Safety Filter Level
                    </span>
                  </div>
                  <select
                    value={safetyFilterLevel}
                    onChange={(e) => setSafetyFilterLevel(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-medium text-neutral-900 focus:outline-none focus:bg-white focus:border-blue-600 transition-all cursor-pointer"
                  >
                    <option value="block_medium_and_above">Block Medium & Above (Standard)</option>
                    <option value="block_low_and_above">Block Low & Above (Strict Family Safe)</option>
                    <option value="block_only_high">Block Only High (High Creativity)</option>
                    <option value="dont_block">Do Not Block (Unfiltered Developer)</option>
                  </select>
                </div>

                {/* Person Generation Policy */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
                    <span className="flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-neutral-500" />
                      Person Generation Policy
                    </span>
                  </div>
                  <select
                    value={personGeneration}
                    onChange={(e) => setPersonGeneration(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-medium text-neutral-900 focus:outline-none focus:bg-white focus:border-blue-600 transition-all cursor-pointer"
                  >
                    <option value="allow_adult">Allow Adults Only (Default)</option>
                    <option value="dont_allow">Do Not Allow (Objects & Landscapes Only)</option>
                    <option value="allow_all">Allow All Demographics</option>
                  </select>
                </div>

                {/* SynthID Watermark */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/80">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-neutral-800">Google SynthID Watermarking</span>
                    <p className="text-[10px] text-neutral-500">Embeds invisible cryptographic provenance</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSynthIdWatermark(!synthIdWatermark)}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                      synthIdWatermark ? "bg-emerald-600" : "bg-neutral-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        synthIdWatermark ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Seed with Multimodal Turn Notice */}
                <div className="space-y-2 pt-2 border-t border-neutral-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-700">Generation Seed</span>
                    <span className="text-[10px] text-amber-600 font-medium">Turn variation active</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSeedMode("random")}
                      className={`h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        seedMode === "random"
                          ? "bg-blue-600 text-white shadow-2xs"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80"
                      }`}
                    >
                      Random
                    </button>
                    <button
                      type="button"
                      onClick={() => setSeedMode("custom")}
                      className={`h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        seedMode === "custom"
                          ? "bg-blue-600 text-white shadow-2xs"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80"
                      }`}
                    >
                      Fixed Seed
                    </button>
                  </div>
                  {seedMode === "custom" && (
                    <input
                      type="number"
                      value={seedValue}
                      onChange={(e) => setSeedValue(Number(e.target.value))}
                      className="w-full h-8 px-3 rounded-xl border border-neutral-200 bg-white text-xs font-mono text-neutral-900 focus:outline-none focus:border-blue-600"
                      placeholder="Seed number..."
                    />
                  )}
                  <p className="text-[10px] text-neutral-400 leading-normal">
                    Gemini multimodal token sampling exhibits natural temperature variation across calls even with an identical seed.
                  </p>
                </div>
              </div>
            )}

            {/* CASE B: GOOGLE IMAGEN SUITE */}
            {currentModel.category === "imagen" && (
              <div className="space-y-4">
                <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Google Imagen Parameters</span>
                  <span className="text-[10px] text-indigo-600 font-semibold bg-indigo-100/70 px-1.5 py-0.5 rounded">Vertex AI</span>
                </div>

                {/* Specialized Inpainting controls for imagen-3-capability-001 */}
                {currentModel.id === "imagen-3-capability-001" && (
                  <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-indigo-950">
                      <span className="flex items-center gap-1.5">
                        <Paintbrush className="w-3.5 h-3.5 text-indigo-600" />
                        Inpainting Boundary Blend
                      </span>
                      <span className="font-mono text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded text-[10px]">
                        {inpaintBoundaryFeather}px Feather
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={20}
                      value={inpaintBoundaryFeather}
                      onChange={(e) => setInpaintBoundaryFeather(Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                    <div className="flex justify-between text-[9px] text-indigo-700/80 font-medium">
                      <span>Sharp Edge (0px)</span>
                      <span>Balanced (6px)</span>
                      <span>Soft Blend (20px)</span>
                    </div>
                    <p className="text-[10px] text-indigo-800/80 leading-normal">
                      Feathers the transition border between original image pixels and inpainting synthesis.
                    </p>
                  </div>
                )}

                {/* Vertex Guidance Scale (CFG) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
                    <span>Guidance Scale (CFG)</span>
                    <span className="font-mono text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded">
                      {cfgScale}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={0.5}
                    value={cfgScale}
                    onChange={(e) => setCfgScale(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-400 font-medium">
                    <span>1.0 (Creative)</span>
                    <span className="text-indigo-600 font-bold">7.5 (Optimal)</span>
                    <span>10.0 (Strict)</span>
                  </div>
                </div>

                {/* Vertex AI Safety Filter Level */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
                    Safety Filter Level
                  </label>
                  <select
                    value={safetyFilterLevel}
                    onChange={(e) => setSafetyFilterLevel(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-medium text-neutral-900 focus:outline-none focus:bg-white focus:border-indigo-600 transition-all cursor-pointer"
                  >
                    <option value="block_medium_and_above">Block Medium & Above (Standard)</option>
                    <option value="block_low_and_above">Block Low & Above (Strict Family Safe)</option>
                    <option value="block_only_high">Block Only High (Permissive)</option>
                    <option value="dont_block">Do Not Block (Unfiltered)</option>
                  </select>
                </div>

                {/* Person Generation Policy */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-neutral-500" />
                    Person Generation Policy
                  </label>
                  <select
                    value={personGeneration}
                    onChange={(e) => setPersonGeneration(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-medium text-neutral-900 focus:outline-none focus:bg-white focus:border-indigo-600 transition-all cursor-pointer"
                  >
                    <option value="allow_adult">Allow Adults Only (Standard)</option>
                    <option value="dont_allow">Do Not Allow (Objects / Landscapes Only)</option>
                    <option value="allow_all">Allow All Demographics</option>
                  </select>
                </div>

                {/* SynthID Watermark */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/80">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-neutral-800">Google SynthID Watermarking</span>
                    <p className="text-[10px] text-neutral-500">Embeds invisible cryptographic provenance</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSynthIdWatermark(!synthIdWatermark)}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                      synthIdWatermark ? "bg-emerald-600" : "bg-neutral-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        synthIdWatermark ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Deterministic Seed */}
                <div className="space-y-2 pt-2 border-t border-neutral-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-700">Deterministic Seed</span>
                    <span className="text-[10px] text-indigo-600 font-mono">100% Reproducible</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSeedMode("random")}
                      className={`h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        seedMode === "random"
                          ? "bg-indigo-600 text-white shadow-2xs"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80"
                      }`}
                    >
                      Random
                    </button>
                    <button
                      type="button"
                      onClick={() => setSeedMode("custom")}
                      className={`h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        seedMode === "custom"
                          ? "bg-indigo-600 text-white shadow-2xs"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80"
                      }`}
                    >
                      Custom Seed
                    </button>
                  </div>
                  {seedMode === "custom" && (
                    <input
                      type="number"
                      value={seedValue}
                      onChange={(e) => setSeedValue(Number(e.target.value))}
                      className="w-full h-8 px-3 rounded-xl border border-neutral-200 bg-white text-xs font-mono text-neutral-900 focus:outline-none focus:border-indigo-600"
                      placeholder="Enter seed number..."
                    />
                  )}
                </div>
              </div>
            )}

            {/* CASE C: SPECIALIZED MODELS (VIRTUAL TRY-ON) */}
            {currentModel.category === "specialized" && (
              <div className="space-y-4">
                <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Virtual Try-On Controls</span>
                  <span className="text-[10px] text-rose-600 font-semibold bg-rose-100/70 px-1.5 py-0.5 rounded">Apparel SLA</span>
                </div>

                {/* Fabric Guidance Adherence */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
                    <span>Garment Adherence (CFG)</span>
                    <span className="font-mono text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded">
                      {cfgScale}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={0.5}
                    value={cfgScale}
                    onChange={(e) => setCfgScale(Number(e.target.value))}
                    className="w-full accent-rose-600"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-400 font-medium">
                    <span>Natural Drape (3.5)</span>
                    <span className="text-rose-600 font-bold">Optimal Fit (7.5)</span>
                    <span>Strict Fabric (10.0)</span>
                  </div>
                </div>

                {/* Person Demographic Policy */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-neutral-500" />
                    Fitting Demographic Policy
                  </label>
                  <select
                    value={personGeneration}
                    onChange={(e) => setPersonGeneration(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-medium text-neutral-900 focus:outline-none focus:bg-white focus:border-rose-600 transition-all cursor-pointer"
                  >
                    <option value="allow_adult">Adult Fashion Models Only</option>
                    <option value="allow_all">All Demographic Models</option>
                  </select>
                </div>

                {/* Safety Filter */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
                    Safety Moderation
                  </label>
                  <select
                    value={safetyFilterLevel}
                    onChange={(e) => setSafetyFilterLevel(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-medium text-neutral-900 focus:outline-none focus:bg-white focus:border-rose-600 transition-all cursor-pointer"
                  >
                    <option value="block_medium_and_above">Standard Moderation</option>
                    <option value="block_low_and_above">Strict Brand Safe</option>
                  </select>
                </div>

                {/* SynthID Watermark */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/80">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-neutral-800">SynthID Apparel Provenance</span>
                    <p className="text-[10px] text-neutral-500">Invisible digital watermark</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSynthIdWatermark(!synthIdWatermark)}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                      synthIdWatermark ? "bg-emerald-600" : "bg-neutral-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        synthIdWatermark ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Deterministic Seed */}
                <div className="space-y-2 pt-2 border-t border-neutral-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-700">Model Character Seed</span>
                    <span className="text-[10px] text-rose-600 font-mono">Avatar Consistency</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSeedMode("random")}
                      className={`h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        seedMode === "random"
                          ? "bg-rose-600 text-white shadow-2xs"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80"
                      }`}
                    >
                      Random
                    </button>
                    <button
                      type="button"
                      onClick={() => setSeedMode("custom")}
                      className={`h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        seedMode === "custom"
                          ? "bg-rose-600 text-white shadow-2xs"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80"
                      }`}
                    >
                      Fixed Seed
                    </button>
                  </div>
                  {seedMode === "custom" && (
                    <input
                      type="number"
                      value={seedValue}
                      onChange={(e) => setSeedValue(Number(e.target.value))}
                      className="w-full h-8 px-3 rounded-xl border border-neutral-200 bg-white text-xs font-mono text-neutral-900 focus:outline-none focus:border-rose-600"
                      placeholder="Enter seed number..."
                    />
                  )}
                </div>
              </div>
            )}

            {/* Negative Prompt */}
            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-700">
                <span className="flex items-center gap-1.5">
                  Negative Guidance
                  <span className="text-[9px] font-normal text-neutral-400">
                    {currentModel.category === "nano" ? "(Natural Prompt)" : "(Native Tensor)"}
                  </span>
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {negativePrompt.length}/1000
                </span>
              </div>
              <textarea
                rows={2}
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder={
                  currentModel.category === "nano"
                    ? "Elements to steer away from (e.g. text watermark, dark lighting, clutter, neon signs)..."
                    : currentModel.category === "specialized"
                    ? "Garment artifacts to avoid (e.g. unnatural folds, blurry fabric texture, bad anatomy)..."
                    : "Unwanted attributes (e.g. blurry, deformed, bad anatomy, low quality)..."
                }
                className="w-full p-2.5 rounded-xl border border-neutral-200 bg-neutral-50/70 text-xs text-neutral-800 focus:outline-none focus:bg-white focus:border-blue-600 transition-all resize-none"
              />
              {currentModel.category === "nano" && (
                <p className="text-[10px] text-blue-600 leading-tight">
                  Auto-formatted as natural instruction: <code className="bg-blue-50 px-1 py-0.5 rounded font-mono text-[9px]">Avoid the following elements: {negativePrompt || "..."}</code>
                </p>
              )}
            </div>

            {/* Advanced Options Toggles: Smart Prompt Keyword Enrichers */}
            <div className="space-y-3 pt-2 border-t border-neutral-100">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Enhancement Modifiers
                </div>
                <span className="text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-200/80 px-1.5 py-0.5 rounded">
                  Smart Enrichers
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 leading-normal">
                Google Cloud APIs synthesize images best through curated descriptors rather than ad-hoc boolean flags; these toggles inject expert prompt tokens.
              </p>

              {[
                {
                  label: "High Detail Mode",
                  desc: "+hyper-detailed, intricate surface textures, 8k",
                  state: highDetailMode,
                  setter: setHighDetailMode,
                },
                {
                  label: "Face Enhancement",
                  desc: "+flawless facial symmetry, realistic skin pores",
                  state: faceEnhancement,
                  setter: setFaceEnhancement,
                },
                {
                  label: "Text & Typography",
                  desc: currentModel.id === "nano-banana-pro"
                    ? "+crisp multilingual typography, signboards & logos (Nano Banana Pro optimized)"
                    : "+sharp legible typography, clear crisp lettering",
                  state: textRendering,
                  setter: setTextRendering,
                },
                {
                  label: "Cinematic HDR Lighting",
                  desc: "+cinematic HDR lighting, dynamic range, specular",
                  state: hdrLighting,
                  setter: setHdrLighting,
                },
                {
                  label: "Safe Generation",
                  desc: "Enforce Google Cloud Responsible AI guardrails",
                  state: safeGeneration,
                  setter: setSafeGeneration,
                },
              ].map((opt) => (
                <div key={opt.label} className="flex items-center justify-between text-xs font-medium text-neutral-800 py-0.5">
                  <div className="space-y-0.5 pr-2">
                    <span className="font-semibold">{opt.label}</span>
                    <p className="text-[9px] text-neutral-400 leading-tight font-mono">{opt.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => opt.setter(!opt.state)}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                      opt.state ? "bg-blue-600" : "bg-neutral-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        opt.state ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>

      <div ref={generationFeedRef} id="generations-feed" className="space-y-4 pt-4 border-t border-neutral-200/80 scroll-mt-6">
        {/* Error Alert Banner */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start justify-between gap-3 text-rose-800 text-xs font-semibold animate-fadeIn shadow-2xs">
            <div className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-rose-600 mt-1.5 shrink-0" />
              <div>
                <span className="font-bold">Generation Error: </span>
                <span>{errorMsg}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setErrorMsg(null)}
              className="text-rose-500 hover:text-rose-800 font-bold text-xs p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-3">
          {/* Feed Tabs */}
          <div className="flex items-center gap-1">
            {[
              { id: "recent", label: "Recent Generations" },
              { id: "my-creations", label: "My Creations" },
              { id: "favorites", label: "Favorites" },
              { id: "projects", label: "Projects" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFeedTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeFeedTab === tab.id
                    ? "bg-neutral-950 text-white shadow-2xs"
                    : "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Feed Filters & Search */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={feedSearchQuery}
                onChange={(e) => setFeedSearchQuery(e.target.value)}
                placeholder="Search your generations..."
                className="pl-8 pr-3 py-1.5 rounded-xl border border-neutral-200 bg-white text-xs text-neutral-800 focus:outline-none focus:border-neutral-400 placeholder-neutral-400 w-48 sm:w-56"
              />
            </div>

            <div className="flex items-center rounded-xl border border-neutral-200 bg-white p-0.5">
              <button
                type="button"
                onClick={() => setFeedViewMode("grid")}
                className={`p-1 rounded-lg transition-colors cursor-pointer ${
                  feedViewMode === "grid" ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setFeedViewMode("list")}
                className={`p-1 rounded-lg transition-colors cursor-pointer ${
                  feedViewMode === "list" ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {/* ── Active Live Generation in Progress Card (Live High-Tech Animation) ── */}
          {isGenerating && (
            <div className="relative rounded-2xl overflow-hidden border-2 border-blue-500 bg-gradient-to-br from-neutral-950 via-slate-900 to-indigo-950 text-white shadow-xl shadow-blue-500/15 flex flex-col justify-between p-4 col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-2 min-h-[280px] animate-fadeIn">
              {/* Animated top shimmer lines */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent pointer-events-none" />
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-indigo-500/25 rounded-full blur-2xl pointer-events-none" />

              {/* Header */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                  <span className="text-xs font-extrabold text-white tracking-wide">
                    Live Synthesis Active
                  </span>
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.2 rounded-full font-bold">
                    Vertex AI
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold bg-white/10 px-2.5 py-0.5 rounded-full backdrop-blur-sm border border-white/15">
                  <Clock className="w-3 h-3 text-cyan-300 animate-spin-slow" />
                  <span className="text-cyan-300">{elapsedSeconds.toFixed(1)}s</span>
                </div>
              </div>

              {/* Center Animation Visualizer */}
              <div className="relative z-10 my-4 flex flex-col items-center justify-center text-center space-y-3">
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/60 animate-spin-slow" />
                  <div className="absolute inset-1.5 rounded-full border-2 border-indigo-400/60 animate-reverse-spin" />
                  <Sparkles className="w-6 h-6 text-cyan-300 animate-pulse" />
                </div>

                <div className="space-y-1 max-w-sm px-2">
                  <p className="text-xs font-extrabold text-white tracking-wide">
                    {generationPhase || `Synthesizing with ${currentModel.name}...`}
                  </p>
                  <p className="text-[11px] text-neutral-300 line-clamp-2 italic font-sans opacity-90 leading-tight">
                    "{prompt}"
                  </p>
                </div>

                {/* Live Glowing Progress Bar */}
                <div className="w-full max-w-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono font-semibold text-neutral-300">
                    <span className="text-blue-300 font-bold">{currentModel.name}</span>
                    <span className="text-cyan-300 font-bold">{progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden relative border border-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-full transition-all duration-300 shadow-sm shadow-cyan-400/50"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Metadata Footer */}
              <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="bg-white/10 px-2 py-0.5 rounded text-neutral-200 font-semibold">{selectedRatio}</span>
                  <span className="bg-white/10 px-2 py-0.5 rounded text-neutral-200 font-semibold">{selectedResolution}</span>
                </div>
                <span className="text-amber-300 font-bold">⚡ {estimatedCost} cr</span>
              </div>
            </div>
          )}

          {/* Real Generated Items */}
          {feedItems
            .filter((item) =>
              feedSearchQuery
                ? item.title.toLowerCase().includes(feedSearchQuery.toLowerCase()) ||
                  item.prompt.toLowerCase().includes(feedSearchQuery.toLowerCase())
                : true
            )
            .map((item) => {
              const isNewlyCreated = item.id === newlyGeneratedId;
              return (
                <div
                  key={item.id}
                  id={`feed-card-${item.id}`}
                  className={`group relative rounded-2xl overflow-hidden border bg-white flex flex-col transition-all duration-500 ${
                    isNewlyCreated
                      ? "ring-2 ring-emerald-500 ring-offset-2 border-emerald-400 shadow-xl shadow-emerald-500/15 animate-spring"
                      : "border-neutral-200/90 shadow-2xs hover:shadow-card-elevated"
                  }`}
                >
                  {/* Image Preview Container */}
                  <div className="relative aspect-square overflow-hidden bg-neutral-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Newly Generated Badge */}
                    {isNewlyCreated && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-md animate-pulse z-10">
                        ✨ New
                      </span>
                    )}

                    {/* Hover Action Overlay */}
                    <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                      <button
                        type="button"
                        onClick={() => setLightboxImage(item.image)}
                        className="p-2 rounded-xl bg-white/90 hover:bg-white text-neutral-900 shadow-xs cursor-pointer transition-transform hover:scale-110"
                        title="Fullscreen Lightbox"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                      <a
                        href={item.image}
                        download={`aistudio-${item.id}.png`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-white/90 hover:bg-white text-neutral-900 shadow-xs cursor-pointer transition-transform hover:scale-110"
                        title="Download Image"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setPrompt(item.prompt);
                          window.scrollTo({ top: 300, behavior: "smooth" });
                        }}
                        className="p-2 rounded-xl bg-white/90 hover:bg-white text-neutral-900 shadow-xs cursor-pointer transition-transform hover:scale-110"
                        title="Use Prompt"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Resolution badge */}
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-neutral-950/70 text-white text-[9px] font-mono font-bold">
                      {item.resolution}
                    </span>
                  </div>

                  {/* Metadata Footer */}
                  <div className="p-3 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-neutral-900 truncate">
                        {item.modelName}
                      </span>
                      <span className="text-amber-600 font-bold font-mono">
                        ⚡ {item.cost} cr
                      </span>
                    </div>
                    <div className="text-[10px] text-neutral-400 flex items-center justify-between">
                      <span>{item.timestamp}</span>
                      <span className="font-mono">{item.aspectRatio}</span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Clean Empty State when no generations exist yet */}
        {feedItems.length === 0 && !isGenerating && (
          <div className="py-16 px-4 rounded-3xl border border-dashed border-neutral-300 bg-neutral-50/60 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200/80 shadow-xs flex items-center justify-center mx-auto text-blue-600">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h4 className="text-sm font-bold text-neutral-800">Your Canvas is Ready</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Enter your description above and click <strong>Generate Images</strong> to synthesize real visual art powered by Google Cloud Vertex AI.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSurpriseMe}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 shadow-2xs transition-all cursor-pointer"
            >
              <Dice5 className="w-3.5 h-3.5 text-purple-600" />
              <span>Try a Creative Sample Prompt</span>
            </button>
          </div>
        )}
      </div>

            {/* ══════════════════════════════════════════════════════════════════════
          POPUP MODALS: MODEL SPECS (Unified Big Popup)
      ══════════════════════════════════════════════════════════════════════ */}
      {modelModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={() => setModelModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-4xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-neutral-200 animate-spring"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Search and count */}
            <div className="px-6 py-4 border-b border-neutral-100 flex flex-col gap-3 bg-white shrink-0">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 max-w-lg">
                  <div className="relative w-full">
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={modalSearch}
                      onChange={(e) => setModalSearch(e.target.value)}
                      placeholder="Search engines by name, engine, or capability..."
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-100 text-xs text-neutral-900 focus:outline-none focus:bg-white focus:border-neutral-400 border border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-neutral-700 bg-neutral-100 px-3 py-1.5 rounded-full font-mono font-bold">
                    8 Certified Google Models
                  </span>
                  <button
                    type="button"
                    onClick={() => setModelModalOpen(false)}
                    className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-800 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none">
                {[
                  { id: "all", label: "All Models (8)" },
                  { id: "nano", label: "Nano Banana (5)" },
                  { id: "imagen", label: "Imagen Suite (2)" },
                  { id: "specialized", label: "Specialized Try-On (1)" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setModalCategory(tab.id as any)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      modalCategory === tab.id
                        ? "bg-neutral-950 text-white shadow-2xs"
                        : "bg-neutral-100 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200/80"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Model Cards Grid inside Modal */}
            <div className="flex-1 p-5 overflow-y-auto space-y-3 scrollbar-thin">
              {STUDIO_MODELS.filter((m) => {
                if (modalCategory !== "all" && m.category !== modalCategory) return false;
                if (modalSearch.trim()) {
                  const q = modalSearch.toLowerCase();
                  return (
                    m.name.toLowerCase().includes(q) ||
                    m.engine.toLowerCase().includes(q) ||
                    m.desc.toLowerCase().includes(q) ||
                    m.badge.toLowerCase().includes(q)
                  );
                }
                return true;
              }).map((m) => {
                const isSelected = selectedModelId === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => {
                      setSelectedModelId(m.id);
                      setModelModalOpen(false);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/30 ring-1 ring-blue-600 shadow-sm"
                        : "border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {renderOfficialLogo(m.id, "w-10 h-10")}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-neutral-950">{m.name}</h4>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${m.badgeColor}`}>
                              {m.badge}
                            </span>
                            <span className="text-xs text-neutral-400 font-mono">({m.provider})</span>
                          </div>
                          <p className="text-xs text-neutral-600">{m.desc}</p>
                          <div className="flex items-center gap-2 pt-1.5 text-[10px] text-neutral-500 font-mono flex-wrap">
                            <span className="bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200/60 font-semibold text-neutral-700">
                              📐 {m.maxResolution}
                            </span>
                            <span className="bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200/60 font-semibold text-neutral-700">
                              🖼️ {m.maxReferences} Ref{m.maxReferences === 1 ? "" : "s"}
                            </span>
                            <span className="bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200/60 font-semibold text-neutral-700">
                              ✍️ {m.maxPromptLength} chars
                            </span>
                            <span className="bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200/60 font-semibold text-neutral-700">
                              ⚡ {m.estimatedRenderTime}
                            </span>
                            <span className="bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200/60 font-semibold text-neutral-700">
                              🎯 Up to {m.maxOutputs} output{m.maxOutputs === 1 ? "" : "s"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-neutral-900 text-white font-mono">
                          {m.cost} cr
                        </span>
                        {isSelected ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-neutral-500 hover:text-neutral-950 font-bold">
                            Select Model →
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between text-xs text-neutral-600 shrink-0">
              <div>
                Active Model: <strong className="text-neutral-950">{currentModel.name}</strong> ({currentModel.cost} cr)
              </div>
              <button
                type="button"
                onClick={() => setModelModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-neutral-950 text-white font-bold text-xs hover:bg-neutral-800 transition-all cursor-pointer shadow-xs"
              >
                Confirm & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: HOW IT WORKS ── */}
      {howItWorksOpen && (
        <div
          className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setHowItWorksOpen(false)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-xl p-6 shadow-2xl border border-neutral-200 animate-spring space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-neutral-950">How AI Image Studio Works</h3>
              </div>
              <button onClick={() => setHowItWorksOpen(false)} className="p-1 text-neutral-400 hover:text-neutral-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-neutral-600 leading-relaxed">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">1</div>
                <div>
                  <strong className="text-neutral-900 block font-bold">1. Choose a Generative Model</strong>
                  Select from premier Google engines (Nano Banana 2.1, Pro, Lite) or open models (FLUX.1 Dev, SDXL).
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">2</div>
                <div>
                  <strong className="text-neutral-900 block font-bold">2. Craft Your Prompt & References</strong>
                  Type your vision or click <strong>✨ Enhance Prompt</strong> to expand your prompt with camera settings, lighting, and textures via Gemini AI.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">3</div>
                <div>
                  <strong className="text-neutral-900 block font-bold">3. Select Aspect Ratio & Resolution</strong>
                  Pick custom dimensions up to 4K studio quality. Two-Phase Escrow protects your credits until completion.
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setHowItWorksOpen(false)}
                className="px-5 py-2 rounded-xl bg-neutral-950 text-white font-bold text-xs"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: PROMPT GUIDE ── */}
      {promptGuideOpen && (
        <div
          className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setPromptGuideOpen(false)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-xl p-6 shadow-2xl border border-neutral-200 animate-spring space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-neutral-950">Prompt Engineering Guide</h3>
              </div>
              <button onClick={() => setPromptGuideOpen(false)} className="p-1 text-neutral-400 hover:text-neutral-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-neutral-600 leading-relaxed">
              <div className="p-3 rounded-2xl bg-purple-50/60 border border-purple-200/70 text-purple-950">
                <strong className="block font-bold mb-1">The Golden Prompt Formula:</strong>
                <code className="text-[11px] font-mono text-purple-800">
                  [Subject] + [Environment & Setting] + [Lighting & Mood] + [Camera & Lens] + [Render Style]
                </code>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-neutral-900">Good Example:</div>
                <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 font-mono text-[11px] text-neutral-800">
                  &ldquo;A majestic dragon flying over snow-covered mountains at sunrise, cinematic lighting, ultra detailed, realistic, epic fantasy, volumetric clouds, 8k&rdquo;
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setPromptGuideOpen(false)}
                className="px-5 py-2 rounded-xl bg-neutral-950 text-white font-bold text-xs"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: KEYBOARD SHORTCUTS ── */}
      {shortcutsOpen && (
        <div
          className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShortcutsOpen(false)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-neutral-200 animate-spring space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-neutral-700" />
                <h3 className="text-sm font-bold text-neutral-950">Keyboard Shortcuts</h3>
              </div>
              <button onClick={() => setShortcutsOpen(false)} className="p-1 text-neutral-400 hover:text-neutral-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-neutral-700">
                <span>Generate Images</span>
                <kbd className="px-2 py-1 rounded bg-neutral-100 border border-neutral-200 font-mono text-[10px]">Ctrl + Enter</kbd>
              </div>
              <div className="flex items-center justify-between text-neutral-700">
                <span>Omni-Search</span>
                <kbd className="px-2 py-1 rounded bg-neutral-100 border border-neutral-200 font-mono text-[10px]">Ctrl + K</kbd>
              </div>
              <div className="flex items-center justify-between text-neutral-700">
                <span>Close Modals / Popups</span>
                <kbd className="px-2 py-1 rounded bg-neutral-100 border border-neutral-200 font-mono text-[10px]">Esc</kbd>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShortcutsOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-neutral-950 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── LIGHTBOX: FULLSCREEN PREVIEW ── */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-neutral-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-3.5 flex items-center justify-between text-white border-b border-neutral-800">
              <span className="text-xs font-bold">Ultra High-Definition Canvas</span>
              <div className="flex items-center gap-2">
                <a
                  href={lightboxImage}
                  download="aistudio-render.jpg"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 rounded-xl bg-white text-neutral-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => setLightboxImage(null)}
                  className="p-1 rounded-full hover:bg-neutral-800 text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center p-4 overflow-auto bg-neutral-950">
              <img src={lightboxImage} alt="Fullscreen View" className="max-h-[75vh] w-auto object-contain rounded-xl" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}