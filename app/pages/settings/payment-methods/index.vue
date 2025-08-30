<script setup lang="ts">
const { getPaymentMethods, paymentMethods, loading, error } =
  usePaymentMethods();

type PaymentMethodID = number | null;

const selectedPm = ref<PaymentMethodID>(null);
const isDrawerAddOpen = ref(false);

onMounted(async () => {
  await getPaymentMethods();
});

function selectPM(pmId: PaymentMethodID) {
  selectedPm.value = pmId;
}

function isActive(pmId: PaymentMethodID) {
  return pmId === selectedPm.value;
}

async function onAddPM() {
  await getPaymentMethods();
  isDrawerAddOpen.value = false;
}
</script>

<template>
  <section>
    <div class="card">
      <!-- Card Title -->
      <div>
        <div class="flex items-center gap-2 text-lg font-heading">
          <UIcon name="i-lucide-hand-coins" class="size-6" />
          Payment Methods
        </div>
      </div>

      <!-- Card Content -->
      <div class="card-content pt-3">
        <div class="payment-method-add mb-3">
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
        </div>

        <div class="payment-method-list">
          <div
            class="payment-method-item flex items-center gap-2 py-1 px-2 border border-transparent"
            :class="{
              '!border-gray-200 shadow-xs rounded-lg': isActive(pm.id),
            }"
            v-for="pm in paymentMethods"
            :key="`pm-${pm.id}`"
          >
            <UIcon :name="`i-lucide-${pm.icon}`" />
            <div class="payment-method-name grow">
              <p>
                {{ pm.name }}
              </p>
            </div>
            <UIcon name="i-lucide-ellipsis-vertical" @click="selectPM(pm.id)" />
          </div>
        </div>
      </div>
    </div>

    <!-- Drawer Add -->
    <UDrawer
      v-model:open="isDrawerAddOpen"
      title="Add Payment Method"
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
  </section>
</template>
