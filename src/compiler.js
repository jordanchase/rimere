import parse from "./parser.js";
import analyze from "./analyzer.js";
import generate from "./generator.js";
import optimize from "./optimizer.js";

export default function compile(sourceCode, outputType) {
  if (outputType === "parsed") {
    return parse(sourceCode);
  }

  if (outputType === "analyzed") {
    return analyze(sourceCode);
  }

  if (outputType === "optimized") {
    return optimize(analyze(sourceCode));
  }

  if (outputType === "js") {
    return generate(sourceCode);
  }

  throw new Error("Unknown output type");
}
