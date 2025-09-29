<script setup lang="ts">
import type { Budget } from "~/types/database.types";
import { useBudgets } from "~/composables/useBudgets";
import { usePeriod } from "~/composables/usePeriod";
import { useAuth } from "~/composables/useAuth";
import { useCategories } from "~/composables/useCategories";
import { useSubCategories } from "~/composables/useSubCategories";

definePageMeta({ layout: "home" });

const { budget, fetchBudgets, createBudget, loading } = useBudgets();
const { selectedMonth, selectedYear } = usePeriod();
const { categories, getCategories } = useCategories();
const { subCategories, getSubCategories } = useSubCategories();

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
      const subCatObj: Record<string, number> = {};
      for (const sub of subCats) {
        subCatObj[sub.name] = 0;
      }
      if (category.type === "income") {
        budgetObj.income[category.name] = subCatObj;
      } else if (category.type === "expense") {
        budgetObj.expense[category.name] = subCatObj;
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

onMounted(() => {
  ensureBudgetsForPeriod();
});
</script>

<template>
  <section>
    <div class="mt-2">
      <div v-if="loading" class="card flex flex-col gap-3">
        Loading budgets...
      </div>
      <div v-else-if="!budget" class="card flex flex-col gap-3">
        No budgets found.
      </div>
      <div v-else class="card flex flex-col gap-3">
        <div v-for="(type, transaction_type) in budget" :key="transaction_type">
          {{ transaction_type }}
          <div
            v-for="(category, category_key) in type"
            :key="category_key"
            class="flex flex-col items-center justify-between"
          >
            {{ category_key }}
            <div class="flex flex-col gap-2">
              <div
                v-for="(sub_category, sub_category_key) in category"
                :key="sub_category_key"
              >
                {{ sub_category_key }}: {{ sub_category }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
