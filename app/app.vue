<script setup>
const toaster = ref({
    position: 'bottom-center',
    expand: false,
})
</script>

<template>
  <NuxtPwaAssets />
  <UApp
    :toaster="toaster"
  >
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <PwaInstallPrompt />
  </UApp>
</template>
