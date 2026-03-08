// a.js
console.log("2 - inside a");
require("./b.cjs");               // ← runs b.js right here!
console.log("5 - end a");