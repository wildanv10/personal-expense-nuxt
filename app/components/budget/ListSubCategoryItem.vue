<script setup lang="ts">
import type { Database } from "~/types/database.types";
import { useSubCategories } from "~/composables/useSubCategories";
import { useBudgets } from "~/composables/useBudgets";
import debounce from "lodash.debounce";

// Composable
const { transactions } = useTransactions();
const { subCategories } = useSubCategories();
const { budgetInfo, budget, updateBudget } = useBudgets();

// Props
const props = defineProps<{
  transaction_type: Database["public"]["Enums"]["transaction_type"];
  category_id: number;
  sub_category_id: number;
  amount: number;
}>();

// State
const localAmount = ref(props.amount);

// Methods
function onAmountInput(e: Event) {
  const input = (e.target as HTMLInputElement).value;
  // Strip non-numeric characters
  const cleanedInput = input.replace(/\D/g, "");
  const parsedValue = cleanedInput ? parseInt(cleanedInput, 10) : 0;
  localAmount.value = parsedValue;

  // Update budget in composable and debounce DB update
  if (budgetInfo.value?.id) {
    // Clone and update local budget value immediately
    const updatedBudget = JSON.parse(
      JSON.stringify(budget.value || { income: {}, expense: {} })
    );
    if (!updatedBudget[props.transaction_type])
      updatedBudget[props.transaction_type] = {};
    if (!updatedBudget[props.transaction_type][props.category_id])
      updatedBudget[props.transaction_type][props.category_id] = {};
    updatedBudget[props.transaction_type][props.category_id][
      props.sub_category_id
    ] = parsedValue;
    budgetInfo.value.budget = updatedBudget;
    debouncedUpdateBudget(parsedValue);
  }
}
function onAmountKeyPress(e: KeyboardEvent) {
  // Allow only digits
  const char = e.key;
  if (!/[0-9]/.test(char)) {
    e.preventDefault();
  }
}
const debouncedUpdateBudget = debounce(async (amount: number) => {
  if (!budgetInfo.value?.id) return;
  // Clone the budget object to avoid mutating refs directly
  const updatedBudget = JSON.parse(
    JSON.stringify(budget.value || { income: {}, expense: {} })
  );
  if (!updatedBudget[props.transaction_type])
    updatedBudget[props.transaction_type] = {};
  if (!updatedBudget[props.transaction_type][props.category_id])
    updatedBudget[props.transaction_type][props.category_id] = {};
  updatedBudget[props.transaction_type][props.category_id][
    props.sub_category_id
  ] = amount;
  await updateBudget(budgetInfo.value?.id, { budget: updatedBudget });
}, 500);

// Computed
const subCategoryNameMap = computed(() => {
  const map: Record<number, string> = {};
  for (const sc of subCategories.value) {
    map[sc.id] = sc.name;
  }
  return map;
});
const formattedAmount = computed(() => {
  if (
    localAmount.value === null ||
    localAmount.value === undefined ||
    isNaN(localAmount.value)
  ) {
    return 0;
  }
  // Format with dot as thousands separator
  return localAmount.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
});
// Calculate total actual transaction amount for this subcategory
const actualAmount = computed(() => {
  // Only count transactions that match this sub_category_id, category_id, and transaction_type
  return transactions.value
    .filter(
      (t) =>
        t.type === props.transaction_type &&
        t.categories?.id === props.category_id &&
        t.sub_categories?.id === props.sub_category_id
    )
    .reduce((sum, t) => sum + (t.amount || 0), 0);
});

const isNoBudget = computed(
  () => !localAmount.value || localAmount.value === 0
);
const isNoTransactions = computed(
  () => !actualAmount.value || actualAmount.value === 0
);

// Calculate progress percentage (actual / budgeted)
const progressPercent = computed(() => {
  if (isNoBudget.value && isNoTransactions.value) return 0;
  else if (isNoBudget.value && !isNoTransactions.value) return 100;
  else {
    const percent = (actualAmount.value / localAmount.value) * 100;
    // return Math.min(100, Math.round(percent));
    return Math.round(percent);
  }
});

// Watcher
watch(
  () => props.amount,
  (newVal) => {
    localAmount.value = newVal;
  }
);
</script>

<template>
  <div class="rounded-lg py-1 flex flex-col">
    <!-- First row: Sub Category Name and Amount Input -->
    <div class="flex items-center justify-between">
      <span class="flex flex-col">
        <span class="text-sm text-gray-800">
          {{
            subCategoryNameMap[Number(props.sub_category_id)] ||
            `Sub Category - ${props.sub_category_id}`
          }}
        </span>

        <span class="text-sm">
          Total: {{ formatWithThousandSeparator(actualAmount) }}
        </span>
      </span>
      <UInput
        :value="formattedAmount"
        @input="onAmountInput"
        @keypress="onAmountKeyPress"
        :size="'md'"
        type="text"
        inputmode="numeric"
        class="w-24"
        :ui="{
          base: 'text-right py-1 px-2',
        }"
      />
    </div>
    <!-- Second row: Progress Bar -->
    <div class="flex items-center gap-1">
      <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          class="h-full transition-all duration-300"
          :class="{
            'bg-primary':
              !isNoBudget && !isNoTransactions && progressPercent <= 100,
            'bg-amber-600':
              (isNoBudget && !isNoTransactions) ||
              (!isNoBudget && !isNoTransactions && progressPercent > 100),
          }"
          :style="{ width: progressPercent + '%' }"
        ></div>
      </div>

      <span class="text-xs text-right flex items-center justify-end">
        <UIcon
          v-if="isNoBudget && !isNoTransactions"
          :name="`i-lucide-chevron-right`"
          size="12"
        />
        {{ progressPercent }}%
      </span>
    </div>
  </div>
</template>
