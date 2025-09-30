<script setup lang="ts">
import { useSubCategories } from "~/composables/useSubCategories";

const { subCategories } = useSubCategories();

const props = defineProps<{
  sub_category_id: number;
  amount: number;
}>();

const localAmount = ref(props.amount);

// Methods
function onAmountInput(e: Event) {
  const input = (e.target as HTMLInputElement).value;
  // Strip non-numeric characters
  const cleanedInput = input.replace(/\D/g, "");
  const parsedValue = cleanedInput ? parseInt(cleanedInput, 10) : 0;
  localAmount.value = parsedValue;

  // Emit cleaned Amount value to parent
  console.log("Amount: ", parsedValue);
}

function onAmountKeyPress(e: KeyboardEvent) {
  // Allow only digits
  const char = e.key;
  if (!/[0-9]/.test(char)) {
    e.preventDefault();
  }
}

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

// Watcher
watch(
  () => props.amount,
  (newVal) => {
    localAmount.value = newVal;
  }
);
</script>

<template>
  <div class="rounded-lg py-1 flex flex-col gap-1">
    <!-- First row: Sub Category Name and Amount Input -->
    <div class="flex items-center justify-between">
      <span class="text-sm text-gray-800">
        {{
          subCategoryNameMap[Number(props.sub_category_id)] ||
          `Sub Category - ${props.sub_category_id}`
        }}
      </span>
      <UInput
        :value="formattedAmount"
        @input="onAmountInput"
        @keypress="onAmountKeyPress"
        :size="'sm'"
        type="text"
        inputmode="numeric"
        class="w-24"
        :ui="{
          base: 'text-right',
        }"
      />
    </div>
    <!-- Second row: Progress Bar (static for now) -->
    <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        class="h-full bg-primary-500 transition-all duration-300"
        :style="{ width: '0%' }"
      ></div>
    </div>
  </div>
</template>
