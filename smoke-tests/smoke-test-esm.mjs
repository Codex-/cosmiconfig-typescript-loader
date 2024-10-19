import assert from "node:assert";

import { cosmiconfig } from "cosmiconfig";
import { TypeScriptLoader } from "../dist/esm/index.mjs";
TypeScriptLoader();

(async () => {
  try {
    const explorer = cosmiconfig("test", {
      loaders: {
        ".ts": TypeScriptLoader(),
      },
    });

    const cfg = await explorer.load("./smoke-tests/config.ts");

    assert.deepStrictEqual(cfg.config, {
      cake: "lie",
    });

    console.info("Loaded with ESM successfully");
  } catch (error) {
    console.error("Failed to load configuration with ESM");
    if (error instanceof TypeError) {
      console.error("Type error occurred:", error.message);
    } else if (error instanceof SyntaxError) {
      console.error("Syntax error in configuration file:", error.message);
    } else {
      console.error("An unexpected error occurred:", error.message);
    }
    console.debug("Error stack trace:", error.stack);
    process.exit(1);
  }
})();
