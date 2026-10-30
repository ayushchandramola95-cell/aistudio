"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Palette,
  Film,
  Mic2,
  PenTool,
  Wand2,
  Images,
  Coins,
  ShieldCheck,
  Home,
  Sparkles,
  Terminal,
  Compass,
  Users2,
  Cuboid,
  Music2,
  FolderKanban,
  Heart,
  BrainCircuit,
  Layers,
  SlidersHorizontal,
  Scissors,
  Maximize2,
  Settings2,
  HardDrive,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const navigationItems = [
  {
    category: "Main Portal",
    items: [
      { name: "Home", href: "/", icon: Home },
      { name: "Explore", href: "/creations", icon: Compass, badge: "New" },
      { name: "Community", href: "/creations", icon: Users2 },
    ],
  },
  {
    category: "Creation Studios",
    items: [
      { name: "Image Studio", href: "/studio", icon: Palette, badge: "Popular" },
      { name: "Video Studio", href: "/video", icon: Film, badge: "Veo 2" },
      { name: "Audio & Speech", href: "/audio", icon: Mic2 },
      { name: "Text & Writing", href: "/text", icon: PenTool },
      { name: "Enhance & Restore", href: "/enhance", icon: Wand2, badge: "4K" },
      { name: "3D Studio", href: "/studio", icon: Cuboid, badge: "Beta" },
      { name: "Music Studio", href: "/audio", icon: Music2, badge: "Beta" },
    ],
  },
  {
    category: "My Workspace",
    items: [
      { name: "My Creations", href: "/creations", icon: Images },
      { name: "Projects", href: "/creations", icon: FolderKanban },
      { name: "Favorites", href: "/creations", icon: Heart },
      { name: "Model Library", href: "/studio", icon: BrainCircuit },
      { name: "Credits & Usage", href: "/credits", icon: Coins },
    ],
  },
  {
    category: "Tools",
    items: [
      { name: "Prompt Enhancer", href: "/studio", icon: Sparkles },
      { name: "Batch Create", href: "/studio", icon: Layers },
      { name: "Image Editor", href: "/enhance", icon: SlidersHorizontal },
      { name: "Background Remover", href: "/enhance", icon: Scissors },
      { name: "Upscaler", href: "/enhance", icon: Maximize2 },
    ],
  },
  {
    category: "System",
    items: [
      { name: "Developer API", href: "/developers", icon: Terminal, badge: "REST" },
      { name: "Admin Dashboard", href: "/admin", icon: ShieldCheck },
      { name: "Settings", href: "/admin", icon: Settings2 },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("aistudio_sidebar_collapsed");
      if (saved === "true") setIsCollapsed(true);
    } catch {}

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleCollapse();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("aistudio_sidebar_collapsed", String(next));
      } catch {}
      return next;
    });
  };

  return (
    <aside
      className={`${
        isCollapsed ? "w-[72px]" : "w-64"
      } border-r border-neutral-200/90 bg-white flex flex-col justify-between shrink-0 hidden lg:flex h-full overflow-y-auto scrollbar-thin transition-all duration-300 ease-in-out select-none`}
    >
      <div>
        {/* Sidebar Compact / Expand Header Control */}
        <div className="px-3 pt-3 pb-2 flex items-center justify-between border-b border-neutral-100">
          {!isCollapsed && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 pl-1">
              Navigation
            </span>
          )}
          <button
            type="button"
            onClick={toggleCollapse}
            title={isCollapsed ? "Expand sidebar (Ctrl+B)" : "Collapse sidebar (Ctrl+B)"}
            className={`p-1.5 rounded-xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer ${
              isCollapsed ? "mx-auto" : ""
            }`}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Categories and Items */}
        <div className={`p-2.5 ${isCollapsed ? "space-y-4" : "space-y-5"}`}>
          {navigationItems.map((group) => (
            <div key={group.category} className="space-y-1">
              {!isCollapsed ? (
                <h3 className="px-2.5 text-[10px] font-bold tracking-wider uppercase text-neutral-400">
                  {group.category}
                </h3>
              ) : (
                <div className="h-px bg-neutral-100 my-2 mx-1" />
              )}

              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href &&
                    (item.name === "Image Studio" ? pathname === "/studio" : true);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={`${group.category}-${item.name}`}
                      href={item.href}
                      className={`flex items-center ${
                        isCollapsed ? "justify-center px-0 py-2.5" : "justify-between px-3 py-2"
                      } rounded-xl text-xs font-semibold transition-all group relative ${
                        isActive && item.name === "Image Studio"
                          ? "bg-neutral-950 text-white shadow-xs"
                          : "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100/70"
                      }`}
                    >
                      <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-2.5"}`}>
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                            isActive && item.name === "Image Studio"
                              ? "text-white"
                              : "text-neutral-500 group-hover:text-neutral-900"
                          }`}
                        />
                        {!isCollapsed && <span className="truncate">{item.name}</span>}
                      </div>

                      {!isCollapsed && item.badge && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                            isActive && item.name === "Image Studio"
                              ? "bg-neutral-800 text-neutral-200"
                              : item.badge === "Popular"
                              ? "bg-blue-50 text-blue-700"
                              : item.badge === "Beta"
                              ? "bg-purple-50 text-purple-700"
                              : "bg-neutral-100 text-neutral-600"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}

                      {/* Floating Tooltip in collapsed mode */}
                      {isCollapsed && (
                        <div className="fixed left-[76px] px-2.5 py-1 bg-neutral-900 text-white text-[11px] font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-md">
                          {item.name}
                          {item.badge && (
                            <span className="ml-1 text-[9px] text-blue-300 font-bold">
                              • {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hardware / Worker Status Card */}
      {!isCollapsed ? (
        <div className="p-3 border-t border-neutral-100 bg-neutral-50/70 space-y-2.5 shrink-0">
          <div className="p-2.5 rounded-xl bg-white border border-neutral-200/80 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-neutral-900">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-mono text-[10px]">
                  ⚡
                </span>
                <span>GPU Worker</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </span>
            </div>

            <div className="text-[10px] text-neutral-500 font-mono">
              RTX 6000 &bull; 96GB VRAM
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] text-neutral-500 font-medium">
                <span>3/8 Jobs Running</span>
                <span className="font-bold text-neutral-700">42%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full w-[42%]" />
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white border border-neutral-200/80 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-bold text-neutral-700">
              <div className="flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-neutral-400" />
                <span>Storage</span>
              </div>
              <span className="font-mono text-neutral-500">426GB / 800GB</span>
            </div>
            <div className="w-full h-1 rounded-full bg-neutral-100 overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full w-[53%]" />
            </div>
          </div>
        </div>
      ) : (
        /* Collapsed Mode Mini Hardware Indicator */
        <div className="p-2 border-t border-neutral-100 bg-neutral-50/70 flex flex-col items-center gap-2 shrink-0">
          <div
            title="GPU Worker: RTX 6000 96GB (Online, 42% Load)"
            className="w-10 h-10 rounded-xl bg-white border border-neutral-200/80 shadow-2xs flex items-center justify-center relative cursor-pointer group"
          >
            <span className="text-xs font-mono font-bold text-neutral-700">⚡</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse absolute top-1 right-1 ring-2 ring-white" />
          </div>

          <div
            title="Storage: 426GB / 800GB (53% used)"
            className="w-10 h-10 rounded-xl bg-white border border-neutral-200/80 shadow-2xs flex items-center justify-center text-neutral-500 cursor-pointer group"
          >
            <HardDrive className="w-4 h-4 text-neutral-500" />
          </div>
        </div>
      )}
    </aside>
  );
}
