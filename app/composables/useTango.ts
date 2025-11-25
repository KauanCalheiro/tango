export type CellState = 'empty' | 'sun' | 'moon'

export type RuleType = 'equal' | 'opposite' | null

export type RuleDirection = 'horizontal' | 'vertical'

export interface Cell {
  state: CellState
  hasError: boolean
  isComplete: boolean
  isLocked: boolean
  row: number
  col: number
}

export interface RuleCell {
  type: RuleType
  direction: RuleDirection
  cell1: { row: number; col: number }
  cell2: { row: number; col: number }
  isViolated: boolean
}

export type BoardMatrix = Cell[][]

export interface LineValidation {
  index: number
  type: 'row' | 'col'
  isComplete: boolean
  hasError: boolean
  sunCount: number
  moonCount: number
}

export interface GameState {
  board: BoardMatrix
  rules: RuleCell[]
  isCompleted: boolean
  moves: number
  highlightedLines: Set<string>
}

export function useTango(rows: number, cols: number) {

  if (rows % 2 !== 0 || cols % 2 !== 0) {
    console.warn('Tango: rows e cols devem ser números pares para balanceamento correto')
  }

  const board = ref<BoardMatrix>([])
  const rules = ref<RuleCell[]>([])
  const moves = ref(0)
  const highlightedLines = ref<Set<string>>(new Set())
  const completedLinesHistory = ref<Set<string>>(new Set())

  function initializeBoard(): void {
    const newBoard: BoardMatrix = []

    for (let row = 0; row < rows; row++) {
      const rowCells: Cell[] = []
      for (let col = 0; col < cols; col++) {
        rowCells.push({
          state: 'empty',
          hasError: false,
          isComplete: false,
          isLocked: false,
          row,
          col
        })
      }
      newBoard.push(rowCells)
    }

    board.value = newBoard
  }

  function clearBoard(): void {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cell = board.value[row]?.[col]
        if (cell && !cell.isLocked) {
          cell.state = 'empty'
          cell.hasError = false
          cell.isComplete = false
          cell.isLocked = false
        }
      }
    }
    moves.value = 0
    highlightedLines.value.clear()
    completedLinesHistory.value.clear()
    validateBoard()
  }

  function addRule(
    row1: number,
    col1: number,
    row2: number,
    col2: number,
    type: 'equal' | 'opposite'
  ): void {
    const direction: RuleDirection = row1 === row2 ? 'horizontal' : 'vertical'

    rules.value.push({
      type,
      direction,
      cell1: { row: row1, col: col1 },
      cell2: { row: row2, col: col2 },
      isViolated: false
    })
  }

  function clearRules(): void {
    rules.value = []
  }

  function generateRandomRules(count: number = Math.floor((rows * cols) / 3)): void {
    clearRules()

    initializeBoard()

    if (!generateSolutionWithoutRules()) {
      console.warn('Não foi possível gerar uma solução base para criar regras')
      return
    }

    const solution: CellState[][] = []
    for (let row = 0; row < rows; row++) {
      solution[row] = []
      for (let col = 0; col < cols; col++) {
        const cell = getCell(row, col)
        solution[row]![col] = cell?.state ?? 'empty'
      }
    }

    const possibleRules: Array<{
      row1: number
      col1: number
      row2: number
      col2: number
      type: 'equal' | 'opposite'
    }> = []

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols - 1; col++) {
        const state1 = solution[row]![col]
        const state2 = solution[row]![col + 1]
        const type: 'equal' | 'opposite' = state1 === state2 ? 'equal' : 'opposite'
        possibleRules.push({ row1: row, col1: col, row2: row, col2: col + 1, type })
      }
    }

    for (let row = 0; row < rows - 1; row++) {
      for (let col = 0; col < cols; col++) {
        const state1 = solution[row]![col]
        const state2 = solution[row + 1]![col]
        const type: 'equal' | 'opposite' = state1 === state2 ? 'equal' : 'opposite'
        possibleRules.push({ row1: row, col1: col, row2: row + 1, col2: col, type })
      }
    }

    const shuffled = possibleRules.sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, Math.min(count, shuffled.length))

    for (const rule of selected) {
      addRule(rule.row1, rule.col1, rule.row2, rule.col2, rule.type)
    }

    initializeBoard()
  }

  function generateSolutionWithoutRules(): boolean {
    let emptyCell: { row: number; col: number } | null = null
    for (let row = 0; row < rows && !emptyCell; row++) {
      for (let col = 0; col < cols && !emptyCell; col++) {
        const cell = getCell(row, col)
        if (cell?.state === 'empty') {
          emptyCell = { row, col }
        }
      }
    }

    if (!emptyCell) return true

    const { row, col } = emptyCell
    const cell = getCell(row, col)
    if (!cell) return false

    const states: CellState[] = Math.random() > 0.5 ? ['sun', 'moon'] : ['moon', 'sun']

    for (const state of states) {
      if (isValidPlacementWithoutRules(row, col, state)) {
        cell.state = state

        if (generateSolutionWithoutRules()) {
          return true
        }

        cell.state = 'empty'
      }
    }

    return false
  }

  function isValidPlacementWithoutRules(row: number, col: number, state: CellState): boolean {
    if (state === 'empty') return true

    const cell = getCell(row, col)
    if (!cell) return false

    const originalState = cell.state
    cell.state = state

    const rowLine = board.value[row]
    if (rowLine) {
      for (let i = 0; i <= cols - 3; i++) {
        const c1 = rowLine[i]?.state
        const c2 = rowLine[i + 1]?.state
        const c3 = rowLine[i + 2]?.state
        if (c1 !== 'empty' && c1 === c2 && c2 === c3) {
          cell.state = originalState
          return false
        }
      }
    }

    for (let i = 0; i <= rows - 3; i++) {
      const c1 = board.value[i]?.[col]?.state
      const c2 = board.value[i + 1]?.[col]?.state
      const c3 = board.value[i + 2]?.[col]?.state
      if (c1 !== 'empty' && c1 === c2 && c2 === c3) {
        cell.state = originalState
        return false
      }
    }

    if (rowLine) {
      const sunCount = rowLine.filter(c => c.state === 'sun').length
      const moonCount = rowLine.filter(c => c.state === 'moon').length
      if (sunCount > cols / 2 || moonCount > cols / 2) {
        cell.state = originalState
        return false
      }
    }

    const colLine = board.value.map(r => r?.[col]).filter((c): c is Cell => c !== undefined)
    const sunCountCol = colLine.filter(c => c.state === 'sun').length
    const moonCountCol = colLine.filter(c => c.state === 'moon').length
    if (sunCountCol > rows / 2 || moonCountCol > rows / 2) {
      cell.state = originalState
      return false
    }

    cell.state = originalState
    return true
  }

  function toggleCell(row: number, col: number, isRightClick: boolean = false): void {
    const cell = board.value[row]?.[col]
    if (!cell) return

    if (cell.isLocked) return

    if (isRightClick) {

      cell.state = cell.state === 'moon' ? 'empty' : 'moon'
    } else {

      cell.state = cell.state === 'sun' ? 'empty' : 'sun'
    }

    moves.value++
    validateBoard()
  }

  function setCell(row: number, col: number, state: CellState): void {
    const cell = board.value[row]?.[col]
    if (cell && !cell.isLocked) {
      cell.state = state
      validateBoard()
    }
  }

  function hasConsecutiveViolation(line: Cell[]): number[] {
    const violations: number[] = []

    for (let i = 0; i < line.length - 2; i++) {
      const cell1 = line[i]
      const cell2 = line[i + 1]
      const cell3 = line[i + 2]

      if (!cell1 || !cell2 || !cell3) continue

      const state1 = cell1.state
      const state2 = cell2.state
      const state3 = cell3.state

      if (state1 !== 'empty' && state1 === state2 && state2 === state3) {
        violations.push(i, i + 1, i + 2)
      }
    }

    return [...new Set(violations)]
  }

  function validateLine(line: Cell[], type: 'row' | 'col', index: number): LineValidation {
    const sunCount = line.filter(c => c.state === 'sun').length
    const moonCount = line.filter(c => c.state === 'moon').length
    const emptyCount = line.filter(c => c.state === 'empty').length
    const halfSize = line.length / 2

    const isComplete = emptyCount === 0 && sunCount === halfSize && moonCount === halfSize

    const hasTooManySuns = sunCount > halfSize
    const hasTooManyMoons = moonCount > halfSize
    const consecutiveViolations = hasConsecutiveViolation(line)

    const hasError = hasTooManySuns || hasTooManyMoons || consecutiveViolations.length > 0

    return {
      index,
      type,
      isComplete: isComplete && !hasError,
      hasError,
      sunCount,
      moonCount
    }
  }

  function validateRules(): void {
    for (const rule of rules.value) {
      if (rule.type === null) continue

      const cell1 = board.value[rule.cell1.row]?.[rule.cell1.col]
      const cell2 = board.value[rule.cell2.row]?.[rule.cell2.col]

      if (!cell1 || !cell2) continue

      if (cell1.state === 'empty' || cell2.state === 'empty') {
        rule.isViolated = false
        continue
      }

      if (rule.type === 'equal') {

        rule.isViolated = cell1.state !== cell2.state
      } else {

        rule.isViolated = cell1.state === cell2.state
      }
    }
  }

  function getRule(row1: number, col1: number, row2: number, col2: number): RuleCell | undefined {
    return rules.value.find(
      r =>
        (r.cell1.row === row1 && r.cell1.col === col1 && r.cell2.row === row2 && r.cell2.col === col2) ||
        (r.cell1.row === row2 && r.cell1.col === col2 && r.cell2.row === row1 && r.cell2.col === col1)
    )
  }

  function getRulesForCell(row: number, col: number): RuleCell[] {
    return rules.value.filter(
      r =>
        (r.cell1.row === row && r.cell1.col === col) ||
        (r.cell2.row === row && r.cell2.col === col)
    )
  }

  function triggerHighlight(type: 'row' | 'col', index: number): void {
    const key = `${type}-${index}`

    if (completedLinesHistory.value.has(key)) return

    completedLinesHistory.value.add(key)
    highlightedLines.value.add(key)

    setTimeout(() => {
      highlightedLines.value.delete(key)
    }, 1000)
  }

  function getCell(row: number, col: number): Cell | null {
    return board.value[row]?.[col] ?? null
  }

  function validateBoard(): void {

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cell = getCell(row, col)
        if (cell) {
          cell.hasError = false
          cell.isComplete = false
        }
      }
    }

    for (let row = 0; row < rows; row++) {
      const line = board.value[row]
      if (!line) continue

      const validation = validateLine(line, 'row', row)

      if (validation.hasError) {

        const consecutiveErrors = hasConsecutiveViolation(line)
        for (const idx of consecutiveErrors) {
          const cell = getCell(row, idx)
          if (cell) cell.hasError = true
        }

        const halfSize = cols / 2
        if (validation.sunCount > halfSize) {
          line.filter(c => c.state === 'sun').forEach(c => {
            const cell = getCell(c.row, c.col)
            if (cell) cell.hasError = true
          })
        }
        if (validation.moonCount > halfSize) {
          line.filter(c => c.state === 'moon').forEach(c => {
            const cell = getCell(c.row, c.col)
            if (cell) cell.hasError = true
          })
        }
      }

      if (validation.isComplete) {
        line.forEach(c => {
          const cell = getCell(c.row, c.col)
          if (cell) cell.isComplete = true
        })
        triggerHighlight('row', row)
      }
    }


    for (let col = 0; col < cols; col++) {
      const line = board.value.map(row => row?.[col]).filter((c): c is Cell => c !== undefined)
      if (line.length !== rows) continue

      const validation = validateLine(line, 'col', col)

      if (validation.hasError) {

        const consecutiveErrors = hasConsecutiveViolation(line)
        for (const idx of consecutiveErrors) {
          const cell = getCell(idx, col)
          if (cell) cell.hasError = true
        }

        const halfSize = rows / 2
        if (validation.sunCount > halfSize) {
          line.filter(c => c.state === 'sun').forEach(c => {
            const cell = getCell(c.row, c.col)
            if (cell) cell.hasError = true
          })
        }
        if (validation.moonCount > halfSize) {
          line.filter(c => c.state === 'moon').forEach(c => {
            const cell = getCell(c.row, c.col)
            if (cell) cell.hasError = true
          })
        }
      }

      if (validation.isComplete) {
        line.forEach(c => {
          const cell = getCell(c.row, c.col)
          if (cell) cell.isComplete = true
        })
        triggerHighlight('col', col)
      }
    }

    validateRules()

    for (const rule of rules.value) {
      if (rule.isViolated) {
        const cell1 = getCell(rule.cell1.row, rule.cell1.col)
        const cell2 = getCell(rule.cell2.row, rule.cell2.col)
        if (cell1) cell1.hasError = true
        if (cell2) cell2.hasError = true
      }
    }
  }

  const isCompleted = computed(() => {

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (board.value[row]?.[col]?.state === 'empty') return false
        if (board.value[row]?.[col]?.hasError) return false
      }
    }

    for (const rule of rules.value) {
      if (rule.isViolated) return false
    }

    return true
  })

  const totalSuns = computed(() => {
    let count = 0
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (board.value[row]?.[col]?.state === 'sun') count++
      }
    }
    return count
  })

  const totalMoons = computed(() => {
    let count = 0
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (board.value[row]?.[col]?.state === 'moon') count++
      }
    }
    return count
  })

  const emptyCells = computed(() => {
    return rows * cols - totalSuns.value - totalMoons.value
  })

  const progress = computed(() => {
    const total = rows * cols
    const filled = total - emptyCells.value
    return Math.round((filled / total) * 100)
  })

  function isLineHighlighted(type: 'row' | 'col', index: number): boolean {
    return highlightedLines.value.has(`${type}-${index}`)
  }

  function isValidPlacement(row: number, col: number, state: CellState): boolean {
    if (state === 'empty') return true

    const cell = getCell(row, col)
    if (!cell) return false


    const originalState = cell.state
    cell.state = state


    const rowLine = board.value[row]
    if (rowLine) {
      for (let i = 0; i <= cols - 3; i++) {
        const c1 = rowLine[i]?.state
        const c2 = rowLine[i + 1]?.state
        const c3 = rowLine[i + 2]?.state
        if (c1 !== 'empty' && c1 === c2 && c2 === c3) {
          cell.state = originalState
          return false
        }
      }
    }

    for (let i = 0; i <= rows - 3; i++) {
      const c1 = board.value[i]?.[col]?.state
      const c2 = board.value[i + 1]?.[col]?.state
      const c3 = board.value[i + 2]?.[col]?.state
      if (c1 !== 'empty' && c1 === c2 && c2 === c3) {
        cell.state = originalState
        return false
      }
    }

    if (rowLine) {
      const sunCount = rowLine.filter(c => c.state === 'sun').length
      const moonCount = rowLine.filter(c => c.state === 'moon').length
      if (sunCount > cols / 2 || moonCount > cols / 2) {
        cell.state = originalState
        return false
      }
    }

    const colLine = board.value.map(r => r?.[col]).filter((c): c is Cell => c !== undefined)
    const sunCountCol = colLine.filter(c => c.state === 'sun').length
    const moonCountCol = colLine.filter(c => c.state === 'moon').length
    if (sunCountCol > rows / 2 || moonCountCol > rows / 2) {
      cell.state = originalState
      return false
    }

    const cellRules = getRulesForCell(row, col)
    for (const rule of cellRules) {
      if (rule.type === null) continue

      const otherPos = rule.cell1.row === row && rule.cell1.col === col
        ? rule.cell2
        : rule.cell1
      const otherCell = getCell(otherPos.row, otherPos.col)

      if (!otherCell || otherCell.state === 'empty') continue

      if (rule.type === 'equal' && cell.state !== otherCell.state) {
        cell.state = originalState
        return false
      }
      if (rule.type === 'opposite' && cell.state === otherCell.state) {
        cell.state = originalState
        return false
      }
    }

    cell.state = originalState
    return true
  }

  function generateSolution(): boolean {

    let emptyCell: { row: number; col: number } | null = null
    for (let row = 0; row < rows && !emptyCell; row++) {
      for (let col = 0; col < cols && !emptyCell; col++) {
        const cell = getCell(row, col)
        if (cell?.state === 'empty') {
          emptyCell = { row, col }
        }
      }
    }

    if (!emptyCell) return true

    const { row, col } = emptyCell
    const cell = getCell(row, col)
    if (!cell) return false

    const states: CellState[] = Math.random() > 0.5 ? ['sun', 'moon'] : ['moon', 'sun']

    for (const state of states) {
      if (isValidPlacement(row, col, state)) {
        cell.state = state


        if (generateSolution()) {
          return true
        }


        cell.state = 'empty'
      }
    }

    return false
  }

  function fillRandomCells(count: number): number {

    const maxCells = rows * cols
    const targetCount = Math.min(count, maxCells)

    if (!generateSolution()) {
      console.warn('Não foi possível gerar uma solução válida para o tabuleiro')
      return 0
    }

    const solution: CellState[][] = []
    for (let row = 0; row < rows; row++) {
      solution[row] = []
      for (let col = 0; col < cols; col++) {
        const cell = getCell(row, col)
        solution[row]![col] = cell?.state ?? 'empty'
      }
    }

    if (targetCount >= maxCells) {
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const cell = getCell(row, col)
          if (cell) {
            cell.isLocked = true
          }
        }
      }
      validateBoard()
      return maxCells
    }

    const allPositions: Array<{ row: number; col: number }> = []
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        allPositions.push({ row, col })
      }
    }

    const shuffled = allPositions.sort(() => Math.random() - 0.5)

    const keepFilled = new Set<string>()
    for (let i = 0; i < targetCount; i++) {
      const pos = shuffled[i]
      if (pos) {
        keepFilled.add(`${pos.row}-${pos.col}`)
      }
    }

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cell = getCell(row, col)
        if (cell) {
          const key = `${row}-${col}`
          if (keepFilled.has(key)) {
            const savedState = solution[row]?.[col]
            cell.state = savedState ?? 'empty'
            cell.isLocked = true
          } else {
            cell.state = 'empty'
            cell.isLocked = false
          }
        }
      }
    }

    validateBoard()
    return targetCount
  }

  function resetGame(): void {
    initializeBoard()
    generateRandomRules()
    moves.value = 0
    highlightedLines.value.clear()
    completedLinesHistory.value.clear()
  }

  function setupGame(predefinedRules?: Array<{
    row1: number
    col1: number
    row2: number
    col2: number
    type: 'equal' | 'opposite'
  }>, initialFill: number = 0): void {
    initializeBoard()

    if (predefinedRules) {
      clearRules()
      for (const rule of predefinedRules) {
        addRule(rule.row1, rule.col1, rule.row2, rule.col2, rule.type)
      }
    } else {
      generateRandomRules()
    }

    if (initialFill > 0) {
      fillRandomCells(initialFill)
    }

    moves.value = 0
    highlightedLines.value.clear()
    completedLinesHistory.value.clear()
  }

  initializeBoard()

  return {
    board: board,
    rules: rules,
    moves: moves,
    highlightedLines: highlightedLines,

    isCompleted,
    totalSuns,
    totalMoons,
    emptyCells,
    progress,

    initializeBoard,
    clearBoard,
    resetGame,
    setupGame,
    addRule,
    clearRules,
    generateRandomRules,
    fillRandomCells,

    toggleCell,
    setCell,

    validateBoard,
    validateLine,
    validateRules,
    getRule,
    getRulesForCell,
    isLineHighlighted
  }
}

export type UseTangoReturn = ReturnType<typeof useTango>
