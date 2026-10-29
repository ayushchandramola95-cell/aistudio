"use client";

import React from "react";
import { Wand2, ImageUp } from "lucide-react";

export default function EnhancePage() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Wand2 className="w-5 h-5" />
          </span>
          AI Image Enhancement & Upscaling
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          4x Ultra-HD upscaling (Real-ESRGAN) and automatic background removal (BiRefNet).
        </p>
      </div>

      <div className="bg-white p-14 rounded-3xl border border-slate-200 text-center max-w-xl mx-auto space-y-4 my-8 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
          <ImageUp className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Scheduled for Phase 3 Extension</h2>
        <p className="text-xs text-slate-500 leading-relaxed font-medium">
          One-click upscaling and background removal will be integrated directly on every generated image card in Phase 3!
        </p>
      </div>
    </div>
  );
}
