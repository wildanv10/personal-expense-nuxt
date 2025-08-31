import type { Transactions } from "~/types/database.types";
import type { TransactionWithRelations } from "~/types/transactions";

export function useTransactions() {
  const client = useSupabaseClient();
  const { userId } = useAuth();
  const transactions = ref<TransactionWithRelations[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const getTransactions = async () => {
    loading.value = true;
    error.value = null;

    try {
      if (!userId.value) {
        throw new Error("User not authenticated");
      }

      const { data, error: err } = await client
        .from("transactions")
        .select(
          `
            id,
            type,
            date,
            amount,
            description,
            created_at,
            categories (
              id,
              name,
              icon
            ),
            sub_categories (
              id,
              name,
              icon
            ),
            payment_methods (
              id,
              name,
              icon
            )
          `
        )
        .eq("user_id", userId.value)
        .order("date", { ascending: false });

      if (err) throw err;

      transactions.value = (data as TransactionWithRelations[]) ?? [];
    } catch (err: any) {
      error.value = err.message || "Unknown error";
    } finally {
      loading.value = false;
    }
  };

  const addTransaction = async (transaction: Transactions["Insert"]) => {
    loading.value = true;
    error.value = null;

    try {
      if (!userId.value) {
        throw new Error("User not authenticated");
      }

      const { data, error: err } = await client
        .from("transactions")
        .insert({ user_id: userId.value, ...transaction })
        .select()
        .single();

      if (err) throw err;

      const newTransaction = data as Transactions["Row"];
      return newTransaction;
    } catch (err: any) {
      error.value = err.message || "Unknown error";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateTransaction = async (
    id: number,
    updates: Transactions["Update"]
  ) => {
    loading.value = true;
    error.value = null;

    try {
      if (!userId.value) {
        throw new Error("User not authenticated");
      }

      const { data, error: err } = await client
        .from("transactions")
        .update({ user_id: userId.value, ...updates })
        .eq("id", id)
        .select()
        .single();

      if (err) throw err;

      const updatedTransaction = data as Transactions["Row"];
      return updatedTransaction;
    } catch (err: any) {
      error.value = err.message || "Unknown error";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteTransaction = async (id: number) => {
    loading.value = true;
    error.value = null;

    try {
      if (!userId.value) {
        throw new Error("User not authenticated");
      }

      const { error: err } = await client
        .from("transactions")
        .delete()
        .eq("id", id)
        .eq("user_id", userId.value);

      if (err) throw err;

      transactions.value = transactions.value.filter((t) => t.id !== id);
    } catch (err: any) {
      error.value = err.message || "Unknown error";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    transactions,
    loading,
    error,
    getTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
