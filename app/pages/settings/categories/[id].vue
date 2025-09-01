<script setup lang="ts">
import type { SubCategories } from "~/types/database.types";

// Composables
const route = useRoute();
const { getSubCategoryByCategoryId } = useSubCategories();

// Types
type ItemID = number | null;

// State
const categoryId = Number(route.params.id);
const subCategory = ref<
  Omit<SubCategories["Row"], "created_at" | "user_id">[] | []
>([]);
const selectedItemID = ref<ItemID>(null);
const isDrawerAddOpen = ref(false);
const isDrawerEditOpen = ref(false);

if (isNaN(categoryId)) {
  throw new Error("Invalid category ID in route parameter.");
}

onMounted(async () => {
  subCategory.value = await getSubCategoryByCategoryId(categoryId);
});

// Methods
function selectItem(id: ItemID) {
  selectedItemID.value = id;
  isDrawerEditOpen.value = true;
}
async function onAddSubCategory() {
  isDrawerAddOpen.value = false;
  subCategory.value = await getSubCategoryByCategoryId(categoryId);
}
</script>

<template>
  <section>
    <SettingsConfigurationCard
      :items="subCategory"
      :selected-item="selectedItemID"
    >
      <template #header>
        <UIcon name="i-lucide-boxes" class="size-6" />
        Sub Categories
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
          Add Sub Category
        </UButton>
      </template>

      <template #content-list="item">
        <UIcon :name="`i-lucide-${item.icon}`" />
        <div class="grow">
          <p>
            {{ item.name }}
          </p>
        </div>
        <UIcon name="i-lucide-ellipsis-vertical" @click="selectItem(item.id)" />
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
        <SettingsSubCategoryAdd class="px-4" @submit="onAddSubCategory" />
      </template>
    </UDrawer>
  </section>
</template>
