<script setup lang="ts">
import { LogOut, Shield } from "lucide-vue-next";

const { signOut } = useAuth();
</script>

<template>
  <section>
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
