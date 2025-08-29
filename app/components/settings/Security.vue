<script setup lang="ts">
const { signOut } = useAuth();
</script>

<template>
  <div class="card">
    <!-- Card Title -->
    <div>
      <div class="flex items-center gap-2 text-lg font-heading">
        <UIcon name="i-lucide-shield" class="size-6" />
        Security
      </div>
    </div>
    <!-- Card Content -->
    <div class="pt-3">
      <UiButton class="bg-red-600 border-red-700 text-white" @click="signOut">
        <UIcon name="i-lucide-log-out" class="size-6" />
        Sign Out
      </UiButton>
    </div>
  </div>
</template>
