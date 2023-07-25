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
    console.error(error);
    console.debug(error.stack);
    console.error("Failed to load with ESM");
    process.exit(1);
  }
})();
