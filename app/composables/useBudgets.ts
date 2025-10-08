import type { PostgrestError } from "@supabase/supabase-js";
import type { Budgets, Budget } from "~/types/database.types";

export function useBudgets() {
  const client = useSupabaseClient();
  const { userId } = useAuth();
  const { selectedMonth, selectedYear } = usePeriod();
  const { categories, getCategories } = useCategories();
  const { subCategories, getSubCategories } = useSubCategories();
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

  const getBudgets = async () => {
    await Promise.all([getCategories(), getSubCategories()]);
    await fetchBudgets(selectedMonth.value + 1, selectedYear.value);

    if (!budget.value) {
      // Try to get previous month's budget
      let prevMonth = selectedMonth.value;
      let prevYear = selectedYear.value;
      if (prevMonth === 0) {
        prevMonth = 11;
        prevYear -= 1;
      } else {
        prevMonth -= 1;
      }

      // Fetch previous month's budget
      // Fetch previous month's budget and check budget.value
      let prevBudget: Budget | null = null;
      try {
        const prevBudgetInfo = await fetchPreviousBudgets(
          prevMonth + 1,
          prevYear
        );
        prevBudget = prevBudgetInfo?.budget || null;
      } catch (e) {
        prevBudget = null;
      }

      let budgetObj: Budget;
      if (prevBudget) {
        budgetObj = prevBudget;
      } else {
        // Generate Budget payload with zeros (existing logic)
        budgetObj = {
          income: {},
          expense: {},
        };
        // Group subCategories by category_id (skip if category_id is null)
        const subCategoriesByCategory: Record<
          number,
          typeof subCategories.value
        > = {};
        for (const sub of subCategories.value) {
          if (sub.category_id == null) continue;
          (subCategoriesByCategory[sub.category_id] ||= []).push(sub);
        }
        for (const category of categories.value) {
          const subCats = subCategoriesByCategory[category.id] || [];
          const subCatObj: Record<number, number> = {};
          for (const sub of subCats) {
            subCatObj[sub.id] = 0;
          }
          if (category.type === "income") {
            budgetObj.income[category.id] = subCatObj;
          } else if (category.type === "expense") {
            budgetObj.expense[category.id] = subCatObj;
          }
        }
      }

      // Execute createBudget
      await createBudget({
        month: selectedMonth.value + 1,
        year: selectedYear.value,
        budget: budgetObj,
      });
    }
  };

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

      const createdBudget = data as Budgets["Row"];
      budgetInfo.value = createdBudget;
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
    getBudgets,
    fetchBudgets,
    fetchPreviousBudgets,
    createBudget,
    updateBudget,
  };
}
