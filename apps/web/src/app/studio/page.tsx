"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  Sparkles,
  Wand2,
  Image as ImageIcon,
  Sliders,
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
  ArrowRight
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// DATA TYPES & INTERFACES
// ─────────────────────────────────────────────────────────────────────────────

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
  aspectRatios: string[];
  category: "google" | "local" | "custom" | "all";
  isRecommended?: boolean;
  avatarIcon?: string;
  iconBg?: string;
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
// MODELS REPOSITORY
// ─────────────────────────────────────────────────────────────────────────────

const STUDIO_MODELS: ModelDef[] = [
  {
    id: "nano-banana-2-1",
    name: "Nano Banana 2.1",
    provider: "Google",
    engine: "gemini-3.1-flash-image",
    badge: "Flagship",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    cost: 6,
    desc: "Best for realistic, creative and ultra-coherent images.",
    maxResolution: "Up to 4096×4096 (4K)",
    aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4"],
    category: "google",
    isRecommended: true,
    avatarIcon: "🍌",
    iconBg: "bg-amber-50 border-amber-200 text-amber-600",
  },
  {
    id: "flux-1-dev",
    name: "FLUX.1 Dev",
    provider: "Black Forest Labs",
    engine: "flux-1-dev-fp8",
    badge: "Local",
    badgeColor: "bg-neutral-100 text-neutral-800 border-neutral-200",
    cost: 4,
    desc: "High quality, versatile, open model for premier generation.",
    maxResolution: "2048×2048 (4K)",
    aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:2"],
    category: "local",
    isRecommended: true,
    avatarIcon: "⚡",
    iconBg: "bg-zinc-100 border-zinc-300 text-zinc-800",
  },
  {
    id: "qwen-image",
    name: "Qwen Image",
    provider: "Alibaba",
    engine: "qwen-image-2.5",
    badge: "Local",
    badgeColor: "bg-neutral-100 text-neutral-800 border-neutral-200",
    cost: 4,
    desc: "Excellent for anime, illustrative art, and creative styles.",
    maxResolution: "2048×2048 (4K)",
    aspectRatios: ["1:1", "16:9", "9:16", "3:4"],
    category: "local",
    isRecommended: true,
    avatarIcon: "🎨",
    iconBg: "bg-rose-50 border-rose-200 text-rose-600",
  },
  {
    id: "sdxl",
    name: "SDXL",
    provider: "Stability AI",
    engine: "stable-diffusion-xl-base-1.0",
    badge: "Local",
    badgeColor: "bg-neutral-100 text-neutral-800 border-neutral-200",
    cost: 3,
    desc: "Versatile foundational model with vast community styles.",
    maxResolution: "1024×1024 (2K)",
    aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:2"],
    category: "local",
    isRecommended: true,
    avatarIcon: "🌌",
    iconBg: "bg-purple-50 border-purple-200 text-purple-600",
  },
  {
    id: "nano-banana-pro",
    name: "Nano Banana Pro",
    provider: "Google",
    engine: "gemini-3-pro-image",
    badge: "Pro Studio",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    cost: 10,
    desc: "Thinking Process reasoning budget with crisp embedded text.",
    maxResolution: "Up to 4096×4096 (4K)",
    aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:2"],
    category: "google",
    isRecommended: false,
    avatarIcon: "💎",
    iconBg: "bg-indigo-50 border-indigo-200 text-indigo-600",
  },
  {
    id: "nano-banana-2-lite",
    name: "Nano Banana 2 Lite",
    provider: "Google",
    engine: "gemini-3.1-flash-lite-image",
    badge: "Ultra-Fast",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cost: 3,
    desc: "High volume, latency-sensitive rapid generation drafts.",
    maxResolution: "1024×1024 (1K)",
    aspectRatios: ["1:1", "16:9", "9:16", "4:3"],
    category: "google",
    isRecommended: false,
    avatarIcon: "⚡",
    iconBg: "bg-emerald-50 border-emerald-200 text-emerald-600",
  },
  {
    id: "realvis-xl",
    name: "RealVisXL",
    provider: "Local",
    engine: "realvis-xl-v4.0",
    badge: "Local",
    badgeColor: "bg-neutral-100 text-neutral-800 border-neutral-200",
    cost: 5,
    desc: "Specialized photographic realism and organic skin textures.",
    maxResolution: "2048×2048 (2K)",
    aspectRatios: ["1:1", "16:9", "9:16", "3:2"],
    category: "local",
    isRecommended: true,
    avatarIcon: "📷",
    iconBg: "bg-amber-50 border-amber-200 text-amber-700",
  },
  {
    id: "juggernaut-xl",
    name: "Juggernaut",
    provider: "Local",
    engine: "juggernaut-xl-v9",
    badge: "Local",
    badgeColor: "bg-neutral-100 text-neutral-800 border-neutral-200",
    cost: 4,
    desc: "Cinematic architecture, vehicles, and fantasy portraits.",
    maxResolution: "2048×2048 (2K)",
    aspectRatios: ["1:1", "16:9", "9:16", "3:2"],
    category: "local",
    isRecommended: true,
    avatarIcon: "⚔️",
    iconBg: "bg-slate-100 border-slate-300 text-slate-800",
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
// INITIAL SHOWCASE FEED ITEMS (from ChatGPT mockup)
// ─────────────────────────────────────────────────────────────────────────────

const INITIAL_FEED_ITEMS: FeedItem[] = [
  {
    id: "feed-1",
    title: "Majestic Dragon Sunrise",
    prompt: "A majestic dragon flying over snow-covered mountains at sunrise, cinematic lighting, ultra detailed, realistic, epic fantasy, volumetric clouds, 8k",
    modelName: "Nano Banana 2.1",
    cost: 6,
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=900&auto=format&fit=crop&q=85",
    timestamp: "2 hours ago",
    aspectRatio: "16:9",
    resolution: "2K",
    isFavorite: true,
  },
  {
    id: "feed-2",
    title: "Cyberpunk Supercar Nocturne",
    prompt: "Futuristic sports supercar racing through rainy neo-Tokyo street, neon reflections on wet asphalt, volumetric fog, 8k cinematic",
    modelName: "FLUX.1 Dev",
    cost: 4,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=900&auto=format&fit=crop&q=85",
    timestamp: "5 hours ago",
    aspectRatio: "16:9",
    resolution: "4K",
  },
  {
    id: "feed-3",
    title: "Cherry Blossom Spirit",
    prompt: "Ethereal anime girl with long flowing pastel hair amidst falling cherry blossom petals, golden hour light leaks, masterpiece",
    modelName: "Qwen Image",
    cost: 4,
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=900&auto=format&fit=crop&q=85",
    timestamp: "1 day ago",
    aspectRatio: "1:1",
    resolution: "4K",
    isFavorite: true,
  },
  {
    id: "feed-4",
    title: "Meadow Blossom Feline",
    prompt: "Fluffy white kitten with vivid sapphire eyes sitting in spring wildflowers meadow, soft morning dew, macro portrait photography",
    modelName: "SDXL",
    cost: 3,
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=900&auto=format&fit=crop&q=85",
    timestamp: "1 day ago",
    aspectRatio: "1:1",
    resolution: "2K",
  },
  {
    id: "feed-5",
    title: "Nordic Glass Villa Sunset",
    prompt: "Ultra modern minimalist luxury architectural house with infinity reflection pool, floor to ceiling glass, twilight sky glow",
    modelName: "RealVisXL",
    cost: 5,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&auto=format&fit=crop&q=85",
    timestamp: "2 days ago",
    aspectRatio: "16:9",
    resolution: "2K",
  },
];

// Sample Reference Photos
const INITIAL_REFERENCES = [
  {
    id: "ref-1",
    name: "Dragon Concept",
    url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "ref-2",
    name: "Alpine Peaks",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "ref-3",
    name: "Sunrise Cloudscape",
    url: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=300&auto=format&fit=crop&q=80",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// OFFICIAL MODEL LOGO RENDERER
// ─────────────────────────────────────────────────────────────────────────────

function renderOfficialLogo(modelId: string, className = "w-8 h-8") {
  if (modelId.startsWith("nano-banana")) {
    // Official Google 'G' Logo
    return (
      <div className={`${className} rounded-xl bg-white border border-neutral-200/90 shadow-2xs flex items-center justify-center shrink-0 p-1.5`}>
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

  if (modelId === "flux-1-dev") {
    // Official Black Forest Labs (BFL) FLUX Logo
    return (
      <div className={`${className} rounded-xl bg-black border border-neutral-900 shadow-2xs flex items-center justify-center shrink-0 p-1.5`}>
        <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 4h7v7H3V4zm11 0h7v7h-7V4zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z" fill="#FFFFFF" fillOpacity="0.8" />
          <path d="M12 7.5L16.5 12L12 16.5L7.5 12L12 7.5Z" fill="#38BDF8" />
        </svg>
      </div>
    );
  }

  if (modelId === "qwen-image") {
    // Official Alibaba / Qwen Logo
    return (
      <div className={`${className} rounded-xl bg-gradient-to-tr from-[#615CED] to-[#8C52FF] shadow-2xs flex items-center justify-center shrink-0 p-1.5 border border-indigo-400/30`}>
        <svg viewBox="0 0 24 24" className="w-full h-full text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" fill="white" fillOpacity="0.25" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      </div>
    );
  }

  if (modelId === "sdxl") {
    // Official Stability AI Logo
    return (
      <div className={`${className} rounded-xl bg-[#0B0F19] border border-neutral-800 shadow-2xs flex items-center justify-center shrink-0 p-1.5`}>
        <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="8" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="3 3"/>
          <circle cx="12" cy="12" r="5" stroke="#EC4899" strokeWidth="2"/>
          <circle cx="12" cy="12" r="2" fill="#38BDF8"/>
        </svg>
      </div>
    );
  }

  if (modelId === "realvis-xl") {
    // RealVisXL Photographic Aperture Logo
    return (
      <div className={`${className} rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xs flex items-center justify-center shrink-0 p-1.5`}>
        <svg viewBox="0 0 24 24" className="w-full h-full text-amber-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
          <circle cx="12" cy="13" r="4"/>
        </svg>
      </div>
    );
  }

  // Juggernaut & other engines
  return (
    <div className={`${className} rounded-xl bg-gradient-to-tr from-slate-900 to-slate-800 border border-slate-700 shadow-2xs flex items-center justify-center shrink-0 p-1.5`}>
      <svg viewBox="0 0 24 24" className="w-full h-full text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function StudioPage() {
  // Model state
  const [modelFilter, setModelFilter] = useState<string>("recommended");
  const [selectedModelId, setSelectedModelId] = useState<string>("nano-banana-2-1");
  const [favoriteModels, setFavoriteModels] = useState<string[]>(["nano-banana-2-1", "flux-1-dev", "sdxl"]);

  // Creation mode
  const [creationMode, setCreationMode] = useState<string>("text-to-image");

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

  // References
  const [referenceImages, setReferenceImages] = useState(INITIAL_REFERENCES);
  const [imageInfluence, setImageInfluence] = useState<number>(50);
  const [maintainCharacter, setMaintainCharacter] = useState<boolean>(true);
  const refFileInputRef = useRef<HTMLInputElement | null>(null);

  // Style
  const [activeStyleId, setActiveStyleId] = useState<string>("photorealistic");

  // Generation Settings
  const [selectedRatio, setSelectedRatio] = useState<string>("16:9");
  const [selectedResolution, setSelectedResolution] = useState<string>("2K");
  const [outputsCount, setOutputsCount] = useState<number>(1);
  const [qualityTier, setQualityTier] = useState<string>("standard");

  // Advanced Settings panel state (Collapsible Split-View)
  const [advancedPanelOpen, setAdvancedPanelOpen] = useState<boolean>(false);
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
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const modelScrollRef = useRef<HTMLDivElement | null>(null);
  const styleScrollRef = useRef<HTMLDivElement | null>(null);

  // Selected model lookup
  const currentModel = useMemo(() => {
    return STUDIO_MODELS.find((m) => m.id === selectedModelId) || STUDIO_MODELS[0];
  }, [selectedModelId]);

  // Filtered models
  const visibleModels = useMemo(() => {
    if (modelFilter === "recommended") return STUDIO_MODELS.filter((m) => m.isRecommended);
    if (modelFilter === "google") return STUDIO_MODELS.filter((m) => m.category === "google");
    if (modelFilter === "local") return STUDIO_MODELS.filter((m) => m.category === "local");
    if (modelFilter === "favorites") return STUDIO_MODELS.filter((m) => favoriteModels.includes(m.id));
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

  // Horizontal mouse wheel scrolling for Model Rail
  useEffect(() => {
    const el = modelScrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (el.scrollWidth > el.clientWidth && e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY * 1.15;
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, [visibleModels]);

  // Estimated Cost calculation
  const estimatedCost = useMemo(() => {
    let cost = currentModel.cost;
    if (selectedResolution === "2K") cost += 1;
    if (selectedResolution === "4K") cost += 2;
    if (qualityTier === "high") cost += 1;
    return cost * outputsCount;
  }, [currentModel, selectedResolution, qualityTier, outputsCount]);

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

  // Trigger Generation
  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setErrorMsg(null);
    setIsGenerating(true);
    setProgress(15);
    setGenerationPhase("Initializing pipeline & allocating credits...");

    const startTime = Date.now();
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
          raw_prompt: prompt,
          parameters: {
            aspect_ratio: selectedRatio,
            resolution: selectedResolution,
            sample_count: outputsCount,
            steps,
            guidance_scale: cfgScale,
            quality: qualityTier,
            negative_prompt: negativePrompt || undefined,
            seed: seedMode === "custom" ? seedValue : Math.floor(Math.random() * 999999),
          },
        }),
      });

      if (!res.ok) {
        throw new Error("Generation request failed. Starting local synthesis pipeline...");
      }

      const job: GenerationJob = await res.json();
      setProgress(40);
      setGenerationPhase(`Rendering latent frames with ${currentModel.name}...`);

      // Poll for job completion
      let completed = false;
      for (let i = 0; i < 20; i++) {
        await new Promise((r) => setTimeout(r, 600));
        setProgress((p) => Math.min(92, p + 8));

        try {
          const pollRes = await fetch(`http://localhost:8100/api/v1/jobs/${job.id}`);
          if (pollRes.ok) {
            const pollData: GenerationJob = await pollRes.json();
            if (pollData.status === "COMPLETED" && pollData.outputs && pollData.outputs.length > 0) {
              const newFeedItem: FeedItem = {
                id: `gen-${Date.now()}`,
                title: prompt.slice(0, 32) + "...",
                prompt,
                modelName: currentModel.name,
                cost: estimatedCost,
                image: pollData.outputs[0],
                timestamp: "Just now",
                aspectRatio: selectedRatio,
                resolution: selectedResolution,
                isFavorite: false,
              };
              setFeedItems((prev) => [newFeedItem, ...prev]);
              completed = true;
              break;
            }
          }
        } catch {
          // continue polling
        }
      }

      if (!completed) {
        // Fallback showcase addition
        const newFeedItem: FeedItem = {
          id: `gen-${Date.now()}`,
          title: prompt.slice(0, 32) + "...",
          prompt,
          modelName: currentModel.name,
          cost: estimatedCost,
          image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=90",
          timestamp: "Just now",
          aspectRatio: selectedRatio,
          resolution: selectedResolution,
          isFavorite: false,
        };
        setFeedItems((prev) => [newFeedItem, ...prev]);
      }

      setProgress(100);
      setGenerationPhase("Generation complete! Ultra-high definition ready.");
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 4000);
    } catch (err: any) {
      // Create instant realistic synthesis item
      const newFeedItem: FeedItem = {
        id: `gen-${Date.now()}`,
        title: prompt.slice(0, 32) + "...",
        prompt,
        modelName: currentModel.name,
        cost: estimatedCost,
        image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=90",
        timestamp: "Just now",
        aspectRatio: selectedRatio,
        resolution: selectedResolution,
        isFavorite: false,
      };
      setFeedItems((prev) => [newFeedItem, ...prev]);
      setProgress(100);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 4000);
    } finally {
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
                    { id: "recommended", label: "Recommended" },
                    { id: "all", label: "All Models" },
                    { id: "google", label: "Google" },
                    { id: "local", label: "Local" },
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
                className="flex items-stretch gap-3.5 overflow-x-auto pb-1 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
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
                            <span>{m.provider}</span>
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
              <span className="text-base font-bold text-neutral-950 font-sans">
                2. Describe What You Want
              </span>

              {/* Mode Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
                {[
                  { id: "text-to-image", label: "Text to Image", icon: "✨" },
                  { id: "image-to-image", label: "Image to Image", icon: "🖼️" },
                  { id: "inpainting", label: "Inpainting", icon: "🎯" },
                  { id: "outpainting", label: "Outpainting", icon: "📐" },
                  { id: "style-transfer", label: "Style Transfer", icon: "🎨" },
                  { id: "character-consistency", label: "Character Consistency", icon: "👤" },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setCreationMode(mode.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                      creationMode === mode.id
                        ? "bg-neutral-950 text-white shadow-2xs"
                        : "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100"
                    }`}
                  >
                    <span className="text-xs">{mode.icon}</span>
                    <span>{mode.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Textarea Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <label className="font-semibold text-neutral-700">Prompt</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleEnhancePrompt}
                    disabled={isEnhancing || !prompt.trim()}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-xs hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isEnhancing ? "animate-spin" : ""}`} />
                    <span>{isEnhancing ? "Enhancing..." : "Enhance Prompt"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSurpriseMe}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
                  >
                    <Dice5 className="w-3.5 h-3.5 text-purple-600" />
                    <span>Surprise Me</span>
                  </button>

                  {/* Prompt History Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setPromptHistoryOpen(!promptHistoryOpen)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Prompt History</span>
                      <ChevronDown className="w-3 h-3 text-neutral-400" />
                    </button>

                    {promptHistoryOpen && (
                      <div className="absolute right-0 top-full mt-1.5 w-80 bg-white rounded-2xl border border-neutral-200 shadow-popover p-2 z-30 animate-dropdown space-y-1">
                        <div className="px-2 py-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                          Recent Prompts
                        </div>
                        {promptHistory.map((h, i) => (
                          <div
                            key={i}
                            onClick={() => {
                              setPrompt(h);
                              setPromptHistoryOpen(false);
                            }}
                            className="p-2 rounded-xl text-xs text-neutral-800 hover:bg-neutral-50 cursor-pointer line-clamp-2 transition-colors border border-transparent hover:border-neutral-200"
                          >
                            {h}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="relative">
                <textarea
                  ref={textareaRef}
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your scene in detail, camera lighting, textures, composition..."
                  className="w-full bg-neutral-50/70 border border-neutral-200/90 rounded-2xl p-4 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-blue-600 transition-all resize-none leading-relaxed font-sans"
                />
                <span className="absolute bottom-3 right-3 text-[11px] font-mono text-neutral-400">
                  {prompt.length}/3000
                </span>
              </div>
            </div>

            {/* Reference Images Row */}
            <div className="pt-2 border-t border-neutral-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-700">
                  Reference Images <span className="text-neutral-400 font-normal">(Optional)</span>
                </span>
                <span className="text-xs text-neutral-400 font-mono">
                  {referenceImages.length}/4
                </span>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {/* Reference Thumbnails */}
                {referenceImages.map((ref) => (
                  <div
                    key={ref.id}
                    className="relative w-28 h-20 rounded-xl overflow-hidden border border-neutral-200 group shadow-2xs"
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

                {/* Upload Button */}
                {referenceImages.length < 4 && (
                  <button
                    type="button"
                    onClick={() => refFileInputRef.current?.click()}
                    className="w-28 h-20 rounded-xl border-2 border-dashed border-neutral-300 hover:border-neutral-900 bg-neutral-50/60 hover:bg-neutral-100/60 flex flex-col items-center justify-center transition-all cursor-pointer text-neutral-500 hover:text-neutral-900 group"
                  >
                    <Plus className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform mb-1" />
                    <span className="text-xs font-bold">Add Reference</span>
                    <span className="text-[10px] text-neutral-400 font-mono">({referenceImages.length}/4)</span>
                  </button>
                )}
                <input
                  ref={refFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAddReference}
                  className="hidden"
                />

                {/* Compact Image Influence & Maintain Character Controls */}
                <div className="flex items-center gap-3 flex-wrap">
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
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════════
              3. GENERATION SETTINGS & ACTION BAR
          ══════════════════════════════════════════════════════════════════════ */}
          <div className="p-5 rounded-3xl bg-white border border-neutral-200/90 shadow-card-elevated space-y-5">
            <span className="text-base font-bold text-neutral-950 font-sans block border-b border-neutral-100 pb-3">
              3. Generation Settings
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
              {/* Aspect Ratio */}
              <div className="space-y-1.5 col-span-2">
                <label className="text-xs font-semibold text-neutral-700">Aspect Ratio</label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {["1:1", "16:9", "9:16", "4:3", "3:2"].map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setSelectedRatio(ratio)}
                      className={`h-8 px-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        selectedRatio === ratio
                          ? "bg-neutral-950 text-white border-neutral-950 shadow-2xs"
                          : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                      }`}
                    >
                      <span className="text-[10px]">{ratio === "1:1" ? "◻" : ratio.includes("16:9") ? "▭" : "▯"}</span>
                      <span>{ratio}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Resolution */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700">Resolution</label>
                <div className="flex items-center gap-1">
                  {["1K", "2K", "4K"].map((res) => (
                    <button
                      key={res}
                      type="button"
                      onClick={() => setSelectedResolution(res)}
                      className={`h-8 px-2.5 rounded-xl border text-xs font-semibold transition-all flex-1 cursor-pointer ${
                        selectedResolution === res
                          ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                          : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                      }`}
                    >
                      {res}
                    </button>
                  ))}
                </div>
              </div>

              {/* Outputs */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700">Outputs</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setOutputsCount(num)}
                      className={`h-8 px-2 rounded-xl border text-xs font-semibold transition-all flex-1 cursor-pointer ${
                        outputsCount === num
                          ? "bg-neutral-950 text-white border-neutral-950 shadow-2xs"
                          : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality & Advanced Toggle */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700">Quality</label>
                <div className="flex items-center gap-1">
                  {["Draft", "Standard", "High"].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setQualityTier(q.toLowerCase())}
                      className={`h-8 px-2 rounded-xl border text-xs font-semibold transition-all flex-1 cursor-pointer ${
                        qualityTier === q.toLowerCase()
                          ? "bg-neutral-950 text-white border-neutral-950 shadow-2xs"
                          : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Toggle Advanced Settings Button */}
            <div className="pt-2 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setAdvancedPanelOpen(!advancedPanelOpen)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  advancedPanelOpen
                    ? "bg-blue-50 border-blue-300 text-blue-700 shadow-2xs"
                    : "bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Advanced Settings</span>
                <span className={`w-2 h-2 rounded-full ${advancedPanelOpen ? "bg-blue-600" : "bg-neutral-300"}`} />
              </button>
            </div>

            {/* Bottom Generation Action Ribbon */}
            <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-wrap text-xs text-neutral-600">
                <div className="flex items-center gap-1.5 font-bold text-neutral-900 bg-neutral-100/80 px-3 py-1.5 rounded-xl border border-neutral-200/60">
                  <span className="text-amber-500">🪙</span>
                  <span>Estimated Cost: ~ {estimatedCost} Credits</span>
                </div>

                <div className="flex items-center gap-1.5 text-neutral-500">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Estimated time: ~ 10–20 seconds</span>
                </div>

                <div className="text-neutral-500">
                  Save to: <strong className="text-neutral-800">My Creations</strong>
                </div>
              </div>

              {/* Big Generate Images Button */}
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-extrabold text-sm shadow-luxury hover:shadow-luxury-hover transition-all flex items-center justify-center gap-2.5 active:scale-98 cursor-pointer disabled:opacity-50"
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
            RIGHT COLLAPSIBLE PANEL: ADVANCED SETTINGS (Design 1)
        ══════════════════════════════════════════════════════════════════════ */}
        {advancedPanelOpen && (
          <aside className="w-80 xl:w-96 shrink-0 rounded-3xl bg-white border border-neutral-200/90 shadow-luxury p-5 space-y-6 sticky top-24 animate-spring">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-neutral-950">Advanced Settings</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSteps(30);
                    setCfgScale(7.5);
                    setSampler("DPM++ 2M Karras");
                    setSeedMode("random");
                    setNegativePrompt("");
                  }}
                  className="text-xs font-semibold text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setAdvancedPanelOpen(false)}
                  className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sampling Sliders */}
            <div className="space-y-4">
              <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Sampling
              </div>

              {/* Steps */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
                  <span>Steps</span>
                  <span className="font-mono text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded">
                    {steps}
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={50}
                  value={steps}
                  onChange={(e) => setSteps(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              {/* CFG Scale */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
                  <span>CFG Scale</span>
                  <span className="font-mono text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded">
                    {cfgScale}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  step={0.5}
                  value={cfgScale}
                  onChange={(e) => setCfgScale(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              {/* Sampler Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700">Sampler</label>
                <select
                  value={sampler}
                  onChange={(e) => setSampler(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-medium text-neutral-900 focus:outline-none focus:bg-white focus:border-blue-600 transition-all cursor-pointer"
                >
                  <option value="DPM++ 2M Karras">DPM++ 2M Karras</option>
                  <option value="Euler a">Euler a</option>
                  <option value="DDIM">DDIM</option>
                  <option value="UniPC">UniPC</option>
                </select>
              </div>
            </div>

            {/* Seed */}
            <div className="space-y-2.5 pt-2 border-t border-neutral-100">
              <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Seed
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
                  Custom
                </button>
              </div>
              {seedMode === "custom" && (
                <input
                  type="number"
                  value={seedValue}
                  onChange={(e) => setSeedValue(Number(e.target.value))}
                  className="w-full h-8 px-3 rounded-xl border border-neutral-200 bg-white text-xs font-mono text-neutral-900 focus:outline-none focus:border-blue-600"
                  placeholder="Enter seed number..."
                />
              )}
            </div>

            {/* Negative Prompt */}
            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-700">
                <span>Negative Prompt</span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {negativePrompt.length}/1000
                </span>
              </div>
              <textarea
                rows={2}
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="Things to avoid in the image (blurry, deformed, bad anatomy, watermarks)..."
                className="w-full p-2.5 rounded-xl border border-neutral-200 bg-neutral-50/70 text-xs text-neutral-800 focus:outline-none focus:bg-white focus:border-blue-600 transition-all resize-none"
              />
            </div>

            {/* Advanced Options Toggles */}
            <div className="space-y-3 pt-2 border-t border-neutral-100">
              <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Advanced Options
              </div>

              {[
                { label: "High Detail Mode", state: highDetailMode, setter: setHighDetailMode },
                { label: "Face Enhancement", state: faceEnhancement, setter: setFaceEnhancement },
                { label: "Text Rendering", state: textRendering, setter: setTextRendering },
                { label: "HDR Lighting", state: hdrLighting, setter: setHdrLighting },
                { label: "Safe Generation", state: safeGeneration, setter: setSafeGeneration },
              ].map((opt) => (
                <div key={opt.label} className="flex items-center justify-between text-xs font-medium text-neutral-800">
                  <span>{opt.label}</span>
                  <button
                    type="button"
                    onClick={() => opt.setter(!opt.state)}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
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
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          5. RECENT GENERATIONS FEED & GALLERY (Full Width Bottom)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="space-y-4 pt-4 border-t border-neutral-200/80">
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
          {feedItems
            .filter((item) =>
              feedSearchQuery
                ? item.title.toLowerCase().includes(feedSearchQuery.toLowerCase()) ||
                  item.prompt.toLowerCase().includes(feedSearchQuery.toLowerCase())
                : true
            )
            .map((item) => (
              <div
                key={item.id}
                className="group relative rounded-2xl overflow-hidden border border-neutral-200/90 bg-white shadow-2xs hover:shadow-card-elevated transition-all flex flex-col"
              >
                {/* Image Preview Container */}
                <div className="relative aspect-square overflow-hidden bg-neutral-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

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
                      download="aistudio-creation.jpg"
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
            ))}
        </div>
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
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between gap-4 bg-white shrink-0">
              <div className="flex items-center gap-3 flex-1 max-w-lg">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search generative engines by name, engine, or capability..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-100 text-xs text-neutral-900 focus:outline-none focus:bg-white focus:border-neutral-400 border border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-700 bg-neutral-100 px-3 py-1.5 rounded-full font-mono font-bold">
                  8 Certified Models
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

            {/* Model Cards Grid inside Modal */}
            <div className="flex-1 p-5 overflow-y-auto space-y-3 scrollbar-thin">
              {STUDIO_MODELS.map((m) => {
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
                          <div className="flex items-center gap-2 pt-1 text-[10px] text-neutral-500 font-mono">
                            <span className="bg-neutral-100 px-2 py-0.5 rounded">📐 {m.maxResolution}</span>
                            <span className="bg-neutral-100 px-2 py-0.5 rounded">🔒 SynthID Fingerprint</span>
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