<script setup lang="ts">
const { signInWithGoogle } = useAuth();
</script>

<template>
  <UiButton class="bg-white border-neutral-200" @click="signInWithGoogle">
    <UIcon name="i-lucide-log-in" class="size-6" />
    Sign in with Google
  </UiButton>
</template>
