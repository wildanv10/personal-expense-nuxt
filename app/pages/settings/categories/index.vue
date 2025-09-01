<script setup lang="ts">
// Composables
const { getCategories, categories, loading, error } = useCategories();

// Types
type categoryId = number | null;

// State
const selectedId = ref<categoryId>(null);
const isDrawerAddOpen = ref(false);

onMounted(async () => {
  await getCategories();
});

// Methods
function selectCategory(id: categoryId) {
  selectedId.value = id;
  navigateTo(`${constants.routes.settings_categories}/${id}`);
}
async function onAddCategory() {
  isDrawerAddOpen.value = false;
  await getCategories();
}
</script>

<template>
  <section>
    <SettingsConfigurationCard :items="categories" :selected-item="selectedId">
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
        <UIcon name="i-lucide-chevron-right" @click="selectCategory(item.id)" />
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
  </section>
</template>
