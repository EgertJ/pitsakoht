export function arraysAreEqual(a: any[] | undefined, b: any[] | undefined) {
  if (a === undefined && b !== undefined) return false;
  if (a !== undefined && b === undefined) return false;
  if (a === undefined && b === undefined) return true;
  if (a !== undefined && b !== undefined) {
    return a.length === b.length && a.every((val, index) => val === b[index]);
  }
}
