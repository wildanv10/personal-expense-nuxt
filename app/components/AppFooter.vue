<script setup lang="ts">
import { ChartLine, House, UserCog } from "lucide-vue-next";
</script>

<template>
  <footer
    class="fixed bottom-0 w-full py-2 bg-white border-t border-(--border-color)"
  >
    <nav>
      <ul class="flex justify-center">
        <li class="">
          <NuxtLink to="/home/transactions" class="flex items-center py-3 px-5">
            <House :size="22" />
            <p class="text-lg ml-2">Home</p>
          </NuxtLink>
        </li>
        <li class="">
          <NuxtLink to="/statistics" class="flex items-center py-3 px-5">
            <ChartLine :size="22" />
            <p class="text-lg ml-2">Statistics</p>
          </NuxtLink>
        </li>
        <li class="">
          <NuxtLink to="/settings" class="flex items-center py-3 px-5">
            <UserCog :size="22" />
            <p class="text-lg ml-2">Settings</p>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </footer>
</template>
