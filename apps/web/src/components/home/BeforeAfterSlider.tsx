"use client";

import React, { useState, useRef, useCallback } from "react";
import { Sparkles, MoveHorizontal, CheckCircle2 } from "lucide-react";

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
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-luxury space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Real-ESRGAN & BiRefNet Super-Resolution
          </span>
          <h3 className="text-xl font-bold text-neutral-950 mt-2 font-editorial text-2xl">
            Interactive 4x AI Upscale & Restoration
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Slide horizontally to inspect pore details, micro-textures, and optical sharpness.
          </p>
        </div>
        <span className="text-xs font-semibold text-neutral-600 flex items-center gap-1.5 self-start sm:self-center bg-neutral-50 px-3 py-1.5 rounded-full border border-neutral-200">
          <MoveHorizontal className="w-4 h-4 text-neutral-950" />
          <span>Drag slider to compare</span>
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
        className="relative h-72 sm:h-[420px] rounded-2xl overflow-hidden cursor-ew-resize select-none border border-neutral-200 shadow-inner group"
      >
        {/* "After" (4K AI Upscaled) - Full Width Background Image */}
        <div className="absolute inset-0 bg-neutral-950">
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1600&auto=format&fit=crop"
            alt="After 4K Upscale"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-neutral-950/80 backdrop-blur-md text-white text-[11px] font-bold border border-white/20 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>4K Master &bull; 3840 &times; 2160 (Sharp)</span>
          </div>
        </div>

        {/* "Before" (Low-Res / Compressed) - Clipped Left Layer */}
        <div
          style={{ width: `${sliderPosition}%` }}
          className="absolute inset-0 overflow-hidden bg-neutral-900 border-r-2 border-white shadow-2xl"
        >
          <div
            style={{ width: containerRef.current?.clientWidth || 800 }}
            className="absolute inset-0 filter blur-[2px] contrast-90"
          >
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=40&w=600&auto=format&fit=crop"
              alt="Before Upscale"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-neutral-950/80 backdrop-blur-md text-white text-[11px] font-bold border border-white/20">
            Raw Low-Res (Blurry & Compressed)
          </div>
        </div>

        {/* Draggable Divider Handle */}
        <div
          style={{ left: `${sliderPosition}%` }}
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_15px_rgba(0,0,0,0.5)] pointer-events-none flex items-center justify-center"
        >
          <div className="w-10 h-10 rounded-full bg-neutral-950 text-white shadow-2xl border-2 border-white flex items-center justify-center pointer-events-auto cursor-ew-resize transition-transform hover:scale-110">
            <MoveHorizontal className="w-5 h-5" />
          </div>
        </div>

        {/* Floating Top Labels */}
        <div className="absolute top-4 left-4 pointer-events-none px-3 py-1 rounded-full bg-neutral-950/75 backdrop-blur-md text-white text-[11px] font-bold">
          Before
        </div>
        <div className="absolute top-4 right-4 pointer-events-none px-3 py-1 rounded-full bg-neutral-950/75 backdrop-blur-md text-white text-[11px] font-bold shadow">
          After (4x Enhanced)
        </div>
      </div>
    </div>
  );
}
