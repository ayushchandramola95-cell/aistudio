"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Calculator, Check, ArrowRight, Zap, Coins, TrendingDown } from "lucide-react";

export default function SavingsCalculator() {
  const [images, setImages] = useState(60);
  const [videos, setVideos] = useState(8);
  const [voiceovers, setVoiceovers] = useState(25);

  // Credit calculation
  const imageCredits = images * 8;
  const videoCredits = videos * 80;
  const voiceCredits = voiceovers * 2;
  const totalCredits = imageCredits + videoCredits + voiceCredits;

  // Approximate cost at $0.008 per credit package equivalent
  const studioCost = Math.max(5, Math.round(totalCredits * 0.008));

  // Traditional fragmented monthly subscription cost:
  // Midjourney ($30) + Runway ($35) + ElevenLabs ($22) + ChatGPT ($20) = $107/mo
  const traditionalCost = 107;
  const monthlySavings = Math.max(0, traditionalCost - studioCost);
  const yearlySavings = monthlySavings * 12;
  const savingsPercent = Math.round((monthlySavings / traditionalCost) * 100);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/90 shadow-luxury space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Pay-As-You-Go Economics
          </span>
          <h3 className="text-2xl font-bold text-neutral-950 mt-2 font-editorial text-3xl">
            Calculate Your Savings vs. Multiple Subscriptions
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            See how much you save by paying only for what you generate instead of 4 separate monthly retainers.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-center sm:text-right shrink-0">
          <div className="text-xs font-bold text-emerald-800 flex items-center gap-1 justify-center sm:justify-end">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
            <span>Estimated Savings</span>
          </div>
          <div className="text-3xl font-extrabold text-emerald-700 mt-0.5">${monthlySavings} / mo</div>
          <div className="text-[11px] text-emerald-800 font-semibold mt-0.5">
            ${yearlySavings.toLocaleString()} saved per year ({savingsPercent}%)
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Sliders Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Images Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-neutral-800">
              <span>AI Images (Google Imagen 3 & FLUX.1)</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-neutral-100 text-neutral-900 border border-neutral-200 font-mono">
                {images} images &bull; {imageCredits} cr
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={300}
              step={10}
              value={images}
              onChange={(e) => setImages(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
          </div>

          {/* Videos Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-neutral-800">
              <span>AI Video Clips (Google Veo 2 & Wan)</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-neutral-100 text-neutral-900 border border-neutral-200 font-mono">
                {videos} videos &bull; {videoCredits} cr
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={30}
              step={1}
              value={videos}
              onChange={(e) => setVideos(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
          </div>

          {/* Voiceovers Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-neutral-800">
              <span>Voiceover Clips (Kokoro TTS)</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-neutral-100 text-neutral-900 border border-neutral-200 font-mono">
                {voiceovers} voice clips &bull; {voiceCredits} cr
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={voiceovers}
              onChange={(e) => setVoiceovers(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
          </div>
        </div>

        {/* Cost Comparison Visual Card */}
        <div className="lg:col-span-5 bg-neutral-50 rounded-2xl p-6 border border-neutral-200 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Cost Breakdown
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-neutral-200">
              <div>
                <div className="text-xs font-bold text-neutral-950">Multiple Subscriptions</div>
                <div className="text-[10px] text-neutral-500">Midjourney + Runway + ElevenLabs</div>
              </div>
              <div className="text-sm font-bold text-rose-600 line-through">${traditionalCost} / mo</div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-950 text-white shadow-sm">
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>AI Studio Credit Model</span>
                  <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.2 rounded font-bold">Pay-Per-Job</span>
                </div>
                <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                  {totalCredits.toLocaleString()} Total Credits Consumed
                </div>
              </div>
              <div className="text-base font-extrabold text-emerald-400">~${studioCost} / mo</div>
            </div>
          </div>

          <Link
            href="/studio"
            className="w-full py-3 rounded-xl font-bold text-xs bg-neutral-950 hover:bg-neutral-800 text-white shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span>Start with 100 Free Credits</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
