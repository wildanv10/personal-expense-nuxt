<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent, FormInputEvents } from "@nuxt/ui";

// Composables
const toast = useToast();
const { getCategoryById, updateCategory, loading, error } = useCategories();

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
  type: "expense",
  icon: null,
});
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["income", "expense"]),
  icon: z.string().nullable(),
});

onMounted(async () => {
  try {
    if (!props.selectedId) throw new Error("Cannot retrieve Category.");

    const selectedPM = await getCategoryById(props.selectedId);
    if (!selectedPM) throw new Error("Cannot retrieve Category.");

    state.value.name = selectedPM?.name;
    state.value.type = selectedPM?.type;
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
    if (!props.selectedId) throw new Error("Cannot update Category.");

    await updateCategory(props.selectedId, state.value);
    if (error.value) throw new Error("Cannot update Category.");

    toast.add({
      title: "Success",
      description: "The Category has been updated.",
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

    <UFormField label="Type" name="type">
      <USelect
        v-model="state.type"
        :items="[
          { label: 'Income', value: 'income' },
          { label: 'Expense', value: 'expense' },
        ]"
        size="lg"
        class="w-full"
      />
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
