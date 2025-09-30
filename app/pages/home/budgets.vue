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
    <div class="mt-4">
      <div v-if="loading" class="card flex flex-col gap-3">
        Loading budgets...
      </div>
      <div v-else-if="!budget" class="card flex flex-col gap-3">
        No budgets found.
      </div>
      <div v-else class="flex flex-col gap-6">
        <div
          v-for="(type, transaction_type) in budget"
          :key="transaction_type"
          class="mb-4 relative"
        >
          <h2
            class="text-lg font-semibold capitalize mb-2 w-full sticky top-12 bg-gray-50 py-3 px-2 z-20"
          >
            {{ transaction_type }}
          </h2>
          <div
            v-for="(category, category_key) in type"
            :key="category_key"
            class="mb-3 card relative pt-3"
          >
            <h3
              class="text-base font-medium text-gray-700 mb-1 w-full sticky top-24 bg-white pt-1 pb-2 z-10"
            >
              {{ category_key }}
            </h3>
            <div class="flex flex-col gap-3">
              <div
                v-for="(amount, sub_category_key) in category"
                :key="sub_category_key"
                class="rounded-lg py-2 px-3 flex flex-col gap-1"
              >
                <!-- First row: Sub Category Name and Amount Input -->
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-800">
                    {{ sub_category_key }}
                  </span>
                  <UInput
                    :value="
                      budget?.[transaction_type]?.[category_key]?.[
                        sub_category_key
                      ]
                    "
                    :size="'sm'"
                    type="text"
                    class="w-24 text-right"
                  />
                </div>
                <!-- Second row: Progress Bar (static for now) -->
                <div
                  class="w-full h-2 bg-gray-200 rounded-full overflow-hidden"
                >
                  <div
                    class="h-full bg-primary-500 transition-all duration-300"
                    :style="{ width: '0%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
