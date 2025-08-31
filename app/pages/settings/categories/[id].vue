<script setup lang="ts">
import type { SubCategories } from "~/types/database.types";

// Composables
const route = useRoute();
const { getSubCategoryByCategoryId } = useSubCategories();

// Types
type ItemID = number | null;

// State
const subCategory = ref<
  Omit<SubCategories["Row"], "created_at" | "user_id">[] | []
>([]);
const selectedItemID = ref<ItemID>(null);
const isDrawerAddOpen = ref(false);
const isDrawerEditOpen = ref(false);

onMounted(async () => {
  if (typeof route.params.id === "string") {
    const id = parseInt(route.params.id);
    subCategory.value = await getSubCategoryByCategoryId(id);
  }
});

// Methods
function selectItem(id: ItemID) {
  selectedItemID.value = id;
  isDrawerEditOpen.value = true;
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
  </section>
</template>
