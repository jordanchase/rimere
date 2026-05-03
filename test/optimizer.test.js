import assert from "node:assert/strict";
import test from "node:test";
import analyze from "../src/analyzer.js";
import optimize from "../src/optimizer.js";

test("optimizer returns the analyzed program unchanged for now", () => {
  const program = analyze(`sprecan "hi";`);
  const optimized = optimize(program);

  assert.equal(optimized, program);
});
