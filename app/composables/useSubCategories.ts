import type { SubCategories } from "~/types/database.types";

export function useSubCategories() {
  const client = useSupabaseClient();
  const { userId } = useAuth();
  const subCategories = ref<SubCategories["Row"][]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const getSubCategories = async () => {
    loading.value = true;
    error.value = null;

    try {
      if (!userId.value) {
        throw new Error("User not authenticated");
      }

      const { data, error: err } = await client
        .from("sub_categories")
        .select("category_id, id, name, icon")
        .eq("user_id", userId.value);

      if (err) throw err;

      subCategories.value = data as SubCategories["Row"][];
    } catch (err: any) {
      error.value = err.message || "Unknown error";
    } finally {
      loading.value = false;
    }
  };

  const addSubCategory = async (payload: SubCategories["Insert"]) => {
    loading.value = true;
    error.value = null;

    try {
      if (!userId.value) {
        throw new Error("User not authenticated");
      }

      const { data, error: err } = await client
        .from("sub_categories")
        .insert({ ...payload, user_id: userId.value })
        .select()
        .single();

      if (err) throw err;

      const newCategory = data as SubCategories["Row"];
      subCategories.value.push(newCategory);
      return newCategory;
    } catch (err: any) {
      error.value = err.message || "Unknown error";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateSubCategory = async (
    id: number,
    payload: Partial<SubCategories["Update"]>
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: err } = await client
        .from("sub_categories")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

      if (err) throw err;

      const updatedCategory = data as SubCategories["Row"];
      const index = subCategories.value.findIndex((c) => c.id === id);
      if (index !== -1) {
        subCategories.value[index] = updatedCategory;
      }
      return updatedCategory;
    } catch (err: any) {
      error.value = err.message || "Unknown error";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteSubCategory = async (id: number) => {
    loading.value = true;
    error.value = null;

    try {
      const { error: err } = await client
        .from("sub_categories")
        .delete()
        .eq("id", id);

      if (err) throw err;

      subCategories.value = subCategories.value.filter((c) => c.id !== id);
    } catch (err: any) {
      error.value = err.message || "Unknown error";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    subCategories,
    loading,
    error,
    getSubCategories,
    addSubCategory,
    updateSubCategory,
    deleteSubCategory,
  };
}
