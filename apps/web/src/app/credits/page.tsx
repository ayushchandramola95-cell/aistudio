"use client";

import React, { useEffect, useState } from "react";
import { Coins, ArrowUpRight, ArrowDownLeft, ShieldCheck, Zap, RefreshCw, CheckCircle2 } from "lucide-react";
import { CreditAccount, CreditTransaction } from "@/types";

const CREDIT_PACKAGES = [
  { id: "starter", name: "Starter Creator", credits: 500, price: "$5", popular: false },
  { id: "pro", name: "Pro Studio", credits: 2500, price: "$20", popular: true },
  { id: "scale", name: "Scale Agency", credits: 10000, price: "$70", popular: false },
];

export default function CreditsPage() {
  const [account, setAccount] = useState<CreditAccount | null>(null);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchCreditData = () => {
    setLoading(true);
    Promise.all([
      fetch("http://localhost:8100/api/v1/credits/balance").then((r) => r.json()),
      fetch("http://localhost:8100/api/v1/credits/transactions").then((r) => r.json()),
    ])
      .then(([accData, txData]) => {
        setAccount(accData);
        setTransactions(txData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCreditData();
  }, []);

  const handlePurchase = async (pkg: (typeof CREDIT_PACKAGES)[0]) => {
    setPurchasing(true);
    setSuccessMsg(null);
    try {
      const priceNum = parseFloat(pkg.price.replace("$", ""));
      const res = await fetch("http://localhost:8100/api/v1/credits/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          package_name: pkg.name,
          amount: pkg.credits,
          price_usd: priceNum,
        }),
      });

      if (res.ok) {
        setSuccessMsg(`Successfully added ${pkg.credits} credits to your account!`);
        fetchCreditData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-accent-purple/20 text-accent-purple">
            <Coins className="w-5 h-5" />
          </span>
          Credits & Ledger Engine
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Two-phase atomic ledger: credits are held in escrow during generation and only settled upon verified success.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3 text-emerald-200 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Credit Balances Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border-studio-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Available Balance
          </span>
          <div className="text-3xl font-extrabold text-white flex items-center gap-2">
            <span>💎 {account?.available?.toFixed(1) ?? "100.0"}</span>
          </div>
          <p className="text-[11px] text-emerald-400">Ready for instant generations</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-studio-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Reserved in Escrow
          </span>
          <div className="text-3xl font-extrabold text-amber-300">
            {account?.reserved?.toFixed(1) ?? "0.0"}
          </div>
          <p className="text-[11px] text-slate-400">Locked in currently running jobs</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-studio-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Account Balance
          </span>
          <div className="text-3xl font-extrabold text-slate-200">
            {account?.balance?.toFixed(1) ?? "100.0"}
          </div>
          <p className="text-[11px] text-slate-400">Available + In-flight escrow</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-studio-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Lifetime Spent
          </span>
          <div className="text-3xl font-extrabold text-purple-300">
            {account?.lifetime_spent?.toFixed(1) ?? "0.0"}
          </div>
          <p className="text-[11px] text-slate-400">Completed generations</p>
        </div>
      </div>

      {/* Top-up Credit Packages */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-accent-amber" />
          <span>Purchase Credit Packages</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CREDIT_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`glass-panel p-6 rounded-2xl flex flex-col justify-between relative transition-all ${
                pkg.popular
                  ? "border-accent-purple shadow-lg shadow-purple-500/10 bg-studio-900/80"
                  : "border-studio-800"
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-3 right-6 bg-accent-purple text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                  Most Popular
                </span>
              )}

              <div className="space-y-3">
                <h3 className="font-bold text-base text-white">{pkg.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white">{pkg.price}</span>
                  <span className="text-xs text-slate-400">one-time</span>
                </div>
                <div className="p-3 rounded-xl bg-studio-950/80 border border-studio-800 text-xs text-purple-300 font-semibold flex items-center gap-2">
                  <Coins className="w-4 h-4 text-purple-400" />
                  <span>{pkg.credits.toLocaleString()} Platform Credits</span>
                </div>
              </div>

              <button
                onClick={() => handlePurchase(pkg)}
                disabled={purchasing}
                className={`mt-6 w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                  pkg.popular
                    ? "bg-gradient-to-r from-accent-purple to-accent-indigo text-white hover:brightness-110 shadow-md"
                    : "bg-studio-800 text-slate-200 hover:text-white hover:bg-studio-700"
                }`}
              >
                {purchasing ? "Processing..." : `Add ${pkg.credits} Credits`}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History Ledger */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Immutable Credit Audit Ledger</span>
          </h2>
          <button
            onClick={fetchCreditData}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Refresh Ledger</span>
          </button>
        </div>

        <div className="glass-panel rounded-2xl border-studio-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-studio-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-studio-800">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Balance After</th>
                  <th className="py-3 px-4">Description / Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-studio-800/60 font-mono text-slate-300">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500 font-sans">
                      No transactions recorded yet.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-studio-950/40">
                      <td className="py-3 px-4 text-slate-400 font-sans">
                        {new Date(tx.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                      <td className="py-3 px-4 font-bold">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-sans ${
                            tx.type === "PURCHASE" || tx.type === "ADJUSTMENT"
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-500/20"
                              : tx.type === "RESERVE"
                              ? "bg-amber-950 text-amber-300 border border-amber-500/20"
                              : tx.type === "REFUND"
                              ? "bg-blue-950 text-blue-300 border border-blue-500/20"
                              : "bg-purple-950 text-purple-300 border border-purple-500/20"
                          }`}
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td
                        className={`py-3 px-4 font-bold ${
                          tx.amount > 0 ? "text-emerald-400" : "text-slate-300"
                        }`}
                      >
                        {tx.amount > 0 ? `+${tx.amount.toFixed(1)}` : `${tx.amount.toFixed(1)}`}
                      </td>
                      <td className="py-3 px-4 text-slate-200">{tx.balance_after.toFixed(1)}</td>
                      <td className="py-3 px-4 text-slate-400 font-sans">{tx.reason}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
