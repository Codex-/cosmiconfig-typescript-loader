import type { LoaderResult, LoaderSync } from "cosmiconfig";
import { createJiti } from "jiti";

type Jiti = ReturnType<typeof createJiti>;
type JitiOptions = Parameters<typeof createJiti>[1];
import { TypeScriptCompileError } from "./typescript-compile-error.js";

type LoaderAsync = (filepath: string, content: string) => Promise<LoaderResult>;

export function TypeScriptLoader(options?: JitiOptions): LoaderAsync {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
  const loader: Jiti = createJiti("", { interopDefault: true, ...options });
  return async (path: string): Promise<unknown> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      const result: { default?: unknown } = (await loader.import(path)) as any;

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

/**
 * @deprecated use `TypeScriptLoader`
 */
export function TypeScriptLoaderSync(options?: JitiOptions): LoaderSync {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
  const loader: Jiti = createJiti("", { interopDefault: true, ...options });
  return (path: string): unknown => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-deprecated
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
