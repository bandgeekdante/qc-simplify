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

export function placeGate(fromY, fromX, toY, toX) {
  placedGates[fromY][fromX] = false
  placedGates[toY][toX] = true
  if (toX > 0 && placedGates[toY][toX-1] === true) {
    placedGates[toY][toX] = false
    placedGates[toY][toX-1] = false
  } else if (toX < 7 && placedGates[toY][toX+1] === true) {
    placedGates[toY][toX] = false
    placedGates[toY][toX+1] = false
  }
  emitChange()
}

export function canPlaceGate(toY, toX) {
  return (
    (toY === 1) && !(placedGates[toY][toX])
  )
}
