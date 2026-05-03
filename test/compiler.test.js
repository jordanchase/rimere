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
