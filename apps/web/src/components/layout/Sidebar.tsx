"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Image as ImageIcon,
  Video,
  Mic,
  FileText,
  Wand2,
  FolderHeart,
  Coins,
  ShieldAlert,
  Home,
  Sparkles,
  Terminal,
  Compass,
  Users,
  Box,
  Music,
  FolderGit2,
  Bookmark,
  Cpu,
  Layers,
  Sliders,
  Scissors,
  ArrowUpRight,
  Settings,
  HardDrive
} from "lucide-react";

const navigationItems = [
  {
    category: "Main Portal",
    items: [
      { name: "Home", href: "/", icon: Home },
      { name: "Explore", href: "/creations", icon: Compass, badge: "New" },
      { name: "Community", href: "/creations", icon: Users },
    ],
  },
  {
    category: "Creation Studios",
    items: [
      { name: "Image Studio", href: "/studio", icon: ImageIcon, badge: "Popular" },
      { name: "Video Studio", href: "/video", icon: Video, badge: "Veo 2" },
      { name: "Audio & Speech", href: "/audio", icon: Mic },
      { name: "Text & Writing", href: "/text", icon: FileText },
      { name: "Enhance & Restore", href: "/enhance", icon: Wand2, badge: "4K" },
      { name: "3D Studio", href: "/studio", icon: Box, badge: "Beta" },
      { name: "Music Studio", href: "/audio", icon: Music, badge: "Beta" },
    ],
  },
  {
    category: "My Workspace",
    items: [
      { name: "My Creations", href: "/creations", icon: FolderHeart },
      { name: "Projects", href: "/creations", icon: FolderGit2 },
      { name: "Favorites", href: "/creations", icon: Bookmark },
      { name: "Model Library", href: "/studio", icon: Cpu },
      { name: "Credits & Usage", href: "/credits", icon: Coins },
    ],
  },
  {
    category: "Tools",
    items: [
      { name: "Prompt Enhancer", href: "/studio", icon: Sparkles },
      { name: "Batch Create", href: "/studio", icon: Layers },
      { name: "Image Editor", href: "/enhance", icon: Sliders },
      { name: "Background Remover", href: "/enhance", icon: Scissors },
      { name: "Upscaler", href: "/enhance", icon: ArrowUpRight },
    ],
  },
  {
    category: "System",
    items: [
      { name: "Developer API", href: "/developers", icon: Terminal, badge: "REST" },
      { name: "Admin Dashboard", href: "/admin", icon: ShieldAlert },
      { name: "Settings", href: "/admin", icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-neutral-200/90 bg-white flex flex-col justify-between shrink-0 hidden lg:flex h-[calc(100vh-72px)] sticky top-[72px] overflow-y-auto scrollbar-thin">
      <div className="p-3 space-y-5">
        {navigationItems.map((group) => (
          <div key={group.category} className="space-y-1">
            <h3 className="px-3 text-[10px] font-bold tracking-wider uppercase text-neutral-400">
              {group.category}
            </h3>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href && (item.name === "Image Studio" ? pathname === "/studio" : true);
                const Icon = item.icon;
                return (
                  <Link
                    key={`${group.category}-${item.name}`}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive && item.name === "Image Studio"
                        ? "bg-neutral-950 text-white shadow-xs"
                        : "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100/70"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive && item.name === "Image Studio" ? "text-white" : "text-neutral-400"
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
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
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Hardware / Worker Status Card */}
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
    </aside>
  );
}
