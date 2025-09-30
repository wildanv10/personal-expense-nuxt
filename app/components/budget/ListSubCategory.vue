<script setup lang="ts">
import type { Database } from "~/types/database.types";

const props = defineProps<{
  transaction_type: Database["public"]["Enums"]["transaction_type"];
  category_id: number;
  sub_categories: object;
}>();
</script>

<template>
  <div class="flex flex-col gap-3">
    <div
      v-for="(amount, sub_category_id) in props.sub_categories"
      :key="sub_category_id"
      class="rounded-lg flex flex-col gap-1"
    >
      <BudgetListSubCategoryItem
        :transaction_type="transaction_type"
        :category_id="category_id"
        :sub_category_id="Number(sub_category_id)"
        :amount="amount"
      />
    </div>
  </div>
</template>
