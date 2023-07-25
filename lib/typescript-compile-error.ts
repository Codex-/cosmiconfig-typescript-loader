export class TypeScriptCompileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;

    // https://github.com/Microsoft/TypeScript-wiki/blob/main/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, new.target.prototype);
  }

  public static fromError(error: Error): TypeScriptCompileError {
    const message = `TypeScriptLoader failed to compile TypeScript:\n${error.message}`;

    const newError = new TypeScriptCompileError(message);
    newError.stack = error.stack;

    return newError;
  }
}
