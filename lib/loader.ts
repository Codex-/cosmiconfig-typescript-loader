import type { Loader } from "cosmiconfig";
import { register, RegisterOptions } from "ts-node";
import { TypeScriptCompileError } from "./typescript-compile-error";

export function TypeScriptLoader(options?: RegisterOptions): Loader {
  const tsNodeInstance = register({
    ...options,
    compilerOptions: { module: "commonjs" },
  });
  return (path: string, content: string) => {
    try {
      // cosmiconfig requires the transpiled configuration to be CJS
      tsNodeInstance.compile(content, path);
      const result = require(path);

      // `default` is used when exporting using export default, some modules
      // may still use `module.exports` or if in TS `export = `
      return result.default || result;
    } catch (error) {
      if (error instanceof Error) {
        // Coerce generic error instance into typed error with better logging.
        throw TypeScriptCompileError.fromError(error);
      }
      throw error;
    }
  };
}
