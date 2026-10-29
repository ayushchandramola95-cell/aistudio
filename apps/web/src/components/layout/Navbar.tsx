"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  ChevronDown,
  Globe,
  Image as ImageIcon,
  Video,
  Mic,
  FileText,
  Wand2,
  Cpu,
  Layers,
  ShieldCheck,
  BookOpen,
  HelpCircle,
  Activity,
  ArrowRight
} from "lucide-react";

interface NavbarProps {
  onOpenAuth: (mode: "login" | "register") => void;
}

export default function Navbar({ onOpenAuth }: NavbarProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState("EN");
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
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
    <header ref={navRef} className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 text-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                AI Studio
              </span>
              <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/70">
                Platform
              </span>
            </div>
          </Link>

          {/* Center: Navigation Menu with Dropdowns */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600">
            
            {/* Product Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("product")}
                className="flex items-center gap-1 hover:text-slate-950 py-2 transition-colors cursor-pointer"
              >
                <span>Product</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${activeDropdown === "product" ? "rotate-180 text-indigo-600" : ""}`} />
              </button>

              {activeDropdown === "product" && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-3xl p-3 border border-slate-200 shadow-2xl shadow-slate-900/10 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1">
                  <Link
                    href="/studio"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 mt-0.5">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">AI Image Generator</div>
                      <div className="text-[11px] text-slate-500 font-normal">Photorealistic imagery via Imagen 3 & FLUX.1</div>
                    </div>
                  </Link>

                  <Link
                    href="/video"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="p-2 rounded-xl bg-purple-50 text-purple-600 mt-0.5">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">AI Video Studio</div>
                      <div className="text-[11px] text-slate-500 font-normal">Cinematic video motion via Google Veo & Wan</div>
                    </div>
                  </Link>

                  <Link
                    href="/audio"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="p-2 rounded-xl bg-teal-50 text-teal-600 mt-0.5">
                      <Mic className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Voice & Speech</div>
                      <div className="text-[11px] text-slate-500 font-normal">Kokoro TTS speech & Faster-Whisper transcription</div>
                    </div>
                  </Link>

                  <Link
                    href="/enhance"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="p-2 rounded-xl bg-amber-50 text-amber-600 mt-0.5">
                      <Wand2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">4x AI Upscale & Restoration</div>
                      <div className="text-[11px] text-slate-500 font-normal">Super-resolution clarity and background removal</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Models Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("models")}
                className="flex items-center gap-1 hover:text-slate-950 py-2 transition-colors cursor-pointer"
              >
                <span>Models</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${activeDropdown === "models" ? "rotate-180 text-indigo-600" : ""}`} />
              </button>

              {activeDropdown === "models" && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-3xl p-3 border border-slate-200 shadow-2xl shadow-slate-900/10 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1">
                  <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Hosted & Open-Weight
                  </div>
                  {[
                    { name: "Google Imagen 3", tag: "Cloud API", cost: "8 cr" },
                    { name: "FLUX.1 Schnell", tag: "GPU Worker", cost: "6 cr" },
                    { name: "Google Veo 2", tag: "Video API", cost: "80 cr" },
                    { name: "Google Gemini 2.0 Flash", tag: "Prompt API", cost: "1 cr" },
                    { name: "Kokoro TTS", tag: "Audio Model", cost: "2 cr" },
                  ].map((m) => (
                    <Link
                      key={m.name}
                      href="/studio"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 transition-colors text-xs font-bold text-slate-800"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                        <span>{m.name}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400">{m.cost}</span>
                    </Link>
                  ))}
                  <div className="pt-2 border-t border-slate-100">
                    <a
                      href="#matrix"
                      onClick={() => setActiveDropdown(null)}
                      className="block text-center text-xs font-bold text-indigo-600 hover:text-indigo-700 py-1"
                    >
                      View Full Capability Matrix &rarr;
                    </a>
                  </div>
                </div>
              )}
            </div>

            <a href="#why-us" className="hover:text-slate-950 transition-colors">
              Enterprise
            </a>

            {/* Pricing with 100 Free Credits / 50% Off Badge */}
            <a href="#pricing" className="flex items-center gap-1.5 hover:text-slate-950 transition-colors">
              <span>Pricing</span>
              <span className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm tracking-wide uppercase">
                100 FREE CR
              </span>
            </a>

            <a href="#matrix" className="hover:text-slate-950 transition-colors">
              MCP
            </a>

            {/* Resources Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("resources")}
                className="flex items-center gap-1 hover:text-slate-950 py-2 transition-colors cursor-pointer"
              >
                <span>Resources</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${activeDropdown === "resources" ? "rotate-180 text-indigo-600" : ""}`} />
              </button>

              {activeDropdown === "resources" && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-3xl p-3 border border-slate-200 shadow-2xl shadow-slate-900/10 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1">
                  <Link
                    href="/admin"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors text-xs font-bold text-slate-800"
                  >
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <span>System Health & Gauges</span>
                  </Link>
                  <Link
                    href="/credits"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors text-xs font-bold text-slate-800"
                  >
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>Two-Phase Escrow Ledger</span>
                  </Link>
                  <a
                    href="#faq"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors text-xs font-bold text-slate-800"
                  >
                    <HelpCircle className="w-4 h-4 text-amber-500" />
                    <span>Frequently Asked Questions</span>
                  </a>
                </div>
              )}
            </div>

            <a href="#showcase" className="hover:text-slate-950 transition-colors">
              Community
            </a>
          </nav>
        </div>

        {/* Right: Language Picker, Login & Sign Up Pill */}
        <div className="flex items-center gap-4">
          
          {/* Language Selector (Invideo style) */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-2 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>{selectedLang}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-28 bg-white rounded-2xl p-1.5 border border-slate-200 shadow-xl text-xs font-bold text-slate-700 space-y-0.5">
                {["EN", "ES", "FR", "DE", "JA"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setSelectedLang(lang);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl transition-colors ${
                      selectedLang === lang ? "bg-indigo-50 text-indigo-600" : "hover:bg-slate-50"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Login Text Button */}
          <button
            onClick={() => onOpenAuth("login")}
            className="text-sm font-bold text-slate-700 hover:text-slate-950 transition-colors cursor-pointer"
          >
            Login
          </button>

          {/* Invideo-style High Contrast Pill "Sign up" Button */}
          <button
            onClick={() => onOpenAuth("register")}
            className="px-5 py-2 rounded-full font-bold text-xs bg-slate-950 hover:bg-slate-800 text-white shadow-sm transition-all hover:scale-[1.02] cursor-pointer flex items-center gap-1.5"
          >
            <span>Sign up</span>
          </button>

          {/* Launch Studio Quick Pill */}
          <Link
            href="/studio"
            className="hidden xl:flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors"
          >
            <span>Studio</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

      </div>
    </header>
  );
}
