"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Globe,
  Image as ImageIcon,
  Video,
  Mic,
  Wand2,
  ShieldCheck,
  HelpCircle,
  Activity,
  Menu,
  X,
  FileText,
  ShoppingBag,
  Layers,
  Cpu,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Terminal,
  MessageSquare,
  FileCode2,
  Zap
} from "lucide-react";

interface NavbarProps {
  onOpenAuth: (mode: "login" | "register") => void;
}

export default function Navbar({ onOpenAuth }: NavbarProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState("EN");
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (name: string) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 transition-all"
    >
      {/* Tall, Airy, Generous Invideo-Style Navbar Height (90px) across wide container */}
      <div className="w-full max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-14 h-[90px] flex items-center justify-between">
        
        {/* Left: Brand Logo & Wordmark (Clean Invideo Style) */}
        <div className="flex items-center gap-10 xl:gap-12">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-neutral-950 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-white"
              >
                <path
                  d="M12 2L14.39 9.61L22 12L14.39 14.39L12 22L9.61 14.39L2 12L9.61 9.61L12 2Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className="font-bold text-[22px] tracking-tight text-neutral-950 font-sans">
              aistudio
            </span>
          </Link>

          {/* Center: Navigation Menu with Invideo Spacing & Typography */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-9 text-[15px] font-medium text-neutral-600">
            
            {/* 1. PRODUCT MEGA-MENU */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("product")}
                className="flex items-center gap-1.5 hover:text-neutral-950 py-3 transition-colors cursor-pointer"
              >
                <span>Product</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${
                    activeDropdown === "product" ? "rotate-180 text-neutral-950" : ""
                  }`}
                />
              </button>

              {activeDropdown === "product" && (
                <div className="absolute top-full -left-10 mt-3 w-[880px] bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-2xl shadow-neutral-900/15 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <div className="grid grid-cols-12 gap-6">
                    
                    {/* Columns 1 & 2: Generation Tools & Pro Features (8 cols) */}
                    <div className="col-span-8 space-y-6">
                      
                      {/* Section A: AI Generation Engines */}
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-3 px-1">
                          Core Generation Engines
                        </div>
                        <div className="grid grid-cols-2 gap-2.5">
                          
                          <Link
                            href="/studio"
                            onClick={() => setActiveDropdown(null)}
                            className="group flex items-start gap-3 p-3 rounded-2xl hover:bg-neutral-50 transition-all border border-transparent hover:border-neutral-200/80"
                          >
                            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform mt-0.5">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                                  AI Image Generator
                                </span>
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-700">
                                  Popular
                                </span>
                              </div>
                              <div className="text-[11px] text-neutral-500 font-normal leading-snug mt-0.5">
                                Photorealistic imagery, character art & 3D renders via Imagen 3 & FLUX.1
                              </div>
                            </div>
                          </Link>

                          <Link
                            href="/studio"
                            onClick={() => setActiveDropdown(null)}
                            className="group flex items-start gap-3 p-3 rounded-2xl hover:bg-neutral-50 transition-all border border-transparent hover:border-neutral-200/80"
                          >
                            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-105 transition-transform mt-0.5">
                              <Video className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-neutral-900 group-hover:text-purple-600 transition-colors">
                                  AI Video Studio
                                </span>
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-700">
                                  New
                                </span>
                              </div>
                              <div className="text-[11px] text-neutral-500 font-normal leading-snug mt-0.5">
                                High-definition cinematic motion & text-to-video via Google Veo 2 & Wan
                              </div>
                            </div>
                          </Link>

                          <Link
                            href="/studio"
                            onClick={() => setActiveDropdown(null)}
                            className="group flex items-start gap-3 p-3 rounded-2xl hover:bg-neutral-50 transition-all border border-transparent hover:border-neutral-200/80"
                          >
                            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 group-hover:scale-105 transition-transform mt-0.5">
                              <Mic className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-neutral-900 group-hover:text-teal-600 transition-colors">
                                Voice & Audio Studio
                              </span>
                              <div className="text-[11px] text-neutral-500 font-normal leading-snug mt-0.5">
                                Kokoro neural TTS speech voiceovers & Faster-Whisper audio transcription
                              </div>
                            </div>
                          </Link>

                          <Link
                            href="/studio"
                            onClick={() => setActiveDropdown(null)}
                            className="group flex items-start gap-3 p-3 rounded-2xl hover:bg-neutral-50 transition-all border border-transparent hover:border-neutral-200/80"
                          >
                            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-105 transition-transform mt-0.5">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-neutral-900 group-hover:text-amber-600 transition-colors">
                                Script & Prompt Enhancer
                              </span>
                              <div className="text-[11px] text-neutral-500 font-normal leading-snug mt-0.5">
                                Expand short ideas into model-tuned prompts via Gemini 2.0 Flash
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>

                      {/* Section B: Workflow & Pro Suites */}
                      <div className="pt-2 border-t border-neutral-100">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-3 px-1">
                          Workflow & Pro Suites
                        </div>
                        <div className="grid grid-cols-2 gap-2.5">
                          
                          <Link
                            href="/studio"
                            onClick={() => setActiveDropdown(null)}
                            className="group flex items-start gap-3 p-3 rounded-2xl hover:bg-neutral-50 transition-all border border-transparent hover:border-neutral-200/80"
                          >
                            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 group-hover:scale-105 transition-transform mt-0.5">
                              <ShoppingBag className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-neutral-900 group-hover:text-rose-600 transition-colors">
                                Product Photos & Ads
                              </span>
                              <div className="text-[11px] text-neutral-500 font-normal leading-snug mt-0.5">
                                Studio lighting, commercial packaging renders & social UGC ads
                              </div>
                            </div>
                          </Link>

                          <Link
                            href="/studio"
                            onClick={() => setActiveDropdown(null)}
                            className="group flex items-start gap-3 p-3 rounded-2xl hover:bg-neutral-50 transition-all border border-transparent hover:border-neutral-200/80"
                          >
                            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-105 transition-transform mt-0.5">
                              <Wand2 className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-neutral-900 group-hover:text-emerald-600 transition-colors">
                                4K Upscale & Restoration
                              </span>
                              <div className="text-[11px] text-neutral-500 font-normal leading-snug mt-0.5">
                                Super-resolution clarity, background removal & facial reconstruction
                              </div>
                            </div>
                          </Link>

                          <Link
                            href="/studio"
                            onClick={() => setActiveDropdown(null)}
                            className="group flex items-start gap-3 p-3 rounded-2xl hover:bg-neutral-50 transition-all border border-transparent hover:border-neutral-200/80"
                          >
                            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-105 transition-transform mt-0.5">
                              <Layers className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-neutral-900 group-hover:text-indigo-600 transition-colors">
                                Cross-Modal Canvas
                              </span>
                              <div className="text-[11px] text-neutral-500 font-normal leading-snug mt-0.5">
                                Visual node board connecting images, video clips, and audio tracks
                              </div>
                            </div>
                          </Link>

                          <Link
                            href="/admin"
                            onClick={() => setActiveDropdown(null)}
                            className="group flex items-start gap-3 p-3 rounded-2xl hover:bg-neutral-50 transition-all border border-transparent hover:border-neutral-200/80"
                          >
                            <div className="p-2.5 rounded-xl bg-slate-100 text-slate-800 group-hover:scale-105 transition-transform mt-0.5">
                              <Cpu className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-neutral-900 group-hover:text-slate-900 transition-colors">
                                Dedicated GPU Sandbox
                              </span>
                              <div className="text-[11px] text-neutral-500 font-normal leading-snug mt-0.5">
                                96GB VRAM RTX 6000 clusters with auto-stop on-demand scheduling
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>

                    </div>

                    {/* Column 3: Featured Release Card (4 cols) */}
                    <div className="col-span-4 bg-gradient-to-br from-neutral-50 to-neutral-100/90 rounded-2xl p-5 border border-neutral-200/80 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100/80 text-blue-700 text-[10px] font-extrabold uppercase tracking-wide">
                          <Sparkles className="w-3 h-3" />
                          <span>Featured Model Release</span>
                        </div>
                        <h5 className="font-bold text-sm text-neutral-950">
                          Google Veo 2 + Imagen 3
                        </h5>
                        <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                          Experience production-grade video motion and pristine 4K photorealistic details with zero local hardware setup.
                        </p>

                        <div className="pt-2 space-y-2 text-[11px] text-neutral-600 font-medium">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Two-Phase Escrow (Auto Refund)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>100 Free Welcome Credits</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Commercial License Verified</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-5 border-t border-neutral-200/60">
                        <Link
                          href="/studio"
                          onClick={() => setActiveDropdown(null)}
                          className="w-full py-2.5 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                        >
                          <span>Open Creative Studio</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* 2. MODELS MEGA-MENU */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("models")}
                className="flex items-center gap-1.5 hover:text-neutral-950 py-3 transition-colors cursor-pointer"
              >
                <span>Models</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${
                    activeDropdown === "models" ? "rotate-180 text-neutral-950" : ""
                  }`}
                />
              </button>

              {activeDropdown === "models" && (
                <div className="absolute top-full -left-28 mt-3 w-[820px] bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-2xl shadow-neutral-900/15 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                        Unified Model Catalog
                      </h4>
                      <div className="text-xs font-bold text-neutral-950 mt-0.5">
                        Dual-Path Engine: Cloud APIs & Rented GPU Inference
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">
                      12 Active Models
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    
                    {/* Category 1: Image Models */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600 mb-2">
                        Image Synthesis
                      </div>
                      {[
                        { name: "Google Imagen 3", cost: "8 cr", tag: "Cloud API", desc: "Top-tier photorealism & text rendering" },
                        { name: "FLUX.1 Schnell", cost: "6 cr", tag: "GPU Worker", desc: "Ultra-fast 4-step generation" },
                        { name: "FLUX.1 Dev", cost: "10 cr", tag: "GPU Worker", desc: "High-fidelity guidance & prompt accuracy" },
                        { name: "Stable Diffusion 3.5", cost: "5 cr", tag: "Open-Weight", desc: "Versatile creative illustration styles" },
                      ].map((m) => (
                        <Link
                          key={m.name}
                          href="/studio"
                          onClick={() => setActiveDropdown(null)}
                          className="block p-2.5 rounded-xl hover:bg-neutral-50 transition-colors border border-transparent hover:border-neutral-200/80"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-neutral-900">{m.name}</span>
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{m.cost}</span>
                          </div>
                          <div className="text-[10px] text-neutral-500 font-normal mt-0.5">{m.desc}</div>
                        </Link>
                      ))}
                    </div>

                    {/* Category 2: Video & Audio Models */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-purple-600 mb-2">
                        Video & Audio
                      </div>
                      {[
                        { name: "Google Veo 2", cost: "80 cr", tag: "Cloud API", desc: "Cinematic 1080p motion & camera pans" },
                        { name: "Wan AI 2.1", cost: "60 cr", tag: "GPU Worker", desc: "Open-weight video foundation model" },
                        { name: "HunyuanVideo", cost: "70 cr", tag: "GPU Worker", desc: "High temporal physics consistency" },
                        { name: "Kokoro TTS", cost: "2 cr", tag: "Open-Weight", desc: "Lightweight natural human speech" },
                        { name: "Faster-Whisper", cost: "1 cr/min", tag: "GPU Worker", desc: "Multi-lingual audio transcription" },
                      ].map((m) => (
                        <Link
                          key={m.name}
                          href="/studio"
                          onClick={() => setActiveDropdown(null)}
                          className="block p-2.5 rounded-xl hover:bg-neutral-50 transition-colors border border-transparent hover:border-neutral-200/80"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-neutral-900">{m.name}</span>
                            <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">{m.cost}</span>
                          </div>
                          <div className="text-[10px] text-neutral-500 font-normal mt-0.5">{m.desc}</div>
                        </Link>
                      ))}
                    </div>

                    {/* Category 3: Reasoning & Hardware */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 mb-2">
                        Reasoning & GPU Nodes
                      </div>
                      {[
                        { name: "Gemini 2.0 Flash", cost: "1 cr", tag: "Cloud API", desc: "Low-latency prompt expansion & logic" },
                        { name: "Qwen 2.5 72B", cost: "2 cr", tag: "GPU Worker", desc: "Creative screenplay & story director" },
                        { name: "RTX 6000 Ada GPU", cost: "Auto-Stop", tag: "Hardware", desc: "96GB VRAM on-demand GPU clusters" },
                      ].map((m) => (
                        <Link
                          key={m.name}
                          href="/admin"
                          onClick={() => setActiveDropdown(null)}
                          className="block p-2.5 rounded-xl hover:bg-neutral-50 transition-colors border border-transparent hover:border-neutral-200/80"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-neutral-900">{m.name}</span>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">{m.cost}</span>
                          </div>
                          <div className="text-[10px] text-neutral-500 font-normal mt-0.5">{m.desc}</div>
                        </Link>
                      ))}

                      <div className="pt-2">
                        <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-1.5">
                          <div className="text-[11px] font-bold text-neutral-900">Custom Checkpoint Support</div>
                          <p className="text-[10px] text-neutral-500 leading-snug">
                            Upload LoRAs and safetensors to run private inference on dedicated workers.
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-xs text-neutral-500">
                      All models are vetted for commercial legality and licensing compliance.
                    </span>
                    <a
                      href="#matrix"
                      onClick={() => setActiveDropdown(null)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <span>Explore Full Capability & Benchmark Matrix</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            <a href="#why-us" className="hover:text-neutral-950 py-3 transition-colors">
              Enterprise
            </a>

            {/* Pricing with Signature Invideo Blue Badge */}
            <a href="#pricing" className="flex items-center gap-1.5 hover:text-neutral-950 py-3 transition-colors">
              <span>Pricing</span>
              <span className="bg-[#2563EB] text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm tracking-wider uppercase">
                100 FREE CR
              </span>
            </a>

            <a href="#matrix" className="hover:text-neutral-950 py-3 transition-colors">
              MCP
            </a>

            {/* 3. RESOURCES MEGA-MENU */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("resources")}
                className="flex items-center gap-1.5 hover:text-neutral-950 py-3 transition-colors cursor-pointer"
              >
                <span>Resources</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${
                    activeDropdown === "resources" ? "rotate-180 text-neutral-950" : ""
                  }`}
                />
              </button>

              {activeDropdown === "resources" && (
                <div className="absolute top-full -left-48 mt-3 w-[620px] bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-2xl shadow-neutral-900/15 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <div className="grid grid-cols-2 gap-6">
                    
                    {/* Column 1: Creators & Workflows */}
                    <div className="space-y-3">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                        Creators & Workflows
                      </div>

                      <a
                        href="#showcase"
                        onClick={() => setActiveDropdown(null)}
                        className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-neutral-50 transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 mt-0.5">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-neutral-900 group-hover:text-indigo-600 transition-colors">
                            Prompt Engineering Guide
                          </div>
                          <div className="text-[11px] text-neutral-500 font-normal">
                            500+ tested prompts with model benchmark settings
                          </div>
                        </div>
                      </a>

                      <a
                        href="#showcase"
                        onClick={() => setActiveDropdown(null)}
                        className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-neutral-50 transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-teal-50 text-teal-600 mt-0.5">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-neutral-900 group-hover:text-teal-600 transition-colors">
                            Community Inspiration
                          </div>
                          <div className="text-[11px] text-neutral-500 font-normal">
                            Trending artwork, videos & 1-click remix prompts
                          </div>
                        </div>
                      </a>

                      <a
                        href="#faq"
                        onClick={() => setActiveDropdown(null)}
                        className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-neutral-50 transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-amber-50 text-amber-600 mt-0.5">
                          <HelpCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-neutral-900 group-hover:text-amber-600 transition-colors">
                            Frequently Asked Questions
                          </div>
                          <div className="text-[11px] text-neutral-500 font-normal">
                            Credit rollover, refund policies & commercial usage
                          </div>
                        </div>
                      </a>
                    </div>

                    {/* Column 2: Developers & Infrastructure */}
                    <div className="space-y-3">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                        Platform & Infrastructure
                      </div>

                      <Link
                        href="/developers"
                        onClick={() => setActiveDropdown(null)}
                        className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-neutral-50 transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-neutral-950 text-white mt-0.5 shadow-sm">
                          <Terminal className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-neutral-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                            <span>Developer API & SDKs</span>
                            <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded font-extrabold">v1 REST</span>
                          </div>
                          <div className="text-[11px] text-neutral-500 font-normal">
                            REST endpoints, secret keys & code snippets (Python/TS)
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/credits"
                        onClick={() => setActiveDropdown(null)}
                        className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-neutral-50 transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600 mt-0.5">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                            Two-Phase Escrow Ledger
                          </div>
                          <div className="text-[11px] text-neutral-500 font-normal">
                            Inspect atomic credit reservation & transaction logs
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/admin"
                        onClick={() => setActiveDropdown(null)}
                        className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-neutral-50 transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 mt-0.5">
                          <Activity className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-neutral-900 group-hover:text-emerald-600 transition-colors">
                            System Status & Telemetry
                          </div>
                          <div className="text-[11px] text-neutral-500 font-normal">
                            Live worker health, queue depth & GPU telemetry
                          </div>
                        </div>
                      </Link>

                      <a
                        href="https://discord.com"
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setActiveDropdown(null)}
                        className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-neutral-50 transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-purple-50 text-purple-600 mt-0.5">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-neutral-900 group-hover:text-purple-600 transition-colors">
                            Discord Community
                          </div>
                          <div className="text-[11px] text-neutral-500 font-normal">
                            Connect with 12,000+ creators & AI engineers
                          </div>
                        </div>
                      </a>
                    </div>

                  </div>
                </div>
              )}
            </div>

            <a href="#showcase" className="hover:text-neutral-950 py-3 transition-colors">
              Community
            </a>
          </nav>
        </div>

        {/* Right: Language Picker, Login & Signature Invideo-Style Sign Up Pill */}
        <div className="hidden lg:flex items-center gap-5 xl:gap-6">
          
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 text-[14px] font-medium text-neutral-600 hover:text-neutral-950 px-2 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <Globe className="w-4 h-4 text-neutral-400" />
              <span>{selectedLang}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-xl p-1 border border-neutral-200 shadow-xl text-xs font-semibold text-neutral-700 space-y-0.5 z-30">
                {["EN", "ES", "FR", "DE", "JA"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setSelectedLang(lang);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors ${
                      selectedLang === lang ? "bg-neutral-100 text-neutral-950 font-bold" : "hover:bg-neutral-50"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Login Text Link */}
          <button
            onClick={() => onOpenAuth("login")}
            className="text-[15px] font-medium text-neutral-700 hover:text-neutral-950 transition-colors cursor-pointer px-3 py-2"
          >
            Login
          </button>

          {/* Invideo-Style Signature Pill "Sign up" Button */}
          <button
            onClick={() => onOpenAuth("register")}
            className="px-6 py-2.5 rounded-full font-semibold text-[14px] bg-neutral-950 hover:bg-neutral-800 text-white shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
          >
            Sign up
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex lg:hidden items-center gap-3">
          <button
            onClick={() => onOpenAuth("register")}
            className="px-4 py-2 rounded-full font-semibold text-xs bg-neutral-950 text-white"
          >
            Sign up
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-700 hover:text-neutral-950"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 bg-white px-6 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-3 text-base font-semibold text-neutral-800">
            <Link href="/studio" onClick={() => setMobileMenuOpen(false)}>AI Studio</Link>
            <a href="#models" onClick={() => setMobileMenuOpen(false)}>Models Catalog</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing (100 Free Credits)</a>
            <a href="#showcase" onClick={() => setMobileMenuOpen(false)}>Showcase Gallery</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
          </nav>
          <div className="pt-4 border-t border-neutral-100 flex gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth("login");
              }}
              className="flex-1 py-3 text-center rounded-xl border border-neutral-200 font-semibold text-sm text-neutral-800"
            >
              Login
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth("register");
              }}
              className="flex-1 py-3 text-center rounded-xl bg-neutral-950 text-white font-semibold text-sm"
            >
              Sign up
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
