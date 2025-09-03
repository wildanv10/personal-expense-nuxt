<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent, FormInputEvents } from "@nuxt/ui";
import { useRoute } from "vue-router";

const { addSubCategory, loading, error } = useSubCategories();
const emits = defineEmits(["submit"]);

const route = useRoute();
const categoryId = Number(route.params.id);

if (isNaN(categoryId)) {
  throw new Error("Invalid category ID in route parameter.");
}

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  icon: z.string().nullable(),
});

type Schema = z.output<typeof schema>;

const state = ref<Schema>({
  name: "",
  icon: null,
});

const validateOn = ref<FormInputEvents[]>(["input"]);

const toast = useToast();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const payload = {
      ...state.value,
      category_id: categoryId,
    };

    await addSubCategory(payload);
    if (error.value) throw new Error();

    toast.add({
      title: "Success",
      description: "The Sub Category has been added.",
      color: "success",
    });

    emits("submit");
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
    @submit="onSubmit"
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
      <UButton type="submit" :loading="loading" size="lg">Submit</UButton>
    </div>
  </UForm>
</template>
