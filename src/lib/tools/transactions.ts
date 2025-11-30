import { tool } from "ai";
import { z } from "zod";

import { db } from "@/lib/db";

export const transactionsTool = tool({
  description: "Get all transactions",
  inputSchema: z.object({}),
  execute: async () => {
    console.log("[DB] Getting transactions...");
    return db.transactions.get();
  },
});
