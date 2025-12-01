# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package Management

**ALWAYS use pnpm** - this project uses pnpm 10.7.0 (specified in package.json). Never use npm or yarn.

## Commands

- **Install**: `pnpm install`
- **Development**: `pnpm dev` (pulls env vars and starts dev server)
- **Build**: `pnpm build`
- **Production**: `pnpm start`
- **Test**: `pnpm test` (runs Vitest)
- **Lint**: `pnpm lint` or `pnpm lint:fix` (uses Biome)

## Architecture

### AI Workflow System

This is a Next.js app using **Vercel Workflow** (`workflow` package) for durable AI agent execution. Key concepts:

**Workflow Pattern** (see https://useworkflow.dev/docs):
- Functions marked with `"use workflow"` are durable workflows
- Functions marked with `"use step"` are durable steps within workflows
- Workflows are started via `start(workflowFunction, args)` from `workflow/api`
- Access return values with `await run.returnValue`
- Example workflow definition:
  ```typescript
  import { anomalyAgent } from "@/lib/agents/anomaly-agent";

  export async function transactionAgentWorkflow() {
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
  ```
- Example starting a workflow in API route:
  ```typescript
  import { NextResponse } from "next/server";
  import { start } from "workflow/api";
  import { transactionAgentWorkflow } from "@/workflows/transaction-agent";

  export async function POST() {
    try {
      const run = await start(transactionAgentWorkflow, []);

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
  ```

**Agent Pattern** (see https://v6.ai-sdk.dev/docs/introduction):
- Always use AI SDK v6 beta (`ai` package version 6.0.0-beta.x)
- Agents are defined using `ToolLoopAgent` from `ai` package
- Agents have `model`, `tools`, `output` schema, and `instructions`
- Agents are instantiated once and reused (singleton pattern in `/lib/agents/`)
- Agents use `Output.object({ schema })` for structured outputs

**Model Selection via Vercel AI Gateway** (see https://vercel.com/docs/ai-gateway):
- **ALWAYS use string model identifiers**, never provider-specific SDKs
- Pattern: `"provider/model-name"` (e.g., `"openai/gpt-5-nano"`, `"anthropic/claude-sonnet-4"`)
- **NEVER import** `@ai-sdk/openai`, `@ai-sdk/anthropic`, or other provider packages
- Authentication via `VERCEL_OIDC_TOKEN` environment variable (automatically provided)
- AI Gateway handles routing, auth, rate limiting, and observability
- Example:
  ```typescript
  import { generateText } from 'ai';

  const { text } = await generateText({
    model: 'anthropic/claude-sonnet-4',
    prompt: 'What is the capital of France?',
  });
  ```

**Tool Pattern** (see https://v6.ai-sdk.dev/docs/introduction):
- Tools defined using `tool()` from `ai` with `description`, `inputSchema`, `execute`
- Tools in `/lib/tools/` are imported into agents
- Tool execute functions can be async and call the database layer
- Example tool definition:
  ```typescript
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
  ```

### Data Layer

**Database Interface** (`src/lib/db.ts`):
- Centralized data access through `db` object with namespaced methods
- Pattern: `await db.transactions.get()`
- Current implementation uses in-memory data, but interface allows easy swap to real DB
- Transaction schema defined with Zod for runtime validation

**Types**:
- All schemas defined with Zod in their respective modules
- `Transaction` type in `/lib/db.ts`
- `AnomalyResult` type in `/lib/anomaly.ts`

### Component Architecture

- **Server Components**: Components that fetch data (e.g., `TransactionsAccordion`, main `page.tsx`)
- **Client Components**: Interactive components marked with `"use client"` (e.g., `TransactionDisplay`)
- Server components fetch data via `await db.transactions.get()` and pass to client components as props

### API Routes

`/api/anomaly/route.ts`:
- Starts the `transactionAgentWorkflow` using Vercel Workflow
- Waits for workflow completion and returns structured JSON
- Called by client components to trigger anomaly detection

## Key Files

- `/src/workflows/transaction-agent.ts` - Main workflow definition
- `/src/lib/agents/anomaly-agent.ts` - Agent configuration with tools and instructions
- `/src/lib/db.ts` - Database interface and transaction data
- `/src/lib/tools/transactions.ts` - Tool definitions for agents
- `/src/lib/anomaly.ts` - Anomaly result schema

## Requirements

- Node.js >= 22
- pnpm 10.7.0
