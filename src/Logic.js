let placedGates = [...Array(8)].map(x=>Array(8).fill(false))
let globalPhase = 0
let tips = 0
let observer = null

function emitChange() {
  observer(placedGates, globalPhase)
}

function cancelOut(y, x) {
  if (x > 0 && placedGates[y][x-1] === placedGates[y][x]) {
    placedGates[y][x] = false
    placedGates[y][x-1] = false
  } else if (x < 7 && placedGates[y][x+1] === placedGates[y][x]) {
    placedGates[y][x] = false
    placedGates[y][x+1] = false
  }
}

function Pauli(gate) {
  return gate === 'X' || gate === 'Y' || gate === 'Z'
}

export function observe(o) {
  if (observer) {
    throw new Error('Multiple observers not implemented.')
  }
  observer = o
  emitChange()
}

export function placeGate(item) {
  if (item.y >= 1) {
    placedGates[item.y][item.x] = item.gate
    cancelOut(item.y, item.x)
    tips = Math.max(1,tips)
  }
  emitChange()
}

export function slideGate(item, toY, toX) {
  if (item.y === toY && item.x === toX) {
    return
  }
  if (placedGates[toY][toX] && item.y === toY && Math.abs(toX-item.x) === 1) {
    // TODO: Refactor into a "commuteGates" function
    if (placedGates[toY][toX] !== item.gate) {
      tips = Math.max(2,tips)
      if (Pauli(placedGates[toY][toX]) && Pauli(item.gate)) {
        globalPhase += 1
      } else {
        // commuting with H
        if (placedGates[toY][toX] === 'X') {
          placedGates[toY][toX] = 'Z'
        } else if (placedGates[toY][toX] === 'Z') {
          placedGates[toY][toX] = 'X'
        } else if (item.gate === 'X') {
          item.gate = 'Z'
        } else if (item.gate === 'Z') {
          item.gate = 'X'
        } else {
          // commuting H and Y
          globalPhase += 1
        }
      }
    }
    placedGates[item.y][item.x] = placedGates[toY][toX]
    placedGates[toY][toX] = false
    cancelOut(item.y, item.x)
  } else if (canPlaceGate(item, toY, toX)) {
    placedGates[item.y][item.x] = false
  } else {
    return
  }
  item.x = toX
  item.y = toY
  placedGates[toY][toX] = item.gate
  item.moved = true
  emitChange()
}

export function canPlaceGate(item, toY, toX) {
  return (
    ((toY >= 1 && toY <= 6) && ((item.moved && item.y === toY && item.x === toX) || !(placedGates[toY][toX])))
    || ((item.y >= 1 || item.x === 7) && toY === 0 && toX === 7)
  )
}

export function getTips() {
  return tips
}
