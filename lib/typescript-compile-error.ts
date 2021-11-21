export class TypeScriptCompileError extends Error {
  public static fromError(error: Error): TypeScriptCompileError {
    const errMsg = error.message.replace(
      "TypeScript compiler encountered syntax errors while transpiling. Errors: ",
      ""
    );

    const message = `Failed to compile TypeScript: ${errMsg}`;

    const newError = new TypeScriptCompileError(message);
    newError.stack = error.stack;

    return newError;
  }

  public toObject() {
    return {
      message: this.message,
      name: this.name,
      stack: this.stack,
    };
  }
}
