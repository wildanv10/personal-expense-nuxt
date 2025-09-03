<script setup lang="ts">
const { isAuthenticated } = useAuth();
</script>

<template>
  <div class="flex flex-col min-h-screen max-w-md mx-auto">
    <AppHeader />
    <main
      class="main"
      :class="{
        'pb-4': isAuthenticated,
        'content-center': !isAuthenticated,
      }"
    >
      <slot />
    </main>
    <AppFooter v-if="isAuthenticated" />
  </div>
</template>
