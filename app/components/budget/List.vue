<script setup lang="ts">
const props = defineProps<{
  budget: object;
}>();
</script>

<template>
  <div>
    <div
      v-for="(type, transaction_type) in props.budget"
      :key="transaction_type"
      class="mb-4 relative"
    >
      <h2
        class="text-lg font-semibold capitalize mb-2 w-full sticky top-12 bg-gray-50 py-3 px-2 z-20"
      >
        {{ transaction_type }}
      </h2>

      <BudgetListCategory :budget="type" />
    </div>
  </div>
</template>
