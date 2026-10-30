"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMarketingHome = pathname === "/";
  const isDedicatedConsole = pathname?.startsWith("/developers") || pathname?.startsWith("/admin");

  if (isMarketingHome || isDedicatedConsole) {
    return <main className="min-h-screen bg-[#FBFBFD] text-neutral-950">{children}</main>;
  }

  return (
    <div className="h-screen bg-[#FBFBFD] text-neutral-950 flex flex-col overflow-hidden antialiased">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className={`flex-1 h-full overflow-y-auto bg-[#FBFBFD] ${pathname === "/studio" ? "p-4 sm:p-6" : "p-6 md:p-8"}`}>
          <div className={`${pathname === "/studio" ? "max-w-[1740px]" : "max-w-7xl"} mx-auto pb-16`}>{children}</div>
        </main>
      </div>
    </div>
  );
}
