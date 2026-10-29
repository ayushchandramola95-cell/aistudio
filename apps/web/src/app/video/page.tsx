"use client";

import React from "react";
import { Video, Sparkles, Clock, Film } from "lucide-react";

export default function VideoStudioPage() {
  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-studio-800">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-accent-purple/20 text-accent-purple">
            <Video className="w-5 h-5" />
          </span>
          Video Generation Studio (Google Veo & Wan 2.1)
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          High-definition AI video generation with camera motion and duration control.
        </p>
      </div>

      <div className="glass-panel p-12 rounded-2xl border-studio-800 text-center max-w-xl mx-auto space-y-4 my-8">
        <div className="w-16 h-16 rounded-2xl bg-studio-950 border border-studio-800 flex items-center justify-center mx-auto text-accent-indigo">
          <Film className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-white">Scheduled for Phase 6</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          The video pipeline architecture, duration estimators, and queue models are defined. We will implement the full Veo & Wan video pipeline in Phase 6 after our Image Studio (Phase 3) is verified!
        </p>
      </div>
    </div>
  );
}
