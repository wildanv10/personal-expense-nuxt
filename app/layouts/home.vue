<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";

const { getTransactions, transactions } = useTransactions();
const { selectedMonth, selectedYear } = usePeriod();

// State
const selectedPage = ref("transactions");
const items = ref<TabsItem[]>([
  {
    label: "Transactions",
    value: "transactions",
  },
  {
    label: "Budgets",
    value: "budgets",
  },
]);
const summary = computed(() => calculateTransactionSummary(transactions.value));

onMounted(async () => {
  await getTransactions();
});

watch([selectedMonth, selectedYear], async ([newMonth, newYear]) => {
  await getTransactions();
});

watch(selectedPage, () => {
  navigateTo(selectedPage.value.toLowerCase());
});
</script>

<template>
  <div>
    <NuxtLayout name="default">
      <div>
        <!-- Summary -->
        <div
          class="w-vw bg-primary -mx-2 -mt-3 z-10 mb-0 pt-2 px-4 py-5 rounded-b-4xl"
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
                <UIcon name="i-lucide-plus" size="36" />
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

        <!-- Period Picker -->
        <HomePeriodSelector />

        <!-- Child Page -->

        <div class="flex">
          <UTabs
            v-model="selectedPage"
            color="neutral"
            variant="link"
            :content="false"
            :items="items"
            size="xl"
            :ui="{
              list: 'gap-3',
              trigger: 'px-0 py-1',
            }"
          />
        </div>
        <slot />
      </div>
    </NuxtLayout>
  </div>
</template>
