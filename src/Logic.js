let placedGates = [...Array(8)].map(x=>Array(8).fill(false))
let globalPhase = 1
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
  placedGates[item.y][item.x] = item.gate
  cancelOut(item.y, item.x)
  emitChange()
}

export function slideGate(item, toY, toX) {
  if (placedGates[toY][toX] && item.y === toY && Math.abs(toX-item.x) === 1) {
    if (placedGates[toY][toX] !== item.gate) {
      if (Pauli(placedGates[toY][toX]) && Pauli(item.gate)) {
        globalPhase *= -1
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
          globalPhase *= -1
        }
      }
    }
    placedGates[item.y][item.x] = placedGates[toY][toX]
    placedGates[toY][toX] = false
    cancelOut(item.y, item.x)
    item.x = toX
    item.y = toY
    emitChange()
  } else if (canPlaceGate(toY, toX)) {
    placedGates[item.y][item.x] = false
    item.x = toX
    item.y = toY
    emitChange()
  }
}

export function canPlaceGate(toY, toX) {
  return (
    (toY >= 1 && toY <= 6) && !(placedGates[toY][toX])
  )
}
