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

/**
 * Parses the `spec` export from the source of a generated OpenAPI router file
 * without executing it, since the file imports sibling directories and runtime
 * dependencies that Node.js can't load without a TypeScript transform.
 *
 * The generator always writes `export const spec = <JSON> as const`, so that is
 * the only form supported.
 *
 * @returns The value of the `spec` export, or `undefined` if there is none.
 */
export function parseGeneratedOpenApiSpec(source: string): unknown {
  // The parser recovers from syntax errors, so check for them separately to
  // avoid reading a value from a file that wouldn't compile
  const [diagnostic] =
    ts.transpileModule(source, { reportDiagnostics: true }).diagnostics ?? [];
  if (diagnostic) {
    const message = ts.flattenDiagnosticMessageText(
      diagnostic.messageText,
      ' ',
    );
    throw new Error(`Syntax error: ${message}`);
  }

  const { statements } = ts.createSourceFile(
    'router.ts',
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  for (const statement of statements) {
    if (
      ts.isVariableStatement(statement) &&
      statement.declarationList.flags & ts.NodeFlags.Const &&
      statement.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      for (const { name, initializer } of statement.declarationList
        .declarations) {
        if (ts.isIdentifier(name) && name.text === 'spec' && initializer) {
          return toValue(initializer);
        }
      }
    }
  }
  return undefined;
}

function toValue(node: ts.Expression): unknown {
  if (ts.isAsExpression(node)) {
    return toValue(node.expression);
  }
  if (ts.isObjectLiteralExpression(node)) {
    const result: Record<string, unknown> = {};
    for (const property of node.properties) {
      if (
        !ts.isPropertyAssignment(property) ||
        !(
          ts.isIdentifier(property.name) ||
          ts.isStringLiteral(property.name) ||
          ts.isNumericLiteral(property.name)
        )
      ) {
        throw unsupportedSyntax(property);
      }
      result[property.name.text] = toValue(property.initializer);
    }
    return result;
  }
  if (ts.isArrayLiteralExpression(node)) {
    return node.elements.map(toValue);
  }
  if (ts.isStringLiteral(node)) {
    return node.text;
  }
  if (ts.isNumericLiteral(node)) {
    return Number(node.text);
  }
  if (
    ts.isPrefixUnaryExpression(node) &&
    node.operator === ts.SyntaxKind.MinusToken &&
    ts.isNumericLiteral(node.operand)
  ) {
    return -Number(node.operand.text);
  }
  if (node.kind === ts.SyntaxKind.TrueKeyword) {
    return true;
  }
  if (node.kind === ts.SyntaxKind.FalseKeyword) {
    return false;
  }
  if (node.kind === ts.SyntaxKind.NullKeyword) {
    return null;
  }
  throw unsupportedSyntax(node);
}

function unsupportedSyntax(node: ts.Node) {
  const { line } = node
    .getSourceFile()
    .getLineAndCharacterOfPosition(node.getStart());
  return new Error(
    `Unsupported syntax in the 'spec' export on line ${
      line + 1
    }, only plain JSON values are supported`,
  );
}
