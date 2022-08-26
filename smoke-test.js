const assert = require("node:assert");

async function main() {
  const esm = await import("./dist/cjs/index.js");
  const cjs = require("./dist/cjs/index.js");

  assert.equal(
    esm.TypeScriptLoader,
    cjs.TypeScriptLoader,
    "esm.TypeScriptLoader === cjs.TypeScriptLoader"
  );

  // try to create loaders
  esm.TypeScriptLoader();
  cjs.TypeScriptLoader();
}

main();
