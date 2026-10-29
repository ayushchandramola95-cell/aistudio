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
  HelpCircle,
  Coins,
  Cpu,
  Layers,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import AuthModal from "@/components/auth/AuthModal";

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
  const [interactivePrompt, setInteractivePrompt] = useState("A majestic golden eagle soaring above snow-capped Alps, morning mist");
  const [interactiveStyle, setInteractiveStyle] = useState("Photorealistic");

  const openAuth = (mode: "login" | "register") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Marketing Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 bg-clip-text text-transparent">
                AI Studio
              </span>
              <span className="ml-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                Light v0.1
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#modalities" className="hover:text-indigo-600 transition-colors">
              Modalities
            </a>
            <a href="#why-us" className="hover:text-indigo-600 transition-colors">
              Why AI Studio
            </a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">
              Pricing & Credits
            </a>
            <a href="#faq" className="hover:text-indigo-600 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => openAuth("login")}
              className="text-sm font-bold text-slate-700 hover:text-indigo-600 px-3 py-2 transition-colors"
            >
              Sign In
            </button>
            <Link
              href="/studio"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
            >
              Launch Studio
            </Link>
            <button
              onClick={() => openAuth("register")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md shadow-indigo-500/25 transition-all"
            >
              <span>Get 100 Free Credits</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/70 text-indigo-700 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Unified Multi-Model Creative Platform</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
            <span className="text-slate-600 font-medium">100 Free Credits on Signup</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.1]">
            One studio for <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">Image, Video, Voice & Text</span> generation.
          </h1>

          {/* Subhead */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Stop paying 5 separate subscriptions. Harness Google Imagen 3, Veo, FLUX.1, Kokoro TTS, and Gemini 2.0 from a single, transparent credit pool.
          </p>

          {/* Dual CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={() => openAuth("register")}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Start Creating Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              href="/studio"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-bold text-sm bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Interactive Studio</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Two-Phase Escrow Billing</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-600" />
              <span>Zero Local Hardware Needed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Commercial License Verified</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive Preview Card */}
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
                <span>Enter Your Vision:</span>
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
                {["Photorealistic", "Cinematic", "Anime", "3D Digital Art", "Cyberpunk"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setInteractiveStyle(st)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      interactiveStyle === st
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {st}
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
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Launch Generation in Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Modalities Section (Bento Grid) */}
      <section id="modalities" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Creative Arsenal
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
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
                  <p className="text-xs text-slate-600 leading-relaxed">{card.desc}</p>
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

      {/* Why AI Studio Comparison Section */}
      <section id="why-us" className="py-20 bg-slate-50 border-y border-slate-200/70">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              The Smarter Way
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
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
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
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
              className="mt-6 w-full py-2.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
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
              className="mt-6 w-full py-2.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors text-center block"
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
              className="mt-6 w-full py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all text-center block"
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
              className="mt-6 w-full py-2.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors text-center block"
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
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
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
                    className="w-full p-5 text-left flex items-center justify-between text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors"
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

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-base text-slate-900">AI Studio</span>
            <span className="text-xs text-slate-400">&bull; Localhost Port 3100 &bull; API Port 8100</span>
          </div>

          <div className="flex items-center gap-6 text-xs font-semibold text-slate-500">
            <Link href="/studio" className="hover:text-indigo-600">
              Studio Workspace
            </Link>
            <Link href="/credits" className="hover:text-indigo-600">
              Credits Ledger
            </Link>
            <Link href="/admin" className="hover:text-indigo-600">
              Admin Telemetry
            </Link>
          </div>

          <div className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} AI Studio. All rights reserved.
          </div>
        </div>
      </footer>

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
