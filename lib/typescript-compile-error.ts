export class TypeScriptCompileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name
  }

  public static fromError(error: Error): TypeScriptCompileError {
    const errMsg = error.message.replace(
      /(TypeScript compiler encountered syntax errors while transpiling\. Errors:\s?)|(⨯ Unable to compile TypeScript:\s?)/,
      ""
    );

    const message = `TypeScriptLoader failed to compile TypeScript:\n${errMsg}`;

    const newError = new TypeScriptCompileError(message);
    newError.stack = error.stack;

    return newError;
  }

  /**
   * Support legacy usage of this method.
   * @deprecated
   */
  public toObject() {
    return {
      message: this.message,
      name: this.name,
      stack: this.stack,
    };
  }
}
