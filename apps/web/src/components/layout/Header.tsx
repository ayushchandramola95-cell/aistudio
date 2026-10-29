"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, Coins, Zap, Shield, User as UserIcon } from "lucide-react";

export default function Header() {
  const [balance, setBalance] = useState<number>(100);

  useEffect(() => {
    // Fetch live balance from backend API
    fetch("http://localhost:8100/api/v1/credits/balance")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.available === "number") {
          setBalance(data.available);
        }
      })
      .catch(() => {
        // Fallback to initial default
      });
  }, []);

  return (
    <header className="h-16 border-b border-studio-800 bg-studio-950/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
      {/* Brand & Route Mode */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent-purple to-accent-indigo flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              AI Studio
            </span>
            <span className="ml-2 text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-studio-800 text-accent-indigo border border-studio-700">
              v0.1
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-2 pl-4 border-l border-studio-800">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-studio-900 border border-studio-800 text-xs text-slate-300">
            <Zap className="w-3.5 h-3.5 text-accent-amber" />
            <span>Router:</span>
            <span className="font-medium text-white">Smart Auto</span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Credits Balance Pill */}
        <Link
          href="/credits"
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border border-purple-500/30 hover:border-purple-500/60 transition-all shadow-sm group"
        >
          <Coins className="w-4 h-4 text-purple-400 group-hover:rotate-12 transition-transform" />
          <span className="text-xs text-slate-300">Balance:</span>
          <span className="text-sm font-semibold text-white tracking-wide">
            {balance.toFixed(0)}
          </span>
          <span className="text-[10px] text-purple-300 bg-purple-500/20 px-1.5 py-0.5 rounded font-medium">
            + Add
          </span>
        </Link>

        {/* User Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-studio-800">
          <div className="w-8 h-8 rounded-full bg-studio-800 border border-studio-700 flex items-center justify-center text-slate-300">
            <UserIcon className="w-4 h-4" />
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-medium text-slate-200">Creative Explorer</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Admin Tier
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
