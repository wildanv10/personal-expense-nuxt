<script setup lang="ts">
// Composables
const { getPaymentMethods, paymentMethods, loading, error } =
  usePaymentMethods();

// Types
type PaymentMethodID = number | null;

// State
const selectedPM = ref<PaymentMethodID>(null);
const isDrawerAddOpen = ref(false);
const isDrawerEditOpen = ref(false);

onMounted(async () => {
  await getPaymentMethods();
});

// Methods
function selectPM(pmId: PaymentMethodID) {
  selectedPM.value = pmId;
  isDrawerEditOpen.value = true;
}
function isActive(pmId: PaymentMethodID) {
  return pmId === selectedPM.value;
}
async function onAddPM() {
  isDrawerAddOpen.value = false;
  await getPaymentMethods();
}
async function onUpdatePM() {
  onCloseDrawerEdit();
  await getPaymentMethods();
}
async function onCloseDrawerEdit() {
  isDrawerEditOpen.value = false;
  selectedPM.value = null;
}
</script>

<template>
  <section>
    <SettingsConfigurationCard
      :items="paymentMethods"
      :selected-item="selectedPM"
    >
      <template #header>
        <UIcon name="i-lucide-hand-coins" class="size-6" />
        Payment Methods
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
          Add Payment Method
        </UButton>
      </template>

      <template #content-list="item">
        <UIcon :name="`i-lucide-${item.icon}`" />
        <div class="payment-method-name grow">
          <p>
            {{ item.name }}
          </p>
        </div>
        <UIcon name="i-lucide-ellipsis-vertical" @click="selectPM(item.id)" />
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
        <h2 class="text-highlighted font-semibold">Add Payment Method</h2>

        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-x"
          @click="isDrawerAddOpen = false"
        />
      </template>

      <template #body>
        <SettingsPaymentMethodAdd class="px-4" @submit="onAddPM" />
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
        <h2 class="text-highlighted font-semibold">Edit Payment Method</h2>

        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-x"
          @click="onCloseDrawerEdit"
        />
      </template>

      <template #body>
        <SettingsPaymentMethodEdit
          class="px-4"
          :selected-id="selectedPM"
          @update="onUpdatePM"
          @close="onCloseDrawerEdit"
        />
      </template>
    </UDrawer>
  </section>
</template>
