<script setup lang="ts">
const toast = useToast()

function handleGameCompleted(): void {
  toast.add({
    title: 'Parabéns! 🎉',
    description: 'Você completou o Tango Game!',
    color: 'success',
    icon: 'i-lucide-trophy',
  })
}
</script>

<template>
  <Tango
    :rows="6"
    :cols="6"
    :initial-fill="5"
    @completed="handleGameCompleted"
  />
</template>
