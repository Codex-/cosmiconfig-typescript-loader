import type { Loader } from "cosmiconfig";
import type { RegisterOptions, Service } from "ts-node";

import { TypeScriptCompileError } from "./typescript-compile-error";

export function TypeScriptLoader(options?: RegisterOptions): Loader {
  let tsNodeInstance: Service;

  return (path: string, content: string) => {
    try {
      if (!tsNodeInstance) {
        const { register } = require("ts-node") as typeof import("ts-node");
        tsNodeInstance = register({
          ...options,
          compilerOptions: { module: "commonjs" },
        });
      }

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
