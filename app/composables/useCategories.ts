import type { Categories } from "~/types/database.types";

export function useCategories() {
  const client = useSupabaseClient();
  const { user } = useAuth();
  const categories = ref<Categories["Row"][]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const userId = computed(() => user.value?.id);

  const getCategories = async () => {
    loading.value = true;
    error.value = null;

    try {
      if (!userId.value) {
        throw new Error("User not authenticated");
      }

      const { data, error: err } = await client
        .from("categories")
        .select("id, name, type, icon")
        .eq("user_id", userId.value);

      if (err) throw err;

      categories.value = data as Categories["Row"][];
    } catch (err: any) {
      error.value = err.message || "Unknown error";
    } finally {
      loading.value = false;
    }
  };

  const addCategory = async (payload: Categories["Insert"]) => {
    loading.value = true;
    error.value = null;

    try {
      if (!userId.value) {
        throw new Error("User not authenticated");
      }

      const { data, error: err } = await client
        .from("categories")
        .insert({ ...payload, user_id: userId.value })
        .select()
        .single();

      if (err) throw err;

      const newCategory = data as Categories["Row"];
      categories.value.push(newCategory);
      return newCategory;
    } catch (err: any) {
      error.value = err.message || "Unknown error";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateCategory = async (
    id: number,
    payload: Partial<Categories["Update"]>
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: err } = await client
        .from("categories")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

      if (err) throw err;

      const updatedCategory = data as Categories["Row"];
      const index = categories.value.findIndex((c) => c.id === id);
      if (index !== -1) {
        categories.value[index] = updatedCategory;
      }
      return updatedCategory;
    } catch (err: any) {
      error.value = err.message || "Unknown error";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteCategory = async (id: number) => {
    loading.value = true;
    error.value = null;

    try {
      const { error: err } = await client
        .from("categories")
        .delete()
        .eq("id", id);

      if (err) throw err;

      categories.value = categories.value.filter((c) => c.id !== id);
    } catch (err: any) {
      error.value = err.message || "Unknown error";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    categories,
    loading,
    error,
    getCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
}
