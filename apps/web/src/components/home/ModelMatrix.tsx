"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Clock, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

interface VertexModelInfo {
  id: string;
  name: string;
  engine: string;
  features: string[];
  bestUseCases: string;
  promptLimit: string;
  watermarking: string;
  creditCost: number;
  highlight: boolean;
}

const VERTEX_MODELS: VertexModelInfo[] = [
  {
    id: "nano-banana-2-1",
    name: "Nano Banana 2.1",
    engine: "Gemini 3.1 Flash Image (Upgraded)",
    features: [
      "Stronger prompt adherence",
      "Multi-reference consistency",
      "Production quality generation & edits from 1K to 4K",
    ],
    bestUseCases: "Flagship Creative Suite: High-resolution 1K to 4K generation, storytelling consistency, and premium commercial assets.",
    promptLimit: "1K to 4K Native Resolution",
    watermarking: "Yes (Built-in)",
    creditCost: 6,
    highlight: true,
  },
  {
    id: "nano-banana-2-lite",
    name: "Nano Banana 2 Lite",
    engine: "Gemini 2.5 Flash Image",
    features: [
      "Class leading image generation",
      "Optimized for high-volume creation",
      "Latency-sensitive asset production",
    ],
    bestUseCases: "High-Volume Real-Time Apps: Fast drafting, social variations, and real-time generation interfaces.",
    promptLimit: "Optimized for Low Latency",
    watermarking: "Yes (Built-in)",
    creditCost: 3,
    highlight: false,
  },
  {
    id: "nano-banana-pro",
    name: "Nano Banana Pro",
    engine: "Gemini 3 Pro Image",
    features: [
      "Complex prompt reasoning",
      "Multilingual text rendering",
      "Deep world knowledge integration",
    ],
    bestUseCases: "Studio & Marketing Production: Graphic design, infographics, advertising with multilingual typography and camera lighting control.",
    promptLimit: "~1,000+ words",
    watermarking: "Yes (Built-in)",
    creditCost: 10,
    highlight: false,
  },
  {
    id: "nano-banana-2",
    name: "Nano Banana 2",
    engine: "gemini-3.1-flash-image",
    features: [
      "General image generation and editing tasks",
      "High visual quality",
      "Low latency response",
    ],
    bestUseCases: "Interactive Storytelling: Character consistency across panels, comic design, and real-time grounded scenes.",
    promptLimit: "High Quality & Low Latency",
    watermarking: "Yes (Built-in)",
    creditCost: 5,
    highlight: false,
  },
  {
    id: "nano-banana",
    name: "Nano Banana",
    engine: "gemini-2.5-flash-image",
    features: [
      "State-of-the-art image generation",
      "Advanced multimodal image editing",
      "Direct Google Cloud integration",
    ],
    bestUseCases: "General Purpose Creative Generation: High photorealism, artistic portraits, and multimodal instruction following.",
    promptLimit: "Multimodal Native",
    watermarking: "Yes (Built-in)",
    creditCost: 4,
    highlight: false,
  },
  {
    id: "imagen-4-fast",
    name: "Imagen 4 Fast",
    engine: "Imagen 4 Fast",
    features: [
      "Next-generation Imagen architecture",
      "Fast text prompt execution",
      "Sub-second composition drafting",
    ],
    bestUseCases: "Instant Visual Exploration: Rapid text-to-image concepting and real-time idea drafting.",
    promptLimit: "Fast Text Prompts",
    watermarking: "Yes (Built-in)",
    creditCost: 4,
    highlight: false,
  },
  {
    id: "virtual-try-on",
    name: "Virtual try-on",
    engine: "Google Virtual Try-On",
    features: [
      "Specialized apparel simulation",
      "Accurate fabric drape & lighting",
      "Photorealistic clothing fit",
    ],
    bestUseCases: "E-Commerce & Fashion: Render clothes and garments directly onto custom models and subjects.",
    promptLimit: "Clothing & Garment Inputs",
    watermarking: "Yes (Built-in)",
    creditCost: 8,
    highlight: false,
  },
  {
    id: "imagen-3-capability-001",
    name: "Imagen 3 Capability 001",
    engine: "Imagen 3 Capability 001",
    features: [
      "Fast localized image editing",
      "Precision region inpainting",
      "Background replacement",
    ],
    bestUseCases: "Interactive Photo Editing: Inpainting, object replacement, and generative fill corrections.",
    promptLimit: "Image Masking & Inpainting",
    watermarking: "Yes (Built-in)",
    creditCost: 5,
    highlight: false,
  },
];

export default function ModelMatrix() {
  const [filter, setFilter] = useState<string>("all");

  const filteredModels = VERTEX_MODELS.filter((m) => {
    if (filter === "nano") return m.id.startsWith("nano");
    if (filter === "imagen") return m.id.startsWith("imagen");
    if (filter === "specialized") return m.id === "virtual-try-on";
    return true;
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/90 shadow-luxury space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Google Cloud Vertex AI Official Catalog
          </span>
          <h3 className="text-2xl font-bold text-neutral-950 mt-2 font-editorial text-3xl">
            Google Image Generation & Editing Models
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            Complete suite of Google's official image models, from Nano Banana 2.1 to Virtual Try-On and Imagen 4 Fast.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-2xl self-start sm:self-center flex-wrap">
          {[
            { id: "all", label: `All Models (${VERTEX_MODELS.length})` },
            { id: "nano", label: "Nano Banana Series" },
            { id: "imagen", label: "Imagen Series" },
            { id: "specialized", label: "Specialized" },
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
            <tr className="border-b border-neutral-200 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="pb-3 px-3 min-w-[170px]">Model Name</th>
              <th className="pb-3 px-3 min-w-[190px]">Underlying Engine</th>
              <th className="pb-3 px-3 min-w-[260px]">Key Features</th>
              <th className="pb-3 px-3 min-w-[280px]">Best Use Cases / "How it Works"</th>
              <th className="pb-3 px-3 min-w-[170px]">Capability / Limit</th>
              <th className="pb-3 px-3 min-w-[130px]">Watermark</th>
              <th className="pb-3 px-3 min-w-[80px]">Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 text-neutral-700">
            {filteredModels.map((m) => (
              <tr key={m.id} className="hover:bg-neutral-50/80 transition-colors">
                {/* Model Name */}
                <td className="py-4 px-3 align-top">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-950 text-sm">{m.name}</span>
                    {m.highlight && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        Featured
                      </span>
                    )}
                  </div>
                </td>

                {/* Underlying Engine */}
                <td className="py-4 px-3 align-top font-mono font-semibold text-neutral-800">
                  <span className="px-2 py-1 rounded-md bg-neutral-100 border border-neutral-200/60 text-xs inline-block">
                    {m.engine}
                  </span>
                </td>

                {/* Key Features */}
                <td className="py-4 px-3 align-top">
                  <ul className="space-y-1 text-neutral-600 leading-snug">
                    {m.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-1.5">
                        <span className="text-neutral-400">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </td>

                {/* Best Use Cases */}
                <td className="py-4 px-3 align-top text-neutral-600 leading-snug">
                  {m.bestUseCases}
                </td>

                {/* Max Prompt Length / Limit */}
                <td className="py-4 px-3 align-top text-neutral-600 leading-snug">
                  {m.promptLimit}
                </td>

                {/* Watermarking */}
                <td className="py-4 px-3 align-top">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{m.watermarking}</span>
                  </span>
                </td>

                {/* Credit Cost */}
                <td className="py-4 px-3 align-top font-bold text-neutral-950">
                  <span className="px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-900 font-bold text-xs inline-block">
                    {m.creditCost} cr
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
          <span>Every model powered by your Google Cloud Vertex AI infrastructure & trial credits</span>
        </div>
        <Link
          href="/studio"
          className="text-xs font-bold text-neutral-950 hover:underline flex items-center gap-1"
        >
          <span>Open Creative Studio</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
