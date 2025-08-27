<script setup lang="ts">
const { user, isAuthenticated } = useAuth();
</script>

<template>
  <div class="bg-neutral-50 flex flex-col min-h-screen">
    <AppHeader v-if="isAuthenticated" />
    <main
      class="grow p-2"
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
