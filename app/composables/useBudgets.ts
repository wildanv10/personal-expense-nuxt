import type { PostgrestError } from "@supabase/supabase-js";
import type { Budgets } from "~/types/database.types";

export function useBudgets() {
  const client = useSupabaseClient();
  const budgets = ref<Budgets["Row"][]>([]);
  const error = ref<PostgrestError | null>(null);
  const loading = ref(false);

  // Get budgets for a user (optionally filter by month/year)
  const fetchBudgets = async (
    userId: string,
    month?: number,
    year?: number
  ) => {
    loading.value = true;
    error.value = null;

    let query = client.from("budgets").select("*").eq("user_id", userId);

    if (month) query = query.eq("month", month);
    if (year) query = query.eq("year", year);

    const { data, error: err } = await query.order("created_at", {
      ascending: false,
    });

    if (err) {
      error.value = err;
    } else {
      budgets.value = data ?? [];
    }

    loading.value = false;
  };

  // Create budget
  const createBudget = async (payload: Budgets["Insert"]) => {
    loading.value = true;
    error.value = null;

    const { data, error: err } = await client
      .from("budgets")
      .insert(payload)
      .select()
      .single();

    if (err) {
      error.value = err;
    }

    loading.value = false;
    return data as Budgets["Row"] | null;
  };

  // Update budget
  const updateBudget = async (id: string, payload: Budgets["Update"]) => {
    loading.value = true;
    error.value = null;

    const { data, error: err } = await client
      .from("budgets")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (err) {
      error.value = err;
    } else if (data) {
      const index = budgets.value.findIndex((b) => b.id === id);
      if (index !== -1) {
        const updatedBudget = data as Budgets["Row"];
        budgets.value[index] = updatedBudget as Budgets["Row"];
      }
    }

    loading.value = false;
    return data as Budgets["Row"] | null;
  };

  // Delete budget
  const deleteBudget = async (id: string) => {
    loading.value = true;
    error.value = null;

    const { error: err } = await client.from("budgets").delete().eq("id", id);

    if (err) {
      error.value = err;
    } else {
      budgets.value = budgets.value.filter((b) => b.id !== id);
    }

    loading.value = false;
  };

  return {
    budgets,
    error,
    loading,
    fetchBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
  };
}
