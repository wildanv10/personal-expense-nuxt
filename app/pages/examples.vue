<template>
  <section>
    <h1>Statistics</h1>
    <p>This page will be displayed at the /statistics route.</p>

    <div class="flex flex-col">
      <div class="flex gap-2">
        <UButton size="lg" color="primary">Button</UButton>
        <p class="text-primary text-2xl">lorem ipsum</p>
      </div>
      <div class="flex gap-2">
        <UButton size="lg" color="secondary">Button</UButton>
        <p class="text-secondary text-2xl">lorem ipsum</p>
      </div>
      <div class="flex gap-2">
        <UButton size="lg" color="neutral">Button</UButton>
        <p class="text-neutral text-2xl">lorem ipsum</p>
      </div>
      <div class="flex gap-2">
        <UButton size="lg" color="success">Button</UButton>
        <p class="text-success text-2xl">lorem ipsum</p>
      </div>
      <div class="flex gap-2">
        <UButton size="lg" color="info">Button</UButton>
        <p class="text-info text-2xl">lorem ipsum</p>
      </div>
      <div class="flex gap-2">
        <UButton size="lg" color="warning">Button</UButton>
        <p class="text-warning text-2xl">lorem ipsum</p>
      </div>
      <div class="flex gap-2">
        <UButton size="lg" color="error">Button</UButton>
        <p class="text-error text-2xl">lorem ipsum</p>
      </div>
    </div>

    <div class="mt-5">
      <div
        class="card flex items-center justify-between"
        v-for="value in 14"
        :key="value"
      >
        <div class="flex items-center space-x-4">
          <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div>
            <p class="font-semibold text-gray-800">Lively Inc.</p>
            <p class="text-xs text-gray-500 uppercase">Lively</p>
          </div>
        </div>
        <div class="text-right">
          <p class="font-semibold text-gray-900">$432.21</p>
          <p class="text-sm text-green-600">+2.53 (9%)</p>
        </div>
      </div>
    </div>
  </section>
</template>
