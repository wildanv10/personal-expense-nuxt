import type { Categories } from "~/types/database.types";

// TODO: aligning the loading and error assignment

export function useCategories() {
  const client = useSupabaseClient();
  const categories = ref<Categories["Row"][]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const getCategories = async () => {
    const { user } = useAuth();
    const userId = user.value?.id;

    loading.value = true;
    error.value = null;

    if (!userId) {
      error.value = "User not authenticated";
      loading.value = false;
      return;
    }

    const { data, error: err } = await client
      .from("categories")
      .select("id, name, type, icon")
      .eq("user_id", userId);

    if (err) error.value = err.message;
    else categories.value = data as Categories["Row"][];
    loading.value = false;
  };

  const addCategory = async (payload: Categories["Insert"]) => {
    const { user } = useAuth();
    const userId = user.value?.id;

    loading.value = true;
    error.value = null;

    if (!userId) {
      error.value = "User not authenticated";
      loading.value = false;
      return;
    }

    const { data, error: err } = await client
      .from("categories")
      .insert({ ...payload, user_id: userId })
      .select()
      .single();

    if (err) throw err;
    categories.value.push(data as Categories["Row"]);
    return data as Categories["Row"];
  };

  const updateCategory = async (
    id: number,
    payload: Partial<Categories["Update"]>
  ) => {
    const { data, error: err } = await client
      .from("categories")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (err) throw err;
    const index = categories.value.findIndex((c) => c.id === id);
    if (index !== -1) categories.value[index] = data as Categories["Row"];
    return data as Categories["Row"];
  };

  const deleteCategory = async (id: number) => {
    const { error: err } = await client
      .from("categories")
      .delete()
      .eq("id", id);

    if (err) throw err;
    categories.value = categories.value.filter((c) => c.id !== id);
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
