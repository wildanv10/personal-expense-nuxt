<script setup lang="ts">
const { signOut } = useAuth();
</script>

<template>
  <section class="flex flex-col gap-4">
    <UiCard
      class="bg-white border-0 shadow-card hover:shadow-hover transition-all-smooth"
    >
      <div class="px-3 pt-3">
        <div class="flex items-center gap-2 text-lg font-heading">
          <UIcon name="i-lucide-settings-2" class="size-6" />
          Configuration
        </div>
      </div>
      <div class="p-3 pt-6">
        <div class="px-2">
          <NuxtLink :to="constants.routes.settings_categories">
            <div class="py-3 flex justify-between items-center">
              <p>Categories</p>
              <UIcon name="i-lucide-chevron-right" class="size-5" />
            </div>
          </NuxtLink>
        </div>
        <div class="px-2">
          <NuxtLink :to="constants.routes.settings_payment_methods">
            <div
              class="py-3 flex justify-between items-center border-t border-(--border-color)"
            >
              <p>Payment Methods</p>
              <UIcon name="i-lucide-chevron-right" class="size-5" />
            </div>
          </NuxtLink>
        </div>
      </div>
    </UiCard>
    <UiCard
      class="bg-white border-0 shadow-card hover:shadow-hover transition-all-smooth"
    >
      <div class="px-3 pt-3">
        <div class="flex items-center gap-2 text-lg font-heading">
          <UIcon name="i-lucide-shield" class="size-6" />
          Security
        </div>
      </div>
      <div class="p-3 pt-6">
        <UiButton class="bg-red-600 border-red-700 text-white" @click="signOut">
          <UIcon name="i-lucide-log-out" class="size-6" />
          Sign Out
        </UiButton>
      </div>
    </UiCard>
  </section>
</template>
