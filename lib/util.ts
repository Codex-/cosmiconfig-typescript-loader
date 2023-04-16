export function instanceOfNodeError(
  error: unknown
): error is NodeJS.ErrnoException {
  return (
    error instanceof Error &&
    // https://github.com/DefinitelyTyped/DefinitelyTyped/commit/cddd0b7aab18761214d26a0c7012cf45de5285a9
    (error as Record<string, any>).code !== undefined
  );
}
