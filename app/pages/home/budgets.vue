<script setup lang="ts">
definePageMeta({ layout: "home" });

const { budget, loading } = useBudgets();
</script>

<template>
  <section>
    <div class="mt-4">
      <div v-if="loading" class="card flex flex-col gap-3">
        Loading budgets...
      </div>
      <div v-else-if="!budget" class="card flex flex-col gap-3">
        No budgets found.
      </div>
      <div v-else class="flex flex-col gap-6">
        <BudgetList :budget="budget" />
      </div>
    </div>
  </section>
</template>
