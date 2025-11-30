import { ToolsSection } from "@/components/tools-section";
import { TransactionDisplay } from "@/components/transaction-display";
import { db } from "@/lib/db";

export default async function TransactionPage() {
  const transactions = await db.transactions.get();

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <TransactionDisplay transactions={transactions} />
        <ToolsSection />
      </div>
    </main>
  );
}
