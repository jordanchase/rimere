#!/usr/bin/env node

import fs from "node:fs";
import compile from "./compiler.js";

const help = `Rímere compiler

Usage:
  node src/rimere.js <filename> [outputType]

Output types:
  js          Generate JavaScript
  parsed      Check syntax only
  analyzed    Run semantic analysis
  optimized   Run optimizer

Examples:
  node src/rimere.js examples/hello.rim
  node src/rimere.js examples/hello.rim js
  node src/rimere.js examples/hello.rim analyzed
`;

const [, , filename, outputType = "js"] = process.argv;

if (!filename || filename === "--help" || filename === "-h") {
  console.log(help);
  process.exit(filename ? 0 : 1);
}

try {
  const sourceCode = fs.readFileSync(filename, "utf8");
  const output = compile(sourceCode, outputType);

  if (outputType === "js") {
    console.log(output);
  } else if (outputType === "parsed") {
    console.log("Syntax is valid");
  } else if (outputType === "analyzed") {
    console.log("Program is semantically valid");
  } else if (outputType === "optimized") {
    console.log("Program optimized successfully");
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
