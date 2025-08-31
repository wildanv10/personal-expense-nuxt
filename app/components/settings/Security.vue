<script setup lang="ts">
const { signOut, isLoading } = useAuth();
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
      <UButton
        color="error"
        variant="solid"
        icon="i-lucide-log-out"
        label="Sign Out"
        size="xl"
        block
        :loading="isLoading"
        @click="signOut"
      />
    </div>
  </div>
</template>
