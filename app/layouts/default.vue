<script setup lang="ts">
const supabase = useSupabaseClient();
const { data: sessionData } = await supabase.auth.getSession();
</script>

<template>
  <div class="bg-neutral-50 flex flex-col min-h-screen">
    <AppHeader v-if="sessionData" />
    <main
      class="grow p-2"
      :class="{
        'pb-16': sessionData,
        'content-center': !sessionData,
      }"
    >
      <slot />
    </main>
    <AppFooter v-if="sessionData" />
  </div>
</template>
