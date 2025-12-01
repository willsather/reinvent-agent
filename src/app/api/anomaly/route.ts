import { NextResponse } from "next/server";
import { start } from "workflow/api";

import { agentWorkflow } from "@/workflows/agent-workflow";

export async function POST() {
  try {
    const run = await start(agentWorkflow, []);

    // wait for the workflow to complete
    const anomalies = await run.returnValue;

    return NextResponse.json(anomalies);
  } catch (error) {
    console.error("Error in anomaly detection:", error);

    return NextResponse.json(
      { error: "Failed to detect anomalies" },
      { status: 500 },
    );
  }
}
