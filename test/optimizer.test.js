import assert from "node:assert/strict";
import test from "node:test";
import analyze from "../src/analyzer.js";
import optimize from "../src/optimizer.js";

test("optimizer returns the analyzed program unchanged for now", () => {
  const program = analyze(`sprecan "hi";`);
  const optimized = optimize(program);

  assert.equal(optimized, program);
});

test("optimizer handles multiple statements", () => {
  const program = analyze(`
    bindan x as 5;
    bindan y as 10;
    sprecan x + y;
  `);

  const optimized = optimize(program);
  assert.equal(optimized, program);
});

test("optimizer preserves nested programs", () => {
  const program = analyze(`
    ritan f with x:
      gif x > 0:
        cweðan x;
      end
      cweðan 0;
    end
    sprecan f(2);
  `);

  const optimized = optimize(program);
  assert.equal(optimized, program);
});

test("optimizer handles empty programs", () => {
  const program = analyze(``);
  const optimized = optimize(program);

  assert.equal(optimized, program);
});
