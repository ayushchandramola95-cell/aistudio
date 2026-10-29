"use client";

import React, { useState, useRef, useCallback } from "react";
import { Sparkles, MoveHorizontal } from "lucide-react";

export default function BeforeAfterSlider() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percent);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl shadow-slate-200/50 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
            Real-ESRGAN & BiRefNet Engine
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-1">
            Interactive 4x AI Upscale & Restoration
          </h3>
        </div>
        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
          <MoveHorizontal className="w-4 h-4 text-indigo-600" />
          <span>Drag slider to compare clarity</span>
        </span>
      </div>

      {/* Slider Stage */}
      <div
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative h-72 sm:h-96 rounded-2xl overflow-hidden cursor-ew-resize select-none border border-slate-200 shadow-inner"
      >
        {/* "After" (Upscaled / Restored) Canvas - Full Width Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-950 flex flex-col items-center justify-center p-8 text-center text-white">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-indigo-500/40 mb-4 animate-pulse">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <div className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white via-indigo-100 to-purple-200 bg-clip-text text-transparent">
            4K Ultra-HD Rendered Asset
          </div>
          <p className="text-xs text-indigo-200 max-w-sm mt-1">
            Intricate hair strands, crisp fabric weave, micro-textures, and zero compression noise.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            <span>3840 x 2160 Resolution &bull; 4 Credits</span>
          </div>
        </div>

        {/* "Before" (Standard / Compressed) Canvas - Clipped Left Layer */}
        <div
          style={{ width: `${sliderPosition}%` }}
          className="absolute inset-0 overflow-hidden bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 border-r-2 border-white shadow-2xl"
        >
          <div
            style={{ width: containerRef.current?.clientWidth || 700 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-slate-700 filter blur-[1.5px]"
          >
            <div className="w-24 h-24 rounded-2xl bg-slate-400 flex items-center justify-center mb-4 opacity-75">
              <Sparkles className="w-12 h-12 text-slate-600" />
            </div>
            <div className="font-extrabold text-2xl tracking-tight text-slate-800">
              Raw Low-Resolution Input
            </div>
            <p className="text-xs text-slate-600 max-w-sm mt-1">
              Soft edges, pixelated compression artifacts, low detail.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-500/20 border border-slate-500/30 text-slate-700 text-xs font-bold">
              <span>960 x 540 Compressed</span>
            </div>
          </div>
        </div>

        {/* Draggable Divider Handle */}
        <div
          style={{ left: `${sliderPosition}%` }}
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_15px_rgba(0,0,0,0.4)] pointer-events-none flex items-center justify-center"
        >
          <div className="w-9 h-9 rounded-full bg-white text-indigo-600 shadow-xl border border-slate-200 flex items-center justify-center pointer-events-auto cursor-ew-resize">
            <MoveHorizontal className="w-4 h-4" />
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 pointer-events-none px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-bold">
          Before (Raw)
        </div>
        <div className="absolute top-4 right-4 pointer-events-none px-3 py-1 rounded-lg bg-indigo-600/80 backdrop-blur-md text-white text-[11px] font-bold shadow">
          After (4x AI Enhanced)
        </div>
      </div>
    </div>
  );
}

