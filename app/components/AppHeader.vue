<script setup lang="ts">
const router = useRouter();
const { isAuthenticated } = useAuth();
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full bg-primary border-b border-primary text-green-900"
  >
    <div class="container flex items-center justify-center px-4 py-3 relative">
      <UiLogo />
      <span
        v-if="isAuthenticated"
        class="absolute left-0 top-0 pl-3 h-full flex items-center"
      >
        <UIcon
          name="i-lucide-arrow-left"
          class="size-6 cursor-pointer"
          @click="router.back()"
        />
      </span>
    </div>
  </header>
</template>
