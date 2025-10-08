<script setup lang="ts">
import type { Section } from "~/types/sections";

const props = defineProps<{
  sections: Section[];
  selectedItem?: number | string | null;
}>();

function isActive(id: number | string | null) {
  return id === props.selectedItem;
}
</script>

<template>
  <div class="card">
    <!-- Card Title -->
    <div v-if="$slots['header']">
      <div class="flex items-center gap-2 text-lg font-heading">
        <slot name="header" />
      </div>
    </div>

    <!-- Card Content -->
    <div class="card-content pt-6 flex flex-col gap-3">
      <!-- Add Button -->
      <div v-if="$slots['content-add']">
        <slot name="content-add" />
      </div>

      <!-- Multiple Content Lists -->
      <div
        v-for="(section, sectionIndex) in sections"
        :key="`section-${sectionIndex}`"
        class="flex flex-col"
      >
        <div v-if="section.title" class="text-base font-medium text-gray-600">
          {{ section.title }}
        </div>

        <div
          v-for="(item, key) in section.items"
          :key="`item-${sectionIndex}-${key}`"
          class="flex items-center gap-2 py-1 px-2 border border-transparent"
          :class="{
            '!border-gray-200 shadow-xs rounded-lg': isActive(item.id),
          }"
        >
          <slot name="content-list" v-bind="item" />
        </div>
      </div>
    </div>
  </div>
</template>
