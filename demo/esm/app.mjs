console.log("1 - start app.mjs");

import "./a.mjs";          // ← static import, discovered early
console.log("4 - back in app after a");

import "./b.mjs";          // ← another static import
console.log("7 - end app");