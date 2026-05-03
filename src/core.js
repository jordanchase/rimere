export class Program {
  constructor(statements) {
    this.statements = statements;
  }
}

export class BindingStatement {
  constructor(variable, initializer) {
    this.variable = variable;
    this.initializer = initializer;
  }
}

export class SpeakStatement {
  constructor(argument) {
    this.argument = argument;
  }
}

export class ReturnStatement {
  constructor(expression) {
    this.expression = expression;
  }
}

export class BreakStatement {
  constructor() {}
}

export class IfStatement {
  constructor(test, consequent, alternate) {
    this.test = test;
    this.consequent = consequent;
    this.alternate = alternate;
  }
}

export class FunctionDeclaration {
  constructor(name, params, body) {
    this.name = name;
    this.params = params;
    this.body = body;
  }
}

export class ForStatement {
  constructor(iterator, low, high, body) {
    this.iterator = iterator;
    this.low = low;
    this.high = high;
    this.body = body;
  }
}

export class WhileStatement {
  constructor(test, body) {
    this.test = test;
    this.body = body;
  }
}

export class ExpressionStatement {
  constructor(expression) {
    this.expression = expression;
  }
}

export class BinaryExpression {
  constructor(op, left, right) {
    this.op = op;
    this.left = left;
    this.right = right;
  }
}

export class Call {
  constructor(callee, args) {
    this.callee = callee;
    this.args = args;
  }
}

export class ListExpression {
  constructor(elements) {
    this.elements = elements;
  }
}

export class Variable {
  constructor(name) {
    this.name = name;
  }
}

export class FunctionEntity {
  constructor(name, params) {
    this.name = name;
    this.params = params;
  }
}

export class Literal {
  constructor(value, type) {
    this.value = value;
    this.type = type;
  }
}

export const numberType = "number";
export const stringType = "string";
export const booleanType = "boolean";
export const listType = "list";
export const anyType = "any";
export const voidType = "void";
