import type { PostgrestError } from "@supabase/supabase-js";
import type { Budgets } from "~/types/database.types";

export function useBudgets() {
  const client = useSupabaseClient();
  const { userId } = useAuth();
  const budgetInfo = useState<Budgets["Row"]>("budgetInfo", () => ({
    id: "",
    user_id: "",
    month: 0,
    year: 0,
    budget: {} as Budgets["Row"]["budget"],
    created_at: null,
  }));
  const budget = computed<Budgets["Row"]["budget"]>(() => {
    return budgetInfo.value?.budget;
  });
  const error = ref<PostgrestError | null>(null);
  const loading = ref(false);

  // Get budgets for a user (optionally filter by month/year)
  const fetchBudgets = async (month?: number, year?: number) => {
    loading.value = true;
    error.value = null;
    try {
      if (!userId.value) {
        throw new Error("User not authenticated");
      }

      let query = client
        .from("budgets")
        .select("*")
        .eq("user_id", userId.value);

      if (month) query = query.eq("month", month);
      if (year) query = query.eq("year", year);

      // Only expect one budget per user per period
      const { data, error: err } = await query
        .order("created_at", { ascending: false })
        .limit(1);

      if (err) {
        error.value = err;
      } else {
        budgetInfo.value = data[0] as Budgets["Row"];
      }
    } catch (err: any) {
      error.value = err.message || "Unknown error";
    } finally {
      loading.value = false;
    }
  };

  // Get previous budgets to get the budget template
  const fetchPreviousBudgets = async (month?: number, year?: number) => {
    loading.value = true;
    error.value = null;
    try {
      if (!userId.value) {
        throw new Error("User not authenticated");
      }

      let query = client
        .from("budgets")
        .select("*")
        .eq("user_id", userId.value);

      if (month) query = query.eq("month", month);
      if (year) query = query.eq("year", year);

      // Only expect one budget per user per period
      const { data, error: err } = await query
        .order("created_at", { ascending: false })
        .limit(1);

      if (err) {
        error.value = err;
      } else {
        return data[0] as Budgets["Row"];
      }
    } catch (err: any) {
      error.value = err.message || "Unknown error";
    } finally {
      loading.value = false;
    }
  };

  // Create budget
  const createBudget = async (payload: Budgets["Insert"]) => {
    loading.value = true;
    error.value = null;

    try {
      if (!userId.value) {
        throw new Error("User not authenticated");
      }

      const { data, error: err } = await client
        .from("budgets")
        .insert({ user_id: userId.value, ...payload })
        .select()
        .single();

      if (err) {
        error.value = err;
      }

      const createdBudget = data as Budgets["Row"] | null;
      budgetInfo.value.budget =
        createdBudget?.budget as Budgets["Row"]["budget"];
      return createdBudget;
    } catch (err: any) {
      error.value = err.message || "Unknown error";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Update budget
  const updateBudget = async (id: string, payload: Budgets["Update"]) => {
    loading.value = true;
    error.value = null;

    try {
      if (!userId.value) {
        throw new Error("User not authenticated");
      }

      const { data, error: err } = await client
        .from("budgets")
        .update({ user_id: userId.value, ...payload })
        .eq("id", id)
        .select()
        .single();

      if (err) {
        error.value = err;
      } else if (data) {
        const updatedBudget = data as Budgets["Row"];
        budgetInfo.value.budget =
          updatedBudget.budget as Budgets["Row"]["budget"];
      }

      return data as Budgets["Row"] | null;
    } catch (err: any) {
      error.value = err.message || "Unknown error";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    budgetInfo,
    budget,
    error,
    loading,
    fetchBudgets,
    fetchPreviousBudgets,
    createBudget,
    updateBudget,
  };
}
