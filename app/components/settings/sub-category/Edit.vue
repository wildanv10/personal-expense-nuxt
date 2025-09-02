<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent, FormInputEvents } from "@nuxt/ui";

// Composables
const toast = useToast();
const { getSubCategoryById, updateSubCategory, loading, error } =
  useSubCategories();

// Types
type Schema = z.output<typeof schema>;

// Props
const props = defineProps<{
  selectedId: number | null;
}>();

// Emits
const emits = defineEmits(["update", "close"]);

// State
const validateOn = ref<FormInputEvents[]>(["input"]);
const state = ref<Schema>({
  name: "",
  icon: null,
});
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  icon: z.string().nullable(),
});

onMounted(async () => {
  try {
    if (!props.selectedId) throw new Error("Cannot retrieve Sub Category.");

    const selectedPM = await getSubCategoryById(props.selectedId);
    if (!selectedPM) throw new Error("Cannot retrieve Sub Category.");

    state.value.name = selectedPM?.name;
    state.value.icon = selectedPM?.icon;
  } catch (err: any) {
    console.error(error.value || err);
    toast.add({
      title: "Error",
      description: err.message || error.value,
      color: "error",
    });
    emits("close");
  }
});

// Methods
async function onUpdate(event: FormSubmitEvent<Schema>) {
  try {
    if (!props.selectedId) throw new Error("Cannot update Sub Category.");

    await updateSubCategory(props.selectedId, state.value);
    if (error.value) throw new Error("Cannot update Sub Category.");

    toast.add({
      title: "Success",
      description: "The Sub Category has been updated.",
      color: "success",
    });

    emits("update");
  } catch (err: any) {
    console.error(err.message || error);

    toast.add({
      title: "Error",
      description: err.message || error,
      color: "error",
    });
  }
}
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    :validate-on="validateOn"
    class="space-y-4"
    @submit="onUpdate"
  >
    <UFormField label="Name" name="name">
      <UInput v-model="state.name" size="lg" autofocus class="w-full" />
    </UFormField>

    <UFormField label="Icon" name="icon">
      <UInput v-model="state.icon" size="lg" class="w-full" />
      <template #help>
        <p>
          Icon name can be found at
          <a href="https://lucide.dev/icons/" target="_blank" class="underline"
            >this website</a
          >.
          <br />
          e.g. `a-arrow-down`.
        </p>
      </template>
    </UFormField>

    <div class="flex justify-end">
      <UButton type="submit" :loading="loading" size="lg"> Update </UButton>
    </div>
  </UForm>
</template>
