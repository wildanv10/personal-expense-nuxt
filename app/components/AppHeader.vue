<script setup lang="ts">
const router = useRouter();
</script>

<template>
  <header class="sticky top-0 z-50 w-full bg-white border-b border-gray-300">
    <div class="container flex h-16 items-center justify-center px-4 relative">
      <UiLogo />
      <span class="absolute left-0 top-0 pl-3 h-full flex items-center">
        <UIcon
          name="i-lucide-arrow-left"
          class="size-6 cursor-pointer"
          @click="router.back()"
        />
      </span>
    </div>
  </header>
</template>
