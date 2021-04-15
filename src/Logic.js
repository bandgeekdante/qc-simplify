let placedGates = [...Array(8)].map(x=>Array(8).fill(false))
let observer = null

function emitChange() {
  observer(placedGates)
}

export function observe(o) {
  if (observer) {
    throw new Error('Multiple observers not implemented.')
  }

  observer = o
  emitChange()
}

export function cancelOut(y, x) {
  if (x > 0 && placedGates[y][x-1] === placedGates[y][x]) {
    placedGates[y][x] = false
    placedGates[y][x-1] = false
  } else if (x < 7 && placedGates[y][x+1] === placedGates[y][x]) {
    placedGates[y][x] = false
    placedGates[y][x+1] = false
  }
}

export function placeGate(item) {
  placedGates[item.y][item.x] = item.gate
  cancelOut(item.y, item.x)
  emitChange()
}

export function slideGate(item, toY, toX) {
  if (placedGates[toY][toX] === item.gate && item.y === toY && Math.abs(toX-item.x) === 1) {
    placedGates[toY][toX] = false
    placedGates[item.y][item.x] = item.gate
    cancelOut(item.y, item.x)
    item.x = toX
    item.y = toY
    emitChange()
  } else if (canPlaceGate(toY, toX)) {
    placedGates[item.y][item.x] = false
    // placedGates[toY][toX] = item.gate
    item.x = toX
    item.y = toY
    emitChange()
  }
}

export function canPlaceGate(toY, toX) {
  return (
    (toY === 1) && !(placedGates[toY][toX])
  )
}
