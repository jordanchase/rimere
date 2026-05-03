import assert from "node:assert/strict";
import test from "node:test";
import analyze from "../src/analyzer.js";

test("analyzes a valid variable program", () => {
  const program = analyze(`
    bindan x as 5;
    sprecan x;
  `);

  assert.equal(program.statements.length, 2);
});

test("rejects undeclared identifiers", () => {
  assert.throws(() => analyze(`sprecan x;`), /has not been declared/);
});

test("rejects duplicate declarations", () => {
  assert.throws(
    () =>
      analyze(`
      bindan x as 1;
      bindan x as 2;
    `),
    /already declared/,
  );
});

test("rejects return outside function", () => {
  assert.throws(() => analyze(`cweðan 5;`), /Return statements/);
});

test("rejects break outside loop", () => {
  assert.throws(() => analyze(`abrecan;`), /Break statements/);
});
