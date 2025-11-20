import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { dummyTransactions } from "@/lib/transaction";

export function TransactionsAccordion() {
  const formatCurrency = (amount: number) => {
    const isNegative = amount < 0;
    const absoluteAmount = Math.abs(amount);
    const formatted = `$${absoluteAmount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
    return isNegative ? `-${formatted}` : `+${formatted}`;
  };

  return (
    <AccordionItem value="transactions">
      <AccordionTrigger className="text-left font-mono">
        getTransactions()
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-3 text-sm">
          <p className="text-gray-400">
            Retrieves financial transaction data for anomaly detection analysis
          </p>

          <div className="space-y-2">
            <h4 className="font-medium font-mono text-white">Sample Data:</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-white/10 border-b">
                    <th className="px-2 py-1 text-left font-mono text-gray-400">
                      ID
                    </th>
                    <th className="px-2 py-1 text-left font-mono text-gray-400">
                      Name
                    </th>
                    <th className="px-2 py-1 text-left font-mono text-gray-400">
                      Description
                    </th>
                    <th className="px-2 py-1 text-right font-mono text-gray-400">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dummyTransactions.slice(0, 5).map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-white/5 border-b"
                    >
                      <td className="px-2 py-1 font-mono text-gray-300">
                        {transaction.id}
                      </td>
                      <td className="px-2 py-1 text-white">
                        {transaction.name}
                      </td>
                      <td className="px-2 py-1 text-gray-300">
                        {transaction.description}
                      </td>
                      <td className="px-2 py-1 text-right font-mono">
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
                  ))}
                  <tr>
                    <td
                      colSpan={4}
                      className="px-2 py-1 text-center text-gray-500"
                    >
                      ... and {dummyTransactions.length - 5} more transactions
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
