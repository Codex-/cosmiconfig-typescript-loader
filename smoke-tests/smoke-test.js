const assert = require("node:assert");

(async () => {
  try {
    const esm = await import("../dist/cjs/index.js");
    const cjs = require("../dist/cjs/index.js");

    assert.strictEqual(
      esm.TypeScriptLoader,
      cjs.TypeScriptLoader,
      "esm.TypeScriptLoader === cjs.TypeScriptLoader"
    );

    // try to create loaders
    esm.TypeScriptLoader();
    cjs.TypeScriptLoader();

    console.info("Loaded with both CJS and ESM successfully");
  } catch (error) {
    console.error(error);
    console.debug(error.stack);

    // Prevent an unhandled rejection, exit gracefully.
    process.exit(1);
  }
})();
