import type { Loader } from "cosmiconfig";
import type { RegisterOptions, Service } from "ts-node";

import { TypeScriptCompileError } from "./typescript-compile-error";
import { instanceOfNodeError } from "./util";

export function TypeScriptLoader(options?: RegisterOptions): Loader {
  let tsNodeInstance: Service;

  return (path: string, content: string) => {
    if (!tsNodeInstance) {
      try {
        const { register } = require("ts-node") as typeof import("ts-node");
        tsNodeInstance = register({
          ...options,
          compilerOptions: { module: "commonjs" },
        });
      } catch (error) {
        if (
          instanceOfNodeError(error) &&
          error.code === "ERR_MODULE_NOT_FOUND"
        ) {
          throw new Error(
            "cosmiconfig-typescript-loader: 'ts-node' is required for loading TypeScript cosmiconfig configuration files." +
              `Make sure it is installed\nError: ${error.message}`
          );
        }
        throw error;
      }
    }

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
