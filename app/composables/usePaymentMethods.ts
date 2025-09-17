import type { PaymentMethods } from "~/types/database.types";

export function usePaymentMethods() {
  const client = useSupabaseClient();
  const paymentMethods = useState<PaymentMethods["Row"][]>(
    "paymentMethods",
    () => []
  );
  const loading = ref(false);
  const loadingDelete = ref(false);
  const error = ref<string | null>(null);
  const { user } = useAuth();

  const userId = computed(() => user.value?.id);

  const getPaymentMethods = async () => {
    if (paymentMethods.value.length > 1) return;

    loading.value = true;
    error.value = null;
    try {
      if (!userId.value) throw new Error("User not authenticated");

      const { data, error: err } = await client
        .from("payment_methods")
        .select("*")
        .eq("user_id", userId.value)
        .order("name", { ascending: true });

      if (err) throw err;
      paymentMethods.value = data ?? [];
    } catch (err: any) {
      error.value = err.message || "Unknown error";
    } finally {
      loading.value = false;
    }
  };

  const paymentMethodOptions = computed(() =>
    paymentMethods.value.map((pm) => ({
      key: pm.id.toString(),
      value: pm.name,
    }))
  );

  const getPaymentMethodById = async (
    id: number
  ): Promise<PaymentMethods["Row"] | undefined> => {
    if (paymentMethods.value.length < 1) {
      await getPaymentMethods();
    }

    return paymentMethods.value.find((pm) => pm.id === id);
  };

  const addPaymentMethod = async (payload: PaymentMethods["Insert"]) => {
    loading.value = true;
    error.value = null;
    try {
      if (!userId.value) throw new Error("User not authenticated");

      const { data, error: err } = await client
        .from("payment_methods")
        .insert({ ...payload, user_id: userId.value })
        .select()
        .single();

      if (err) throw err;
      const newPM = data as PaymentMethods["Row"];
      paymentMethods.value.unshift(newPM);
      return newPM;
    } catch (err: any) {
      error.value = err.message || "Unknown error";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updatePaymentMethod = async (
    id: number,
    updates: Partial<PaymentMethods["Update"]>
  ) => {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: err } = await client
        .from("payment_methods")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (err) throw err;
      const updated = data as PaymentMethods["Row"];
      const idx = paymentMethods.value.findIndex((pm) => pm.id === id);
      if (idx !== -1) paymentMethods.value[idx] = updated;
      return updated;
    } catch (err: any) {
      error.value = err.message || "Unknown error";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deletePaymentMethod = async (id: number) => {
    loadingDelete.value = true;
    error.value = null;
    try {
      if (!userId.value) throw new Error("User not authenticated");

      const { error: err } = await client
        .from("payment_methods")
        .delete()
        .eq("id", id);

      if (err) throw err;
      paymentMethods.value = paymentMethods.value.filter((pm) => pm.id !== id);
    } catch (err: any) {
      error.value = err.message || "Unknown error";
      throw err;
    } finally {
      loadingDelete.value = false;
    }
  };

  return {
    paymentMethods,
    loading,
    loadingDelete,
    error,
    getPaymentMethods,
    paymentMethodOptions,
    getPaymentMethodById,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
  };
}
