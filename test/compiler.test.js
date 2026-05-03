import assert from "node:assert/strict";
import test from "node:test";
import compile from "../src/compiler.js";

test("compiles to JavaScript", () => {
  assert.equal(compile(`sprecan "hi";`, "js").trim(), `console.log("hi");`);
});

test("supports parsed output", () => {
  const parsed = compile(`sprecan "hi";`, "parsed");
  assert.equal(parsed.succeeded(), true);
});

test("supports analyzed output", () => {
  const analyzed = compile(`sprecan "hi";`, "analyzed");
  assert.equal(analyzed.statements.length, 1);
});

test("supports optimized output", () => {
  const optimized = compile(`sprecan "hi";`, "optimized");
  assert.equal(optimized.statements.length, 1);
});

test("rejects unknown output types", () => {
  assert.throws(() => compile(`sprecan "hi";`, "bad"), /Unknown output type/);
});

test("compile full program", () => {
  const result = compile(
    `
    bindan x as 5;
    sprecan x;
  `,
    "js",
  );

  assert(result.includes("console.log"));
});

test("compile parse mode", () => {
  const result = compile(`sprecan "hi";`, "parsed");
  assert(result.succeeded());
});

test("compile analyzed mode with variable program", () => {
  const result = compile(
    `
    bindan x as 7;
    sprecan x;
  `,
    "analyzed",
  );

  assert.equal(result.statements.length, 2);
});

test("compile js mode with function program", () => {
  const result = compile(
    `
    ritan id with x:
      cweðan x;
    end
    sprecan id(9);
  `,
    "js",
  );

  assert(result.includes("function id"));
});
