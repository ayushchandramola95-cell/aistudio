"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Coins, Zap, User as UserIcon, ExternalLink } from "lucide-react";

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
    <header className="h-[72px] border-b border-neutral-200/90 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-6 sm:px-8 flex items-center justify-between transition-all">
      {/* Brand & Route Mode */}
      <div className="flex items-center gap-5">
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
            <span className="font-bold text-xl tracking-tight text-neutral-950 font-sans">
              aistudio
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
              Workspace
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-2.5 pl-4 border-l border-neutral-200">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 font-medium">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Router:</span>
            <span className="font-bold text-neutral-950">Smart Auto</span>
          </div>

          <Link
            href="/"
            className="flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-neutral-950 px-2 py-1 transition-colors"
          >
            <span>Website Home</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Credits Balance Pill */}
        <Link
          href="/credits"
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 transition-all shadow-sm group"
        >
          <Coins className="w-4 h-4 text-blue-600 group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-medium text-neutral-500">Balance:</span>
          <span className="text-sm font-bold text-neutral-950 tracking-tight">
            {balance.toFixed(0)} cr
          </span>
          <span className="text-[10px] text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-md font-bold">
            + Top Up
          </span>
        </Link>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-neutral-200">
          <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 font-bold text-xs">
            A
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-neutral-950">Creative Explorer</div>
            <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Escrow Active
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
