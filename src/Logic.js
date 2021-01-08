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

export function placeGate(toX, toY) {
  placedGates[toY][toX] = true
  emitChange()
}

export function removeGate(fromX, fromY) {
  placedGates[fromY][fromX] = false
  emitChange()
}

export function canPlaceGate(toX, toY) {
  return (
    (toY === 1) && !(placedGates[toY][toX])
  )
}
