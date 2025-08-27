import type { Transactions } from "~/types/database.types";

export function useTransactions() {
  const client = useSupabaseClient();
  const transactions = ref<Transactions["Row"][]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const { user } = useAuth();
  const userId = user.value?.id;

  const getTransactions = async () => {
    loading.value = true;
    error.value = null;

    if (!userId) {
      error.value = "User not authenticated";
      loading.value = false;
      return;
    }

    const { data, error: err } = await client
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    loading.value = false;
    if (err) {
      error.value = err.message;
    } else {
      transactions.value = data ?? [];
    }
  };

  const addTransaction = async (transaction: Transactions["Insert"]) => {
    loading.value = true;
    error.value = null;

    if (!userId) {
      error.value = "User not authenticated";
      loading.value = false;
      return;
    }

    const { data, error: err } = await client
      .from("transactions")
      .insert({ user_id: userId, ...transaction })
      .select()
      .single();

    loading.value = false;
    if (err) {
      error.value = err.message;
      return null;
    } else {
      transactions.value.unshift(data);
      return data;
    }
  };

  const updateTransaction = async (
    id: number,
    updates: Transactions["Update"]
  ) => {
    loading.value = true;
    error.value = null;

    if (!userId) {
      error.value = "User not authenticated";
      loading.value = false;
      return;
    }

    const { data, error: err } = await client
      .from("transactions")
      .update({ user_id: userId, ...updates })
      .eq("id", id)
      .select()
      .single();

    loading.value = false;
    if (err) {
      error.value = err.message;
      return null;
    } else {
      const index = transactions.value.findIndex(
        (transaction: Transactions["Row"]) => transaction.id === id
      );
      if (index !== -1) transactions.value[index] = data as Transactions["Row"];
      return data as Transactions["Row"];
    }
  };

  const deleteTransaction = async (id: number) => {
    loading.value = true;
    error.value = null;

    if (!userId) {
      error.value = "User not authenticated";
      loading.value = false;
      return;
    }

    const { error: err } = await client
      .from("transactions")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    loading.value = false;
    if (err) {
      error.value = err.message;
    } else {
      transactions.value = transactions.value.filter(
        (transaction: Transactions["Row"]) => transaction.id !== id
      );
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
