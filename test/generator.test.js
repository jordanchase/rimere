import assert from "node:assert/strict";
import test from "node:test";
import generate from "../src/generator.js";

test("generates JavaScript for hello world", () => {
  assert.equal(
    generate(`sprecan "Hello, Rímere!";`).trim(),
    `console.log("Hello, Rímere!");`,
  );
});

test("generates JavaScript for variables and arithmetic", () => {
  assert.equal(
    generate(`
      bindan x as 5;
      bindan y as 10;
      sprecan x + y;
    `).trim(),
    `let x = 5;
let y = 10;
console.log((x + y));`,
  );
});

test("generates JavaScript for conditionals", () => {
  assert.equal(
    generate(`
      bindan x as 5;
      gif x > 3:
        sprecan "big";
      elles:
        sprecan "small";
      end
    `).trim(),
    `let x = 5;
if ((x > 3)) {
console.log("big");
} else {
console.log("small");
}`,
  );
});

test("generates JavaScript for functions", () => {
  assert.equal(
    generate(`
      ritan add with a, b:
        cweðan a + b;
      end

      sprecan add(2, 3);
    `).trim(),
    `function add(a, b) {
return (a + b);
}
console.log(add(2, 3));`,
  );
});
