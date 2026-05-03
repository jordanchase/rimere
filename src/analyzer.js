import parse from "./parser.js";
import * as core from "./core.js";

class Context {
  constructor(parent = null, inLoop = false, inFunction = false) {
    this.parent = parent;
    this.locals = new Map();
    this.inLoop = inLoop;
    this.inFunction = inFunction;
  }

  add(name, entity) {
    if (this.locals.has(name)) {
      throw new Error(`Identifier ${name} already declared`);
    }
    this.locals.set(name, entity);
  }

  lookup(name) {
    if (this.locals.has(name)) return this.locals.get(name);
    if (this.parent) return this.parent.lookup(name);
    throw new Error(`Identifier ${name} has not been declared`);
  }

  newChildContext({ inLoop = this.inLoop, inFunction = this.inFunction } = {}) {
    return new Context(this, inLoop, inFunction);
  }
}

export default function analyze(sourceCode) {
  const match = parse(sourceCode);
  let context = new Context();

  function check(condition, message) {
    if (!condition) throw new Error(message);
  }

  function checkNumber(expression) {
    check(
      expression.type === core.numberType || expression.type === core.anyType,
      "Expected a number",
    );
  }

  function checkBoolean(expression) {
    check(
      expression.type === core.booleanType || expression.type === core.anyType,
      "Expected a boolean",
    );
  }

  const analyzer = match.matcher.grammar.createSemantics().addOperation("rep", {
    Program(_leadingSpace, statements, _trailingSpace, _end) {
      return new core.Program(statements.children.map((s) => s.rep()));
    },

    Statement(statement) {
      return statement.rep();
    },

    BindingStmt(_bindan, id, _as, exp, _terminator) {
      const name = id.sourceString;
      const initializer = exp.rep();
      const variable = new core.Variable(name);
      variable.type = initializer.type;
      context.add(name, variable);
      return new core.BindingStatement(variable, initializer);
    },

    SpeakStmt(_sprecan, exp, _terminator) {
      return new core.SpeakStatement(exp.rep());
    },

    ReturnStmt(_cwedan, exp, _terminator) {
      check(
        context.inFunction,
        "Return statements may only appear inside functions",
      );
      return new core.ReturnStatement(exp.rep());
    },

    BreakStmt(_abrecan, _terminator) {
      check(context.inLoop, "Break statements may only appear inside loops");
      return new core.BreakStatement();
    },

    ExprStmt(exp, _terminator) {
      return new core.ExpressionStatement(exp.rep());
    },

    IfStmt(
      _gif,
      test,
      _colon,
      _terminator1,
      statements,
      elseClause,
      _end,
      _terminator2,
    ) {
      const testRep = test.rep();
      checkBoolean(testRep);

      const oldContext = context;
      context = context.newChildContext();
      const consequent = statements.children.map((s) => s.rep());
      context = oldContext;

      const alternate =
        elseClause.children.length > 0 ? elseClause.children[0].rep() : [];

      return new core.IfStatement(testRep, consequent, alternate);
    },

    ElseClause(_elles, _colon, _terminator, statements) {
      const oldContext = context;
      context = context.newChildContext();
      const body = statements.children.map((s) => s.rep());
      context = oldContext;
      return body;
    },

    FunctionStmt(
      _ritan,
      id,
      _with,
      params,
      _colon,
      _terminator1,
      statements,
      _end,
      _terminator2,
    ) {
      const name = id.sourceString;
      const paramNames =
        params.children.length > 0 ? params.children[0].rep() : [];

      const fun = new core.FunctionEntity(name, paramNames);
      context.add(name, fun);

      const oldContext = context;
      context = context.newChildContext({ inFunction: true });

      for (const param of paramNames) {
        const variable = new core.Variable(param);
        variable.type = core.anyType;
        context.add(param, variable);
      }

      const body = statements.children.map((s) => s.rep());
      context = oldContext;

      return new core.FunctionDeclaration(name, paramNames, body);
    },

    ParamList(params) {
      return params.asIteration().children.map((p) => p.sourceString);
    },

    ForStmt(
      _foran,
      id,
      _fram,
      low,
      _to,
      high,
      _colon,
      _terminator1,
      statements,
      _end,
      _terminator2,
    ) {
      const lowRep = low.rep();
      const highRep = high.rep();
      checkNumber(lowRep);
      checkNumber(highRep);

      const oldContext = context;
      context = context.newChildContext({ inLoop: true });

      const iterator = new core.Variable(id.sourceString);
      iterator.type = core.numberType;
      context.add(iterator.name, iterator);

      const body = statements.children.map((s) => s.rep());
      context = oldContext;

      return new core.ForStatement(iterator, lowRep, highRep, body);
    },

    WhileStmt(
      _hwil,
      test,
      _colon,
      _terminator1,
      statements,
      _end,
      _terminator2,
    ) {
      const testRep = test.rep();
      checkBoolean(testRep);

      const oldContext = context;
      context = context.newChildContext({ inLoop: true });
      const body = statements.children.map((s) => s.rep());
      context = oldContext;

      return new core.WhileStatement(testRep, body);
    },

    Exp(expression) {
      return expression.rep();
    },

    LogicExp_or(left, _or, right) {
      const leftRep = left.rep();
      const rightRep = right.rep();
      checkBoolean(leftRep);
      checkBoolean(rightRep);
      const expression = new core.BinaryExpression("or", leftRep, rightRep);
      expression.type = core.booleanType;
      return expression;
    },

    LogicExp_and(left, _and, right) {
      const leftRep = left.rep();
      const rightRep = right.rep();
      checkBoolean(leftRep);
      checkBoolean(rightRep);
      const expression = new core.BinaryExpression("and", leftRep, rightRep);
      expression.type = core.booleanType;
      return expression;
    },

    CompareExp_compare(left, op, right) {
      const leftRep = left.rep();
      const rightRep = right.rep();
      const expression = new core.BinaryExpression(
        op.sourceString,
        leftRep,
        rightRep,
      );
      expression.type = core.booleanType;
      return expression;
    },

    AddExp_plus(left, _op, right) {
      const leftRep = left.rep();
      const rightRep = right.rep();
      checkNumber(leftRep);
      checkNumber(rightRep);
      const expression = new core.BinaryExpression("+", leftRep, rightRep);
      expression.type = core.numberType;
      return expression;
    },

    AddExp_minus(left, _op, right) {
      const leftRep = left.rep();
      const rightRep = right.rep();
      checkNumber(leftRep);
      checkNumber(rightRep);
      const expression = new core.BinaryExpression("-", leftRep, rightRep);
      expression.type = core.numberType;
      return expression;
    },

    MulExp_times(left, _op, right) {
      const leftRep = left.rep();
      const rightRep = right.rep();
      checkNumber(leftRep);
      checkNumber(rightRep);
      const expression = new core.BinaryExpression("*", leftRep, rightRep);
      expression.type = core.numberType;
      return expression;
    },

    MulExp_divide(left, _op, right) {
      const leftRep = left.rep();
      const rightRep = right.rep();
      checkNumber(leftRep);
      checkNumber(rightRep);
      const expression = new core.BinaryExpression("/", leftRep, rightRep);
      expression.type = core.numberType;
      return expression;
    },

    PriExp_number(expression) {
      return expression.rep();
    },

    PriExp_string(expression) {
      return expression.rep();
    },

    PriExp_boolean(expression) {
      return expression.rep();
    },

    PriExp_list(expression) {
      return expression.rep();
    },

    PriExp_call(expression) {
      return expression.rep();
    },

    PriExp_variable(expression) {
      return expression.rep();
    },

    PriExp_parens(_open, expression, _close) {
      return expression.rep();
    },

    FunctionCall(id, _open, args, _close) {
      const name = id.sourceString;
      const entity = context.lookup(name);
      check(entity instanceof core.FunctionEntity, `${name} is not a function`);

      const argList = args.children.length > 0 ? args.children[0].rep() : [];

      check(
        argList.length === entity.params.length,
        `${name} expects ${entity.params.length} arguments`,
      );

      const call = new core.Call(name, argList);
      call.type = core.anyType;
      return call;
    },

    ArgList(args) {
      return args.asIteration().children.map((a) => a.rep());
    },

    ListExp(_open, elements, _close) {
      const list = new core.ListExpression(
        elements.children.length > 0 ? elements.children[0].rep() : [],
      );
      list.type = core.listType;
      return list;
    },

    ListElements(elements) {
      return elements.asIteration().children.map((e) => e.rep());
    },

    ident(_start, _parts) {
      return context.lookup(this.sourceString);
    },

    number(_whole, _decimal, _digits) {
      return new core.Literal(Number(this.sourceString), core.numberType);
    },

    string(_open, _chars, _close) {
      return new core.Literal(this.sourceString.slice(1, -1), core.stringType);
    },

    boolean(_) {
      return new core.Literal(this.sourceString === "soþ", core.booleanType);
    },

    _terminal() {
      return this.sourceString;
    },

    _iter(...children) {
      return children.map((child) => child.rep());
    },
  });

  return analyzer(match).rep();
}
