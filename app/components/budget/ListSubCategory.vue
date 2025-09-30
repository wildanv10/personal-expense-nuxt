<script setup lang="ts">
const props = defineProps<{
  category: object;
}>();
</script>

<template>
  <div class="flex flex-col gap-3">
    <div
      v-for="(amount, sub_category_id) in props.category"
      :key="sub_category_id"
      class="rounded-lg flex flex-col gap-1"
    >
      <BudgetListSubCategoryItem
        :sub_category_id="Number(sub_category_id)"
        :amount="amount"
      />
    </div>
  </div>
</template>
