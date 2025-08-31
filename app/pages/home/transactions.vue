<script setup lang="ts">
const { getTransactions, transactions, loading, error } = useTransactions();

onMounted(async () => {
  await getTransactions();
});
</script>

<template>
  <div>
    <h1 class="font-semibold">Transactions</h1>

    <div
      class="mt-2"
      v-for="(date, id) in groupTransactionsByDate(transactions)"
      :key="id"
    >
      <div class="card flex flex-col gap-3">
        <h1 class="font-semibold text-xs text-gray-500 mb-2">
          {{ formatDate(id) }}
        </h1>
        <div
          class="flex items-center justify-between gap-3"
          v-for="transaction in date"
          :key="transaction.id"
        >
          <div class="flex items-center space-x-4">
            <div
              class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
            >
              <UIcon
                v-if="transaction.sub_categories?.icon"
                :name="`i-lucide-${transaction.sub_categories?.icon}`"
                size="16"
              />
            </div>
            <div>
              <p class="font-semibold text-gray-800">
                {{ transaction.sub_categories?.name }}
              </p>
              <p class="text-xs text-gray-500">
                {{ transaction.description }}
              </p>
            </div>
          </div>
          <div class="text-right">
            <p
              class="font-semibold text-gray-900"
              :class="{
                'text-red-500': transaction.type === constants.expense,
                'text-green-600': transaction.type === constants.income,
              }"
            >
              <span v-if="transaction.type === constants.expense">-</span>
              <span v-else-if="transaction.type === constants.income">+</span>
              {{ formatWithThousandSeparator(transaction.amount) }}
            </p>
            <p class="text-xs text-gray-500">&nbsp;</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
