// app.js
console.log("1 - start app");

const a = require("./a.cjs");     // ← blocks & runs a.js completely
console.log("4 - back in app");

const b = require("./b.cjs");     // ← blocks & runs b.js completely
console.log("7 - end app");


/*
If the {"type": "module"} is setted that doesn't means you can not create or use the CommonJS module system. You can use it you just need to modify the file extension.

same for ESM that time extension ".mjs"

If you only write the extension ".js" then Node will decide how to treat it whether as CommonJS or ESM by seeming the package.json

*/