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
  Terminal
} from "lucide-react";

const navigationItems = [
  {
    category: "Main Portal",
    items: [
      { name: "Website Home", href: "/", icon: Home },
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
      { name: "Developer API", href: "/developers", icon: Terminal, badge: "REST" },
      { name: "Admin Dashboard", href: "/admin", icon: ShieldAlert },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-neutral-200/90 bg-white flex flex-col justify-between shrink-0 hidden lg:flex">
      <div className="p-4 space-y-6">
        {navigationItems.map((group) => (
          <div key={group.category} className="space-y-1">
            <h3 className="px-3 text-[10px] font-bold tracking-wider uppercase text-neutral-400">
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
                    className={`flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-neutral-950 text-white shadow-sm"
                        : "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? "text-white" : "text-neutral-400"
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                          isActive
                            ? "bg-neutral-800 text-neutral-200"
                            : "bg-blue-50 text-blue-700"
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

      {/* Footer Info */}
      <div className="p-4 border-t border-neutral-100 text-xs text-neutral-500">
        <div className="flex items-center justify-between font-medium">
          <span>AI Studio Core</span>
          <span className="text-emerald-600 font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Online
          </span>
        </div>
        <div className="mt-1 text-[11px] text-neutral-400 font-medium">
          Port 3100 (Web) &bull; Port 8100 (API)
        </div>
      </div>
    </aside>
  );
}
