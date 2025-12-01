import { Header } from "@/components/header";
import { TransactionList } from "@/components/transaction-list";
import { db } from "@/lib/db";

export default async function TransactionPage() {
  const transactions = await db.transactions.get();

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <Header />

        <TransactionList transactions={transactions} />
      </div>
    </main>
  );
}
