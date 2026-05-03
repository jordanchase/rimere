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

test("allows nested scopes", () => {
  analyze(`
    bindan x as 5;
    gif soþ:
      bindan y as 10;
      sprecan y;
    end
  `);
});

test("rejects wrong function arity", () => {
  assert.throws(() =>
    analyze(`
    ritan f with a, b:
      cweðan a + b;
    end
    sprecan f(1);
  `),
  );
});

test("allows correct function arity", () => {
  analyze(`
    ritan f with a, b:
      cweðan a + b;
    end
    sprecan f(1, 2);
  `);
});

test("loop variable is scoped", () => {
  analyze(`
    foran i fram 1 to 3:
      sprecan i;
    end
  `);
});

test("boolean logic works", () => {
  analyze(`
    bindan x as soþ;
    bindan y as na;
    sprecan x and y;
  `);
});

test("rejects arithmetic with booleans", () => {
  assert.throws(() => analyze(`sprecan soþ + 1;`), /Expected a number/);
});

test("rejects logical operation with numbers", () => {
  assert.throws(() => analyze(`sprecan 1 and 2;`), /Expected a boolean/);
});

test("rejects if condition that is not boolean", () => {
  assert.throws(
    () =>
      analyze(`
    gif 5:
      sprecan "bad";
    end
  `),
    /Expected a boolean/,
  );
});

test("rejects while condition that is not boolean", () => {
  assert.throws(
    () =>
      analyze(`
    hwil 5:
      sprecan "bad";
    end
  `),
    /Expected a boolean/,
  );
});

test("rejects nonnumeric for loop lower bound", () => {
  assert.throws(
    () =>
      analyze(`
    foran i fram "one" to 3:
      sprecan i;
    end
  `),
    /Expected a number/,
  );
});

test("rejects nonnumeric for loop upper bound", () => {
  assert.throws(
    () =>
      analyze(`
    foran i fram 1 to "three":
      sprecan i;
    end
  `),
    /Expected a number/,
  );
});

test("allows break inside loop", () => {
  analyze(`
    foran i fram 1 to 3:
      abrecan;
    end
  `);
});

test("allows return inside function", () => {
  analyze(`
    ritan f with x:
      cweðan x;
    end
  `);
});

test("rejects using loop variable outside loop", () => {
  assert.throws(
    () =>
      analyze(`
    foran i fram 1 to 3:
      sprecan i;
    end
    sprecan i;
  `),
    /has not been declared/,
  );
});

test("allows shadowing in nested scopes", () => {
  analyze(`
    bindan x as 1;
    gif soþ:
      bindan x as 2;
      sprecan x;
    end
  `);
});

test("rejects calling a variable like a function", () => {
  assert.throws(
    () =>
      analyze(`
    bindan x as 5;
    sprecan x();
  `),
    /is not a function/,
  );
});
