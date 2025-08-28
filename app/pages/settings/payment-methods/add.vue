<script setup lang="ts">
import { usePaymentMethods } from "~/composables/usePaymentMethods";

const { addPaymentMethod, loading, error } = usePaymentMethods();

const form = ref({
  name: "",
  icon: "",
});

const handleSubmit = async () => {
  try {
    await addPaymentMethod(form.value);
    navigateTo(constants.routes.settings_payment_methods);
  } catch (err) {
    console.error("Failed to add payment method:", err);
  }
};
</script>

<template>
  <div class="max-w-md mx-auto">
    <h1 class="text-2xl font-semibold mb-4">Add Payment Method</h1>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Name -->
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700"
          >Name</label
        >
        <input
          v-model="form.name"
          type="text"
          id="name"
          class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          required
        />
      </div>

      <!-- Icon -->
      <div>
        <label for="icon" class="block text-sm font-medium text-gray-700"
          >Icon (optional)</label
        >
        <input
          v-model="form.icon"
          type="text"
          id="icon"
          maxlength="2"
          placeholder="💳"
          class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>

      <!-- Error message -->
      <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>

      <!-- Submit button -->
      <div class="flex gap-2">
        <NuxtLink :to="constants.routes.settings_payment_methods">
          <button
            type="submit"
            class="bg-gray-200 hover:bg-gray-400 px-4 py-2 rounded"
            :disabled="loading"
          >
            Cancel
          </button>
        </NuxtLink>
        <button
          type="submit"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          :disabled="loading"
        >
          {{ loading ? "Saving..." : "Save" }}
        </button>
      </div>
    </form>
  </div>
</template>
