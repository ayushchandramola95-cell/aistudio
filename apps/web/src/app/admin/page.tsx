"use client";

import React, { useEffect, useState } from "react";
import { ShieldAlert, Cpu, Server, Activity, Power, Layers } from "lucide-react";
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
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <ShieldAlert className="w-5 h-5" />
          </span>
          Developer & Admin Command Center
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor GPU compute infrastructure, configure model credit multipliers, and inspect system telemetry.
        </p>
      </div>

      {/* System Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>FastAPI Gateway</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">Port 8100</div>
          <div className="text-xs text-emerald-600 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Operational &bull; 0ms Queue Lag
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Next.js Web Client</span>
            <Server className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">Port 3100</div>
          <div className="text-xs text-indigo-600 font-semibold">Active Workspace Host</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>GCP Budget Guardrail</span>
            <span className="text-xs font-extrabold text-emerald-600">$300 Credit Safe</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">$0.00 Spent</div>
          <div className="text-xs text-slate-400 font-medium">Zero active persistent VM charges</div>
        </div>
      </div>

      {/* GPU Worker Lifecycle Manager */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{gpuStatus.gpuModel}</h2>
              <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5 font-medium">
                <span>Estimated: <strong>{gpuStatus.ratePerHour}</strong></span>
                <span>&bull;</span>
                <span>Auto-shutdown idle: <strong>{gpuStatus.idleTimeoutMinutes} mins</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                gpuStatus.state.includes("RUNNING")
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              {gpuStatus.state}
            </span>

            <button
              onClick={toggleGpuWorker}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                gpuStatus.state.includes("RUNNING")
                  ? "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                  : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{gpuStatus.state.includes("RUNNING") ? "Power Down Worker" : "Power Up Worker"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Model Registry Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Active Model Registry ({models.length} Registered)</span>
          </h2>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 font-bold">Model ID</th>
                <th className="py-3.5 px-4 font-bold">Display Name</th>
                <th className="py-3.5 px-4 font-bold">Provider</th>
                <th className="py-3.5 px-4 font-bold">Backend</th>
                <th className="py-3.5 px-4 font-bold">Base Cost</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold">Commercial License</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-slate-600">
              {models.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{m.id}</td>
                  <td className="py-3.5 px-4 font-sans text-slate-800 font-semibold">{m.display_name}</td>
                  <td className="py-3.5 px-4 font-sans text-slate-500">{m.provider}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-700">
                      {m.backend_type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-indigo-600 font-extrabold">
                    {m.base_credit_cost} Credits
                  </td>
                  <td className="py-3.5 px-4 font-sans">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                      {m.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-sans text-slate-500">{m.commercial_license}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
