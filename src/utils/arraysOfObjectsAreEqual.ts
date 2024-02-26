function objectsAreEqual(a: any, b: any): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function arraysOfObjectsAreEqual(
  a: any[] | undefined,
  b: any[] | undefined
): boolean {
  if (a === undefined && b !== undefined) return false;
  if (a !== undefined && b === undefined) return false;
  if (a === undefined && b === undefined) return true;
  if (a!.length !== b!.length) return false;

  return a!.every((val, index) => objectsAreEqual(val, b![index]));
}
