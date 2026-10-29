"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Layers, Zap, Clock, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  task: string;
  speed: string;
  creditCost: number;
  bestFor: string;
  license: string;
  highlight: boolean;
}

const MODELS_CATALOG: ModelInfo[] = [
  {
    id: "imagen-3",
    name: "Google Imagen 3",
    provider: "Google Cloud Vertex AI",
    task: "Text-to-Image",
    speed: "2.8s",
    creditCost: 8,
    bestFor: "Photorealism, crisp typography, cinematic lighting & intricate textures",
    license: "Commercial Cloud API",
    highlight: true,
  },
  {
    id: "flux-1-schnell",
    name: "FLUX.1 Schnell",
    provider: "Black Forest Labs",
    task: "Text-to-Image",
    speed: "1.2s",
    creditCost: 6,
    bestFor: "Ultra-fast concept iteration, character anatomy, diverse aesthetics",
    license: "Apache 2.0 (Open-Weight)",
    highlight: false,
  },
  {
    id: "flux-1-dev",
    name: "FLUX.1 Dev",
    provider: "Black Forest Labs",
    task: "Text-to-Image",
    speed: "4.5s",
    creditCost: 10,
    bestFor: "Artistic perfection, complex prompt adherence, high dynamic range",
    license: "Non-Commercial / Pro Studio",
    highlight: false,
  },
  {
    id: "veo-2",
    name: "Google Veo 2",
    provider: "Google Cloud",
    task: "Text-to-Video",
    speed: "28s",
    creditCost: 80,
    bestFor: "Cinematic camera pans, high frame stability, 1080p motion physics",
    license: "Commercial Cloud API",
    highlight: false,
  },
  {
    id: "gemini-2-flash",
    name: "Google Gemini 2.0 Flash",
    provider: "Google Cloud",
    task: "Prompt Expansion & Scripts",
    speed: "0.4s",
    creditCost: 1,
    bestFor: "Instant prompt enhancement, cinematic screenplays, creative dialogue",
    license: "Commercial Cloud API",
    highlight: false,
  },
  {
    id: "kokoro-tts",
    name: "Kokoro TTS",
    provider: "Open-Source AI",
    task: "Text-to-Speech",
    speed: "0.8s",
    creditCost: 2,
    bestFor: "Natural human inflection, conversational dialogue, audiobooks",
    license: "Apache 2.0 (Open-Weight)",
    highlight: false,
  },
  {
    id: "real-esrgan",
    name: "Real-ESRGAN 4x+",
    provider: "Open-Source AI",
    task: "AI Upscaling",
    speed: "1.9s",
    creditCost: 4,
    bestFor: "Restoring low-res images, texture sharpening, 4K print export",
    license: "BSD-3-Clause",
    highlight: false,
  },
];

export default function ModelMatrix() {
  const [filter, setFilter] = useState<string>("all");

  const filteredModels = MODELS_CATALOG.filter((m) => {
    if (filter === "image") return m.task.includes("Image");
    if (filter === "video") return m.task.includes("Video");
    if (filter === "audio_text") return m.task.includes("Speech") || m.task.includes("Prompt");
    return true;
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/90 shadow-luxury space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Real Inference Catalog
          </span>
          <h3 className="text-2xl font-bold text-neutral-950 mt-2 font-editorial text-3xl">
            Unified Multi-Model Capability Matrix
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            Compare latency, credit costs, and verified commercial licenses across every deployed engine.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-2xl self-start sm:self-center">
          {[
            { id: "all", label: "All Models" },
            { id: "image", label: "Image" },
            { id: "video", label: "Video" },
            { id: "audio_text", label: "Audio & Text" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filter === tab.id
                  ? "bg-white text-neutral-950 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-950"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="pb-3 px-3">Model Name</th>
              <th className="pb-3 px-3">Provider</th>
              <th className="pb-3 px-3">Primary Task</th>
              <th className="pb-3 px-3">Avg Latency</th>
              <th className="pb-3 px-3">Credit Cost</th>
              <th className="pb-3 px-3">Best Recommended For</th>
              <th className="pb-3 px-3">Commercial License</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 text-neutral-700">
            {filteredModels.map((m) => (
              <tr key={m.id} className="hover:bg-neutral-50/80 transition-colors">
                <td className="py-4 px-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-950 text-sm">{m.name}</span>
                    {m.highlight && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        Top Pick
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-3 text-neutral-500 font-medium">{m.provider}</td>
                <td className="py-4 px-3 font-semibold text-neutral-800">{m.task}</td>
                <td className="py-4 px-3 font-mono font-medium text-blue-600 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-neutral-400" />
                  <span>{m.speed}</span>
                </td>
                <td className="py-4 px-3 font-bold text-neutral-950">
                  <span className="px-2 py-1 rounded-md bg-neutral-100 text-neutral-900 font-bold">
                    {m.creditCost} cr
                  </span>
                </td>
                <td className="py-4 px-3 text-neutral-600 max-w-xs leading-snug">{m.bestFor}</td>
                <td className="py-4 px-3">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {m.license}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Every generation is protected by Two-Phase Escrow billing</span>
        </div>
        <Link
          href="/studio"
          className="text-xs font-bold text-neutral-950 hover:underline flex items-center gap-1"
        >
          <span>Try All Models in Studio Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
