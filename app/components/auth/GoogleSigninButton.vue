<template>
  <UiButton class="bg-white border-neutral-200" @click="signInWithGoogle">
    <LogIn :size="22" />
    Sign in with Google
  </UiButton>
</template>

<script setup lang="ts">
import { LogIn } from "lucide-vue-next";

const supabase = useSupabaseClient();

const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin + "/confirm",
    },
  });
  if (error) {
    console.error("Google sign-in error:", error);
  }
};
</script>

<style scoped>
.google-signin-btn {
  background-color: #4285f4;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;
}
.google-signin-btn:hover {
  background-color: #357ae8;
}
</style>
