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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <FolderHeart className="w-5 h-5" />
            </span>
            My Creations
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Access your generation history, download high-res files, and inspect prompt parameters.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200 shadow-sm text-xs">
          {["all", "image", "video", "audio"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl capitalize font-bold transition-all ${
                filter === cat
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid or Empty State */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white p-16 rounded-3xl border border-slate-200 text-center space-y-4 max-w-lg mx-auto my-12 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-600">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No creations recorded yet</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Head to the Image Studio on the sidebar, enter a prompt, and click Generate to see your outputs stored here!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                    {job.model_id}
                  </span>
                  <span
                    className={`font-bold text-[10px] px-2.5 py-1 rounded-full ${
                      job.status === "COMPLETED"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : job.status === "FAILED"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                <p className="text-xs text-slate-700 line-clamp-3 leading-relaxed italic font-medium">
                  "{job.raw_prompt}"
                </p>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 mt-3 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(job.created_at).toLocaleDateString()}</span>
                </div>
                <div className="text-indigo-600 font-extrabold">💎 {job.credits_reserved} cr</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
