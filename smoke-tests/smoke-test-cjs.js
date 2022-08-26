const mod = require("../dist/cjs/index.js");
const { TypeScriptLoader } = mod;
TypeScriptLoader();

console.info("Loaded with CJS successfully");
