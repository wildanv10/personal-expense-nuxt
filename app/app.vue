<script setup lang="ts">
import type { ToasterProps } from "@nuxt/ui";
const toaster: ToasterProps = { position: "top-right" };
</script>

<template>
  <div>
    <UApp :toaster="toaster">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UApp>
  </div>
</template>
