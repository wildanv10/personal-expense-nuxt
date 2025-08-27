<script setup lang="ts">
import { LogIn } from "lucide-vue-next";

const { signInWithGoogle } = useAuth();
</script>

<template>
  <UiButton class="bg-white border-neutral-200" @click="signInWithGoogle">
    <LogIn :size="22" />
    Sign in with Google
  </UiButton>
</template>
