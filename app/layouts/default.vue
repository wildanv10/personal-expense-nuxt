<script setup lang="ts">
const { isAuthenticated } = useAuth();
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader v-if="isAuthenticated" />
    <main
      class="main"
      :class="{
        'pb-16': isAuthenticated,
        'content-center': !isAuthenticated,
      }"
    >
      <slot />
    </main>
    <AppFooter v-if="isAuthenticated" />
  </div>
</template>
