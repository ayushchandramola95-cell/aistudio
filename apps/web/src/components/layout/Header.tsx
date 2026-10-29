"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, Coins, Zap, User as UserIcon, ExternalLink } from "lucide-react";

export default function Header() {
  const [balance, setBalance] = useState<number>(100);

  useEffect(() => {
    fetch("http://localhost:8100/api/v1/credits/balance")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.available === "number") {
          setBalance(data.available);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header className="h-16 border-b border-slate-200/90 bg-white/90 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
      {/* Brand & Route Mode */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900">
              AI Studio
            </span>
            <span className="ml-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/70">
              Studio
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-200">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-600 font-medium">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Router:</span>
            <span className="font-bold text-slate-900">Smart Auto</span>
          </div>

          <Link
            href="/"
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 px-2 py-1 transition-colors"
          >
            <span>Home Page</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Credits Balance Pill */}
        <Link
          href="/credits"
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100/70 border border-indigo-200/80 transition-all shadow-sm group"
        >
          <Coins className="w-4 h-4 text-indigo-600 group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-medium text-slate-600">Balance:</span>
          <span className="text-sm font-extrabold text-indigo-950 tracking-wide">
            {balance.toFixed(0)}
          </span>
          <span className="text-[10px] text-indigo-700 bg-white border border-indigo-200 px-1.5 py-0.5 rounded-md font-bold">
            + Add
          </span>
        </Link>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
            <UserIcon className="w-4 h-4" />
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-slate-900">Creative Explorer</div>
            <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Admin Tier
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
