const assert = require("node:assert");

const { cosmiconfig } = require("cosmiconfig");
const { TypeScriptLoader } = require("../dist/cjs/index.cjs");
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

    console.info("Loaded with CJS successfully");
  } catch (error) {
    console.error(error);
    console.debug(error.stack);
    console.error("Failed to load with CJS");
    process.exit(1);
  }
})();
