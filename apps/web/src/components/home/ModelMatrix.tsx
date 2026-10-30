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
    id: "nano-banana-2",
    name: "Nano Banana 2",
    engine: "Gemini 3.1 Flash Image",
    features: [
      "Multi-character consistency (up to 5 characters & 14 objects)",
      "Real-time Web Search grounding",
      "Exceptional text-in-image rendering",
    ],
    bestUseCases:
      "Interactive & Storytelling Apps: Ideal for generating storyboards, custom comic books, or mockups where characters must remain identical across multiple scenes. Uses real-time search to match current events/niche real-world objects.",
    promptLimit: "~1,000+ words (Uses Gemini's large context to process long, highly descriptive scenes & character profiles).",
    watermarking: "Yes (Built-in)",
    creditCost: 5,
    highlight: true,
  },
  {
    id: "nano-banana-pro",
    name: "Nano Banana Pro",
    engine: "Gemini 3 Pro Image",
    features: [
      "Complex prompt reasoning",
      "Professional-grade visual quality",
      "Advanced editing (inpainting & outpainting)",
    ],
    bestUseCases:
      "Studio & Marketing Production: High-end graphic design, complex infographics, educational diagrams, and promotional materials that require precise, stylized rendering and custom editing (adjusting lighting, camera angles, color grading).",
    promptLimit: "~1,000+ words (Excellent for complex prompt chains and reference image inputs).",
    watermarking: "Yes (Built-in)",
    creditCost: 10,
    highlight: false,
  },
  {
    id: "imagen-3",
    name: "Imagen 3",
    engine: "imagen-3.0-generate-002",
    features: [
      "Exceptional photorealism",
      "High prompt adherence",
      "Crisp, legible text rendering",
    ],
    bestUseCases:
      "General Photorealism & High-Quality Design: Best for creating beautiful, realistic artwork, professional product shots, and high-fidelity text-heavy images.",
    promptLimit: "~250 - 500 words (Optimized for concise but highly descriptive text prompts).",
    watermarking: "Yes (Built-in)",
    creditCost: 8,
    highlight: false,
  },
  {
    id: "imagen-2",
    name: "Imagen 2",
    engine: "imagegeneration@006",
    features: [
      "Reliable baseline text-to-image",
      "Image expansion (outpainting)",
      "Subject editing (inpainting)",
    ],
    bestUseCases:
      "Legacy Applications & High-Volume Tasks: Great for cost-effective standard generation, bulk image assets, and standard image editing tasks like placing product mockups in different environments.",
    promptLimit: "~250 words",
    watermarking: "Yes (Built-in)",
    creditCost: 4,
    highlight: false,
  },
];

export default function ModelMatrix() {
  const [filter, setFilter] = useState<string>("all");

  const filteredModels = VERTEX_MODELS.filter((m) => {
    if (filter === "nano") return m.id.startsWith("nano");
    if (filter === "imagen") return m.id.startsWith("imagen");
    return true;
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/90 shadow-luxury space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Google Cloud Vertex AI
          </span>
          <h3 className="text-2xl font-bold text-neutral-950 mt-2 font-editorial text-3xl">
            Google Cloud Vertex AI Image Generation Models
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            Production generative engines powered by your Google Cloud Vertex AI infrastructure and $200 free trial credits.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-2xl self-start sm:self-center">
          {[
            { id: "all", label: `All Models (${VERTEX_MODELS.length})` },
            { id: "nano", label: "Nano Banana Series" },
            { id: "imagen", label: "Imagen Series" },
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
              <th className="pb-3 px-3 min-w-[150px]">Model Name</th>
              <th className="pb-3 px-3 min-w-[170px]">Underlying Engine</th>
              <th className="pb-3 px-3 min-w-[260px]">Key Features</th>
              <th className="pb-3 px-3 min-w-[280px]">Best Use Cases / "How it Works"</th>
              <th className="pb-3 px-3 min-w-[180px]">Max Prompt Length / Limit</th>
              <th className="pb-3 px-3 min-w-[140px]">Watermarking (SynthID)</th>
              <th className="pb-3 px-3 min-w-[90px]">Credit Cost</th>
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
                  <span className="px-2 py-1 rounded-md bg-neutral-100 border border-neutral-200/60 text-xs">
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

                {/* Max Prompt Length */}
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
          <span>Every generation is backed by Google Cloud Vertex AI & Two-Phase Escrow</span>
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
