<script setup lang="ts">
const { getTransactions, transactions } = useTransactions();

// State
const summary = computed(() => calculateTransactionSummary(transactions.value));

onMounted(async () => {
  await getTransactions();
});
</script>

<template>
  <div>
    <NuxtLayout name="default">
      <div>
        <div
          class="w-vw bg-primary -mx-2 -mt-3 z-10 mb-0 pt-2 px-4 pb-8 rounded-b-4xl"
        >
          <!-- Balance -->
          <div class="relative mb-4 text-green-900">
            <h1 class="text-xs">Balance</h1>
            <h2 class="text-2xl font-semibold">
              {{ formatWithThousandSeparator(summary.balance) }}
            </h2>

            <!-- Add Transaction Button -->
            <NuxtLink :to="constants.routes.transaction">
              <button
                type="button"
                class="absolute right-2 top-0 rounded-full flex text-primary bg-gradient-primary p-1 cursor-pointer active:bg-green-800/80 transition"
              >
                <UIcon name="i-lucide-plus" size="40" />
              </button>
            </NuxtLink>
          </div>

          <!-- Income & Expense -->
          <div class="flex justify-between gap-4">
            <!-- Expense -->
            <div
              class="flex grow items-center gap-2 bg-green-700/10 p-2 rounded-xl"
            >
              <UIcon name="i-lucide-wallet" size="32" />
              <div class="flex flex-col text-green-900">
                <h1 class="text-xs">Income</h1>
                <h2 class="font-semibold">
                  {{ formatWithThousandSeparator(summary.income) }}
                </h2>
              </div>
            </div>

            <!-- Income -->
            <div
              class="flex grow items-center gap-2 bg-green-700/10 p-2 rounded-xl"
            >
              <UIcon name="i-lucide-wallet" size="32" />
              <div class="flex flex-col text-green-900">
                <h1 class="text-xs">Expense</h1>
                <h2 class="font-semibold">
                  {{ formatWithThousandSeparator(summary.expense) }}
                </h2>
              </div>
            </div>
          </div>
        </div>

        <!-- Child Page -->
        <slot />
      </div>
    </NuxtLayout>
  </div>
</template>
