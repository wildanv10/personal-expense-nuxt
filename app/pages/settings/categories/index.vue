<script setup lang="ts">
import type { Section, SectionItem } from "~/types/sections";

// Composables
const { getCategories, categories, loading, error } = useCategories();

// Types
type categoryId = number | null;

// State
const selectedId = ref<categoryId>(null);
const isDrawerAddOpen = ref(false);
const isDrawerEditOpen = ref(false);

onMounted(async () => {
  await getCategories();
});

// Methods
function selectCategory(id: categoryId) {
  selectedId.value = id;
  isDrawerEditOpen.value = true;
}
function openSubCategory(id: categoryId) {
  navigateTo(`${constants.routes.settings_categories}/${id}`);
}
async function onAddCategory() {
  isDrawerAddOpen.value = false;
  await getCategories();
}
async function onUpdateCategory() {
  onCloseDrawerEdit();
  await getCategories();
}
async function onCloseDrawerEdit() {
  isDrawerEditOpen.value = false;
  selectedId.value = null;
}

// Computed
const sections = computed<Section[]>(() => {
  const grouped = categories.value.reduce<Record<string, SectionItem[]>>(
    (acc, item) => {
      (acc[item.type] ??= []).push(item);
      return acc;
    },
    {}
  );

  return Object.entries(grouped)
    .sort(([typeA], [typeB]) => {
      if (typeA === "expense") return -1;
      if (typeB === "expense") return 1;
      return typeA.localeCompare(typeB);
    })
    .map(([type, items]) => ({
      title: type.charAt(0).toUpperCase() + type.slice(1),
      items,
    }));
});
</script>

<template>
  <section>
    <SettingsConfigurationCard :sections="sections" :selected-item="selectedId">
      <template #header>
        <UIcon name="i-lucide-box" class="size-6" />
        Categories
      </template>

      <template #content-add>
        <UButton
          icon="i-lucide-plus"
          size="lg"
          color="neutral"
          variant="outline"
          block
          @click="isDrawerAddOpen = true"
        >
          Add Category
        </UButton>
      </template>

      <template #content-list="item">
        <UIcon :name="`i-lucide-${item.icon}`" />
        <div class="grow">
          <p>
            {{ item.name }}
          </p>
        </div>
        <span class="flex items-center gap-1">
          <UIcon
            name="i-lucide-ellipsis-vertical"
            @click="selectCategory(item.id)"
          />
          <USeparator orientation="vertical" class="h-3" />
          <UIcon
            name="i-lucide-chevron-right"
            @click="openSubCategory(item.id)"
          />
        </span>
      </template>
    </SettingsConfigurationCard>

    <!-- Drawer Add -->
    <UDrawer
      v-model:open="isDrawerAddOpen"
      :dismissible="false"
      :handle="false"
      :ui="{ header: 'flex items-center justify-between' }"
    >
      <template #header>
        <h2 class="text-highlighted font-semibold">Add Category</h2>

        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-x"
          @click="isDrawerAddOpen = false"
        />
      </template>

      <template #body>
        <SettingsCategoryAdd class="px-4" @submit="onAddCategory" />
      </template>
    </UDrawer>

    <!-- Drawer Edit -->
    <UDrawer
      v-model:open="isDrawerEditOpen"
      :dismissible="false"
      :handle="false"
      :ui="{ header: 'flex items-center justify-between' }"
    >
      <template #header>
        <h2 class="text-highlighted font-semibold">Edit Category</h2>

        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-x"
          @click="onCloseDrawerEdit"
        />
      </template>

      <template #body>
        <SettingsCategoryEdit
          class="px-4"
          :selected-id="selectedId"
          @update="onUpdateCategory"
          @close="onCloseDrawerEdit"
        />
      </template>
    </UDrawer>
  </section>
</template>
