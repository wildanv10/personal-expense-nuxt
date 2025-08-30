<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent, FormInputEvents } from "@nuxt/ui";

const { addPaymentMethod, loading, error } = usePaymentMethods();
const emits = defineEmits(["submit"]);

const schema = z.object({
  name: z.string().min(1),
  icon: z.string().nullable(),
});

type Schema = z.output<typeof schema>;

const state = ref({
  name: "",
  icon: null,
});

const validateOn = ref<FormInputEvents[]>(["input"]);

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await addPaymentMethod(state.value);
    if (error.value) throw new Error();

    toast.add({
      title: "Success",
      description: "The Payment Method has been added.",
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
      <UButton type="submit" :loading="loading" size="lg"> Submit </UButton>
    </div>
  </UForm>
</template>
