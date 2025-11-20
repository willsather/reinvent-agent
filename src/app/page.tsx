import { ToolsSection } from "@/components/tools-section";
import { TransactionDisplay } from "@/components/transaction-display";

export default function TransactionPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <TransactionDisplay />
        <ToolsSection />
      </div>
    </main>
  );
}
