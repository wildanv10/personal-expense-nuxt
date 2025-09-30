<script setup lang="ts">
import type { Database } from "~/types/database.types";

const { categories } = useCategories();

const props = defineProps<{
  transaction_type: Database["public"]["Enums"]["transaction_type"];
  categories: object;
}>();

const categoryNameMap = computed(() => {
  const map: Record<number, string> = {};
  for (const c of categories.value) {
    map[c.id] = c.name;
  }
  return map;
});
</script>

<template>
  <div>
    <div
      v-for="(sub_categories, category_id) in props.categories"
      :key="category_id"
      class="mb-3 card relative pt-3"
    >
      <h3
        class="text-base font-medium text-gray-700 mb-1 w-full sticky top-24 bg-white pt-1 pb-2 z-10"
      >
        {{
          categoryNameMap[Number(category_id)] || `Category - ${category_id}`
        }}
      </h3>
      <div class="flex flex-col gap-3">
        <BudgetListSubCategory
          :transaction_type="transaction_type"
          :category_id="Number(category_id)"
          :sub_categories="sub_categories"
        />
      </div>
    </div>
  </div>
</template>
