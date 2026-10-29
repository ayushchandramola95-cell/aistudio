"use client";

import React from "react";
import { FileText, Bot } from "lucide-react";

export default function TextStudioPage() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <FileText className="w-5 h-5" />
          </span>
          Text & Writing Studio (Gemini 2.0 Flash)
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Creative writing, cinematic prompt expansion, video scripts, and story outlines.
        </p>
      </div>

      <div className="bg-white p-14 rounded-3xl border border-slate-200 text-center max-w-xl mx-auto space-y-4 my-8 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto text-amber-600">
          <Bot className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Scheduled for Phase 4 & 7</h2>
        <p className="text-xs text-slate-500 leading-relaxed font-medium">
          Gemini 2.0 Flash is ready in the registry. It will power our real prompt expansion in Phase 4 and the full scriptwriting studio in Phase 7!
        </p>
      </div>
    </div>
  );
}
