import { anomalyAgent } from "@/lib/agents/anomaly-agent";

export async function agentWorkflow() {
  "use workflow";

  return await agentStep();
}

async function agentStep() {
  "use step";

  const { output } = await anomalyAgent.generate({
    prompt: `Please analyze my financial transactions and detect any anomalies or suspicious activities. Get the transactions data first, then provide structured results with anomalies and summary.`,
  });

  return output;
}
