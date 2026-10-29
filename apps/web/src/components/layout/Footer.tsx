"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Globe,
  ChevronDown,
  ExternalLink,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Github
} from "lucide-react";

export default function Footer() {
  const [selectedLang, setSelectedLang] = useState("EN");
  const [langOpen, setLangOpen] = useState(false);

  return (
    <footer className="bg-slate-50 border-t border-slate-200/90 text-slate-700 pt-16 pb-12 text-xs">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        
        {/* Main Multi-Column Mega Links Grid (Matching Invideo Layout) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          
          {/* Column 1: AI Studio Video */}
          <div className="space-y-6">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 mb-3">AI Studio</h4>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                Video Tools
              </div>
              <ul className="space-y-2 text-slate-600 font-medium">
                <li><Link href="/video" className="hover:text-indigo-600 transition-colors">AI Video Generator</Link></li>
                <li><Link href="/video" className="hover:text-indigo-600 transition-colors">AI Avatar Generator</Link></li>
                <li><Link href="/video" className="hover:text-indigo-600 transition-colors">Text to Video</Link></li>
                <li><Link href="/video" className="hover:text-indigo-600 transition-colors">Image to Video</Link></li>
                <li><Link href="/video" className="hover:text-indigo-600 transition-colors">UGC Ads Creator</Link></li>
                <li><Link href="/video" className="hover:text-indigo-600 transition-colors">AI Animation Generator</Link></li>
                <li><Link href="/video" className="hover:text-indigo-600 transition-colors">AI Ad Generator</Link></li>
              </ul>
            </div>

            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                Video Models
              </div>
              <ul className="space-y-2 text-slate-600 font-medium">
                <li><span className="text-slate-700 font-semibold">Google Veo 2</span></li>
                <li><span className="text-slate-500">Sora 2 (Roadmap)</span></li>
                <li><span className="text-slate-700 font-semibold">Wan AI 2.1</span></li>
                <li><span className="text-slate-700 font-semibold">HunyuanVideo</span></li>
                <li><span className="text-slate-500">Pixverse AI</span></li>
                <li><span className="text-slate-500">Hailuo AI</span></li>
                <li><a href="#matrix" className="text-indigo-600 font-bold hover:underline">View all models &rarr;</a></li>
              </ul>
            </div>
          </div>

          {/* Column 2: Image Tools & Models */}
          <div className="space-y-6">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 mb-3">Image Tools</h4>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                Image Suite
              </div>
              <ul className="space-y-2 text-slate-600 font-medium">
                <li><Link href="/studio" className="hover:text-indigo-600 transition-colors">AI Image Generator</Link></li>
                <li><Link href="/studio" className="hover:text-indigo-600 transition-colors">AI Art Generator</Link></li>
                <li><Link href="/studio" className="hover:text-indigo-600 transition-colors">Image to Image</Link></li>
                <li><Link href="/studio" className="hover:text-indigo-600 transition-colors">AI Thumbnail Maker</Link></li>
                <li><Link href="/enhance" className="hover:text-indigo-600 transition-colors">AI Image Enhancer</Link></li>
              </ul>
            </div>

            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                Image Models
              </div>
              <ul className="space-y-2 text-slate-600 font-medium">
                <li><span className="text-slate-700 font-semibold">Google Imagen 3</span></li>
                <li><span className="text-slate-700 font-semibold">FLUX.1 Schnell</span></li>
                <li><span className="text-slate-700 font-semibold">FLUX.1 Dev</span></li>
                <li><span className="text-slate-500">Stable Diffusion XL</span></li>
                <li><span className="text-slate-500">SD 3.5 Large</span></li>
                <li><span className="text-slate-500">Qwen Image</span></li>
                <li><a href="#matrix" className="text-indigo-600 font-bold hover:underline">View all models &rarr;</a></li>
              </ul>
            </div>
          </div>

          {/* Column 3: Audio & Music Tools */}
          <div className="space-y-6">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 mb-3">Audio & Music Tools</h4>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                Voice & Audio
              </div>
              <ul className="space-y-2 text-slate-600 font-medium">
                <li><Link href="/audio" className="hover:text-indigo-600 transition-colors">AI Voice Generator</Link></li>
                <li><Link href="/audio" className="hover:text-indigo-600 transition-colors">AI Music Generator</Link></li>
                <li><Link href="/audio" className="hover:text-indigo-600 transition-colors">Text to Speech (TTS)</Link></li>
                <li><Link href="/audio" className="hover:text-indigo-600 transition-colors">Speech to Text (STT)</Link></li>
                <li><Link href="/audio" className="hover:text-indigo-600 transition-colors">Voice Cloning (Roadmap)</Link></li>
              </ul>
            </div>

            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                Audio Models
              </div>
              <ul className="space-y-2 text-slate-600 font-medium">
                <li><span className="text-slate-700 font-semibold">Kokoro TTS</span></li>
                <li><span className="text-slate-700 font-semibold">Faster-Whisper</span></li>
                <li><span className="text-slate-500">Eleven Labs (API)</span></li>
                <li><span className="text-slate-500">F5-TTS</span></li>
              </ul>
            </div>

            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                Quick AI Tools
              </div>
              <ul className="space-y-2 text-slate-600 font-medium">
                <li><Link href="/enhance" className="hover:text-indigo-600 transition-colors">4x Super Resolution</Link></li>
                <li><Link href="/enhance" className="hover:text-indigo-600 transition-colors">Background Removal</Link></li>
              </ul>
            </div>
          </div>

          {/* Column 4: Studio Features */}
          <div className="space-y-6">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 mb-3">Studio Features</h4>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                Workflow
              </div>
              <ul className="space-y-2 text-slate-600 font-medium">
                <li><Link href="/studio" className="hover:text-indigo-600 transition-colors">Online Canvas Studio</Link></li>
                <li><Link href="/studio" className="hover:text-indigo-600 transition-colors">Beginner 3-Click Mode</Link></li>
                <li><Link href="/studio" className="hover:text-indigo-600 transition-colors">Advanced Parameter Node</Link></li>
                <li><Link href="/text" className="hover:text-indigo-600 transition-colors">Prompt Enhancer Engine</Link></li>
                <li><Link href="/credits" className="hover:text-indigo-600 transition-colors">Two-Phase Escrow Ledger</Link></li>
                <li><Link href="/admin" className="hover:text-indigo-600 transition-colors">On-Demand GPU Workers</Link></li>
              </ul>
            </div>
          </div>

          {/* Column 5: Help & Company */}
          <div className="space-y-6">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 mb-3">Help & Docs</h4>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                Support
              </div>
              <ul className="space-y-2 text-slate-600 font-medium">
                <li><a href="mailto:support@aistudio.com" className="hover:text-indigo-600 transition-colors">Email Us</a></li>
                <li><a href="#showcase" className="hover:text-indigo-600 transition-colors">Tutorials & Guides</a></li>
                <li><Link href="/admin" className="hover:text-indigo-600 transition-colors">System Telemetry</Link></li>
                <li><a href="#why-us" className="hover:text-indigo-600 transition-colors">Commercial Licensing</a></li>
                <li><a href="#pricing" className="hover:text-indigo-600 transition-colors">Credit Pricing Packs</a></li>
                <li><a href="#faq" className="hover:text-indigo-600 transition-colors">Community Discord</a></li>
              </ul>
            </div>
          </div>

          {/* Column 6: Get The App (Invideo Style App Store Badges) */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              GET THE APP
            </h4>
            
            {/* Google Play Store Badge Mockup */}
            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-sm hover:scale-[1.02] transition-transform cursor-pointer">
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.609 1.814L13.792 12 3.61 22.186c-.378-.328-.61-.83-.61-1.423V3.237c0-.593.232-1.095.61-1.423zm11.238 11.238l2.673 2.673-12.016 6.942 9.343-9.615zm0-2.104L5.504 1.333l12.016 6.942-2.673 2.673zm1.055 1.052l3.418 1.974c.983.568.983 1.494 0 2.062l-3.418 1.974-2.128-2.128 2.128-1.882z" />
              </svg>
              <div className="text-left">
                <div className="text-[8px] uppercase font-bold text-slate-400 leading-none">GET IT ON</div>
                <div className="text-xs font-extrabold tracking-tight text-white leading-tight">Google Play</div>
              </div>
            </div>

            {/* Apple App Store Badge Mockup */}
            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-sm hover:scale-[1.02] transition-transform cursor-pointer">
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.85.94-2.93-.91.04-2.02.61-2.67 1.37-.58.67-1.09 1.77-.95 2.83 1.02.08 2.05-.5 2.68-1.27z" />
              </svg>
              <div className="text-left">
                <div className="text-[8px] uppercase font-bold text-slate-400 leading-none">Download on the</div>
                <div className="text-xs font-extrabold tracking-tight text-white leading-tight">App Store</div>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-400">
              Desktop & Mobile Apps coming in Phase 9 (Tauri & Expo).
            </div>
          </div>

        </div>

        {/* Bottom Bar: Logo, Language Selector & Socials (Matching Invideo) */}
        <div className="pt-8 border-t border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo & Language */}
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-slate-900 tracking-tight">
                AI Studio
              </span>
            </Link>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>Language</span>
                <span className="text-indigo-600 font-extrabold">{selectedLang}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langOpen && (
                <div className="absolute left-0 bottom-full mb-2 w-32 bg-white rounded-2xl p-1.5 border border-slate-200 shadow-xl text-xs font-bold text-slate-700 space-y-0.5 z-30">
                  {["EN", "ES", "FR", "DE", "JA"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setSelectedLang(lang);
                        setLangOpen(false);
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
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4 text-slate-400">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl hover:bg-white hover:text-slate-900 transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl hover:bg-white hover:text-slate-900 transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl hover:bg-white hover:text-slate-900 transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl hover:bg-white hover:text-slate-900 transition-colors">
              <Youtube className="w-4 h-4" />
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl hover:bg-white hover:text-slate-900 transition-colors">
              <Github className="w-4 h-4" />
            </a>
          </div>

        </div>

        {/* Legal & Copyright Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px] pt-2">
          <div className="flex flex-wrap items-center gap-4 font-medium">
            <a href="#" className="hover:text-slate-900">Privacy policy</a>
            <span>&bull;</span>
            <a href="#" className="hover:text-slate-900">Terms & conditions</a>
            <span>&bull;</span>
            <a href="#" className="hover:text-slate-900">Child safety & Responsible AI</a>
            <span>&bull;</span>
            <a href="#" className="hover:text-slate-900">Commercial License Terms</a>
          </div>

          <div>
            &copy; 2026 AI Studio. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
}
