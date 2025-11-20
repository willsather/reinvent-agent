import { tool } from "ai";
import { z } from "zod";

import { dummyTransactions } from "@/lib/transaction";

export const getTransactionsTool = tool({
  description:
    "Get a list of financial transactions for anomaly detection analysis",
  inputSchema: z.object({}),
  execute: async () => {
    return {
      transactions: dummyTransactions,
      message: `Retrieved ${dummyTransactions.length} transactions for analysis`,
    };
  },
});
