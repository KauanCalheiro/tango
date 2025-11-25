<script setup lang="ts">
import type { Cell, RuleCell } from '~/composables/useTango'

interface TangoBoardProps {
  board: Cell[][]
  rules: RuleCell[]
  rows: number
  cols: number
  isLineHighlighted: (type: 'row' | 'col', index: number) => boolean
}

const {
  board,
  rules,
  rows,
  cols,
  isLineHighlighted
} = defineProps<TangoBoardProps>()

const emit = defineEmits<{
  cellLeftClick: [row: number, col: number]
  cellRightClick: [row: number, col: number]
}>()

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
  gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
}))

function getHorizontalRule(row: number, col: number): RuleCell | null {
  if (col >= cols - 1) return null

  return rules.find(
    r =>
      r.direction === 'horizontal' &&
      ((r.cell1.row === row && r.cell1.col === col && r.cell2.row === row && r.cell2.col === col + 1) ||
        (r.cell2.row === row && r.cell2.col === col && r.cell1.row === row && r.cell1.col === col + 1))
  ) || null
}

function getVerticalRule(row: number, col: number): RuleCell | null {
  if (row >= rows - 1) return null

  return rules.find(
    r =>
      r.direction === 'vertical' &&
      ((r.cell1.row === row && r.cell1.col === col && r.cell2.row === row + 1 && r.cell2.col === col) ||
        (r.cell2.row === row && r.cell2.col === col && r.cell1.row === row + 1 && r.cell1.col === col))
  ) || null
}

function handleLeftClick(row: number, col: number): void {
  emit('cellLeftClick', row, col)
}

function handleRightClick(row: number, col: number): void {
  emit('cellRightClick', row, col)
}
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div
      class="grid gap-4 sm:p-4 rounded-xl"
      :style="gridStyle"
    >
      <template v-for="(row, rowIndex) in board" :key="rowIndex">
        <TangoCell
          v-for="(cell, colIndex) in row"
          :key="`${rowIndex}-${colIndex}`"
          :cell="cell"
          :horizontal-rule="getHorizontalRule(rowIndex, colIndex)"
          :vertical-rule="getVerticalRule(rowIndex, colIndex)"
          :row-highlighted="isLineHighlighted('row', rowIndex)"
          :col-highlighted="isLineHighlighted('col', colIndex)"
          @left-click="handleLeftClick"
          @right-click="handleRightClick"
        />
      </template>
    </div>

    <div class="flex flex-wrap justify-center gap-4 text-sm text-muted">
      <div class="flex items-center gap-2">
        <IconsSun class="w-4 h-4" />
        <span>Clique esquerdo</span>
      </div>
      <div class="flex items-center gap-2">
        <IconsMoon class="w-4 h-4" />
        <span>Clique direito</span>
      </div>
      <div class="flex items-center gap-2">
        <IconsEqual class="w-5 h-5" />
        <span>Devem ser iguais</span>
      </div>
      <div class="flex items-center gap-2">
        <IconsMultiply class="w-5 h-5" />
        <span>Devem ser opostos</span>
      </div>
    </div>
  </div>
</template>
