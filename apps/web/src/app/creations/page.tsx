"use client";

import React, { useEffect, useState } from "react";
import { FolderHeart, Image as ImageIcon, Video, Mic, RefreshCw, Calendar, Download } from "lucide-react";
import { GenerationJob } from "@/types";

export default function CreationsPage() {
  const [jobs, setJobs] = useState<GenerationJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchCreations = () => {
    setLoading(true);
    fetch("http://localhost:8100/api/v1/jobs")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setJobs(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCreations();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    if (filter === "all") return true;
    if (filter === "image") return job.task_type.includes("image");
    if (filter === "video") return job.task_type.includes("video");
    if (filter === "audio") return job.task_type.includes("speech") || job.task_type.includes("audio");
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-studio-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-accent-purple/20 text-accent-purple">
              <FolderHeart className="w-5 h-5" />
            </span>
            My Creations
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Access your generation history, download high-res files, and inspect prompt parameters.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-studio-950 rounded-xl border border-studio-800 text-xs">
          {["all", "image", "video", "audio"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                filter === cat
                  ? "bg-accent-purple text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid or Empty State */}
      {filteredJobs.length === 0 ? (
        <div className="glass-panel p-16 rounded-2xl border-studio-800 text-center space-y-4 max-w-lg mx-auto my-12">
          <div className="w-16 h-16 rounded-2xl bg-studio-950 border border-studio-800 flex items-center justify-center mx-auto text-slate-500">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h3 className="text-base font-semibold text-white">No creations yet</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Head to the Image Studio on the sidebar, type a creative prompt, and click Generate to see your creations stored here!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="glass-panel rounded-2xl border-studio-800 overflow-hidden hover:border-accent-purple/40 transition-all flex flex-col justify-between"
            >
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-studio-800 text-slate-300 font-semibold uppercase text-[10px]">
                    {job.model_id}
                  </span>
                  <span
                    className={`font-semibold text-[10px] px-2 py-0.5 rounded ${
                      job.status === "COMPLETED"
                        ? "bg-emerald-950 text-emerald-400"
                        : job.status === "FAILED"
                        ? "bg-rose-950 text-rose-400"
                        : "bg-amber-950 text-amber-300"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                <p className="text-xs text-slate-200 line-clamp-3 leading-relaxed italic">
                  "{job.raw_prompt}"
                </p>
              </div>

              <div className="p-4 pt-0 border-t border-studio-800/60 mt-3 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(job.created_at).toLocaleDateString()}</span>
                </div>
                <div className="text-slate-400 font-medium">💎 {job.credits_reserved} cr</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
