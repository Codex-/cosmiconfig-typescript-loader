import type { Loader } from "cosmiconfig";
import { register, RegisterOptions } from "ts-node";

const TypeScriptLoader = (options?: RegisterOptions): Loader => {
  return (path: string, content: string) => {
    try {
      register(options).compile(content, path);
      const result = require(path);
      return result.default || result;
    } catch (error) {}
  };
};

export default TypeScriptLoader;
