<script setup lang="ts">
import type { Budget } from "~/types/database.types";

definePageMeta({ layout: "home" });

const { budget, fetchBudgets, fetchPreviousBudgets, createBudget, loading } =
  useBudgets();
const { selectedMonth, selectedYear } = usePeriod();
const { categories, getCategories } = useCategories();
const { subCategories, getSubCategories } = useSubCategories();

onMounted(async () => {
  await ensureBudgetsForPeriod();
});

// Methods
async function ensureBudgetsForPeriod() {
  await Promise.all([getCategories(), getSubCategories()]);
  await fetchBudgets(selectedMonth.value + 1, selectedYear.value);

  if (!budget.value) {
    // Try to get previous month's budget
    let prevMonth = selectedMonth.value;
    let prevYear = selectedYear.value;
    if (prevMonth === 0) {
      prevMonth = 11;
      prevYear -= 1;
    } else {
      prevMonth -= 1;
    }

    // Fetch previous month's budget
    // Fetch previous month's budget and check budget.value
    let prevBudget: Budget | null = null;
    try {
      const prevBudgetInfo = await fetchPreviousBudgets(
        prevMonth + 1,
        prevYear
      );
      prevBudget = prevBudgetInfo?.budget || null;
    } catch (e) {
      prevBudget = null;
    }

    let budgetObj: Budget;
    if (prevBudget) {
      budgetObj = prevBudget;
    } else {
      // Generate Budget payload with zeros (existing logic)
      budgetObj = {
        income: {},
        expense: {},
      };
      // Group subCategories by category_id (skip if category_id is null)
      const subCategoriesByCategory: Record<
        number,
        typeof subCategories.value
      > = {};
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
    }

    // Execute createBudget
    await createBudget({
      month: selectedMonth.value + 1,
      year: selectedYear.value,
      budget: budgetObj,
    });
  }
}

// Watcher
watch([selectedMonth, selectedYear], async () => {
  await ensureBudgetsForPeriod();
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
