<script setup lang="ts">
const supabase = useSupabaseClient();
const { data: sessionData } = await supabase.auth.getSession();

watch(
  sessionData,
  () => {
    if (sessionData) {
      return navigateTo("/");
    }
  },
  { immediate: true }
);
</script>

<template>
  <div>Waiting for login...</div>
</template>
