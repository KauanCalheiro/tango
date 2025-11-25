<script setup lang="ts">
interface TangoProps {
  rows?: number
  cols?: number
  initialFill?: number
}

const {
  rows = 6,
  cols = 6,
  initialFill = 0
} = defineProps<TangoProps>()

const emit = defineEmits<{
  completed: []
}>()

const {
  board,
  rules,
  moves,
  isCompleted,
  totalSuns,
  totalMoons,
  emptyCells,
  progress,
  toggleCell,
  clearBoard,
  resetGame,
  setupGame,
  isLineHighlighted
} = useTango(rows, cols)

onMounted(() => {
  setupGame(undefined, initialFill)
})

watch(isCompleted, (completed) => {
  if (completed) {
    emit('completed')
  }
})

function handleCellLeftClick(row: number, col: number): void {
  toggleCell(row, col, false)
}

function handleCellRightClick(row: number, col: number): void {
  toggleCell(row, col, true)
}

function handleNewGame(): void {
  resetGame()
  setupGame(undefined, initialFill)
}

function handleClear(): void {
  clearBoard()
}
</script>

<template>
  <UContainer class="py-8">
    <div class="max-w-4xl mx-auto">

      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
        <div class="flex items-center gap-3">
          <IconsSun class="w-8 h-8" />
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Tango Game
          </h1>
          <IconsMoon class="w-8 h-8" />
        </div>

        <div class="flex items-center gap-2">
          <UButton
            icon="i-lucide-refresh-cw"
            color="neutral"
            variant="soft"
            @click="handleNewGame"
          >
            Novo Jogo
          </UButton>
          <UButton
            icon="i-lucide-eraser"
            color="neutral"
            variant="soft"
            @click="handleClear"
          >
            Limpar
          </UButton>
        </div>
      </div>

      <UAlert
        v-if="isCompleted"
        color="success"
        variant="soft"
        icon="i-lucide-trophy"
        title="Parabéns!"
        description="Você completou o jogo com sucesso!"
        class="mb-6"
      />

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <UCard variant="soft" class="text-center bg-accented">
          <div class="flex flex-col items-center gap-1">
            <IconsSun class="w-6 h-6" />
            <span class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ totalSuns }}
            </span>
            <span class="text-xs text-gray-500 dark:text-gray-400">
            </span>
          </div>
        </UCard>

        <UCard variant="soft" class="text-center bg-accented">
          <div class="flex flex-col items-center gap-1">
            <IconsMoon class="w-6 h-6" />
            <span class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ totalMoons }}
            </span>
            <span class="text-xs text-gray-500 dark:text-gray-400">
            </span>
          </div>
        </UCard>

        <UCard variant="soft" class="text-center bg-accented">
          <div class="flex flex-col items-center gap-1">
            <UIcon name="i-lucide-mouse-pointer-click" class="w-6 h-6 text-gray-500" />
            <span class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ moves }}
            </span>
            <span class="text-xs text-gray-500 dark:text-gray-400">
              Movimentos
            </span>
          </div>
        </UCard>

        <UCard variant="soft" class="text-center bg-accented">
          <div class="flex flex-col items-center gap-1">
            <UIcon name="i-lucide-grid-3x3" class="w-6 h-6 text-gray-500" />
            <span class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ emptyCells }}
            </span>
            <span class="text-xs text-gray-500 dark:text-gray-400">
              Restantes
            </span>
          </div>
        </UCard>
      </div>

      <div class="mb-6 px-2">
        <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1 px-2">
          <span>Progresso</span>
          <span>{{ progress }}%</span>
        </div>
        <UProgress :value="progress" color="primary" />
      </div>

      <div class="flex justify-center">
        <TangoBoard
          :board="board"
          :rules="rules"
          :rows="rows"
          :cols="cols"
          :is-line-highlighted="isLineHighlighted"
          @cell-left-click="handleCellLeftClick"
          @cell-right-click="handleCellRightClick"
        />
      </div>

        <div class="text-center text-sm text-gray-500 dark:text-gray-400 py-6">
          <p class="mb-2">
            <strong>Regras:</strong>
          </p>
          <ul class="list-disc list-inside text-left max-w-md mx-auto space-y-1">
            <li>Cada linha e coluna deve ter exatamente metade sóis e metade luas</li>
            <li>Não pode haver mais de 2 símbolos iguais consecutivos</li>
            <li>
              <IconsEqual class="inline w-4 h-4" /> indica que células adjacentes devem ser iguais
            </li>
            <li>
              <IconsMultiply class="inline w-4 h-4" /> indica que células adjacentes devem ser opostas
            </li>
          </ul>
        </div>

    </div>
  </UContainer>
</template>
