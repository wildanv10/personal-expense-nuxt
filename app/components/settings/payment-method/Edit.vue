<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent, FormInputEvents } from "@nuxt/ui";
import type { PaymentMethods } from "~/types/database.types";

// Composables
const toast = useToast();
const {
  getPaymentMethodById,
  updatePaymentMethod,
  deletePaymentMethod,
  loading,
  loadingDelete,
  error,
} = usePaymentMethods();

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
const state = ref<Omit<PaymentMethods["Row"], "id" | "created_at" | "user_id">>(
  {
    name: "",
    icon: null,
  }
);
const schema = z.object({
  name: z.string().min(1),
  icon: z.string().nullable(),
});
const isConfirmDeleteOpen = ref(false);

onMounted(async () => {
  try {
    if (!props.selectedId) throw new Error("Cannot retrieve Payment Method.");

    const selectedPM = await getPaymentMethodById(props.selectedId);
    if (!selectedPM) throw new Error("Cannot retrieve Payment Method.");

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
    if (!props.selectedId) throw new Error("Cannot update Payment Method.");

    await updatePaymentMethod(props.selectedId, state.value);
    if (error.value) throw new Error("Cannot update Payment Method.");

    toast.add({
      title: "Success",
      description: "The Payment Method has been updated.",
      color: "success",
    });

    emits("update");
  } catch (err: any) {
    console.error(error.value || err);

    toast.add({
      title: "Error",
      description: error.value || err.message,
      color: "error",
    });
  }
}
async function onDelete() {
  try {
    if (!props.selectedId) throw new Error("Cannot delete Payment Method.");

    await deletePaymentMethod(props.selectedId);
    if (error.value) throw new Error("Cannot delete Payment Method.");

    toast.add({
      title: "Success",
      description: "The Payment Method has been deleted.",
      color: "success",
    });

    emits("update");
  } catch (err: any) {
    console.error(error.value || err);

    toast.add({
      title: "Error",
      description: error.value || err.message,
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
      <UInput v-model="state.name" size="lg" class="w-full" />
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

    <div class="flex justify-between">
      <!-- Delete Button -->
      <div>
        <UPopover v-model:open="isConfirmDeleteOpen" mode="click" arrow>
          <UButton type="button" color="error" size="lg"> Delete </UButton>

          <template #content>
            <div class="p-4">
              <p>Are you sure want to delete?</p>
              <div class="flex gap-2 pt-2 justify-end">
                <UButton
                  type="button"
                  color="error"
                  size="md"
                  :loading="loadingDelete"
                  @click="onDelete"
                >
                  Yes
                </UButton>
                <UButton
                  type="button"
                  color="neutral"
                  variant="outline"
                  size="md"
                  :disabled="loadingDelete"
                  @click="isConfirmDeleteOpen = false"
                >
                  No
                </UButton>
              </div>
            </div>
          </template>
        </UPopover>
      </div>

      <!-- Update Button -->
      <UButton type="submit" :loading="loading" size="lg"> Update </UButton>
    </div>
  </UForm>
</template>
