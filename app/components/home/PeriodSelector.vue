<script setup lang="ts">
const {
  selectedMonth,
  selectedYear,
  currentYear,
  monthNames,
  isFutureMonth,
  previousYear,
  nextYear,
  selectMonth,
} = usePeriod();

const isPeriodPopupOpen = ref(false);

function onSelectMonth(index: number) {
  isPeriodPopupOpen.value = false;
  selectMonth(index);
}
</script>

<template>
  <section class="relative my-3">
    <UPopover
      v-model:open="isPeriodPopupOpen"
      :content="{
        sideOffset: 0,
        collisionPadding: 0,
      }"
    >
      <UButton
        color="neutral"
        variant="ghost"
        size="xl"
        block
        class="rounded-2xl text-xl py-3"
      >
        {{ monthNames[selectedMonth] }} {{ selectedYear }}
      </UButton>

      <template #content>
        <div class="max-w-md w-full bg-white rounded-lg shadow p-4">
          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <UButton
              icon="lucide:chevron-left"
              color="neutral"
              variant="ghost"
              @click="previousYear"
            />
            <div class="text-lg font-semibold">
              {{ selectedYear }}
            </div>
            <UButton
              icon="lucide:chevron-right"
              color="neutral"
              variant="ghost"
              :disabled="selectedYear >= currentYear"
              class="disabled:text-gray-400"
              @click="nextYear"
            />
          </div>

          <!-- Month Selector -->
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="(month, index) in monthNames"
              :key="index"
              :disabled="isFutureMonth(index)"
              @click="onSelectMonth(index)"
              class="p-2 rounded text-sm font-medium transition-all hover:bg-primary hover:text-green-950 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-white"
              :class="{
                'bg-lime-500 text-green-950':
                  index === selectedMonth && selectedYear === currentYear,
                'bg-gray-100':
                  index === selectedMonth && selectedYear !== currentYear,
              }"
            >
              {{ month }}
            </button>
          </div>
        </div>
      </template>
    </UPopover>
  </section>
</template>
