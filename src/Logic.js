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

export function placeGate(item, toY, toX) {
  placedGates[item.y][item.x] = false
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

export function slideGate(item, toY, toX) {
  if (placedGates[toY][toX] && item.y === toY) {
    placedGates[toY][toX] = false
    placedGates[item.y][item.x] = true
    console.log(placedGates)
    emitChange()
  }
  item.x = toX
  item.y = toY
}

export function canPlaceGate(toY, toX) {
  return (
    (toY === 1) && !(placedGates[toY][toX])
  )
}
