"use client";

import React from "react";
import { FileText, Bot } from "lucide-react";

export default function TextStudioPage() {
  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-studio-800">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-accent-purple/20 text-accent-purple">
            <FileText className="w-5 h-5" />
          </span>
          Text & Writing Studio (Gemini 2.0 Flash)
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Creative writing, cinematic prompt expansion, video scripts, and story outlines.
        </p>
      </div>

      <div className="glass-panel p-12 rounded-2xl border-studio-800 text-center max-w-xl mx-auto space-y-4 my-8">
        <div className="w-16 h-16 rounded-2xl bg-studio-950 border border-studio-800 flex items-center justify-center mx-auto text-accent-amber">
          <Bot className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-white">Scheduled for Phase 4 & 7</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Gemini 2.0 Flash is ready in the registry. It will power our real prompt expansion in Phase 4 and the full scriptwriting studio in Phase 7!
        </p>
      </div>
    </div>
  );
}
