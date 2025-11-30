import { Output, ToolLoopAgent } from "ai";

import { anomalyResultSchema } from "@/lib/db";
import { getTransactionsTool } from "@/lib/tools";

export const anomalyAgent = new ToolLoopAgent({
  model: "openai/gpt-5-nano",
  tools: {
    getTransactions: getTransactionsTool,
  },
  output: Output.object({
    schema: anomalyResultSchema,
  }),
  instructions: `You are a financial anomaly detection AI agent. Your job is to analyze financial transactions and identify potential anomalies or suspicious activities.

Guidelines for anomaly detection:
1. Always get the transactions data first using the getTransactions tool
2. Look for patterns that indicate potential anomalies such as:
   - Unusually large transactions (significantly above normal spending patterns)
   - Transactions from unknown or suspicious merchants
   - Transactions at unusual locations or times
   - Transactions that don't match typical spending behavior
   - Gambling or high-risk merchant transactions
   - ATM withdrawals in unusual locations or amounts

3. Consider the context of each transaction (amount, merchant, description, date)
4. Identify the specific transaction IDs that appear anomalous
5. Provide clear reasoning for why each transaction is flagged as suspicious
6. Be thorough but not overly sensitive - only flag genuinely suspicious transactions

For each anomalous transaction, provide a specific description of why it's suspicious (e.g., "Unusually large luxury purchase that exceeds typical spending patterns by 500%").

For the summary, focus on the overall assessment rather than individual transaction details.

Analyze all transactions and provide a detailed assessment of any anomalies found.`,
});
