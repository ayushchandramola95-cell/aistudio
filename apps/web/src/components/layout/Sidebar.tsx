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
  Settings,
} from "lucide-react";

const navigationItems = [
  {
    category: "Creation Studios",
    items: [
      { name: "Image Studio", href: "/", icon: ImageIcon },
      { name: "Video Studio", href: "/video", icon: Video },
      { name: "Audio & Speech", href: "/audio", icon: Mic },
      { name: "Text & Writing", href: "/text", icon: FileText },
      { name: "Enhance & Restore", href: "/enhance", icon: Wand2 },
    ],
  },
  {
    category: "Workspace",
    items: [
      { name: "My Creations", href: "/creations", icon: FolderHeart },
      { name: "Credits & Usage", href: "/credits", icon: Coins },
    ],
  },
  {
    category: "System",
    items: [
      { name: "Admin Dashboard", href: "/admin", icon: ShieldAlert },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-studio-800 bg-studio-950 flex flex-col justify-between shrink-0 hidden lg:flex">
      <div className="p-4 space-y-6">
        {navigationItems.map((group) => (
          <div key={group.category} className="space-y-1.5">
            <h3 className="px-3 text-[11px] font-semibold tracking-wider uppercase text-slate-500">
              {group.category}
            </h3>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-accent-purple/15 text-white border border-accent-purple/30 shadow-sm"
                        : "text-slate-400 hover:text-slate-200 hover:bg-studio-900"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-accent-purple" : "text-slate-400"
                      }`}
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-studio-800/80 text-xs text-slate-500">
        <div className="flex items-center justify-between">
          <span>AI Studio Core</span>
          <span className="text-emerald-400 font-medium">Online</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-600">
          Port 3100 (Web) &bull; Port 8100 (API)
        </div>
      </div>
    </aside>
  );
}
