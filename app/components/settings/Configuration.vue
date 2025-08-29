<template>
  <div class="card">
    <!-- Card Title -->
    <div>
      <div class="flex items-center gap-2 text-lg font-heading">
        <UIcon name="i-lucide-settings-2" class="size-6" />
        Configuration
      </div>
    </div>
    <!-- Card Content -->
    <div class="pt-3">
      <div class="card-list">
        <NuxtLink :to="constants.routes.settings_categories">
          <div class="py-3 flex justify-between items-center">
            <p>Categories</p>
            <UIcon name="i-lucide-chevron-right" class="size-5" />
          </div>
        </NuxtLink>
      </div>
      <div class="card-list">
        <NuxtLink :to="constants.routes.settings_payment_methods">
          <div class="py-3 flex justify-between items-center">
            <p>Payment Methods</p>
            <UIcon name="i-lucide-chevron-right" class="size-5" />
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
