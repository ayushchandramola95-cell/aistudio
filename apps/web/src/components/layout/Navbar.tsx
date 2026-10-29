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
  X
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
      {/* Tall, Airy, Generous Invideo-Style Navbar Height (92px) across full width */}
      <div className="w-full max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-14 h-[90px] flex items-center justify-between">
        
        {/* Left: Brand Logo & Wordmark (Clean Invideo Style) */}
        <div className="flex items-center gap-10 xl:gap-12">
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* Elegant Vector Mark */}
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
            
            {/* Product Dropdown */}
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
                <div className="absolute top-full left-0 mt-2 w-84 bg-white rounded-2xl p-3 border border-neutral-200/90 shadow-2xl shadow-neutral-900/10 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1 z-30">
                  <Link
                    href="/studio"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-neutral-50 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600 mt-0.5">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-900">AI Image Generator</div>
                      <div className="text-[11px] text-neutral-500 font-normal">Photorealistic imagery via Imagen 3 & FLUX.1</div>
                    </div>
                  </Link>

                  <Link
                    href="/studio"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-neutral-50 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-purple-50 text-purple-600 mt-0.5">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-900">AI Video Studio</div>
                      <div className="text-[11px] text-neutral-500 font-normal">Cinematic video motion via Google Veo 2 & Wan</div>
                    </div>
                  </Link>

                  <Link
                    href="/studio"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-neutral-50 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-teal-50 text-teal-600 mt-0.5">
                      <Mic className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-900">Voice & Speech</div>
                      <div className="text-[11px] text-neutral-500 font-normal">Kokoro TTS speech & Faster-Whisper audio</div>
                    </div>
                  </Link>

                  <Link
                    href="/studio"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-neutral-50 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-amber-50 text-amber-600 mt-0.5">
                      <Wand2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-900">4x AI Upscale & Restoration</div>
                      <div className="text-[11px] text-neutral-500 font-normal">Clarity restoration and background removal</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Models Dropdown */}
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
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl p-3 border border-neutral-200/90 shadow-2xl shadow-neutral-900/10 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1 z-30">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Hosted & Open-Weight Catalog
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
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-50 transition-colors text-xs font-semibold text-neutral-800"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                        <span>{m.name}</span>
                      </div>
                      <span className="text-[11px] font-medium text-neutral-400">{m.cost}</span>
                    </Link>
                  ))}
                  <div className="pt-2 border-t border-neutral-100">
                    <a
                      href="#matrix"
                      onClick={() => setActiveDropdown(null)}
                      className="block text-center text-xs font-bold text-blue-600 hover:text-blue-700 py-1"
                    >
                      View Full Capability Matrix &rarr;
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

            {/* Resources Dropdown */}
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
                <div className="absolute top-full left-0 mt-2 w-76 bg-white rounded-2xl p-3 border border-neutral-200/90 shadow-2xl shadow-neutral-900/10 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1 z-30">
                  <Link
                    href="/admin"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-neutral-50 transition-colors text-xs font-semibold text-neutral-800"
                  >
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <span>System Health & Gauges</span>
                  </Link>
                  <Link
                    href="/credits"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-neutral-50 transition-colors text-xs font-semibold text-neutral-800"
                  >
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Two-Phase Escrow Ledger</span>
                  </Link>
                  <a
                    href="#faq"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-neutral-50 transition-colors text-xs font-semibold text-neutral-800"
                  >
                    <HelpCircle className="w-4 h-4 text-amber-500" />
                    <span>Frequently Asked Questions</span>
                  </a>
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
