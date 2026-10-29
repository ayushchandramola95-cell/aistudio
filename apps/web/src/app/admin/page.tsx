"use client";

import React, { useEffect, useState } from "react";
import { ShieldAlert, Cpu, Server, Activity, CheckCircle2, Power, Layers } from "lucide-react";
import { Model } from "@/types";

export default function AdminPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [gpuStatus, setGpuStatus] = useState({
    state: "STOPPED",
    gpuModel: "NVIDIA RTX PRO 6000 (Blackwell 96GB VRAM)",
    ratePerHour: "$1.30/hr",
    idleTimeoutMinutes: 15,
  });

  useEffect(() => {
    fetch("http://localhost:8100/api/v1/models")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.models) setModels(data.models);
      })
      .catch(() => {});
  }, []);

  const toggleGpuWorker = () => {
    setGpuStatus((prev) => ({
      ...prev,
      state: prev.state === "STOPPED" ? "RUNNING (Warm)" : "STOPPED",
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-accent-purple/20 text-accent-purple">
            <ShieldAlert className="w-5 h-5" />
          </span>
          Developer & Admin Command Center
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Monitor GPU compute infrastructure, configure model credit multipliers, and inspect system telemetry.
        </p>
      </div>

      {/* System Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>FastAPI Gateway</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">Port 8100</div>
          <div className="text-xs text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Operational &bull; 0ms Queue Lag
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Next.js Web Client</span>
            <Server className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">Port 3100</div>
          <div className="text-xs text-purple-300">Active Workspace Host</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>GCP Budget Guardrail</span>
            <span className="text-xs font-bold text-emerald-400">$300 Credit Safe</span>
          </div>
          <div className="text-2xl font-bold text-white">$0.00 Spent</div>
          <div className="text-xs text-slate-400">Zero active persistent VM charges</div>
        </div>
      </div>

      {/* GPU Worker Lifecycle Manager */}
      <div className="glass-panel p-6 rounded-2xl border-studio-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-studio-950 border border-studio-800 text-accent-indigo">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{gpuStatus.gpuModel}</h2>
              <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>Estimated: {gpuStatus.ratePerHour}</span>
                <span>&bull;</span>
                <span>Auto-shutdown idle: {gpuStatus.idleTimeoutMinutes} mins</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                gpuStatus.state.includes("RUNNING")
                  ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                  : "bg-studio-800 text-slate-400 border border-studio-700"
              }`}
            >
              {gpuStatus.state}
            </span>

            <button
              onClick={toggleGpuWorker}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                gpuStatus.state.includes("RUNNING")
                  ? "bg-rose-950 text-rose-300 border border-rose-500/30 hover:bg-rose-900"
                  : "bg-emerald-950 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900"
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{gpuStatus.state.includes("RUNNING") ? "Power Down" : "Power Up Worker"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Model Registry Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-accent-purple" />
            <span>Active Model Registry ({models.length} Registered)</span>
          </h2>
        </div>

        <div className="glass-panel rounded-2xl border-studio-800 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-studio-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-studio-800">
              <tr>
                <th className="py-3 px-4">Model ID</th>
                <th className="py-3 px-4">Display Name</th>
                <th className="py-3 px-4">Provider</th>
                <th className="py-3 px-4">Backend</th>
                <th className="py-3 px-4">Base Cost</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Commercial License</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-studio-800/60 font-mono text-slate-300">
              {models.map((m) => (
                <tr key={m.id} className="hover:bg-studio-950/40">
                  <td className="py-3 px-4 font-bold text-white">{m.id}</td>
                  <td className="py-3 px-4 font-sans text-slate-200">{m.display_name}</td>
                  <td className="py-3 px-4 font-sans text-slate-400">{m.provider}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-studio-800 text-[10px] text-slate-300">
                      {m.backend_type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-accent-purple font-bold">
                    {m.base_credit_cost} Credits
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold">
                      {m.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-400">{m.commercial_license}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
