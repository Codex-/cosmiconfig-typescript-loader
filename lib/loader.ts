import type { LoaderResult, LoaderSync } from "cosmiconfig";
import { createJiti } from "jiti";

type Jiti = ReturnType<typeof createJiti>;
type JitiOptions = Parameters<typeof createJiti>[1];
import { TypeScriptCompileError } from "./typescript-compile-error.js";

type LoaderAsync = (filepath: string, content: string) => Promise<LoaderResult>;

export function TypeScriptLoader(options?: JitiOptions): LoaderAsync {
  const loader: Jiti = createJiti("", { interopDefault: true, ...options });
  return async (path: string, _content: string): Promise<LoaderResult> => {
    try {
      // Because the import resolved as `unknown`, in the union of `unknown & { default?: unknown }`
      // `unknown` is the loosest type, however, we know it's an imported module possibly with a
      // default export set.
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const result = (await loader.import(path)) as { default?: unknown };

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
  const loader: Jiti = createJiti("", { interopDefault: true, ...options });
  return (path: string, _content: string): LoaderResult => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      const result = loader(path) as { default?: unknown };

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
