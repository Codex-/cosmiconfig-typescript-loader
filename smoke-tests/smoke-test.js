const assert = require("node:assert");

(async () => {
  try {
    const { TypeScriptLoader: esm } = await import("../dist/cjs/index.js");
    const { TypeScriptLoader: cjs } = require("../dist/cjs/index.js");

    assert.strictEqual(esm, cjs, "esm === cjs");

    // Try to create loaders
    esm();
    cjs();

    console.info("Loaded with both CJS and ESM successfully");
  } catch (error) {
    console.error(error);
    console.debug(error.stack);

    // Prevent an unhandled rejection, exit gracefully.
    process.exit(1);
  }
})();
