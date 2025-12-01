"use client";

import { Fragment, useState } from "react";

import type { AnomalyResult } from "@/lib/anomaly";
import type { Transaction } from "@/lib/db";
import { DetectButton } from "@/components/detect-button";

export function TransactionList({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const [anomalies, setAnomalies] = useState<AnomalyResult | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const handleDetect = (result: AnomalyResult) => {
    setAnomalies(result);
  };

  const formatCurrency = (amount: number) => {
    const isNegative = amount < 0;
    const absoluteAmount = Math.abs(amount);
    const formatted = `$${absoluteAmount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
    return isNegative ? `-${formatted}` : `+${formatted}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getAnomalyItem = (transactionId: string) => {
    return anomalies?.anomalies.find(
      (item) => item.transactionId === transactionId,
    );
  };

  const isAnomaly = (transactionId: string) => {
    return getAnomalyItem(transactionId) !== undefined;
  };

  const toggleRow = (transactionId: string) => {
    if (!isAnomaly(transactionId)) return;
    setExpandedRow(expandedRow === transactionId ? null : transactionId);
  };

  return (
    <>
      {/* Header */}
      <div className="mb-16 text-center">
        <h1 className="mb-4 font-bold font-mono text-5xl tracking-tight">
          Transaction Agent
        </h1>
        <p className="text-gray-400 text-lg">
          AI-powered financial transaction anomaly detection
        </p>
        <a
          href="https://github.com/willsather/agent-starter"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-2 text-gray-500 text-sm transition-colors hover:text-gray-300"
        >
          <svg
            className="h-4 w-4"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
          <p>view source{" ->"}</p>
        </a>
      </div>

      <DetectButton onDetect={handleDetect} />

      {/* Transaction Table */}
      <div className="mb-8 overflow-hidden rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-white/10 border-b">
                <th className="px-6 py-4 text-left font-mono text-gray-400 text-sm uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-left font-mono text-gray-400 text-sm uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left font-mono text-gray-400 text-sm uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left font-mono text-gray-400 text-sm uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-right font-mono text-gray-400 text-sm uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => {
                const isAnomalous = isAnomaly(transaction.id);
                const anomalyItem = getAnomalyItem(transaction.id);
                const isExpanded = expandedRow === transaction.id;

                return (
                  <Fragment key={transaction.id}>
                    <tr
                      className={`border-white/5 border-b transition-colors ${
                        isAnomalous
                          ? "cursor-pointer border-red-500/20 bg-red-500/10 hover:bg-red-500/15"
                          : "hover:bg-white/2"
                      }`}
                      onClick={() => toggleRow(transaction.id)}
                    >
                      <td className="px-6 py-4 font-mono text-sm text-white">
                        {transaction.id}
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-6 py-4 font-medium text-white">
                        <div className="flex items-center gap-2">
                          {transaction.name}
                          {isAnomalous && (
                            <>
                              <span className="inline-flex items-center rounded-full bg-red-500/20 px-2 py-1 font-mono text-red-400 text-xs">
                                ANOMALY
                              </span>
                              <svg
                                className={`h-4 w-4 text-red-400 transition-transform ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                role="graphics-symbol"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 text-right font-medium font-mono">
                        <span
                          className={
                            transaction.amount < 0
                              ? "text-red-400"
                              : "text-green-400"
                          }
                        >
                          {formatCurrency(transaction.amount)}
                        </span>
                      </td>
                    </tr>

                    {isAnomalous && isExpanded && anomalyItem && (
                      <tr className="border-red-500/30 border-b">
                        <td colSpan={5} className="bg-red-500/10 px-6 py-4">
                          <div className="mb-2 font-mono font-semibold text-red-400 text-xs uppercase tracking-wider">
                            Anomaly Details
                          </div>
                          <div className="font-mono text-red-300 text-sm leading-relaxed">
                            {anomalyItem.description}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      {anomalies?.summary && (
        <div className="mb-12 rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="mb-3 font-mono font-semibold text-gray-400 text-sm uppercase tracking-wider">
            Anomaly Detection Summary
          </div>
          <div className="text-gray-300 leading-relaxed">
            {anomalies.summary}
          </div>
        </div>
      )}
    </>
  );
}
