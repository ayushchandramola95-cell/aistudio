"use client";

import React from "react";
import { Mic, Volume2 } from "lucide-react";

export default function AudioStudioPage() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Mic className="w-5 h-5" />
          </span>
          Audio & Speech Studio (Kokoro TTS & Whisper)
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Lifelike voice generation and fast timestamped speech-to-text transcription.
        </p>
      </div>

      <div className="bg-white p-14 rounded-3xl border border-slate-200 text-center max-w-xl mx-auto space-y-4 my-8 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center mx-auto text-teal-600">
          <Volume2 className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Scheduled for Phase 7</h2>
        <p className="text-xs text-slate-500 leading-relaxed font-medium">
          The models for Kokoro and Faster-Whisper are seeded in the database. Voice synthesis and transcription interfaces will be fully connected in Phase 7!
        </p>
      </div>
    </div>
  );
}
