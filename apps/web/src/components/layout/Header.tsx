"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Coins, Plus, Search, Bell, Sparkles, ChevronRight, Zap } from "lucide-react";

export default function Header() {
  const [balance, setBalance] = useState<number>(12450);
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
  const [showCreditPopover, setShowCreditPopover] = useState<boolean>(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("aistudio_token") : null;
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    fetch("http://localhost:8100/api/v1/credits/balance", { headers })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.available === "number") {
          setBalance(data.available);
          if (data.available >= 999999) {
            setIsAdmin(true);
          }
        }
      })
      .catch(() => {});

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowCreditPopover(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-[72px] shrink-0 border-b border-neutral-200/90 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 transition-all select-none">
      {/* Brand & Workspace Indicator */}
      <div className="flex items-center gap-3 shrink-0">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-neutral-950 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-white"
            >
              <path
                d="M12 2L14.39 9.61L22 12L14.39 14.39L12 22L9.61 14.39L2 12L9.61 9.61L12 2Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl tracking-tight text-neutral-950 font-sans">
              aistudio
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200 hidden sm:inline-flex items-center gap-1">
              Workspace
            </span>
          </div>
        </Link>
      </div>

      {/* Middle Omni-Search Bar (Clean & Centered) */}
      <div className="flex-1 max-w-xl mx-auto hidden md:block">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search models, styles, prompts, or anything..."
            className="w-full pl-10 pr-12 py-2 rounded-xl bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-neutral-300 text-xs text-neutral-900 focus:outline-none transition-all placeholder-neutral-400 font-medium"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-white border border-neutral-200 text-[10px] font-mono text-neutral-400 shadow-2xs pointer-events-none">
            Ctrl K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Improved Premium Credits Box with Interactive Breakdown */}
        <div className="relative" ref={popoverRef}>
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-neutral-50/90 hover:bg-neutral-100/70 border border-neutral-200/90 shadow-2xs transition-all">
            <button
              type="button"
              onClick={() => setShowCreditPopover(!showCreditPopover)}
              className="flex items-center gap-2 pl-2 pr-1.5 py-1 text-xs font-bold text-neutral-900 hover:text-blue-600 transition-colors cursor-pointer group"
              title="Click to view credits & usage details"
            >
              {/* Golden Vector Coin Emblem */}
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center text-amber-950 shadow-2xs ring-1 ring-amber-400/50 group-hover:scale-105 transition-transform">
                <Coins className="w-3 h-3 text-amber-950" />
              </div>
              <span className="font-mono font-extrabold text-neutral-900 text-xs">
                {balance.toLocaleString()}
              </span>
              <span className="text-[11px] text-neutral-400 font-medium">Credits</span>
            </button>

            <Link
              href="/credits"
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-xs transition-all hover:scale-102 active:scale-98"
            >
              <Plus className="w-3 h-3 stroke-[2.5]" />
              <span>Add Credits</span>
            </Link>
          </div>

          {/* Interactive Credits Breakdown Popover */}
          {showCreditPopover && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl border border-neutral-200 shadow-xl p-3.5 z-50 animate-dropdown space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Available Balance
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xl font-black font-mono text-neutral-950">
                      {balance.toLocaleString()}
                    </span>
                    <span className="text-xs font-semibold text-neutral-500">Credits</span>
                  </div>
                </div>
                <div className="px-2 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Pro Plan</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-neutral-600">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-neutral-500">Fast Generation Cost:</span>
                  <span className="font-mono font-bold text-neutral-800">~ 4–6 cr / image</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-neutral-500">High-Res 4K Upscale:</span>
                  <span className="font-mono font-bold text-neutral-800">~ 2 cr / upscale</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-neutral-500">Monthly Auto-Renewal:</span>
                  <span className="font-semibold text-neutral-700">Active (Nov 15)</span>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
                <Link
                  href="/credits"
                  onClick={() => setShowCreditPopover(false)}
                  className="flex-1 text-center py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-2xs"
                >
                  Buy Credit Pack
                </Link>
                <Link
                  href="/credits"
                  onClick={() => setShowCreditPopover(false)}
                  className="flex items-center justify-center p-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-600 transition-colors"
                  title="View usage history"
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Bell Notification */}
        <button
          type="button"
          className="relative p-2 rounded-xl hover:bg-neutral-100 text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
        </button>

        {/* User Profile Card */}
        <div className="flex items-center gap-2 pl-2 border-l border-neutral-200">
          <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-200 flex items-center justify-center text-white font-bold text-xs shadow-2xs">
            {isAdmin ? "★" : "A"}
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-bold text-neutral-950 leading-tight">
              {isAdmin ? "Super Admin" : "Creative Explorer"}
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Online</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
