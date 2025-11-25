<script setup>
const toaster = ref({
    position: 'bottom-center',
    expand: false,
})
</script>

<template>
  <UApp
    :toaster="toaster"
  >
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
