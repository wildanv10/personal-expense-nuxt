<script setup lang="ts">
const {
  selectedMonth,
  selectedYear,
  currentMonth,
  currentYear,
  monthNames,
  isFutureMonth,
  selectMonth,
} = usePeriod();

// State
const isPeriodPopupOpen = ref(false);
const activeYear = ref(selectedYear.value);

// Methods
function previousYear() {
  activeYear.value--;
}
function nextYear() {
  if (activeYear.value < currentYear) {
    activeYear.value++;
  }
}
function onSelectMonth(monthIndex: number) {
  if (!isFutureMonth(monthIndex, activeYear.value)) {
    selectMonth(monthIndex, activeYear.value);
    isPeriodPopupOpen.value = false;
  }
}
function onToggle(isOpen: boolean) {
  if (!isOpen) {
    setTimeout(() => {
      activeYear.value = selectedYear.value;
    }, 300);
  }
}
</script>

<template>
  <section class="relative my-2">
    <UPopover
      v-model:open="isPeriodPopupOpen"
      :content="{
        sideOffset: 0,
        collisionPadding: 0,
      }"
      @update:open="onToggle"
    >
      <UButton
        color="neutral"
        variant="ghost"
        size="lg"
        block
        class="rounded-2xl text-md font-bold py-3"
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
            <div class="text-md font-semibold">
              {{ activeYear }}
            </div>
            <UButton
              icon="lucide:chevron-right"
              color="neutral"
              variant="ghost"
              :disabled="activeYear >= currentYear"
              class="disabled:text-gray-400"
              @click="nextYear"
            />
          </div>

          <!-- Month Selector -->
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="(month, index) in monthNames"
              :key="index"
              :disabled="isFutureMonth(index, activeYear)"
              @click="onSelectMonth(index)"
              class="p-2 rounded text-sm font-medium transition-all hover:bg-primary hover:text-green-950 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-white"
              :class="{
                'bg-primary text-green-950':
                  index === selectedMonth && selectedYear === activeYear,
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
