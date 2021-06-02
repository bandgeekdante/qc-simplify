let placedGates = [...Array(8)].map(x=>Array(8).fill(false));
let globalPhase = 0;
let tips = 0;
let observer = null;

function emitChange() {
  observer(placedGates, globalPhase);
}

function cancelOne(y, x) {
  if (x > 0) {
    cancelTwo(y, x, x-1);
  }
  if (x < 7) {
    cancelTwo(y, x, x+1);
  }
}

function cancelTwo(y, x1, x2) {
  if (placedGates[y][x1] === placedGates[y][x2]) {
    placedGates[y][x1] = false;
    placedGates[y][x2] = false;
    return true;
  }
  let p1 = PauliNumber(placedGates[y][x1]);
  let p2 = PauliNumber(placedGates[y][x2]);
  if (p1 && p2) {
    if (p2-p1 === 1 || p2-p1 === -2) {
      placedGates[y][x1] = PauliGate((p1 + 2) % 3);
      globalPhase += 0.5;
    } else {
      placedGates[y][x1] = PauliGate((p1 + 1) % 3);
      globalPhase += 1.5;
    }
    if (x2 < x1) {
      globalPhase += 1;
    }
    placedGates[y][x2] = false;
    return true;
  }
  return false;
}

function PauliNumber(gate) {
  if (gate === 'X') {
    return 1;
  } else if (gate === 'Y') {
    return 2;
  } else if (gate === 'Z') {
    return 3;
  } else {
    return 0;
  }
}

function PauliGate(number) {
  if (number === 1) {
    return 'X';
  } else if (number === 2) {
    return 'Y';
  } else if (number === 0) {
    return 'Z';
  }
}

export function observe(o) {
  if (observer) {
    throw new Error('Multiple observers not implemented.');
  }
  observer = o;
  emitChange();
}

export function placeGate(item) {
  if (item.y >= 1) {
    placedGates[item.y][item.x] = item.gate;
    cancelOne(item.y, item.x);
    tips = Math.max(1,tips);
  }
  emitChange();
}

export function slideGate(item, toY, toX) {
  if (item.y === toY && item.x === toX) {
    return;
  }
  if (placedGates[toY][toX] && item.y === toY && Math.abs(toX-item.x) === 1) {
    if (placedGates[toY][toX] !== item.gate) {
      tips = Math.max(2,tips);
      if (PauliNumber(placedGates[toY][toX]) && PauliNumber(item.gate)) {
        globalPhase += 1;
      } else {
        // commuting with H
        if (placedGates[toY][toX] === 'X') {
          placedGates[toY][toX] = 'Z';
        } else if (placedGates[toY][toX] === 'Z') {
          placedGates[toY][toX] = 'X';
        } else if (item.gate === 'X') {
          item.gate = 'Z';
        } else if (item.gate === 'Z') {
          item.gate = 'X';
        } else {
          // commuting H and Y
          globalPhase += 1;
        }
      }
    }
    placedGates[item.y][item.x] = placedGates[toY][toX];
    placedGates[toY][toX] = false;
    cancelOne(item.y, item.x);
  } else if (canPlaceGate(item, toY, toX)) {
    placedGates[item.y][item.x] = false;
  } else {
    return;
  }
  item.x = toX;
  item.y = toY;
  placedGates[toY][toX] = item.gate;
  item.moved = true;
  emitChange();
}

export function canPlaceGate(item, toY, toX) {
  return (
    ((toY >= 1 && toY <= 6) && ((item.moved && item.y === toY && item.x === toX) || !(placedGates[toY][toX])))
    || ((item.y >= 1 || item.x === 7) && toY === 0 && toX === 7)
  );
}

export function getTips() {
  return tips;
}
