import { tool } from "ai";
import { z } from "zod";

import { db } from "@/lib/db";

export const getTransactionsTool = tool({
  description:
    "Get a list of financial transactions for anomaly detection analysis",
  inputSchema: z.object({}),
  execute: async () => {
    const transactions = await db.transactions.get();
    return {
      transactions,
      message: `Retrieved ${transactions.length} transactions for analysis`,
    };
  },
});
