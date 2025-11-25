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
  </UApp>
</template>
