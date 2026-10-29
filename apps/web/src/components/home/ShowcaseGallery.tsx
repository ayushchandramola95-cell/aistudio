"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowUpRight, Copy, Check, Wand2 } from "lucide-react";

interface ShowcaseItem {
  id: string;
  title: string;
  category: "photorealistic" | "cinematic" | "anime" | "3d_art" | "fantasy";
  model: string;
  prompt: string;
  aspect: string;
  credits: number;
  gradient: string;
}

const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: "1",
    title: "Kyoto Cyberpunk Shrine",
    category: "cinematic",
    model: "Google Imagen 3",
    prompt: "An ancient Kyoto torii gate illuminated by neon holographic glyphs in heavy rain, cinematic lighting, 8k resolution, photorealistic reflections on wet stone pavement",
    aspect: "16:9",
    credits: 8,
    gradient: "from-blue-600 via-indigo-700 to-purple-900",
  },
  {
    id: "2",
    title: "Studio Ceramic Teapot",
    category: "photorealistic",
    model: "FLUX.1 Schnell",
    prompt: "Minimalist ceramic Japanese teapot with crackled kintsugi gold lacquer on weathered oak table, natural diffused morning window light, 50mm f/1.4 lens depth of field",
    aspect: "1:1",
    credits: 6,
    gradient: "from-amber-600 via-stone-700 to-slate-900",
  },
  {
    id: "3",
    title: "Celestial Mech Pilot",
    category: "anime",
    model: "FLUX.1 Dev",
    prompt: "Anime concept art of a futuristic mecha pilot in glowing armor looking out into deep nebula space from hangar bay, Makoto Shinkai style, vibrant colors",
    aspect: "9:16",
    credits: 6,
    gradient: "from-fuchsia-600 via-violet-700 to-indigo-950",
  },
  {
    id: "4",
    title: "Bioluminescent Abyssal Creature",
    category: "fantasy",
    model: "Google Imagen 3",
    prompt: "An ethereal glowing deep-sea dragon swimming through dark abyssal trenches, radiant blue and gold bioluminescence, hyperdetailed scales, national geographic style",
    aspect: "16:9",
    credits: 8,
    gradient: "from-teal-600 via-emerald-800 to-slate-950",
  },
  {
    id: "5",
    title: "Isometric Solarpunk City",
    category: "3d_art",
    model: "FLUX.1 Schnell",
    prompt: "3D render of an isometric solarpunk architectural habitat, lush rooftop vertical gardens, sleek floating transit rails, clay render aesthetic, soft ambient occlusion",
    aspect: "1:1",
    credits: 6,
    gradient: "from-emerald-600 via-cyan-700 to-slate-900",
  },
  {
    id: "6",
    title: "Cinematic Desert Nomad",
    category: "cinematic",
    model: "Google Imagen 3",
    prompt: "Cinematic portrait of a nomadic desert wanderer in gilded brass goggles and flowing sand-blown scarves at twilight, dramatic rim light, dust motes, Arri Alexa 65",
    aspect: "16:9",
    credits: 8,
    gradient: "from-orange-600 via-rose-800 to-indigo-950",
  },
];

export default function ShowcaseGallery() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredItems = SHOWCASE_ITEMS.filter((item) =>
    activeFilter === "all" ? true : item.category === activeFilter
  );

  const handleCopyPrompt = (id: string, promptText: string) => {
    navigator.clipboard.writeText(promptText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {[
          { id: "all", label: "All Creations" },
          { id: "cinematic", label: "Cinematic" },
          { id: "photorealistic", label: "Photorealistic" },
          { id: "anime", label: "Anime / Concept" },
          { id: "3d_art", label: "3D Digital Art" },
          { id: "fantasy", label: "Dark Fantasy" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeFilter === tab.id
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Masonry-Style Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all overflow-hidden flex flex-col justify-between"
          >
            {/* Visual Canvas Card */}
            <div
              className={`h-56 sm:h-64 bg-gradient-to-br ${item.gradient} p-6 flex flex-col justify-between relative overflow-hidden text-white`}
            >
              <div className="flex items-center justify-between z-10">
                <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[11px] font-bold text-white border border-white/20">
                  {item.model}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold text-white">
                  {item.aspect} &bull; 💎 {item.credits} cr
                </span>
              </div>

              {/* Title & Sparkle */}
              <div className="z-10">
                <h4 className="font-extrabold text-xl tracking-tight text-white drop-shadow">
                  {item.title}
                </h4>
              </div>

              {/* Decorative Subtle Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 pointer-events-none" />
            </div>

            {/* Prompt & Quick Action Controls */}
            <div className="p-5 space-y-4">
              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Exact Generation Prompt:
                </div>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed italic font-medium">
                  "{item.prompt}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleCopyPrompt(item.id, item.prompt)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Prompt</span>
                    </>
                  )}
                </button>

                <Link
                  href="/studio"
                  className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Remix in Studio</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

