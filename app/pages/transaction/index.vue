<script setup lang="ts">
import type { Enums, Transactions } from "~/types/database.types";
import { useTransactions } from "~/composables/useTransactions";
import { usePaymentMethods } from "~/composables/usePaymentMethods";

const { addTransaction, error } = useTransactions();
const { getCategoryOptions, categoryExpenseOptions, categoryIncomeOptions } =
  useCategories();
const { getPaymentMethods, paymentMethodOptions } = usePaymentMethods();
const toast = useToast();

// State
const form = ref({
  type: "expense" as Enums<"transaction_type">,
  amount: null as any,
  category_id: undefined as string | undefined,
  payment_method_id: undefined as string | undefined,
  description: "",
  date: new Date().toISOString().substring(0, 10),
});
const loading = ref(false);
const transactionTypes = [
  { value: "expense", label: "Expense" },
  { value: "income", label: "Income" },
];

// Mounted
onMounted(async () => {
  await Promise.all([getCategoryOptions(), getPaymentMethods()]);
});

// Methods
const getTransactionPayload = (): Transactions["Insert"] => {
  const formData = form.value;

  const [categoryIdStr, subCategoryIdStr] = formData.category_id
    ? formData.category_id?.split("-")
    : [];

  const categoryId = categoryIdStr ? parseInt(categoryIdStr) : null;
  const subCategoryId = subCategoryIdStr ? parseInt(subCategoryIdStr) : null;
  const paymentMethodId = form.value.payment_method_id
    ? parseInt(form.value.payment_method_id)
    : null;

  return {
    ...formData,
    type: formData.type,
    category_id: categoryId,
    sub_category_id: subCategoryId,
    payment_method_id: paymentMethodId,
  };
};

const handleSubmit = async () => {
  loading.value = true;

  try {
    await addTransaction(getTransactionPayload());
    clearForm();

    toast.add({
      title: "Success",
      description: "The Transaction has been added.",
      color: "success",
    });

    navigateTo("/home/transactions");
  } catch (err: any) {
    console.error(err.message || error);

    toast.add({
      title: "Error",
      description: err.message || error,
      color: "error",
    });
  } finally {
    loading.value = false;
  }
};

const clearForm = () => {
  form.value = {
    type: "expense",
    amount: null,
    category_id: undefined,
    payment_method_id: undefined,
    description: "",
    date: new Date().toISOString().substring(0, 10),
  };
};

function onAmountInput(e: Event) {
  const input = (e.target as HTMLInputElement).value;
  // Strip non-numeric characters
  const cleanedInput = input.replace(/\D/g, "");
  form.value.amount = cleanedInput ? parseInt(cleanedInput, 10) : null;
}

function onAmountKeyPress(e: KeyboardEvent) {
  // Allow only digits
  const char = e.key;
  if (!/[0-9]/.test(char)) {
    e.preventDefault();
  }
}

// Computed
const categoryOptions = computed(() => {
  return form.value.type === "expense"
    ? categoryExpenseOptions.value
    : categoryIncomeOptions.value;
});

const transactionType = computed(() => form.value.type);

const formattedAmount = computed(() => {
  if (
    form.value.amount === null ||
    form.value.amount === undefined ||
    isNaN(form.value.amount)
  ) {
    return "";
  }
  // Format with dot as thousands separator
  return form.value.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
});

// Watcher
watch(transactionType, () => {
  form.value.category_id = undefined;
});
</script>

<template>
  <section class="flex flex-col gap-3">
    <div class="card">
      <!-- Card Title -->
      <div>
        <div class="flex items-center gap-2 text-lg font-heading">
          <UIcon name="i-lucide-settings-2" class="size-6" />
          Add Transaction
        </div>
      </div>

      <!-- Card Content -->
      <UForm
        :state="form"
        class="mt-3 space-y-4"
        @submit.prevent="handleSubmit"
      >
        <UTabs
          v-model="form.type"
          :items="transactionTypes"
          class="w-full mb-7"
          size="lg"
        />

        <UFormField name="date">
          <UInput
            type="date"
            v-model="form.date"
            icon="i-lucide-calendar"
            class="w-full"
            size="xl"
          />
        </UFormField>

        <UFormField name="amount">
          <UInput
            :value="formattedAmount"
            @input="onAmountInput"
            @keypress="onAmountKeyPress"
            placeholder="Amount"
            required
            class="w-full"
            size="xl"
            autofocus
          />
        </UFormField>

        <UFormField name="category_id">
          <USelectMenu
            v-model="form.category_id"
            :items="categoryOptions"
            value-key="key"
            label-key="value"
            placeholder="Select Category"
            class="w-full"
            size="xl"
          />
        </UFormField>

        <UFormField name="payment_method_id">
          <USelectMenu
            v-model="form.payment_method_id"
            :items="paymentMethodOptions"
            value-key="key"
            label-key="value"
            placeholder="Select a payment method"
            class="w-full"
            size="xl"
          />
        </UFormField>

        <UFormField name="description">
          <UTextarea
            v-model="form.description"
            placeholder="Add a note"
            :rows="3"
            class="w-full"
            size="xl"
          />
        </UFormField>

        <UButton
          type="submit"
          :loading="loading"
          color="primary"
          variant="solid"
          block
          size="xl"
        >
          {{ loading ? "Adding..." : "Add Transaction" }}
        </UButton>
      </UForm>
    </div>
  </section>
</template>
