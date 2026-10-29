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
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Coins className="w-5 h-5" />
          </span>
          Credits & Ledger Engine
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Two-phase atomic ledger: credits are held in escrow during generation and only settled upon verified success.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Credit Balances Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Available Balance
          </span>
          <div className="text-3xl font-extrabold text-indigo-600 flex items-center gap-2">
            <span>💎 {account?.available?.toFixed(1) ?? "100.0"}</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold">Ready for instant generations</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Reserved in Escrow
          </span>
          <div className="text-3xl font-extrabold text-amber-500">
            {account?.reserved?.toFixed(1) ?? "0.0"}
          </div>
          <p className="text-[11px] text-slate-400">Locked in currently running jobs</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Account Balance
          </span>
          <div className="text-3xl font-extrabold text-slate-900">
            {account?.balance?.toFixed(1) ?? "100.0"}
          </div>
          <p className="text-[11px] text-slate-400">Available + In-flight escrow</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Lifetime Spent
          </span>
          <div className="text-3xl font-extrabold text-slate-700">
            {account?.lifetime_spent?.toFixed(1) ?? "0.0"}
          </div>
          <p className="text-[11px] text-slate-400">Completed generations</p>
        </div>
      </div>

      {/* Top-up Credit Packages */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Purchase Credit Packages</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CREDIT_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-white p-6 rounded-3xl border flex flex-col justify-between relative transition-all ${
                pkg.popular
                  ? "border-2 border-indigo-600 shadow-xl shadow-indigo-600/10"
                  : "border-slate-200 shadow-sm"
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-3 right-6 bg-indigo-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider shadow">
                  Most Popular
                </span>
              )}

              <div className="space-y-3">
                <h3 className="font-bold text-base text-slate-900">{pkg.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900">{pkg.price}</span>
                  <span className="text-xs text-slate-400 font-medium">one-time</span>
                </div>
                <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-700 font-bold flex items-center gap-2">
                  <Coins className="w-4 h-4 text-indigo-600" />
                  <span>{pkg.credits.toLocaleString()} Platform Credits</span>
                </div>
              </div>

              <button
                onClick={() => handlePurchase(pkg)}
                disabled={purchasing}
                className={`mt-6 w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                  pkg.popular
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/25"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-800"
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
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Immutable Credit Audit Ledger</span>
          </h2>
          <button
            onClick={fetchCreditData}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-medium"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Refresh Ledger</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Timestamp</th>
                  <th className="py-3.5 px-4 font-bold">Type</th>
                  <th className="py-3.5 px-4 font-bold">Amount</th>
                  <th className="py-3.5 px-4 font-bold">Balance After</th>
                  <th className="py-3.5 px-4 font-bold">Description / Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-slate-600">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 font-sans">
                      No transactions recorded yet.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 text-slate-500 font-sans">
                        {new Date(tx.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                      <td className="py-3.5 px-4 font-bold">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold ${
                            tx.type === "PURCHASE" || tx.type === "ADJUSTMENT"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : tx.type === "RESERVE"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : tx.type === "REFUND"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-purple-50 text-purple-700 border border-purple-200"
                          }`}
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td
                        className={`py-3.5 px-4 font-extrabold ${
                          tx.amount > 0 ? "text-emerald-600" : "text-slate-800"
                        }`}
                      >
                        {tx.amount > 0 ? `+${tx.amount.toFixed(1)}` : `${tx.amount.toFixed(1)}`}
                      </td>
                      <td className="py-3.5 px-4 text-slate-900 font-bold">{tx.balance_after.toFixed(1)}</td>
                      <td className="py-3.5 px-4 text-slate-600 font-sans">{tx.reason}</td>
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
