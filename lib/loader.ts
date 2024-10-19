import type { Loader } from "cosmiconfig";
import jiti, { type JITIOptions } from "jiti";

import { TypeScriptCompileError } from "./typescript-compile-error.js";

export function TypeScriptLoader(options?: JITIOptions): Loader {
  const loader = jiti("", { interopDefault: true, ...options });
  return (path: string): unknown => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result: { default?: unknown } = loader(path);

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
