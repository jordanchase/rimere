import analyze from "./analyzer.js";
import * as core from "./core.js";

export default function generate(sourceCode) {
  const program = analyze(sourceCode);

  function gen(node) {
    if (node instanceof core.Program) {
      return node.statements.map(gen).join("\n");
    }

    if (node instanceof core.BindingStatement) {
      return `let ${node.variable.name} = ${gen(node.initializer)};`;
    }

    if (node instanceof core.SpeakStatement) {
      return `console.log(${gen(node.argument)});`;
    }

    if (node instanceof core.ReturnStatement) {
      return `return ${gen(node.expression)};`;
    }

    if (node instanceof core.BreakStatement) {
      return "break;";
    }

    if (node instanceof core.ExpressionStatement) {
      return `${gen(node.expression)};`;
    }

    if (node instanceof core.IfStatement) {
      const consequent = node.consequent.map(gen).join("\n");
      const alternate =
        node.alternate.length > 0
          ? ` else {\n${node.alternate.map(gen).join("\n")}\n}`
          : "";
      return `if (${gen(node.test)}) {\n${consequent}\n}${alternate}`;
    }

    if (node instanceof core.FunctionDeclaration) {
      return `function ${node.name}(${node.params.join(", ")}) {\n${node.body.map(gen).join("\n")}\n}`;
    }

    if (node instanceof core.ForStatement) {
      return `for (let ${node.iterator.name} = ${gen(node.low)}; ${node.iterator.name} <= ${gen(node.high)}; ${node.iterator.name}++) {\n${node.body.map(gen).join("\n")}\n}`;
    }

    if (node instanceof core.WhileStatement) {
      return `while (${gen(node.test)}) {\n${node.body.map(gen).join("\n")}\n}`;
    }

    if (node instanceof core.BinaryExpression) {
      const op = node.op === "and" ? "&&" : node.op === "or" ? "||" : node.op;
      return `(${gen(node.left)} ${op} ${gen(node.right)})`;
    }

    if (node instanceof core.Call) {
      return `${node.callee}(${node.args.map(gen).join(", ")})`;
    }

    if (node instanceof core.ListExpression) {
      return `[${node.elements.map(gen).join(", ")}]`;
    }

    if (node instanceof core.Variable) {
      return node.name;
    }

    if (node instanceof core.Literal) {
      return typeof node.value === "string"
        ? JSON.stringify(node.value)
        : String(node.value);
    }

    throw new Error(`Cannot generate code for ${node}`);
  }

  return gen(program);
}
