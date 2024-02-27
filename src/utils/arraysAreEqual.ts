export function arraysAreEqual(
  a: any[] | undefined | null,
  b: any[] | undefined | null
) {
  if (a === undefined && b !== undefined) return false;
  if (a !== undefined && b === undefined) return false;
  if (a === undefined && b === undefined) return true;
  if (a === null && b !== null) return false;
  if (a !== null && b === null) return false;
  if (a === null && b === null) return true;

  if (a !== undefined && b !== undefined && a !== null && b !== null) {
    return a.length === b.length && a.every((val, index) => val === b[index]);
  }
}
