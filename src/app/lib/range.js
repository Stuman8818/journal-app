export function range(lowEnd, highEnd) {
  const arr = [];
  let c = highEnd - lowEnd;
  while (c--) {
    arr[c] = --highEnd;
  }
  return arr;
}
