<script setup lang="ts">
definePageMeta({
  layout: false,
});

onMounted(() => {
  navigateTo(constants.routes.home_transactions);
});
</script>

<template>
  <div>
    <NuxtLayout name="home">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
