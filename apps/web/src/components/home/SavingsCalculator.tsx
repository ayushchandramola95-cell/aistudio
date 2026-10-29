"use client";

import React, { useState } from "react";
import { Calculator, Check, ArrowRight, Zap, Coins } from "lucide-react";

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
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl shadow-slate-200/50 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Transparent Credit Math
          </span>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
            Calculate Your Savings vs. Fragmented Subscriptions
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            See why creators are ditching multiple $20–$35/month recurring subscriptions.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center sm:text-right">
          <div className="text-xs font-bold text-emerald-700">Estimated Monthly Savings</div>
          <div className="text-3xl font-extrabold text-emerald-600">${monthlySavings} / mo</div>
          <div className="text-[11px] text-emerald-700 font-semibold">(${yearlySavings.toLocaleString()}/year saved)</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Sliders Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Images Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>AI Images (Google Imagen 3 & FLUX.1)</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                {images} images ({imageCredits} credits)
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={300}
              step={10}
              value={images}
              onChange={(e) => setImages(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Videos Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>AI Video Clips (Google Veo 2 & Wan)</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-100">
                {videos} videos ({videoCredits} credits)
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={30}
              step={1}
              value={videos}
              onChange={(e) => setVideos(Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
          </div>

          {/* Voiceovers Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Voiceover Clips (Kokoro TTS)</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-100">
                {voiceovers} voice clips ({voiceCredits} credits)
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={voiceovers}
              onChange={(e) => setVoiceovers(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Zero Expiration Guarantee</span>
            </div>
            <p>
              Unlike subscription tools where unused monthly allowances vanish every 30 days, your AI Studio credits never expire.
            </p>
          </div>
        </div>

        {/* Cost Comparison Breakdown Column */}
        <div className="lg:col-span-5 bg-slate-50/80 rounded-2xl p-6 border border-slate-200 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200/80">
              <span className="font-semibold text-slate-500">Traditional 4 Subscriptions</span>
              <span className="font-bold text-rose-600 text-sm line-through">${traditionalCost}/mo</span>
            </div>

            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200/80">
              <span className="font-bold text-indigo-950">AI Studio Credit Cost</span>
              <span className="font-extrabold text-indigo-600 text-lg">~${studioCost} one-time</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Total Credits Needed</span>
              <span className="font-extrabold text-slate-900 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-indigo-600" />
                <span>{totalCredits.toLocaleString()} Credits</span>
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-500 text-white text-center font-extrabold text-sm shadow-md shadow-emerald-500/20">
            {savingsPercent}% Lower Operating Cost
          </div>

          <p className="text-[11px] text-slate-500 text-center leading-relaxed">
            *Based on standard $30/mo Midjourney, $35/mo Runway, $22/mo ElevenLabs, and $20/mo ChatGPT subscriptions.
          </p>
        </div>
      </div>
    </div>
  );
}

