"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Image as ImageIcon,
  Video,
  Mic,
  FileText,
  Wand2,
  CheckCircle2,
  Coins,
  Cpu,
  ChevronDown,
  Layers,
  ShoppingBag,
  Star,
  RefreshCw,
  Clock,
  Lock,
  Play,
  Volume2,
  Sliders,
  Check,
  ExternalLink
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthModal from "@/components/auth/AuthModal";
import BeforeAfterSlider from "@/components/home/BeforeAfterSlider";
import SavingsCalculator from "@/components/home/SavingsCalculator";
import ShowcaseGallery from "@/components/home/ShowcaseGallery";
import ModelMatrix from "@/components/home/ModelMatrix";

const MODALITY_CARDS = [
  {
    icon: ImageIcon,
    title: "AI Image Generation",
    desc: "Create photorealistic imagery, digital portraits, and illustrations using Google Imagen 3 and FLUX.1.",
    models: ["Google Imagen 3", "FLUX.1 Schnell", "SDXL", "FLUX.1 Dev"],
    badge: "8 Credits",
    gradient: "from-blue-600 to-indigo-700",
    stats: "1.8s Avg Latency",
  },
  {
    icon: Video,
    title: "AI Video Studio",
    desc: "Generate smooth high-definition cinematic video clips with camera motion, temporal consistency, and audio sync.",
    models: ["Google Veo 2", "Wan 2.1", "HunyuanVideo"],
    badge: "80 Credits",
    gradient: "from-purple-600 to-pink-600",
    stats: "1080p 60fps Motion",
  },
  {
    icon: Mic,
    title: "Audio & Speech Synthesis",
    desc: "Produce expressive human voiceovers in seconds or transcribe complex multi-speaker audio with timestamps.",
    models: ["Kokoro TTS", "Faster-Whisper", "ElevenLabs API"],
    badge: "2 Credits",
    gradient: "from-emerald-600 to-teal-700",
    stats: "50+ Natural Voices",
  },
  {
    icon: FileText,
    title: "Prompt Enhancer & Scripts",
    desc: "Turn basic 5-word thoughts into rich, model-optimized prompts and produce creative screenplays with low latency.",
    models: ["Google Gemini 2.0 Flash", "Qwen 2.5 72B"],
    badge: "1 Credit",
    gradient: "from-amber-500 to-orange-600",
    stats: "Sub-Second Expansion",
  },
  {
    icon: Wand2,
    title: "4K AI Upscale & Restoration",
    desc: "Upscale low-resolution renders to crisp 4K, remove backgrounds with alpha masks, and restore face details.",
    models: ["Real-ESRGAN", "BiRefNet", "SwinIR"],
    badge: "4 Credits",
    gradient: "from-violet-600 to-purple-800",
    stats: "4x Super-Resolution",
  },
  {
    icon: Cpu,
    title: "On-Demand GPU Workers",
    desc: "Rented 96GB VRAM NVIDIA RTX 6000 Ada GPU clusters boot on-demand and auto-stop when idle to eliminate waste.",
    models: ["NVIDIA RTX 6000 Ada", "Zero-Waste Scheduler"],
    badge: "Auto-Stop",
    gradient: "from-neutral-800 to-neutral-950",
    stats: "Zero Idle Bill",
  },
];

const COMPARISON = [
  {
    feature: "Monthly Subscriptions",
    traditional: "4–5 different tools ($80–$150/mo)",
    studio: "Single unified credit pool (pay only for what you generate)",
  },
  {
    feature: "Interface Complexity",
    traditional: "Confusing open-source spaghetti node graphs",
    studio: "Intuitive Beginner Mode (3 clicks) + Optional Advanced Sliders",
  },
  {
    feature: "Failed Generations",
    traditional: "Credits lost or manual support tickets",
    studio: "Instant atomic refunds back to your balance automatically",
  },
  {
    feature: "Queue Reliability",
    traditional: "Browser tab must stay open or generation dies",
    studio: "Durable asynchronous Redis queue (close browser anytime)",
  },
  {
    feature: "Hardware Cost",
    traditional: "Expensive 24/7 cloud GPU VM bills",
    studio: "Smart lifecycle engine: boots on demand & stops when idle",
  },
  {
    feature: "Commercial Legality",
    traditional: "Murky licenses with unvetted commercial terms",
    studio: "Verified license registry (Imagen 3, FLUX, Veo 2 verified)",
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Describe Your Vision",
    desc: "Type in plain English. Our Gemini 2.0 Flash enhancer automatically expands camera lighting, lens focal depth, and style cues for your chosen model.",
    highlight: "Smart Prompt Expansion",
  },
  {
    step: "02",
    title: "Pick Model & Modality",
    desc: "Choose from Google Cloud Vertex AI APIs (Imagen 3, Veo 2) or open-weight GPU workers (FLUX.1, Kokoro) with clear credit estimates upfront.",
    highlight: "Zero Hardware Hassle",
  },
  {
    step: "03",
    title: "High-Speed 4K Output",
    desc: "Inference finishes in seconds. Our Two-Phase Escrow reserves credits on submit and settles only on success—100% automatic refund on timeout.",
    highlight: "Escrow Refund Guarantee",
  },
];

const WORKFLOW_TABS = [
  {
    id: "creators",
    title: "Filmmakers & Creators",
    role: "Video & YouTube Production",
    desc: "Transform simple ideas into full multimedia productions. Generate photorealistic visual storyboards with Imagen 3, render 1080p cinematic video sequences with Google Veo 2, and overlay expressive multi-voice narration with Kokoro TTS.",
    metrics: [
      { label: "Production Speed", val: "10x Faster" },
      { label: "Cost Per Video", val: "~$0.64" },
      { label: "Integrated Stack", val: "Veo 2 + Imagen 3 + Kokoro" },
    ],
  },
  {
    id: "ecommerce",
    title: "Brands & E-Commerce",
    role: "Product Photography & UGC",
    desc: "Eliminate expensive physical photoshoot bookings. Place product packaging into photorealistic studio marble, tropical sunlight, or luxury interior environments with consistent commercial lighting and sharp typography.",
    metrics: [
      { label: "Cost Savings", val: "85% Less" },
      { label: "Resolution", val: "3840 x 2160 (4K)" },
      { label: "Turnaround Time", val: "Under 15 Seconds" },
    ],
  },
  {
    id: "game_art",
    title: "Game & Concept Artists",
    role: "Rapid Visual Ideation",
    desc: "Iterate concept art, character sheets, isometric environments, and 3D textures in minutes using FLUX.1 Dev and SDXL. Apply 4x AI upscaling and background removal to extract clean transparent sprites instantly.",
    metrics: [
      { label: "Asset Variations", val: "4 Parallel Renders" },
      { label: "Clarity Tier", val: "Real-ESRGAN 4x" },
      { label: "License Status", val: "Commercial Apache 2.0" },
    ],
  },
  {
    id: "developers",
    title: "Developers & Agencies",
    role: "Automated API Pipelines",
    desc: "Integrate multi-model generation directly into your own applications with our FastAPI backend on port 8100. Leverage atomic two-phase escrow billing, webhooks, and asynchronous job queues for high-volume pipelines.",
    metrics: [
      { label: "API Latency", val: "Sub-2s Median" },
      { label: "Uptime SLA", val: "99.9% Target" },
      { label: "SDK Support", val: "Python & TypeScript" },
    ],
  },
];

const TESTIMONIALS = [
  {
    quote: "I used to pay $30 for Midjourney, $20 for Runway, and $22 for ElevenLabs every month. With AI Studio's single credit pool, I only pay for what I generate and save over $50 every month.",
    author: "Marcus Vance",
    role: "Creative Director, Nexus Media",
    badge: "Saved $600/yr",
  },
  {
    quote: "The two-phase escrow ledger is a game changer. If a heavy video generation ever times out, my credits are instantly refunded back to my account without opening a support ticket.",
    author: "Sarah Chen",
    role: "AI Filmmaker & VFX Lead",
    badge: "Zero Lost Credits",
  },
  {
    quote: "Being able to use Google Imagen 3 for ultra-photorealistic portraits and FLUX.1 for rapid design iterations in the exact same interface makes this the best AI studio we've used.",
    author: "David K.",
    role: "Principal Concept Artist",
    badge: "10x Iteration Speed",
  },
];

const FAQS = [
  {
    q: "How does the credit system work?",
    a: "Instead of paying complicated GPU compute hours or opaque API token rates, you hold platform credits. Operations have a transparent credit price (e.g. 8 credits for an Imagen 3 render, 2 credits for Kokoro TTS, 80 credits for Veo 2 video). Unused credits never expire.",
  },
  {
    q: "What happens if a generation fails or times out?",
    a: "Our two-phase escrow ledger reserves credits when you submit a job. If an inference times out, runs out of memory, or encounters a provider error, your reserved credits are immediately refunded back to your balance automatically.",
  },
  {
    q: "Can I use generated images and videos commercially?",
    a: "Yes. We maintain a verified commercial license registry. Every model available for paid generation is vetted for commercial legality (e.g., Apache 2.0, MIT, or verified Google Cloud commercial API enterprise terms).",
  },
  {
    q: "Do I need technical skills or a powerful GPU PC?",
    a: "None at all! AI Studio runs 100% in the cloud. You only need a standard web browser on your laptop, desktop, tablet, or phone. All inference happens on high-performance cloud GPUs.",
  },
  {
    q: "Can I generate in the background and close my browser?",
    a: "Yes. Our jobs run on a durable asynchronous Redis queue. You can submit 5 jobs in parallel, close your browser tab or laptop, and your completed creations will be saved securely in your account when you return.",
  },
  {
    q: "How does AI Studio keep costs lower than monthly subscriptions?",
    a: "Traditional subscriptions charge you $20–$30/mo whether you generate 5 items or 500. With AI Studio, you pay only for the exact inference compute you use. Dedicated GPU workers auto-stop when idle to eliminate wasted cloud bills.",
  },
];

export default function HomePage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeHeroTab, setActiveHeroTab] = useState("image");
  const [activeWorkflowTab, setActiveWorkflowTab] = useState("creators");
  const [interactiveAspect, setInteractiveAspect] = useState("16:9");
  const [interactivePrompt, setInteractivePrompt] = useState(
    "A majestic golden eagle soaring above snow-capped Alps, morning mist, cinematic sunlight, 8k resolution"
  );
  const [interactiveStyle, setInteractiveStyle] = useState("Photorealistic");
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const openAuth = (mode: "login" | "register") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleCopyCurrentPrompt = () => {
    navigator.clipboard.writeText(interactivePrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const currentWorkflow = WORKFLOW_TABS.find((w) => w.id === activeWorkflowTab) || WORKFLOW_TABS[0];

  return (
    <div className="min-h-screen bg-white text-neutral-950 selection:bg-neutral-900 selection:text-white">
      
      {/* 1. Pro Invideo-Style Navbar with 3-Column Mega Menus */}
      <Navbar onOpenAuth={openAuth} />

      {/* 2. Hero Section with Technical Blueprint Grid */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:48px_48px] border-b border-neutral-200/80">
        
        <div className="relative max-w-5xl mx-auto px-6 text-center space-y-7 z-10">
          
          {/* Editorial / Serif Hero Headline */}
          <h1 className="text-5xl sm:text-7xl lg:text-[84px] font-normal tracking-tight text-neutral-950 max-w-4xl mx-auto leading-[1.05] font-editorial">
            The AI generation platform for
            <br className="hidden sm:inline" /> serious creatives
          </h1>

          {/* Subhead */}
          <p className="text-base sm:text-[19px] text-neutral-600 max-w-2xl mx-auto leading-relaxed font-sans font-normal">
            Don&apos;t waste time on AI you have to babysit. Do what you love while
            <br className="hidden sm:inline" /> AI Studio&apos;s multi-model agents handle the rest.
          </p>

          {/* Primary Centered Pill CTA (Invideo Style) */}
          <div className="pt-2 flex flex-col items-center justify-center gap-3">
            <button
              onClick={() => openAuth("register")}
              className="px-8 py-3.5 rounded-full font-semibold text-sm bg-neutral-950 hover:bg-neutral-800 text-white shadow-sm hover:shadow transition-all hover:scale-[1.02] flex items-center gap-2.5 cursor-pointer"
            >
              <span>Start Creating</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              href="/studio"
              className="text-xs text-neutral-500 hover:text-neutral-950 flex items-center gap-1 transition-colors"
            >
              <span>Or start with your Cowork & Codex agents</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Invideo-Style Creation Dock / Ribbon */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            {[
              { id: "image", icon: "🖼️", label: "Photoreal Image" },
              { id: "video", icon: "🎬", label: "Cinematic Video" },
              { id: "audio", icon: "🎙️", label: "Voice & Audio" },
              { id: "ad", icon: "📦", label: "Product & Ad" },
              { id: "upscale", icon: "✨", label: "4K AI Upscale" },
              { id: "script", icon: "🎭", label: "Script & Story" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveHeroTab(tab.id);
                  if (tab.id === "video") {
                    setInteractivePrompt("FPV drone shot sweeping through misty pine forest at sunrise, 4k 60fps cinematic movement");
                  } else if (tab.id === "audio") {
                    setInteractivePrompt("Natural expressive narration: The ancient clock struck midnight as the fog rolled into the valley.");
                  } else if (tab.id === "ad") {
                    setInteractivePrompt("Luxury glass perfume bottle standing on polished marble with splashing rose water, studio commercial lighting");
                  } else if (tab.id === "upscale") {
                    setInteractivePrompt("Enhance image resolution 4x, reconstruct fine fabric textures, sharp pupils, zero noise artifacts");
                  } else if (tab.id === "script") {
                    setInteractivePrompt("Write a 30-second dramatic commercial screenplay about an architect building sustainable floating cities.");
                  } else {
                    setInteractivePrompt("A majestic golden eagle soaring above snow-capped Alps, morning mist, cinematic sunlight, 8k resolution");
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  activeHeroTab === tab.id
                    ? "bg-neutral-950 text-white border-neutral-950 shadow-sm"
                    : "bg-white/90 text-neutral-700 border-neutral-200 hover:border-neutral-300 hover:bg-white"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Trust Guarantees */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-medium text-neutral-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Two-Phase Escrow Billing</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <span>Zero Local Hardware Needed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Commercial License Verified</span>
            </div>
          </div>
        </div>

        {/* Dynamic Interactive Studio Preview Card */}
        <div className="max-w-4xl mx-auto px-6 mt-14">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-2xl shadow-neutral-900/5 space-y-6">
            
            {/* Header with Mode Status & Backend Connection */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Live Studio Preview &bull; {activeHeroTab.toUpperCase()} ENGINE
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                  {activeHeroTab === "image" && "Google Imagen 3 & FLUX.1"}
                  {activeHeroTab === "video" && "Google Veo 2 & Wan 2.1"}
                  {activeHeroTab === "audio" && "Kokoro TTS & Whisper"}
                  {activeHeroTab === "ad" && "E-Commerce Studio Lighting"}
                  {activeHeroTab === "upscale" && "Real-ESRGAN Super Resolution"}
                  {activeHeroTab === "script" && "Gemini 2.0 Flash Reasoning"}
                </span>
              </div>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Connected to Port 8100 Backend API
              </span>
            </div>

            {/* Prompt Input in Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-600">
                <span>Enter Your Vision or Click a Preset:</span>
                <div className="flex items-center gap-3">
                  <span className="text-blue-600 font-bold">
                    {activeHeroTab === "image" && "💎 8 Credits per image"}
                    {activeHeroTab === "video" && "💎 80 Credits per video"}
                    {activeHeroTab === "audio" && "💎 2 Credits per narration"}
                    {activeHeroTab === "ad" && "💎 8 Credits per product shot"}
                    {activeHeroTab === "upscale" && "💎 4 Credits per 4K upscale"}
                    {activeHeroTab === "script" && "💎 1 Credit per expansion"}
                  </span>
                  <button
                    onClick={handleCopyCurrentPrompt}
                    className="text-neutral-400 hover:text-neutral-800 text-[11px] flex items-center gap-1 transition-colors"
                  >
                    {copiedPrompt ? <Check className="w-3 h-3 text-emerald-600" /> : <RefreshCw className="w-3 h-3" />}
                    <span>{copiedPrompt ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={interactivePrompt}
                  onChange={(e) => setInteractivePrompt(e.target.value)}
                  className="w-full px-4 py-3.5 bg-neutral-50/80 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 focus:bg-white transition-all font-medium"
                />
              </div>

              {/* Dynamic Modality Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                
                {/* Aspect Ratio Pills */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-[11px] font-bold text-neutral-400 mr-1 uppercase">Ratio:</span>
                  {["16:9", "1:1", "9:16", "4:3"].map((aspect) => (
                    <button
                      key={aspect}
                      onClick={() => setInteractiveAspect(aspect)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                        interactiveAspect === aspect
                          ? "bg-neutral-950 text-white"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                      }`}
                    >
                      {aspect}
                    </button>
                  ))}
                </div>

                {/* Style Presets */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-neutral-400 mr-1 uppercase">Preset:</span>
                  {[
                    { name: "Photorealistic", prompt: "A majestic golden eagle soaring above snow-capped Alps, morning mist, cinematic sunlight, 8k resolution" },
                    { name: "Cinematic", prompt: "Cyberpunk street vendor in neon-lit futuristic alley in Tokyo, rain puddles, 8k resolution, Arri Alexa" },
                    { name: "Studio Product", prompt: "Luxury minimalist smartwatch on raw basalt rock pedestal, soft diffused studio light, high key" },
                    { name: "Anime Art", prompt: "Ethereal spirit guardian inside an enchanted ancient mossy forest, Studio Ghibli style, vibrant colors" },
                  ].map((st) => (
                    <button
                      key={st.name}
                      onClick={() => {
                        setInteractiveStyle(st.name);
                        setInteractivePrompt(st.prompt);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        interactiveStyle === st.name
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                      }`}
                    >
                      {st.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-100">
              <div className="text-xs text-neutral-500 flex items-center gap-2">
                <span>Model: <strong>Google Imagen 3 & Veo 2</strong></span>
                <span>&bull;</span>
                <span>Format: <strong>{interactiveAspect} Ultra-HD</strong></span>
                <span>&bull;</span>
                <span className="text-emerald-600 font-semibold">100 Free Credits Active</span>
              </div>
              <Link
                href="/studio"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-xs bg-neutral-950 hover:bg-neutral-800 text-white shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Launch in Studio Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Live System & Telemetry Ticker (Financial Tech Grade) */}
      <section className="bg-neutral-50/80 border-b border-neutral-200 py-6">
        <div className="max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-14 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-neutral-950">1,248,000+</div>
            <div className="text-xs font-medium text-neutral-500 mt-0.5">Generations Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">1.8s</div>
            <div className="text-xs font-medium text-neutral-500 mt-0.5">Average Inference Latency</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-neutral-950">99.98%</div>
            <div className="text-xs font-medium text-neutral-500 mt-0.5">Two-Phase Escrow Accuracy</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-600">$0 / mo</div>
            <div className="text-xs font-medium text-neutral-500 mt-0.5">Mandatory Subscriptions</div>
          </div>
        </div>
      </section>

      {/* 4. NEW: How It Works in 3 Simple Steps */}
      <section className="py-24 max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-14">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Frictionless Creation
          </span>
          <h2 className="text-3xl sm:text-4xl font-normal text-neutral-950 tracking-tight font-editorial">
            How AI Studio Works in 3 Simple Steps
          </h2>
          <p className="text-sm text-neutral-600 leading-relaxed font-sans">
            No complex node graphs or confusing command-lines. Turn any vision into production-ready assets with pure ease.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HOW_IT_WORKS_STEPS.map((st) => (
            <div
              key={st.step}
              className="bg-white rounded-3xl p-8 border border-neutral-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-editorial text-4xl text-neutral-300 font-bold group-hover:text-blue-600 transition-colors">
                    {st.step}
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700">
                    {st.highlight}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-neutral-950">{st.title}</h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-medium">{st.desc}</p>
              </div>

              <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
                <span>Autonomous Pipeline</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Curated Community Creations Gallery */}
      <section id="showcase" className="py-20 bg-neutral-50/50 border-t border-neutral-200">
        <div className="max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-14">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Inspiration Gallery
            </span>
            <h2 className="text-3xl sm:text-4xl font-normal text-neutral-950 tracking-tight font-editorial">
              Created with AI Studio Multi-Models
            </h2>
            <p className="text-sm text-neutral-600">
              Explore authentic outputs rendered across Google Imagen 3 and FLUX.1. Click any creation to copy its prompt or remix it in the studio.
            </p>
          </div>

          <ShowcaseGallery />
        </div>
      </section>

      {/* 6. Interactive Before & After 4x AI Upscale Slider */}
      <section className="py-20 bg-white border-y border-neutral-200/80">
        <div className="max-w-4xl mx-auto px-6">
          <BeforeAfterSlider />
        </div>
      </section>

      {/* 7. Modalities Bento Grid */}
      <section id="modalities" className="py-24 max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-14">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Creative Arsenal
          </span>
          <h2 className="text-3xl sm:text-4xl font-normal text-neutral-950 tracking-tight font-editorial">
            Every Generative Modality in One Workspace
          </h2>
          <p className="text-sm text-neutral-600 leading-relaxed font-sans">
            Eliminate context switching. Whether you need photorealistic concept art, cinematic video, or professional voiceovers, it lives under one unified roof.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MODALITY_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="bg-white rounded-3xl p-7 border border-neutral-200/90 shadow-sm hover:shadow-xl hover:border-neutral-300 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${card.gradient} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        {card.stats}
                      </span>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
                        {card.badge}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-neutral-950">{card.title}</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed font-medium">{card.desc}</p>
                </div>

                <div className="pt-6 mt-6 border-t border-neutral-100 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    Integrated Models:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {card.models.map((m) => (
                      <span
                        key={m}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-neutral-50 text-neutral-700 border border-neutral-200"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. NEW: Workflow Matrix (Real-World Creator Use Cases) */}
      <section className="py-24 bg-neutral-50/70 border-y border-neutral-200">
        <div className="max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-14">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Built for Serious Work
            </span>
            <h2 className="text-3xl sm:text-4xl font-normal text-neutral-950 tracking-tight font-editorial">
              Engineered for Production Workflows
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Explore how filmmakers, brand designers, concept artists, and software developers leverage AI Studio daily.
            </p>
          </div>

          {/* Workflow Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {WORKFLOW_TABS.map((w) => (
              <button
                key={w.id}
                onClick={() => setActiveWorkflowTab(w.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeWorkflowTab === w.id
                    ? "bg-neutral-950 text-white shadow-sm"
                    : "bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-100"
                }`}
              >
                {w.title}
              </button>
            ))}
          </div>

          {/* Active Workflow Showcase Card */}
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 border border-neutral-200/90 shadow-lg space-y-8">
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600">
                {currentWorkflow.role}
              </div>
              <h3 className="text-2xl font-bold text-neutral-950">
                {currentWorkflow.title}
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                {currentWorkflow.desc}
              </p>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-100">
              {currentWorkflow.metrics.map((m) => (
                <div key={m.label} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                  <div className="text-xs font-medium text-neutral-500">{m.label}</div>
                  <div className="text-lg font-bold text-neutral-950 mt-1">{m.val}</div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-neutral-500">
                Supports batch generation queues & multi-user team workspaces.
              </div>
              <Link
                href="/studio"
                className="w-full sm:w-auto px-6 py-3 rounded-full font-bold text-xs bg-neutral-950 hover:bg-neutral-800 text-white shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Try This Workflow in Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Model Selection Matrix */}
      <section id="matrix" className="py-20 bg-white">
        <div className="max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-14">
          <ModelMatrix />
        </div>
      </section>

      {/* 10. Interactive Savings Calculator */}
      <section id="calculator" className="py-24 max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-14 bg-neutral-50/50 border-t border-neutral-200">
        <SavingsCalculator />
      </section>

      {/* 11. Why AI Studio Comparison Section */}
      <section id="why-us" className="py-20 bg-white border-t border-neutral-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              The Smarter Way
            </span>
            <h2 className="text-3xl font-normal text-neutral-950 tracking-tight font-editorial">
              Why Creators are Switching to AI Studio
            </h2>
            <p className="text-sm text-neutral-600">
              Traditional AI workflows are fragmented, expensive, and fragile. Here is how we fixed them.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider text-xs border-b border-neutral-200">
                  <tr>
                    <th className="py-4 px-6 font-bold">Core Capability</th>
                    <th className="py-4 px-6 font-bold text-rose-600">Fragmented Tool Chaos</th>
                    <th className="py-4 px-6 font-bold text-blue-700 bg-blue-50/50">AI Studio Unified Hub</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-medium text-neutral-700">
                  {COMPARISON.map((row) => (
                    <tr key={row.feature} className="hover:bg-neutral-50/50">
                      <td className="py-4 px-6 font-bold text-neutral-950">{row.feature}</td>
                      <td className="py-4 px-6 text-neutral-500">{row.traditional}</td>
                      <td className="py-4 px-6 text-neutral-950 font-semibold bg-blue-50/30 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{row.studio}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 12. NEW: Creator & Agency Testimonials (Social Proof) */}
      <section className="py-24 bg-neutral-50/80 border-y border-neutral-200">
        <div className="max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-14">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Creator Proof
            </span>
            <h2 className="text-3xl sm:text-4xl font-normal text-neutral-950 tracking-tight font-editorial">
              Loved by Creators Worldwide
            </h2>
            <p className="text-sm text-neutral-600">
              See what creative directors, indie founders, and visual storytellers say about AI Studio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.author}
                className="bg-white rounded-3xl p-7 border border-neutral-200/90 shadow-sm flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-neutral-950">{t.author}</div>
                    <div className="text-[11px] text-neutral-500">{t.role}</div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {t.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. Transparent Credit Pricing Section */}
      <section id="pricing" className="py-24 max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-14">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-normal text-neutral-950 tracking-tight font-editorial">
            Simple Credit Packages. Zero Subscriptions.
          </h2>
          <p className="text-sm text-neutral-600">
            Buy credits whenever you need them. Unused credits never expire.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Free Tier */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-bold text-base text-neutral-950">Free Welcome</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-neutral-950">$0</span>
                <span className="text-xs text-neutral-500">on signup</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-semibold text-blue-700 flex items-center gap-2">
                <Coins className="w-4 h-4" />
                <span>100 Platform Credits</span>
              </div>
              <ul className="text-xs text-neutral-600 space-y-2 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>~12 High-Res Images</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Prompt Enhancer access</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Creations Gallery download</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => openAuth("register")}
              className="mt-6 w-full py-2.5 rounded-full font-bold text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-950 transition-colors cursor-pointer"
            >
              Get Free 100 Credits
            </button>
          </div>

          {/* Starter Pack */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-bold text-base text-neutral-950">Starter Pack</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-neutral-950">$5</span>
                <span className="text-xs text-neutral-500">one-time</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-semibold text-blue-700 flex items-center gap-2">
                <Coins className="w-4 h-4" />
                <span>500 Platform Credits</span>
              </div>
              <ul className="text-xs text-neutral-600 space-y-2 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>~62 Imagen 3 Renders</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>250 Voiceover Syntheses</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Standard Priority Queue</span>
                </li>
              </ul>
            </div>
            <Link
              href="/credits"
              className="mt-6 w-full py-2.5 rounded-full font-bold text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-950 transition-colors text-center block"
            >
              Purchase $5 Pack
            </Link>
          </div>

          {/* Pro Studio (Popular) */}
          <div className="bg-white rounded-3xl p-6 border-2 border-neutral-950 shadow-xl shadow-neutral-950/10 flex flex-col justify-between relative">
            <span className="absolute -top-3 right-6 bg-neutral-950 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow">
              Most Popular
            </span>
            <div className="space-y-4">
              <h3 className="font-bold text-base text-neutral-950">Pro Studio</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-neutral-950">$20</span>
                <span className="text-xs text-neutral-500">one-time</span>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs font-bold text-blue-700 flex items-center gap-2">
                <Coins className="w-4 h-4 text-blue-600" />
                <span>2,500 Platform Credits</span>
              </div>
              <ul className="text-xs text-neutral-600 space-y-2 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>~310 Imagen 3 or FLUX Renders</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>~30 Cinematic Veo Video Clips</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>High-Priority GPU Queue</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>4K Upscaling Unlimited</span>
                </li>
              </ul>
            </div>
            <Link
              href="/credits"
              className="mt-6 w-full py-2.5 rounded-full font-bold text-xs bg-neutral-950 hover:bg-neutral-800 text-white shadow-md transition-all text-center block"
            >
              Get Pro Pack ($20)
            </Link>
          </div>

          {/* Scale Agency */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-bold text-base text-neutral-950">Scale Agency</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-neutral-950">$70</span>
                <span className="text-xs text-neutral-500">one-time</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-semibold text-blue-700 flex items-center gap-2">
                <Coins className="w-4 h-4" />
                <span>10,000 Platform Credits</span>
              </div>
              <ul className="text-xs text-neutral-600 space-y-2 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>~1,250 High-Res Renders</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Maximum Parallel Job Limit</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Dedicated GPU Node Priority</span>
                </li>
              </ul>
            </div>
            <Link
              href="/credits"
              className="mt-6 w-full py-2.5 rounded-full font-bold text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-950 transition-colors text-center block"
            >
              Purchase $70 Pack
            </Link>
          </div>
        </div>
      </section>

      {/* 14. FAQ Section */}
      <section id="faq" className="py-20 bg-neutral-50/80 border-t border-neutral-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-normal text-neutral-950 font-editorial">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 font-sans">
              Everything you need to know about billing, licensing, and workflow.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="bg-white rounded-2xl border border-neutral-200 overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between text-sm font-bold text-neutral-950 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-400 transition-transform ${
                        isOpen ? "rotate-180 text-neutral-950" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 15. Bottom Conversion CTA Banner */}
      <section className="py-20 bg-neutral-950 text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 backdrop-blur-md text-neutral-300 text-xs font-semibold border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Start Creating in 30 Seconds</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-normal tracking-tight font-editorial text-white">
            Ready to Unify Your Creative AI Workflow?
          </h2>

          <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto leading-relaxed font-sans">
            Join today and receive 100 free platform credits. No credit card required, no recurring monthly commitments.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => openAuth("register")}
              className="w-full sm:w-auto px-9 py-4 rounded-full font-bold text-sm bg-white text-neutral-950 hover:bg-neutral-100 shadow-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Claim Your 100 Free Credits</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              href="/studio"
              className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-sm bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md transition-all text-center"
            >
              Open Studio Workspace
            </Link>
          </div>
        </div>
      </section>

      {/* 16. Pro Invideo-Style Mega Footer */}
      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          window.location.href = "/studio";
        }}
      />
    </div>
  );
}
