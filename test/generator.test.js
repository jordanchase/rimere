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

test("generates while loop", () => {
  const js = generate(`
    bindan x as 1;
    hwil x < 3:
      sprecan x;
    end
  `);

  assert(js.includes("while"));
});

test("generates boolean logic", () => {
  const js = generate(`
    bindan x as soþ;
    bindan y as na;
    sprecan x and y;
  `);

  assert(js.includes("&&"));
});

test("generates comparison", () => {
  const js = generate(`
    sprecan 5 > 3;
  `);

  assert(js.includes(">"));
});

test("generates list literals", () => {
  assert.equal(
    generate(`sprecan [1, 2, 3];`).trim(),
    "console.log([1, 2, 3]);",
  );
});

test("generates parenthesized arithmetic", () => {
  assert.equal(
    generate(`sprecan (1 + 2) * 3;`).trim(),
    "console.log(((1 + 2) * 3));",
  );
});

test("generates subtraction", () => {
  assert.equal(generate(`sprecan 10 - 4;`).trim(), "console.log((10 - 4));");
});

test("generates division", () => {
  assert.equal(generate(`sprecan 8 / 2;`).trim(), "console.log((8 / 2));");
});

test("generates less than comparison", () => {
  assert.equal(generate(`sprecan 2 < 3;`).trim(), "console.log((2 < 3));");
});

test("generates equality comparison", () => {
  assert.equal(generate(`sprecan 2 == 2;`).trim(), "console.log((2 == 2));");
});

test("generates nested conditionals", () => {
  const js = generate(`
    bindan x as 5;
    gif x > 0:
      gif x < 10:
        sprecan "inside";
      end
    end
  `);

  assert(js.includes("if"));
  assert(js.includes("inside"));
});

test("generates function with nested if", () => {
  const js = generate(`
    ritan check with x:
      gif x > 0:
        cweðan x;
      end
      cweðan 0;
    end
  `);

  assert(js.includes("function check"));
  assert(js.includes("return x"));
  assert(js.includes("return 0"));
});

test("generates nested arithmetic precedence", () => {
  assert.equal(
    generate(`sprecan 1 + 2 * 3;`).trim(),
    "console.log((1 + (2 * 3)));",
  );
});
