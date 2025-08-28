<script setup lang="ts">
const { getPaymentMethods, paymentMethods, loading, error } =
  usePaymentMethods();

onMounted(async () => {
  await getPaymentMethods();
});
</script>

<template>
  <div>
    <h1>Payment Methods</h1>
    <NuxtLink :to="constants.routes.settings_payment_methods_add">
      <button
        type="button"
        class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Add Payment Method
      </button>
    </NuxtLink>

    <div>Table Listing</div>
    <p>
      {{ paymentMethods }}
    </p>
  </div>
</template>
