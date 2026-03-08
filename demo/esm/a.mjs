console.log("2 - inside a.mjs");

import "./b.mjs";          // ← a depends on b
console.log("5 - end a");