<script setup lang="ts">
import type { Cell, RuleCell } from '~/composables/useTango'

interface TangoCellProps {
  cell: Cell
  horizontalRule?: RuleCell | null
  verticalRule?: RuleCell | null
  rowHighlighted?: boolean
  colHighlighted?: boolean
}

const {
  cell,
  horizontalRule,
  verticalRule,
  rowHighlighted = false,
  colHighlighted = false
} = defineProps<TangoCellProps>()

const emit = defineEmits<{
  leftClick: [row: number, col: number]
  rightClick: [row: number, col: number]
}>()

const cellClasses = computed(() => {
  const classes: string[] = [
    'w-14 h-14 md:w-16 md:h-16',
    'rounded-lg',
    'border-2'
  ]

  if (cell.isLocked) {
    classes.push('cursor-not-allowed')
  } else {
    classes.push(
      'cursor-pointer',
    )
  }

  if (cell.hasError) {
    classes.push(
      'bg-red-100 dark:bg-red-900/30',
      'border-red-500 dark:border-red-400',
      'ring-2 ring-red-500/50',
      'animate-shake'
    )
  }
  else if (rowHighlighted || colHighlighted) {
    classes.push(
      'bg-green-100 dark:bg-green-900/30',
      'border-green-500 dark:border-green-400',
      'ring-2 ring-green-500/50',
      'animate-pulse'
    )
  }
  else if (cell.isComplete) {
    classes.push(
      'bg-green-50 dark:bg-green-900/20',
      'border-green-400 dark:border-green-500'
    )
  }
  else if (cell.isLocked) {
    classes.push(
      'bg-gray-100 dark:bg-gray-700',
      'border-gray-400 dark:border-gray-500'
    )
  }
  else {
    classes.push(
      'bg-accented',
      'border-accented',
      'hover:border-muted',
      'hover:bg-muted'
    )
  }

  return classes
})

function handleLeftClick(): void {
  emit('leftClick', cell.row, cell.col)
}

function handleRightClick(): void {
  emit('rightClick', cell.row, cell.col)
}
</script>

<template>
  <div
    class="relative flex items-center justify-center cursor-pointer select-none transition-all duration-200"
    :class="cellClasses"
    @click.left="handleLeftClick"
    @contextmenu.prevent="handleRightClick"
  >
    <div class="flex items-center justify-center w-full h-full">
      <IconsSun
        v-if="cell.state === 'sun'"
        class="w-8 h-8 md:w-10 md:h-10"
      />

      <IconsMoon
        v-if="cell.state === 'moon'"
        class="w-8 h-8 md:w-10 md:h-10"
      />

      <div
        v-if="cell.state === 'empty'"
        class="w-4 h-4 rounded-full bg-inverted opacity-10"
      />
    </div>

    <div
      v-if="horizontalRule"
      class="absolute -right-5 top-1/2 -translate-y-1/3 z-50"
      :class="{ 'animate-pulse': horizontalRule.isViolated }"
    >
      <IconsEqual
        v-if="horizontalRule.type === 'equal'"
        class="w-5 h-5"
        :class="{ 'text-red-500 dark:text-red-400': horizontalRule.isViolated }"
      />
      <IconsMultiply
        v-if="horizontalRule.type === 'opposite'"
        class="w-5 h-5"
        :class="{ 'text-red-500 dark:text-red-400': horizontalRule.isViolated }"
      />
    </div>

    <div
      v-if="verticalRule"
      class="absolute left-1/2 -bottom-[27px] -translate-x-1/2 z-50"
      :class="{ 'animate-pulse': verticalRule.isViolated }"
    >
      <IconsEqual
        v-if="verticalRule.type === 'equal'"
        class="w-5 h-5 rotate-90"
        :class="{ 'text-red-500 dark:text-red-400': verticalRule.isViolated }"
      />
      <IconsMultiply
        v-if="verticalRule.type === 'opposite'"
        class="w-5 h-5"
        :class="{ 'text-red-500 dark:text-red-400': verticalRule.isViolated }"
      />
    </div>
  </div>
</template>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

.animate-shake {
  animation: shake 0.3s ease-in-out;
}
</style>
