<script setup lang="ts">
import { LogOut, Settings2, Shield, ChevronRight } from "lucide-vue-next";

const { signOut } = useAuth();
</script>

<template>
  <section class="flex flex-col gap-4">
    <UiCard
      class="bg-white border-0 shadow-card hover:shadow-hover transition-all-smooth"
    >
      <div class="px-3 pt-3">
        <div class="flex items-center gap-2 text-lg font-heading">
          <Settings2 class="h-5 w-5" />
          Configuration
        </div>
      </div>
      <div class="p-3 pt-6">
        <div class="px-2">
          <NuxtLink :to="constants.routes.settings_categories">
            <div class="py-3 flex justify-between">
              <p>Categories</p>
              <ChevronRight />
            </div>
          </NuxtLink>
        </div>
        <div class="px-2">
          <NuxtLink :to="constants.routes.settings_payment_methods">
            <div
              class="py-3 flex justify-between border-t border-(--border-color)"
            >
              <p>Payment Methods</p>
              <ChevronRight />
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
          <Shield class="h-5 w-5" />
          Security
        </div>
      </div>
      <div class="p-3 pt-6">
        <UiButton class="bg-red-600 border-red-700 text-white" @click="signOut">
          <LogOut :size="22" />
          Sign Out
        </UiButton>
      </div>
    </UiCard>
  </section>
</template>
