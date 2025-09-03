<script setup lang="ts">
const { signInWithGoogle, isLoading } = useAuth();
</script>

<template>
  <UButton
    color="neutral"
    variant="outline"
    size="xl"
    block
    :loading="isLoading"
    @click="signInWithGoogle"
  >
    <IconGoogle v-if="isLoading !== true" />
    Continue with Google
  </UButton>
</template>
