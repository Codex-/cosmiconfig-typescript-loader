const assert = require("node:assert");

(async () => {
  try {
    const { TypeScriptLoaderSync: esm } = await import("../dist/esm/index.mjs");
    const { TypeScriptLoaderSync: cjs } = require("../dist/cjs/index.cjs");

    // Assert the functions loaded by checking their names load and types are correct
    assert.strictEqual(esm.name === "TypeScriptLoaderSync", true);
    assert.strictEqual(typeof esm === "function", true);
    assert.strictEqual(cjs.name === "TypeScriptLoaderSync", true);
    assert.strictEqual(typeof cjs === "function", true);

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
