<script setup lang="ts">
const route = useRoute();

const props = defineProps<{
  menuText: string;
  menuIcon: string;
  to: string;
}>();

const isActive = computed(() => {
  const parent = route.path.split("/", 2)[1];
  const current = props.to.split("/", 2)[1];
  return parent?.toLowerCase() === current?.toLowerCase();
});
</script>

<template>
  <li>
    <NuxtLink
      :to="props.to"
      class="flex items-center border-b-2 transition-bor duration-300 ease-in-out"
      :class="{
        'border-transparent': !isActive,
        'border-primary': isActive,
      }"
    >
      <UIcon :name="props.menuIcon" size="16" />
      <p class="text-md ml-2">{{ props.menuText }}</p>
    </NuxtLink>
  </li>
</template>
