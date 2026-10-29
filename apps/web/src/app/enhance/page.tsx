"use client";

import React from "react";
import { Wand2, ImageUp } from "lucide-react";

export default function EnhancePage() {
  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-studio-800">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-accent-purple/20 text-accent-purple">
            <Wand2 className="w-5 h-5" />
          </span>
          AI Image Enhancement & Upscaling
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          4x Ultra-HD upscaling (Real-ESRGAN) and automatic background removal (BiRefNet).
        </p>
      </div>

      <div className="glass-panel p-12 rounded-2xl border-studio-800 text-center max-w-xl mx-auto space-y-4 my-8">
        <div className="w-16 h-16 rounded-2xl bg-studio-950 border border-studio-800 flex items-center justify-center mx-auto text-emerald-400">
          <ImageUp className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-white">Scheduled for Phase 3 Extension</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          One-click upscaling and background removal will be integrated directly on every generated image card in Phase 3!
        </p>
      </div>
    </div>
  );
}
