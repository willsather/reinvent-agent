import z from "zod";

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
