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

const rulesOpen = ref(false)

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
  cycleCell,
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

function handleCellTap(row: number, col: number): void {
  cycleCell(row, col)
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
  <UContainer class="sm:py-8">
    <div class="max-w-4xl mx-auto">

      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
        <div class="flex items-center gap-2">
          <UColorModeButton
            variant="soft"
          />
          <UButton
            icon="i-lucide-book-open"
            color="neutral"
            variant="soft"
            @click="rulesOpen = true"
          >
            Regras
          </UButton>
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

      <div class="grid grid-cols-4 gap-4 mb-6">
        <UCard variant="soft" class="text-center bg-elevated dark:bg-muted">
          <div class="flex flex-col items-center gap-2 sm:gap-6">
            <IconsSun class="w-6 h-6" />
            <span class="text-2xl font-bold text-normal">
              {{ totalSuns }}
            </span>
          </div>
        </UCard>

        <UCard variant="soft" class="text-center bg-elevated dark:bg-muted">
          <div class="flex flex-col items-center gap-2 sm:gap-6">
            <IconsMoon class="w-6 h-6" />
            <span class="text-2xl font-bold text-normal">
              {{ totalMoons }}
            </span>
          </div>
        </UCard>

        <UCard variant="soft" class="text-center bg-elevated dark:bg-muted">
          <div class="flex flex-col items-center gap-2 sm:gap-6">
            <UIcon name="i-lucide-mouse-pointer-click" class="w-6 h-6" />
            <span class="text-2xl font-bold text-normal">
              {{ moves }}
            </span>
          </div>
        </UCard>

        <UCard variant="soft" class="text-center bg-elevated dark:bg-muted">
          <div class="flex flex-col items-center gap-2 sm:gap-6">
            <UIcon name="i-lucide-grid-3x3" class="w-6 h-6" />
            <span class="text-2xl font-bold text-normal">
              {{ emptyCells }}
            </span>
          </div>
        </UCard>
      </div>

      <div class="mb-6 px-2">
        <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1 px-2">
          <span>Progresso</span>
          <span>{{ progress }}%</span>
        </div>
        <UProgress v-model="progress" color="neutral" />
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
          @cell-tap="handleCellTap"
        />
      </div>

      <Modal
        v-model:open="rulesOpen"
        closable
        dismissible
      >
        <div class="text-center text-sm text-muted py-6">
          <p class="mb-4 text-xl">
            <strong>Regras:</strong>
          </p>

          <div class="flex flex-col items-start px-4 gap-2 text-xs">
            <div>
              Cada linha e coluna deve ter exatamente metade sóis e metade luas
            </div>

            <div>
              Não pode haver mais de 2 símbolos iguais consecutivos
            </div>

            <div class="flex items-center gap-2">
              <IconsEqual class="w-5 h-5"/>
              Indica que células adjacentes devem ser iguais
            </div>

            <div class="flex items-center gap-2">
              <IconsMultiply class="w-5 h-5"/>
              Indica que células adjacentes devem ser opostas
            </div>
          </div>
        </div>
      </Modal>

    </div>
  </UContainer>
</template>
