const assert = require('node:assert');

async function main() {
   const TypeScriptLoader1 = await import('./dist/cjs/index.js');
   const TypeScriptLoader2 = require('./dist/cjs/index.js');

   assert.equal(TypeScriptLoader1.default, TypeScriptLoader2, 'TypeScriptLoader1 === TypeScriptLoader2');

   // try to create loaders
   TypeScriptLoader1()
   TypeScriptLoader2()
}

main()
