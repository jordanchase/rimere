# lmu-cmsi-3802-homework1

<p align="center">
  <img src="docs/RímereLogo.png" width="220">
</p>

<h1 align="center">Rímere</h1>

<h2 align="center">
  Computing for the Medieval World!
</h2>

## Authors

- Jordan Chase, Marleena Limbrick, Vicente Anyaegbu, Audrey Whitney, Ray, Temi, Anastasia Buzovo

---

## Overview

In an age before silicon-based screens, computation was the craft of scribes, scholars, and quiet thinkers. These were the people who transformed symbols into meaning. **Rímere** reimagines programming as it might have existed in that world: a language shaped not by modern syntax, but by the cadence and vocabulary of Old English.

Rather than calling functions or executing commands, a programmer in Rímere chants instructions, binds values, and declares truths using words inspired by a time when knowledge was handwritten and computation was an art. By blending historical language with modern programming principles, Rímere invites its users to experience coding as both logic and storytelling.

Rímere is not intended to be a perfectly reconstructed linguistic model of Old English. Instead, it is a **thematic programming language** that draws from Old English vocabulary and style while remaining readable, teachable, and implementable in a modern compiler project.

## Design Goals

- Create a programming language with a distinctive medieval identity
- Make syntax feel literary and narrative rather than purely mechanical
- Preserve core programming concepts in a form that is still understandable to modern users
- Balance novelty with usability so the language is fun to write and feasible to implement
- Explore how theme and syntax can shape the programmer’s experience

---

## Features

### Old English-inspired syntax

Rímere uses keywords inspired by Old English vocabulary:

- **bindan** — bind a value
- **sprecan** — speak (print/output)
- **cweðan** — declare/return
- **gif** — if
- **elles** — else
- **foran** — for loop
- **hwil** — while loop

### Readable, narrative-style code

Programs resemble structured prose or instructions rather than dense symbolic expressions.

### Familiar programming constructs

Rímere supports:

- variable binding
- arithmetic expressions
- conditionals
- loops
- functions
- booleans, numbers, and strings

### Minimal punctuation philosophy

The language favors words and structure over heavy symbolic syntax.

---

## Running Rímere

### 1. Install dependencies

Make sure you are in the project root, then run:

```bash
npm install
```

### 2. Compile a Rimere program to JavaScript

```
node src/rimere.js examples/hello.rim js
```

### 3. Run a Rimere program

```
node src/rimere.js examples/hello.rim js > out.js
node out.js
```

### 4. Check syntax (parsing only)

```
node src/rimere.js examples/hello.rim parsed
```

### 5. Run Semantic analysis

```
node src/rimere.js examples/hello.rim analyzed
```

### 6. Run all example programs

```
node src/rimere.js examples/variables.rim js > out.js && node out.js
node src/rimere.js examples/if.rim js > out.js && node out.js
node src/rimere.js examples/function.rim js > out.js && node out.js
node src/rimere.js examples/loop.rim js > out.js && node out.js
```

## Checks

Rímere is designed with compile-time and runtime discipline in mind. Its checks aim to make programs easier to reason about while preserving the language’s expressive style.

### Static

The following checks should be performed before execution:

- **Undefined name detection**
  Variables, functions, or symbols must be declared before they are used.

- **Duplicate declaration prevention**
  The same identifier should not be declared multiple times in the same scope unless shadowing is explicitly allowed.

- **Type-consistency checks**
  Expressions should be validated so that incompatible values are not combined incorrectly.

- **Arity checking**
  Invocations of procedures or functions must supply the correct number of arguments.

- **Scope validation**
  Names should only be accessible within valid regions of the program.

- **Syntactic structure enforcement**
  Statements must follow the grammar of the language and preserve the intended narrative structure.

### Static Semantics

Rímere enforces the following rules:

- Variables must be declared before use
- Variables cannot be redeclared in the same scope
- Function calls must use the correct number of arguments
- Arithmetic operations require numbers
- Logical operations require booleans
- If/while conditions must be boolean
- Break statements only allowed inside loops
- Return statements only allowed inside functions

### Safety

Rímere should aim to protect programmers from common errors through language design:

- **Explicit declarations**
  Values should be introduced intentionally rather than appearing implicitly.

- **Controlled mutation**
  Rebinding or reassignment should be visible and deliberate.

- **Predictable evaluation**
  Expressions should execute in a clear and consistent order.

- **Readable failure messages**
  Errors should explain what went wrong in language that matches the style of the project without becoming cryptic or overly theatrical.

- **Optional immutability support**
  Certain bindings may be treated as fixed truths once declared.

### Security

Although Rímere is an academic language and not a production system, its design should still consider safe execution practices:

- **No arbitrary code execution from string input**
- **Restricted runtime environment**
- **Validated parsing of all source text**
- **No implicit access to files, system resources, or external processes unless explicitly provided**
- **Clear boundaries between language features and host-language implementation**

---

## Grammar

[src/rimere.ohm](src/rimere.ohm)

## Example / Comparison Programs

Below are comparisons between modern programming languages and Rímere.

---

### 1. Variable Assignment

#### Python

```python
x = 5
```

#### Rimere

```
bindan x as 5;
```

### 2. Output (Printing)

#### Python

```
print("Hello, world!")
```

#### Rimere

```
sprecan "hātan grētan, Rímere!";
```

### 3. Conditionals

#### Python

```
x = 5

if x > 10:
    print("greater")
else:
    print("lesser or equal")
```

#### Rimere

```
bindan x as 5;

gif x > 10:
  sprecan "greater";
elles:
  sprecan "lesser or equal";
end
```

### 4. Functions

#### Python

```
function add(a, b) {
  return a + b;
}

console.log(add(2, 3));
```

#### Rimere

```
ritan add with a, b:
  cweðan a + b;
end

sprecan add(2, 3);
```

### 5. Loops

#### Python

```
for (let i = 1; i <= 3; i++) {
  console.log(i);
}
```

#### Rimere

```
foran i fram 1 to 3:
  sprecan i;
end
```

## Testing

Run the full test suite with:

```bash
npm test
```
