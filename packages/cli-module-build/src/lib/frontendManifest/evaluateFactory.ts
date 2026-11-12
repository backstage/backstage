/*
 * Copyright 2026 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ts } from 'ts-morph';

/** An error that makes a plugin not deferrable, with the reason why. */
export class AnalysisError extends Error {}

/**
 * A value that the factory of a blueprint works with, as far as it is known
 * without running the factory.
 */
export type FactoryValue =
  /** A value that is known, such as a literal param */
  | { type: 'known'; value: unknown }
  /**
   * A value that is present, but isn't known, such as a function param or
   * the app node. The reason says why it isn't known.
   */
  | { type: 'opaque'; reason: string; typeOf?: string; source?: unknown }
  /** The value of a config key, which is only known when the app runs */
  | { type: 'config'; key: string; valueType: 'string' | 'number' | 'object' }
  /** An object with properties that are values of their own */
  | { type: 'record'; get(key: string): FactoryValue }
  /** A value that can't be read, with the reason why */
  | { type: 'unknown'; reason: string };

/** The value of the element that an extension outputs. */
export const ELEMENT_VALUE: FactoryValue = {
  type: 'opaque',
  reason: 'the element',
  typeOf: 'object',
};

/** The data that one run of a factory outputs, keyed by data ref ID. */
export type FactoryOutputs = Map<string, FactoryValue>;

/** What the analysis needs from the program that a factory is part of. */
export interface FactoryHost {
  /** Describes the location of a node, for messages. */
  location(node: ts.Node): string;
  /** Reads the ID of the data ref that a yielded value is created with. */
  readDataRefId(callee: ts.Expression): string;
  /** Finds the generator function that a `yield*` delegates to. */
  resolveGenerator(callee: ts.Expression): ts.FunctionLikeDeclaration;
}

const ELEMENT_DATA_ID = 'core.reactElement';
const MAX_DEPTH = 20;

class EvaluationFailure extends Error {}

class Scope {
  readonly #values = new Map<string, FactoryValue>();
  readonly #parent?: Scope;

  constructor(parent?: Scope) {
    this.#parent = parent;
  }

  set(name: string, value: FactoryValue) {
    this.#values.set(name, value);
  }

  get(name: string): FactoryValue | undefined {
    return this.#values.get(name) ?? this.#parent?.get(name);
  }
}

function known(value: unknown): FactoryValue {
  return { type: 'known', value };
}

function unwrap(expr: ts.Expression): ts.Expression {
  let current = expr;
  while (
    ts.isParenthesizedExpression(current) ||
    ts.isAsExpression(current) ||
    ts.isSatisfiesExpression(current) ||
    ts.isNonNullExpression(current) ||
    ts.isTypeAssertionExpression(current)
  ) {
    current = current.expression;
  }
  return current;
}

/** The truthiness of a value, or undefined if it isn't known. */
function truthiness(value: FactoryValue): boolean | undefined {
  switch (value.type) {
    case 'known':
      return Boolean(value.value);
    case 'opaque':
    case 'record':
      return true;
    case 'config':
      // Config values are assumed to be non-empty. The app loads the plugin
      // for config with an empty value, see findDeferredConfigConflict.
      return true;
    default:
      return undefined;
  }
}

function typeOf(value: FactoryValue): string | undefined {
  switch (value.type) {
    case 'known':
      return value.value === null ? 'object' : typeof value.value;
    case 'record':
      return 'object';
    case 'config':
      return value.valueType;
    case 'opaque':
      return value.typeOf;
    default:
      return undefined;
  }
}

function isNullish(value: FactoryValue): boolean | undefined {
  if (value.type === 'known') {
    return value.value === undefined || value.value === null;
  }
  if (value.type === 'unknown') {
    return undefined;
  }
  return false;
}

/** Compares two values with `==` or `===`, or returns undefined. */
function compare(
  left: FactoryValue,
  right: FactoryValue,
  strict: boolean,
): boolean | undefined {
  if (left.type === 'known' && right.type === 'known') {
    // eslint-disable-next-line eqeqeq
    return strict ? left.value === right.value : left.value == right.value;
  }
  // A value that is present is never equal to undefined or null
  for (const [a, b] of [
    [left, right],
    [right, left],
  ]) {
    if (b.type === 'known' && (b.value === undefined || b.value === null)) {
      return isNullish(a) === false ? false : undefined;
    }
  }
  return undefined;
}

/** Describes why a value can't be read, for messages. */
export function describeValue(value: FactoryValue): string {
  switch (value.type) {
    case 'opaque':
    case 'unknown':
      return value.reason;
    case 'config':
      return `the value of the '${value.key}' config`;
    case 'record':
      return 'an object';
    default:
      return 'a value';
  }
}

/** Checks if two outputs of a factory are the same. */
export function isSameValue(a: FactoryValue, b: FactoryValue): boolean {
  if (a.type === 'known' && b.type === 'known') {
    return JSON.stringify(a.value) === JSON.stringify(b.value);
  }
  if (a.type === 'config' && b.type === 'config') {
    return a.key === b.key && a.valueType === b.valueType;
  }
  if (a.type === 'opaque' && b.type === 'opaque') {
    return a === b || (a.source !== undefined && a.source === b.source);
  }
  return false;
}

/**
 * Evaluates the factory of a blueprint for known params, without running
 * it, and returns the data that it outputs. The element that the factory
 * outputs isn't evaluated, since it is only rendered once the plugin has
 * loaded, so the params and config that are only used for the element can
 * be anything.
 *
 * Only a small part of the language is supported: constants, property
 * access, `typeof`, comparisons, logical and conditional operators, `if`,
 * `yield`, and `yield*` of other generator functions. Calls are never
 * evaluated, so their results can only be used for the element. Anything
 * else makes the evaluation fail with the reason why.
 */
export class FactoryEvaluator {
  readonly #host: FactoryHost;
  readonly #outputs: FactoryOutputs = new Map();

  constructor(host: FactoryHost) {
    this.#host = host;
  }

  /**
   * Runs the factory with the given arguments, and returns its outputs, or
   * the reason why they can't be read.
   */
  static run(
    host: FactoryHost,
    factory: ts.FunctionLikeDeclaration,
    args: FactoryValue[],
  ): { outputs: FactoryOutputs } | { failure: string } {
    const evaluator = new FactoryEvaluator(host);
    try {
      evaluator.#call(factory, args, 0);
      return { outputs: evaluator.#outputs };
    } catch (error) {
      if (
        error instanceof EvaluationFailure ||
        error instanceof AnalysisError
      ) {
        return { failure: error.message };
      }
      throw error;
    }
  }

  #fail(message: string, node: ts.Node): never {
    throw new EvaluationFailure(`${message} (${this.#host.location(node)})`);
  }

  #unknown(description: string, node: ts.Node): FactoryValue {
    return {
      type: 'unknown',
      reason: `${description} (${this.#host.location(node)})`,
    };
  }

  #call(fn: ts.FunctionLikeDeclaration, args: FactoryValue[], depth: number) {
    if (depth > MAX_DEPTH) {
      this.#fail('the factory delegates too deeply to be read', fn);
    }
    if (!fn.asteriskToken || !fn.body || !ts.isBlock(fn.body)) {
      this.#fail('the factory must be a generator function', fn);
    }
    const scope = new Scope();
    fn.parameters.forEach((parameter, index) => {
      if (parameter.dotDotDotToken) {
        this.#fail('the factory must not use rest parameters', parameter);
      }
      let value = args[index] ?? known(undefined);
      if (parameter.initializer && isNullish(value) !== false) {
        value = this.#evaluate(parameter.initializer, scope);
      }
      this.#bind(parameter.name, value, scope);
    });
    this.#run(fn.body.statements, scope, depth);
  }

  #bind(name: ts.BindingName, value: FactoryValue, scope: Scope) {
    if (ts.isIdentifier(name)) {
      scope.set(name.text, value);
      return;
    }
    if (ts.isObjectBindingPattern(name)) {
      for (const element of name.elements) {
        if (element.dotDotDotToken) {
          this.#fail('rest properties are not supported', element);
        }
        const keyNode = element.propertyName ?? element.name;
        if (!ts.isIdentifier(keyNode) && !ts.isStringLiteralLike(keyNode)) {
          this.#fail('computed properties are not supported', element);
        }
        let property = this.#property(value, keyNode.text, element);
        if (element.initializer && isNullish(property) !== false) {
          property = this.#evaluate(element.initializer, scope);
        }
        this.#bind(element.name, property, scope);
      }
      return;
    }
    this.#fail('array destructuring is not supported', name);
  }

  /** Runs statements, and returns true if they returned. */
  #run(
    statements: readonly ts.Statement[],
    scope: Scope,
    depth: number,
  ): boolean {
    for (const statement of statements) {
      if (this.#runStatement(statement, scope, depth)) {
        return true;
      }
    }
    return false;
  }

  #runStatement(statement: ts.Statement, scope: Scope, depth: number): boolean {
    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        const value = declaration.initializer
          ? this.#evaluate(declaration.initializer, scope)
          : known(undefined);
        this.#bind(declaration.name, value, scope);
      }
      return false;
    }
    if (ts.isExpressionStatement(statement)) {
      const expr = unwrap(statement.expression);
      if (ts.isYieldExpression(expr)) {
        this.#yield(expr, scope, depth);
        return false;
      }
      // Logging doesn't change what the factory outputs
      if (
        ts.isCallExpression(expr) &&
        ts.isPropertyAccessExpression(expr.expression) &&
        ts.isIdentifier(expr.expression.expression) &&
        expr.expression.expression.text === 'console' &&
        !scope.get('console')
      ) {
        return false;
      }
      return this.#fail(
        'the factory runs a statement that cannot be read',
        expr,
      );
    }
    if (ts.isIfStatement(statement)) {
      const condition = this.#evaluate(statement.expression, scope);
      const isTrue = truthiness(condition);
      if (isTrue === undefined) {
        this.#fail(
          `the factory branches on a value that can't be read: ${describeValue(
            condition,
          )}`,
          statement.expression,
        );
      }
      if (isTrue) {
        return this.#runStatement(statement.thenStatement, scope, depth);
      }
      return statement.elseStatement
        ? this.#runStatement(statement.elseStatement, scope, depth)
        : false;
    }
    if (ts.isBlock(statement)) {
      return this.#run(statement.statements, new Scope(scope), depth);
    }
    if (ts.isReturnStatement(statement)) {
      return true;
    }
    if (ts.isThrowStatement(statement)) {
      return this.#fail('the factory throws an error', statement);
    }
    if (ts.isEmptyStatement(statement)) {
      return false;
    }
    if (ts.isFunctionDeclaration(statement) && statement.name) {
      scope.set(statement.name.text, {
        type: 'opaque',
        reason: `the '${statement.name.text}' function`,
        typeOf: 'function',
      });
      return false;
    }
    return this.#fail(
      'the factory runs a statement that cannot be read',
      statement,
    );
  }

  #yield(expr: ts.YieldExpression, scope: Scope, depth: number) {
    const call = expr.expression && unwrap(expr.expression);
    if (!call || !ts.isCallExpression(call)) {
      this.#fail(
        'the factory yields a value that is not created by a call',
        expr,
      );
    }
    if (expr.asteriskToken) {
      const fn = this.#host.resolveGenerator(call.expression);
      const args = call.arguments.map(arg => {
        if (ts.isSpreadElement(arg)) {
          this.#fail('spread arguments are not supported', arg);
        }
        return this.#evaluate(arg, scope);
      });
      this.#call(fn, args, depth + 1);
      return;
    }
    const dataRefId = this.#host.readDataRefId(call.expression);
    if (this.#outputs.has(dataRefId)) {
      this.#fail(`the factory outputs '${dataRefId}' more than once`, expr);
    }
    const [arg] = call.arguments;
    if (dataRefId === ELEMENT_DATA_ID) {
      this.#outputs.set(dataRefId, ELEMENT_VALUE);
      return;
    }
    this.#outputs.set(
      dataRefId,
      arg ? this.#evaluate(arg, scope) : known(undefined),
    );
  }

  #property(object: FactoryValue, key: string, node: ts.Node): FactoryValue {
    switch (object.type) {
      case 'record':
        return object.get(key);
      case 'known': {
        const value = object.value;
        if (value === undefined || value === null) {
          return this.#unknown(`a property of ${String(value)}`, node);
        }
        if (typeof value === 'object') {
          return known(
            Object.hasOwn(value, key)
              ? (value as Record<string, unknown>)[key]
              : undefined,
          );
        }
        if (typeof value === 'string' && key === 'length') {
          return known(value.length);
        }
        return this.#unknown(
          `the '${key}' property of a ${typeof value}`,
          node,
        );
      }
      default:
        return this.#unknown(
          `the '${key}' property of ${describeValue(object)}`,
          node,
        );
    }
  }

  #evaluate(input: ts.Expression, scope: Scope): FactoryValue {
    const expr = unwrap(input);
    if (ts.isStringLiteralLike(expr)) {
      return known(expr.text);
    }
    if (ts.isNumericLiteral(expr)) {
      return known(Number(expr.text));
    }
    switch (expr.kind) {
      case ts.SyntaxKind.TrueKeyword:
        return known(true);
      case ts.SyntaxKind.FalseKeyword:
        return known(false);
      case ts.SyntaxKind.NullKeyword:
        return known(null);
      default:
        break;
    }
    if (ts.isIdentifier(expr)) {
      const value = scope.get(expr.text);
      if (value) {
        return value;
      }
      if (expr.text === 'undefined') {
        return known(undefined);
      }
      return this.#unknown(`'${expr.text}', which is not a local value`, expr);
    }
    if (ts.isTemplateExpression(expr)) {
      let result = expr.head.text;
      for (const span of expr.templateSpans) {
        const value = this.#evaluate(span.expression, scope);
        if (
          value.type !== 'known' ||
          (typeof value.value === 'object' && value.value !== null)
        ) {
          return this.#unknown('a template string with unknown values', expr);
        }
        result += String(value.value) + span.literal.text;
      }
      return known(result);
    }
    if (ts.isPropertyAccessExpression(expr)) {
      const object = this.#evaluate(expr.expression, scope);
      if (expr.questionDotToken && isNullish(object)) {
        return known(undefined);
      }
      return this.#property(object, expr.name.text, expr);
    }
    if (
      ts.isElementAccessExpression(expr) &&
      ts.isStringLiteralLike(expr.argumentExpression)
    ) {
      const object = this.#evaluate(expr.expression, scope);
      if (expr.questionDotToken && isNullish(object)) {
        return known(undefined);
      }
      return this.#property(object, expr.argumentExpression.text, expr);
    }
    if (ts.isTypeOfExpression(expr)) {
      const value = this.#evaluate(expr.expression, scope);
      const type = typeOf(value);
      return type
        ? known(type)
        : this.#unknown(`the type of ${describeValue(value)}`, expr);
    }
    if (
      ts.isPrefixUnaryExpression(expr) &&
      expr.operator === ts.SyntaxKind.ExclamationToken
    ) {
      const value = this.#evaluate(expr.operand, scope);
      const isTrue = truthiness(value);
      return isTrue === undefined ? value : known(!isTrue);
    }
    if (
      ts.isPrefixUnaryExpression(expr) &&
      expr.operator === ts.SyntaxKind.MinusToken &&
      ts.isNumericLiteral(expr.operand)
    ) {
      return known(-Number(expr.operand.text));
    }
    if (ts.isBinaryExpression(expr)) {
      return this.#evaluateBinary(expr, scope);
    }
    if (ts.isConditionalExpression(expr)) {
      const condition = this.#evaluate(expr.condition, scope);
      const isTrue = truthiness(condition);
      if (isTrue === undefined) {
        return condition;
      }
      return this.#evaluate(isTrue ? expr.whenTrue : expr.whenFalse, scope);
    }
    if (ts.isArrayLiteralExpression(expr)) {
      const values = new Array<unknown>();
      for (const element of expr.elements) {
        const value = ts.isSpreadElement(element)
          ? undefined
          : this.#evaluate(element, scope);
        if (value?.type !== 'known') {
          return this.#unknown('an array with unknown values', expr);
        }
        values.push(value.value);
      }
      return known(values);
    }
    if (ts.isObjectLiteralExpression(expr)) {
      const values: Record<string, unknown> = {};
      for (const property of expr.properties) {
        let value: FactoryValue | undefined;
        if (
          ts.isPropertyAssignment(property) &&
          (ts.isIdentifier(property.name) ||
            ts.isStringLiteralLike(property.name))
        ) {
          value = this.#evaluate(property.initializer, scope);
        } else if (ts.isShorthandPropertyAssignment(property)) {
          value = this.#evaluate(property.name, scope);
        }
        if (value?.type !== 'known') {
          return this.#unknown('an object with unknown values', expr);
        }
        values[(property.name as ts.Identifier).text] = value.value;
      }
      return known(values);
    }
    if (ts.isArrowFunction(expr) || ts.isFunctionExpression(expr)) {
      return { type: 'opaque', reason: 'a function', typeOf: 'function' };
    }
    if (ts.isCallExpression(expr) || ts.isNewExpression(expr)) {
      return this.#unknown(
        `the result of calling '${expr.expression.getText()}'`,
        expr,
      );
    }
    if (
      ts.isJsxElement(expr) ||
      ts.isJsxSelfClosingElement(expr) ||
      ts.isJsxFragment(expr)
    ) {
      return { type: 'opaque', reason: 'a React element', typeOf: 'object' };
    }
    return this.#unknown('an expression that cannot be read', expr);
  }

  #evaluateBinary(expr: ts.BinaryExpression, scope: Scope): FactoryValue {
    const operator = expr.operatorToken.kind;
    const left = this.#evaluate(expr.left, scope);
    switch (operator) {
      case ts.SyntaxKind.AmpersandAmpersandToken: {
        const isTrue = truthiness(left);
        if (isTrue === undefined || !isTrue) {
          return left;
        }
        return this.#evaluate(expr.right, scope);
      }
      case ts.SyntaxKind.BarBarToken: {
        const isTrue = truthiness(left);
        if (isTrue === undefined || isTrue) {
          return left;
        }
        return this.#evaluate(expr.right, scope);
      }
      case ts.SyntaxKind.QuestionQuestionToken: {
        const nullish = isNullish(left);
        if (nullish === undefined || !nullish) {
          return left;
        }
        return this.#evaluate(expr.right, scope);
      }
      default:
        break;
    }
    const right = this.#evaluate(expr.right, scope);
    let result: boolean | undefined;
    switch (operator) {
      case ts.SyntaxKind.EqualsEqualsEqualsToken:
        result = compare(left, right, true);
        break;
      case ts.SyntaxKind.ExclamationEqualsEqualsToken:
        result = compare(left, right, true);
        result = result === undefined ? undefined : !result;
        break;
      case ts.SyntaxKind.EqualsEqualsToken:
        result = compare(left, right, false);
        break;
      case ts.SyntaxKind.ExclamationEqualsToken:
        result = compare(left, right, false);
        result = result === undefined ? undefined : !result;
        break;
      default:
        return this.#unknown('an operator that is not supported', expr);
    }
    return result === undefined
      ? this.#unknown('a comparison of values that are not known', expr)
      : known(result);
  }
}
