<script setup lang="ts">
import type { Enums, Transactions } from "~/types/database.types";
import { useTransactions } from "~/composables/useTransactions";

const { addTransaction } = useTransactions();
const { getCategoryOptions, categoryExpenseOptions, categoryIncomeOptions } =
  useCategories();

// State
const form = ref({
  type: "expense",
  amount: 0,
  category_id: "",
  payment_method_id: "",
  description: "",
  date: new Date().toISOString().substring(0, 10),
});
const loading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

// Mounted
onMounted(async () => {
  await getCategoryOptions();
});

// Methods
const getTransactionPayload = (): Transactions["Insert"] => {
  const formData = form.value;

  const [categoryIdStr, subCategoryIdStr] =
    formData.category_id?.split("-") ?? [];

  const categoryId = categoryIdStr ? parseInt(categoryIdStr) : null;
  const subCategoryId = subCategoryIdStr ? parseInt(subCategoryIdStr) : null;
  const paymentMethodId = form.value.payment_method_id
    ? parseInt(form.value.payment_method_id)
    : null;

  return {
    ...formData,
    type: formData.type as Enums<"transaction_type">,
    category_id: categoryId,
    sub_category_id: subCategoryId,
    payment_method_id: paymentMethodId,
  };
};

const handleSubmit = async () => {
  loading.value = true;
  successMessage.value = "";
  errorMessage.value = "";

  try {
    await addTransaction(getTransactionPayload());
    successMessage.value = "Transaction added successfully!";
    clearForm();

    navigateTo("/home/transactions");
  } catch (error: any) {
    errorMessage.value = error.message ?? "Failed to add transaction.";
  } finally {
    loading.value = false;
  }
};

const clearForm = () => {
  form.value = {
    type: "expense",
    amount: 0,
    category_id: "",
    payment_method_id: "",
    description: "",
    date: new Date().toISOString(),
  };
};

// Computed
const categoryOptions = computed(() => {
  return form.value.type === constants.expense
    ? categoryExpenseOptions.value
    : categoryIncomeOptions.value;
});

const transactionType = computed(() => form.value.type);

// Watcher
watch(transactionType, () => {
  form.value.category_id = "";
});
</script>

<template>
  <div class="max-w-md mx-auto p-4">
    <h1 class="text-xl font-semibold mb-4">Add Transaction</h1>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block mb-1">Type</label>
        <select v-model="form.type" class="border rounded p-2 w-full">
          <option
            v-for="type in constants.options.transactionType"
            :key="type.key"
            :value="type.key"
          >
            {{ type.value }}
          </option>
        </select>
      </div>

      <div>
        <label class="block mb-1">Amount</label>
        <input
          type="number"
          v-model.number="form.amount"
          class="border rounded p-2 w-full"
          required
        />
      </div>

      <div>
        <label class="block mb-1">Category</label>
        <select v-model="form.category_id" class="border rounded p-2 w-full">
          <option
            v-for="category in categoryOptions"
            :key="category.key"
            :value="category.key"
          >
            {{ category.value }}
          </option>
        </select>
      </div>

      <div>
        <label class="block mb-1">Description</label>
        <textarea
          v-model="form.description"
          class="border rounded p-2 w-full"
          rows="3"
        ></textarea>
      </div>

      <div>
        <label class="block mb-1">Transaction Date</label>
        <input
          type="date"
          v-model="form.date"
          class="border rounded p-2 w-full"
        />
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {{ loading ? "Saving..." : "Add Transaction" }}
      </button>
    </form>

    <p v-if="successMessage" class="text-green-600 mt-4">
      {{ successMessage }}
    </p>
    <p v-if="errorMessage" class="text-red-600 mt-4">{{ errorMessage }}</p>
  </div>
</template>
