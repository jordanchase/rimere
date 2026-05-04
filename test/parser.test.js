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

test("parses multiple statements", () => {
  const match = parse(`
    bindan x as 5;
    sprecan x;
  `);
  assert.equal(match.succeeded(), true);
});

test("parses nested blocks", () => {
  const match = parse(`
    gif soþ:
      gif soþ:
        sprecan "nested";
      end
    end
  `);
  assert.equal(match.succeeded(), true);
});

test("parses comments and blank lines", () => {
  const match = parse(`
    # a heading
    bindan x as 5;
    sprecan x; # speak the value
  `);
  assert.equal(match.succeeded(), true);
});

test("parses zero-argument functions and list literals", () => {
  const match = parse(`
    ritan gather with:
      cweðan [1, 2, 3];
    end
    sprecan gather();
  `);
  assert.equal(match.succeeded(), true);
});

test("parses multiple statements", () => {
  const match = parse(`
    bindan x as 5;
    sprecan x;
  `);
  assert.equal(match.succeeded(), true);
});

test("parses nested blocks", () => {
  const match = parse(`
    gif soþ:
      gif soþ:
        sprecan "nested";
      end
    end
  `);
  assert.equal(match.succeeded(), true);
});
