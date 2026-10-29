import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "AI Studio | Multi-Model AI Creation Platform",
  description: "Unified AI generation platform for Images, Videos, Audio, and Text.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-studio-950 text-slate-100 flex flex-col antialiased">
        <Header />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-studio-900/50 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
