"use client";

import React from "react";
import { Video, Film } from "lucide-react";

export default function VideoStudioPage() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Video className="w-5 h-5" />
          </span>
          Video Generation Studio (Google Veo & Wan 2.1)
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          High-definition AI video generation with camera motion and temporal consistency.
        </p>
      </div>

      <div className="bg-white p-14 rounded-3xl border border-slate-200 text-center max-w-xl mx-auto space-y-4 my-8 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-600">
          <Film className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Scheduled for Phase 6</h2>
        <p className="text-xs text-slate-500 leading-relaxed font-medium">
          The video pipeline architecture, duration estimators, and queue models are defined. We will implement the full Veo & Wan video pipeline in Phase 6 after our Image Studio (Phase 3) is verified!
        </p>
      </div>
    </div>
  );
}
