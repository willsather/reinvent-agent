import { z } from "zod";

export const transactionSchema = z.object({
  id: z.string(),
  amount: z.number(),
  name: z.string(),
  description: z.string(),
  date: z.string(),
  isAnomaly: z.boolean().optional(),
});

export type Transaction = z.infer<typeof transactionSchema>;

export const anomalyResultSchema = z.object({
  anomalies: z.array(
    z.object({
      transactionId: z.string(),
      description: z.string(),
    }),
  ),
  summary: z.string(),
});

export type AnomalyResult = z.infer<typeof anomalyResultSchema>;

export const dummyTransactions: Transaction[] = [
  {
    id: "txn_001",
    amount: -45.23,
    name: "Starbucks",
    description: "Coffee and pastry",
    date: "2024-10-23",
  },
  {
    id: "txn_002",
    amount: -1250.0,
    name: "Rent Payment",
    description: "Monthly apartment rent",
    date: "2024-10-01",
  },
  {
    id: "txn_003",
    amount: -89.99,
    name: "Amazon",
    description: "Household supplies",
    date: "2024-10-20",
  },
  {
    id: "txn_004",
    amount: 2500.0,
    name: "Salary Deposit",
    description: "Bi-weekly paycheck",
    date: "2024-10-15",
  },
  {
    id: "txn_005",
    amount: -15000.0,
    name: "Luxury Watch Store",
    description: "Rolex Submariner",
    date: "2024-10-22",
  },
  {
    id: "txn_006",
    amount: -12.5,
    name: "Netflix",
    description: "Monthly subscription",
    date: "2024-10-10",
  },
  {
    id: "txn_007",
    amount: -350.0,
    name: "Grocery Store",
    description: "Weekly groceries",
    date: "2024-10-21",
  },
  {
    id: "txn_008",
    amount: -5.99,
    name: "Coffee Shop",
    description: "Morning latte",
    date: "2024-10-19",
  },
  {
    id: "txn_009",
    amount: -8500.0,
    name: "Unknown Merchant",
    description: "ATM withdrawal - unusual location",
    date: "2024-10-18",
  },
  {
    id: "txn_010",
    amount: -85.0,
    name: "Gas Station",
    description: "Fuel purchase",
    date: "2024-10-17",
  },
  {
    id: "txn_011",
    amount: 2500.0,
    name: "Salary Deposit",
    description: "Bi-weekly paycheck",
    date: "2024-10-01",
  },
  {
    id: "txn_012",
    amount: -2500.0,
    name: "Online Casino",
    description: "Gambling transaction",
    date: "2024-10-16",
  },
];
