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

import fs from 'fs-extra';
import { ts } from 'ts-morph';

/**
 * Reads the `spec` export from a generated OpenAPI router file without
 * executing it.
 *
 * The generated file imports sibling directories and runtime dependencies,
 * which can't be loaded by Node.js without a TypeScript transform, so instead
 * the object literal is parsed directly from the source.
 *
 * @returns The value of the `spec` export, or `undefined` if there is none.
 */
export async function readGeneratedOpenApiSpec(path: string): Promise<unknown> {
  const sourceFile = ts.createSourceFile(
    path,
    await fs.readFile(path, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  for (const statement of sourceFile.statements) {
    if (
      !ts.isVariableStatement(statement) ||
      !statement.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      continue;
    }
    for (const declaration of statement.declarationList.declarations) {
      if (
        ts.isIdentifier(declaration.name) &&
        declaration.name.text === 'spec' &&
        declaration.initializer
      ) {
        return toValue(declaration.initializer);
      }
    }
  }

  return undefined;
}

function toValue(node: ts.Expression): unknown {
  if (
    ts.isAsExpression(node) ||
    ts.isSatisfiesExpression(node) ||
    ts.isTypeAssertionExpression(node) ||
    ts.isParenthesizedExpression(node)
  ) {
    return toValue(node.expression);
  }
  if (ts.isObjectLiteralExpression(node)) {
    const result: Record<string, unknown> = {};
    for (const property of node.properties) {
      if (!ts.isPropertyAssignment(property)) {
        throw unsupportedSyntax(property);
      }
      // Avoids the special handling of keys such as `__proto__`
      Object.defineProperty(result, toPropertyName(property.name), {
        value: toValue(property.initializer),
        enumerable: true,
        writable: true,
        configurable: true,
      });
    }
    return result;
  }
  if (ts.isArrayLiteralExpression(node)) {
    return node.elements.map(element => toValue(element));
  }
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
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

function toPropertyName(name: ts.PropertyName): string {
  if (
    ts.isIdentifier(name) ||
    ts.isStringLiteral(name) ||
    ts.isNumericLiteral(name)
  ) {
    return name.text;
  }
  throw unsupportedSyntax(name);
}

function unsupportedSyntax(node: ts.Node) {
  const sourceFile = node.getSourceFile();
  const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
  return new Error(
    `Unsupported syntax in the 'spec' export at ${sourceFile.fileName}:${
      line + 1
    }, only plain JSON values are supported`,
  );
}
