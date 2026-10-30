"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Coins, Zap, User as UserIcon, ExternalLink, Search, Bell, Moon } from "lucide-react";

export default function Header() {
  const [balance, setBalance] = useState<number>(100);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

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
  }, []);

  return (
    <header className="h-[72px] shrink-0 border-b border-neutral-200/90 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 transition-all">
      {/* Brand & Workspace */}
      <div className="flex items-center gap-3 sm:gap-5 shrink-0">
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
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200 hidden sm:inline-flex items-center gap-1">
              Workspace
            </span>
          </div>
        </Link>

        <div className="hidden xl:flex items-center gap-2 pl-3 border-l border-neutral-200">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 font-medium">
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

      {/* Middle Omni-Search Bar */}
      <div className="flex-1 max-w-xl mx-2 hidden md:block">
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
        {/* Credits Balance Chip + Add Credits Button */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-neutral-50 border border-neutral-200/90 shadow-2xs">
          <Link
            href="/credits"
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-neutral-900 hover:text-blue-600 transition-colors"
            title="Available Generation Credits"
          >
            <span className="text-amber-500 text-sm">🪙</span>
            <span>{isAdmin ? "12,450" : `${balance.toFixed(0)}`}</span>
            <span className="text-[11px] text-neutral-400 font-normal">Credits</span>
          </Link>

          <Link
            href="/credits"
            className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1"
          >
            <span>+</span>
            <span>Add Credits</span>
          </Link>
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

        {/* User Profile */}
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

        {/* Dark/Light mode toggle indicator */}
        <button
          type="button"
          className="p-2 rounded-xl hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer hidden sm:block"
          title="Toggle Theme"
        >
          <Moon className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
