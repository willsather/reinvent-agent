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
      <DetectButton onDetect={handleDetect} />

      {/* Transaction Table */}
      <div className="mb-8 overflow-hidden rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-white/10 border-b">
                <th className="w-[100px] px-4 py-4 text-left font-mono text-gray-400 text-sm uppercase tracking-wider">
                  ID
                </th>
                <th className="w-[120px] px-4 py-4 text-left font-mono text-gray-400 text-sm uppercase tracking-wider">
                  Date
                </th>
                <th className="w-[200px] px-4 py-4 text-left font-mono text-gray-400 text-sm uppercase tracking-wider">
                  Name
                </th>
                <th className="w-[300px] px-4 py-4 text-left font-mono text-gray-400 text-sm uppercase tracking-wider">
                  Description
                </th>
                <th className="w-[140px] px-4 py-4 text-right font-mono text-gray-400 text-sm uppercase tracking-wider">
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
                      <td className="overflow-hidden text-ellipsis whitespace-nowrap px-4 py-4 font-mono text-sm text-white">
                        {transaction.id}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-gray-300 text-sm">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-4 py-4 font-medium text-white">
                        <div className="flex items-center gap-2">
                          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                            {transaction.name}
                          </span>
                          {isAnomalous && (
                            <>
                              <span className="inline-flex shrink-0 items-center rounded-full bg-red-500/20 px-2 py-1 font-mono text-red-400 text-xs">
                                ANOMALY
                              </span>
                              <svg
                                className={`h-4 w-4 shrink-0 text-red-400 transition-transform ${
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
                      <td className="overflow-hidden text-ellipsis whitespace-nowrap px-4 py-4 text-gray-300 text-sm">
                        {transaction.description}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-right font-medium font-mono">
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
                        <td colSpan={5} className="bg-red-500/10 px-4 py-4">
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
