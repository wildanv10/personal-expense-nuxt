<script setup lang="ts">
import type { Budget } from "~/types/database.types";
import { useBudgets } from "~/composables/useBudgets";
import { usePeriod } from "~/composables/usePeriod";
import { useCategories } from "~/composables/useCategories";
import { useSubCategories } from "~/composables/useSubCategories";

definePageMeta({ layout: "home" });

const { budget, fetchBudgets, createBudget, loading } = useBudgets();
const { selectedMonth, selectedYear } = usePeriod();
const { categories, getCategories } = useCategories();
const { subCategories, getSubCategories } = useSubCategories();

onMounted(() => {
  ensureBudgetsForPeriod();
});

// Methods
async function ensureBudgetsForPeriod() {
  await Promise.all([getCategories(), getSubCategories()]);
  await fetchBudgets(selectedMonth.value + 1, selectedYear.value);

  if (!budget.value) {
    // Generate Budget payload
    const budgetObj: Budget = {
      income: {},
      expense: {},
    };

    // Group subCategories by category_id (skip if category_id is null)
    const subCategoriesByCategory: Record<number, typeof subCategories.value> =
      {};
    for (const sub of subCategories.value) {
      if (sub.category_id == null) continue;
      (subCategoriesByCategory[sub.category_id] ||= []).push(sub);
    }

    for (const category of categories.value) {
      const subCats = subCategoriesByCategory[category.id] || [];
      const subCatObj: Record<number, number> = {};
      for (const sub of subCats) {
        subCatObj[sub.id] = 0;
      }
      if (category.type === "income") {
        budgetObj.income[category.id] = subCatObj;
      } else if (category.type === "expense") {
        budgetObj.expense[category.id] = subCatObj;
      }
    }

    // Execute createBudget
    await createBudget({
      month: selectedMonth.value + 1,
      year: selectedYear.value,
      budget: budgetObj,
    });
  }
}

// Computed
const categoryNameMap = computed(() => {
  const map: Record<number, string> = {};
  for (const c of categories.value) {
    map[c.id] = c.name;
  }
  return map;
});

const subCategoryNameMap = computed(() => {
  const map: Record<number, string> = {};
  for (const sc of subCategories.value) {
    map[sc.id] = sc.name;
  }
  return map;
});
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
