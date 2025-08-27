<script setup lang="ts">
const { isAuthenticated } = useAuth();

watch(
  isAuthenticated,
  () => {
    if (isAuthenticated) {
      return navigateTo("/");
    }
  },
  { immediate: true }
);
</script>

<template>
  <div>Waiting for login...</div>
</template>
