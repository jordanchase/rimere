import assert from "node:assert/strict";
import test from "node:test";
import parse from "../src/parser.js";

test("parses a hello world program", () => {
  const match = parse(`sprecan "Hello, Rímere!";`);
  assert.equal(match.succeeded(), true);
});

test("throws an error for invalid syntax", () => {
  assert.throws(() => parse(`sprecan "missing terminator"`));
});
