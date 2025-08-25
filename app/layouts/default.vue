<template>
  <div class="bg-neutral-50 flex flex-col min-h-screen">
    <AppHeader />
    <main class="grow pb-16">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
