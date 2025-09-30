<script setup lang="ts">
const { categories } = useCategories();

const props = defineProps<{
  budget: object;
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
      v-for="(category, category_id) in props.budget"
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
        <BudgetListSubCategory :category="category" />
      </div>
    </div>
  </div>
</template>
