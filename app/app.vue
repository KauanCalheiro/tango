<script setup>
const toaster = ref({
    position: 'bottom-center',
    expand: false,
})

const { isStandalone } = useStandalone()
</script>

<template>
  <NuxtPwaAssets />
  <UApp
    :toaster="toaster"
    :class="{ 'standalone-mode': isStandalone }"
  >
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <PwaInstallPrompt />
  </UApp>
</template>

<style>
.standalone-mode {
  min-height: 100dvh;
}
</style>
