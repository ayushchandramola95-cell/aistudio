"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Layers, Zap, Clock, ShieldCheck, ArrowRight } from "lucide-react";

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
    bestFor: "Photorealism, crisp typography, cinematic textures",
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
    bestFor: "Rapid concept iteration, anatomy, diverse aesthetics",
    license: "Apache 2.0 (Open-Weight)",
    highlight: false,
  },
  {
    id: "gemini-2-flash",
    name: "Google Gemini 2.0 Flash",
    provider: "Google Cloud",
    task: "Prompt Expansion & Text",
    speed: "0.4s",
    creditCost: 1,
    bestFor: "Instant prompt enhancement, cinematic scripts, character dialogue",
    license: "Commercial Cloud API",
    highlight: false,
  },
  {
    id: "veo-2",
    name: "Google Veo 2",
    provider: "Google Cloud",
    task: "Text-to-Video",
    speed: "28s",
    creditCost: 80,
    bestFor: "Cinematic camera pans, high frame stability, 1080p motion",
    license: "Commercial Cloud API",
    highlight: false,
  },
  {
    id: "kokoro-tts",
    name: "Kokoro TTS",
    provider: "Open-Source Community",
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
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl shadow-slate-200/50 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Open Registry
          </span>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
            Multi-Model Capability & Speed Matrix
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Compare latency, credit pricing, and ideal use cases across our verified models.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          {[
            { id: "all", label: "All Models" },
            { id: "image", label: "Images" },
            { id: "video", label: "Video" },
            { id: "audio_text", label: "Speech & Text" },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === btn.id
                  ? "bg-white text-slate-900 shadow-sm font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredModels.map((m) => (
          <div
            key={m.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              m.highlight
                ? "bg-indigo-50/40 border-indigo-300 ring-2 ring-indigo-500/10 shadow-md"
                : "bg-slate-50/50 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-slate-900">{m.name}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-indigo-700 border border-indigo-200 shadow-sm">
                  💎 {m.creditCost} Credits
                </span>
              </div>

              <div className="text-[11px] font-semibold text-slate-500">{m.provider}</div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                <strong>Best For:</strong> {m.bestFor}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-bold text-slate-700">{m.speed}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{m.license}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

