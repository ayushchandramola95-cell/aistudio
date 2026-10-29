"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Copy, Check, Wand2, Maximize2, ExternalLink } from "lucide-react";

interface ShowcaseItem {
  id: string;
  title: string;
  category: "photorealistic" | "cinematic" | "anime" | "3d_art" | "architecture";
  model: string;
  prompt: string;
  aspect: string;
  credits: number;
  imageUrl: string;
}

const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: "1",
    title: "Kyoto Cyberpunk Shrine",
    category: "cinematic",
    model: "Google Imagen 3",
    prompt: "An ancient Kyoto torii gate illuminated by neon holographic glyphs in heavy rain, cinematic lighting, 8k resolution, photorealistic reflections on wet stone pavement, anamorphic bokeh",
    aspect: "16:9",
    credits: 8,
    imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Studio Ceramic & Kintsugi Gold",
    category: "photorealistic",
    model: "FLUX.1 Schnell",
    prompt: "Minimalist ceramic Japanese teapot with crackled kintsugi gold lacquer on weathered oak table, natural diffused morning window light, 50mm f/1.4 lens depth of field, architectural digest",
    aspect: "1:1",
    credits: 6,
    imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Celestial Mech Pilot",
    category: "anime",
    model: "FLUX.1 Dev",
    prompt: "Anime concept art of a futuristic mecha pilot in glowing armor looking out into deep nebula space from hangar bay, Makoto Shinkai style, vibrant colors, cinematic composition",
    aspect: "9:16",
    credits: 10,
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "Bioluminescent Abyssal Creature",
    category: "3d_art",
    model: "Google Imagen 3",
    prompt: "An ethereal glowing deep-sea dragon swimming through dark abyssal trenches, radiant blue and gold bioluminescence, hyperdetailed scales, national geographic undersea photography",
    aspect: "16:9",
    credits: 8,
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "5",
    title: "Brutalist Concrete Villa",
    category: "architecture",
    model: "FLUX.1 Dev",
    prompt: "Modern brutalist concrete architectural villa built over a serene alpine lake, floor-to-ceiling glass, sunset golden hour reflections, warm ambient interior lighting, ultra-realistic",
    aspect: "16:9",
    credits: 10,
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "6",
    title: "Nordic Watchmaker Portrait",
    category: "photorealistic",
    model: "Google Imagen 3",
    prompt: "Studio portrait of an elderly watchmaker with intricate silver spectacles examining an antique pocket watch, soft dramatic side lighting, Hasselblad H6D-100c medium format clarity",
    aspect: "1:1",
    credits: 8,
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop",
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
          { id: "architecture", label: "Architecture" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all btn-tactile cursor-pointer ${
              activeFilter === tab.id
                ? "bg-neutral-950 text-white shadow-sm"
                : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50 hover:text-neutral-950"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* High-Resolution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-3xl border border-neutral-200/90 shadow-luxury hover:shadow-luxury-hover hover:border-neutral-950 transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            {/* Real Photography Viewport */}
            <div className="h-64 overflow-hidden relative">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Badges on Image */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                <span className="px-3 py-1 rounded-full bg-neutral-950/75 backdrop-blur-md text-[11px] font-bold text-white border border-white/10">
                  {item.model}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-neutral-950/75 backdrop-blur-md text-[11px] font-bold text-white border border-white/10">
                  {item.aspect} &bull; {item.credits} cr
                </span>
              </div>

              {/* Hover Quick Actions */}
              <div className="absolute inset-0 bg-neutral-950/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <Link
                  href="/studio"
                  className="px-4 py-2 rounded-xl bg-white text-neutral-950 text-xs font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-1.5"
                >
                  <Wand2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Remix in Studio</span>
                </Link>
                <button
                  onClick={() => handleCopyPrompt(item.id, item.prompt)}
                  className="px-3 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
                >
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === item.id ? "Copied" : "Prompt"}</span>
                </button>
              </div>
            </div>

            {/* Info Container */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-base text-neutral-950 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed mt-1 font-medium">
                  {item.prompt}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
                <span className="capitalize">{item.category}</span>
                <span className="text-emerald-600 font-bold">100% Guaranteed Output</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
