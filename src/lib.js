export function map(value, inMin, inMax, outMin, outMax) {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin
}

export function range(start, end, tick) {
  const s = Math.round(start / tick) * tick
  return Array.from({
    length: Math.floor((end - start) / tick)
  }, (v, k) => {
    return k * tick + s
  });
}
