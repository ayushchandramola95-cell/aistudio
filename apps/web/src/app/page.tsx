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
  MousePointer,
  ChevronDown
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
    desc: "Create photorealistic imagery, digital art, and illustrations using Google Imagen 3 and FLUX.1.",
    models: ["Google Imagen 3", "FLUX.1 Schnell", "SDXL"],
    badge: "8 Credits",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    icon: Video,
    title: "AI Video Studio",
    desc: "Generate smooth high-definition cinematic video clips with camera motion and temporal consistency.",
    models: ["Google Veo 2", "Wan 2.1", "HunyuanVideo"],
    badge: "80 Credits",
    gradient: "from-purple-500 to-pink-600",
  },
  {
    icon: Mic,
    title: "Audio & Speech Synthesis",
    desc: "Produce natural-sounding voiceovers in seconds or transcribe complex speech with word-level timestamps.",
    models: ["Kokoro TTS", "Faster-Whisper", "F5-TTS"],
    badge: "2 Credits",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: FileText,
    title: "Prompt Enhancer & Scripts",
    desc: "Turn basic 5-word ideas into rich, model-optimized prompts and produce creative scripts with low latency.",
    models: ["Google Gemini 2.0 Flash", "Qwen 2.5"],
    badge: "1 Credit",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    icon: Wand2,
    title: "Enhancement & 4x Upscaling",
    desc: "Upscale low-resolution renders to crisp 4K and remove backgrounds with clean pixel-edge masks.",
    models: ["Real-ESRGAN", "BiRefNet", "SwinIR"],
    badge: "4 Credits",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: Cpu,
    title: "On-Demand GPU Workers",
    desc: "Rented 96GB VRAM Blackwell-class GPUs boot on-demand and auto-shutdown when idle to minimize costs.",
    models: ["NVIDIA RTX PRO 6000", "Zero-Waste Scheduler"],
    badge: "Auto-Stop",
    gradient: "from-slate-700 to-slate-900",
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
];

const FAQS = [
  {
    q: "How does the credit system work?",
    a: "Instead of paying complex GPU compute hours or API token rates, you hold platform credits. Operations have a transparent credit price (e.g. 8 credits for an Imagen 3 render). Credits never expire.",
  },
  {
    q: "What happens if a generation fails?",
    a: "Our two-phase ledger reserves credits when you submit a job. If an inference times out or an error occurs, your reserved credits are immediately refunded back to your balance without manual intervention.",
  },
  {
    q: "Can I use generated images and videos commercially?",
    a: "Yes. We maintain a verified commercial license registry. Every model available for paid generation is vetted for commercial legality (e.g., Apache 2.0, MIT, or verified Google Cloud commercial API terms).",
  },
  {
    q: "Do I need technical skills or a powerful PC?",
    a: "None at all! AI Studio runs completely in the cloud. You only need a web browser on any computer, tablet, or phone.",
  },
];

export default function HomePage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeHeroTab, setActiveHeroTab] = useState("image");
  const [interactivePrompt, setInteractivePrompt] = useState(
    "A majestic golden eagle soaring above snow-capped Alps, morning mist, cinematic sunlight"
  );
  const [interactiveStyle, setInteractiveStyle] = useState("Photorealistic");

  const openAuth = (mode: "login" | "register") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-950 selection:bg-neutral-900 selection:text-white">
      
      {/* 1. Pro Invideo-Style Navbar */}
      <Navbar onOpenAuth={openAuth} />

      {/* 2. Hero Section with Technical Blueprint Grid & Floating Cursor Tags */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:48px_48px] border-b border-neutral-200/80">
        
        {/* Floating Collaborator Cursor Tags (Exact Invideo Hero Match) */}
        <div className="absolute inset-0 pointer-events-none max-w-6xl mx-auto overflow-hidden hidden md:block">
          
          {/* Cursor Tag: "You" (Indigo/Purple - Top Left) */}
          <div className="absolute top-12 left-12 flex items-start gap-1.5 transition-transform hover:scale-105">
            <svg className="w-4 h-4 text-indigo-600 drop-shadow-sm fill-indigo-600" viewBox="0 0 24 24">
              <path d="M4 2l16 12-8.5 1.5L8 22 4 2z" />
            </svg>
            <span className="bg-indigo-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md">
              You
            </span>
          </div>

          {/* Cursor Tag: "Andrew" (Emerald/Green - Top Right) */}
          <div className="absolute top-14 right-20 flex items-start gap-1.5 transition-transform hover:scale-105">
            <svg className="w-4 h-4 text-emerald-600 drop-shadow-sm fill-emerald-600" viewBox="0 0 24 24">
              <path d="M4 2l16 12-8.5 1.5L8 22 4 2z" />
            </svg>
            <span className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md">
              Andrew
            </span>
          </div>

          {/* Cursor Tag: "Anna" (Coral/Orange - Mid Left) */}
          <div className="absolute bottom-28 left-20 flex items-start gap-1.5 transition-transform hover:scale-105">
            <svg className="w-4 h-4 text-amber-500 drop-shadow-sm fill-amber-500" viewBox="0 0 24 24">
              <path d="M4 2l16 12-8.5 1.5L8 22 4 2z" />
            </svg>
            <span className="bg-amber-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md">
              Anna
            </span>
          </div>

          {/* Cursor Tag: "Agent Two" (Violet/Purple - Mid Right) */}
          <div className="absolute bottom-24 right-28 flex items-start gap-1.5 transition-transform hover:scale-105">
            <svg className="w-4 h-4 text-purple-600 drop-shadow-sm fill-purple-600" viewBox="0 0 24 24">
              <path d="M4 2l16 12-8.5 1.5L8 22 4 2z" />
            </svg>
            <span className="bg-purple-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md">
              Agent Two
            </span>
          </div>
        </div>

        <div className="relative max-w-5xl mx-auto px-6 text-center space-y-7 z-10">
          
          {/* Editorial / Serif Hero Headline (Exact Invideo Style) */}
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
              { id: "script", icon: "🎭", label: "Microdrama & Script" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveHeroTab(tab.id);
                  if (tab.id === "video") {
                    setInteractivePrompt("Drone shot through misty pine forest at sunrise, 4k 60fps cinematic movement");
                  } else if (tab.id === "audio") {
                    setInteractivePrompt("Natural expressive audiobook narration: The ancient clock struck midnight as the fog rolled in.");
                  } else if (tab.id === "ad") {
                    setInteractivePrompt("Luxury perfume bottle standing on polished marble with splashing rose water, commercial lighting");
                  } else {
                    setInteractivePrompt("A majestic golden eagle soaring above snow-capped Alps, morning mist, cinematic sunlight");
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

        {/* Hero Interactive Live Preview Card */}
        <div className="max-w-4xl mx-auto px-6 mt-14">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xl shadow-indigo-900/5 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                <span className="ml-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Interactive Live Studio Preview
                </span>
              </div>
              <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                Connected to Port 8100 Backend API
              </span>
            </div>

            {/* Prompt Input in Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>Enter Your Vision or Click a Preset:</span>
                <span className="text-indigo-600 font-bold">💎 8 Credits per image</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={interactivePrompt}
                  onChange={(e) => setInteractivePrompt(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-medium"
                />
              </div>

              {/* Style Presets */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {[
                  { name: "Photorealistic", prompt: "A majestic golden eagle soaring above snow-capped Alps, morning mist, cinematic sunlight" },
                  { name: "Cinematic", prompt: "Cyberpunk street vendor in neon-lit futuristic alley in Tokyo, rain puddles, 8k resolution" },
                  { name: "Anime", prompt: "Ethereal spirit guardian girl inside an enchanted mossy forest, vibrant anime style, Studio Ghibli vibes" },
                  { name: "3D Digital Art", prompt: "Cute robotic companion sitting on a floating island, stylized 3D render, Pixar style lighting" },
                ].map((st) => (
                  <button
                    key={st.name}
                    onClick={() => {
                      setInteractiveStyle(st.name);
                      setInteractivePrompt(st.prompt);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      interactiveStyle === st.name
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {st.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
              <div className="text-xs text-slate-500">
                Model: <strong>Google Imagen 3</strong> &bull; Output: <strong>1344x768 (16:9)</strong>
              </div>
              <Link
                href="/studio"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs bg-slate-950 hover:bg-slate-800 text-white shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Launch Generation in Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Live System & Telemetry Ticker */}
      <section className="bg-slate-50/70 border-b border-slate-200/80 py-6">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-extrabold text-slate-900">1,248,000+</div>
            <div className="text-xs font-semibold text-slate-500">Generations Completed</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-indigo-600">1.8s</div>
            <div className="text-xs font-semibold text-slate-500">Average Inference Latency</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">99.98%</div>
            <div className="text-xs font-semibold text-slate-500">Two-Phase Escrow Accuracy</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-emerald-600">$0 / mo</div>
            <div className="text-xs font-semibold text-slate-500">Mandatory Subscriptions</div>
          </div>
        </div>
      </section>

      {/* Curated Community Creations Gallery */}
      <section id="showcase" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Inspiration Gallery
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif">
            Created with AI Studio Multi-Models
          </h2>
          <p className="text-sm text-slate-600">
            Explore authentic outputs rendered across Google Imagen 3 and FLUX.1. Click any creation to copy its prompt or remix it in the studio.
          </p>
        </div>

        <ShowcaseGallery />
      </section>

      {/* Interactive Before & After 4x AI Upscale Slider */}
      <section className="py-20 bg-slate-50/60 border-y border-slate-200/80">
        <div className="max-w-4xl mx-auto px-6">
          <BeforeAfterSlider />
        </div>
      </section>

      {/* Modalities Bento Grid */}
      <section id="modalities" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Creative Arsenal
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif">
            Every Generative Modality in One Workspace
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Eliminate context switching. Whether you need photorealistic concept art, cinematic video, or professional voiceovers, it lives under one roof.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MODALITY_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${card.gradient} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{card.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{card.desc}</p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Integrated Models:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {card.models.map((m) => (
                      <span
                        key={m}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 border border-slate-200"
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

      {/* Model Selection Matrix */}
      <section id="matrix" className="py-20 bg-slate-50/60 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6">
          <ModelMatrix />
        </div>
      </section>

      {/* Interactive Savings Calculator */}
      <section id="calculator" className="py-24 max-w-7xl mx-auto px-6">
        <SavingsCalculator />
      </section>

      {/* Why AI Studio Comparison Section */}
      <section id="why-us" className="py-20 bg-slate-50 border-y border-slate-200/70">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              The Smarter Way
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-serif">
              Why Creators are Switching to AI Studio
            </h2>
            <p className="text-sm text-slate-600">
              Traditional AI workflows are fragmented, expensive, and fragile. Here is how we fixed them.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-xs border-b border-slate-200">
                  <tr>
                    <th className="py-4 px-6 font-bold">Core Capability</th>
                    <th className="py-4 px-6 font-bold text-rose-600">Fragmented Tool Chaos</th>
                    <th className="py-4 px-6 font-bold text-indigo-700 bg-indigo-50/50">AI Studio Unified Hub</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {COMPARISON.map((row) => (
                    <tr key={row.feature} className="hover:bg-slate-50/50">
                      <td className="py-4 px-6 font-bold text-slate-900">{row.feature}</td>
                      <td className="py-4 px-6 text-slate-500">{row.traditional}</td>
                      <td className="py-4 px-6 text-indigo-950 font-semibold bg-indigo-50/30 flex items-center gap-2">
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

      {/* Pricing & Packages Section */}
      <section id="pricing" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif">
            Simple Credit Packages. Zero Subscriptions.
          </h2>
          <p className="text-sm text-slate-600">
            Buy credits whenever you need them. Unused credits never expire.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Free Tier */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-bold text-base text-slate-900">Free Welcome</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900">$0</span>
                <span className="text-xs text-slate-500">on signup</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-indigo-700 flex items-center gap-2">
                <Coins className="w-4 h-4" />
                <span>100 Platform Credits</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 pt-2">
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
              className="mt-6 w-full py-2.5 rounded-full font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
            >
              Get Free 100 Credits
            </button>
          </div>

          {/* Starter Pack */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-bold text-base text-slate-900">Starter Pack</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900">$5</span>
                <span className="text-xs text-slate-500">one-time</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-indigo-700 flex items-center gap-2">
                <Coins className="w-4 h-4" />
                <span>500 Platform Credits</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 pt-2">
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
              className="mt-6 w-full py-2.5 rounded-full font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors text-center block"
            >
              Purchase $5 Pack
            </Link>
          </div>

          {/* Pro Studio (Popular) */}
          <div className="bg-white rounded-3xl p-6 border-2 border-indigo-600 shadow-xl shadow-indigo-600/10 flex flex-col justify-between relative">
            <span className="absolute -top-3 right-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider shadow">
              Most Popular
            </span>
            <div className="space-y-4">
              <h3 className="font-bold text-base text-slate-900">Pro Studio</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-indigo-600">$20</span>
                <span className="text-xs text-slate-500">one-time</span>
              </div>
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-700 flex items-center gap-2">
                <Coins className="w-4 h-4 text-indigo-600" />
                <span>2,500 Platform Credits</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 pt-2">
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
              className="mt-6 w-full py-2.5 rounded-full font-bold text-xs bg-slate-950 hover:bg-slate-800 text-white shadow-md transition-all text-center block"
            >
              Get Pro Pack ($20)
            </Link>
          </div>

          {/* Scale Agency */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-bold text-base text-slate-900">Scale Agency</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900">$70</span>
                <span className="text-xs text-slate-500">one-time</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-indigo-700 flex items-center gap-2">
                <Coins className="w-4 h-4" />
                <span>10,000 Platform Credits</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 pt-2">
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
              className="mt-6 w-full py-2.5 rounded-full font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors text-center block"
            >
              Purchase $70 Pack
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-slate-50 border-t border-slate-200/70">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Everything you need to know about billing, licensing, and workflow.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isOpen ? "rotate-180 text-indigo-600" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-50 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom Conversion CTA Banner */}
      <section className="py-20 bg-slate-950 text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-300 text-xs font-bold border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start Creating in 30 Seconds</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-serif">
            Ready to Unify Your Creative AI Workflow?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Join today and receive 100 free platform credits. No credit card required, no recurring charges.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => openAuth("register")}
              className="w-full sm:w-auto px-9 py-4 rounded-full font-extrabold text-sm bg-white text-slate-950 hover:bg-slate-100 shadow-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Claim Your 100 Free Credits</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              href="/studio"
              className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-sm bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md transition-all text-center"
            >
              Open Studio Workspace
            </Link>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* 3. Pro Invideo-Style Mega Footer */}
      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(user) => {
          window.location.href = "/studio";
        }}
      />
    </div>
  );
}
