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
 * the object literal is parsed directly from the source. References to other
 * top-level `const` declarations in the same file are followed.
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

  const constants = new Map<string, ts.Expression>();
  let specName: string | undefined;

  for (const statement of sourceFile.statements) {
    if (
      ts.isVariableStatement(statement) &&
      statement.declarationList.flags & ts.NodeFlags.Const
    ) {
      const isExported = statement.modifiers?.some(
        m => m.kind === ts.SyntaxKind.ExportKeyword,
      );
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name) && declaration.initializer) {
          constants.set(declaration.name.text, declaration.initializer);
          if (isExported && declaration.name.text === 'spec') {
            specName = 'spec';
          }
        }
      }
    } else if (
      ts.isExportDeclaration(statement) &&
      !statement.moduleSpecifier &&
      statement.exportClause &&
      ts.isNamedExports(statement.exportClause)
    ) {
      for (const element of statement.exportClause.elements) {
        if (element.name.text === 'spec') {
          specName = (element.propertyName ?? element.name).text;
        }
      }
    }
  }

  if (!specName) {
    return undefined;
  }
  const initializer = constants.get(specName);
  if (!initializer) {
    return undefined;
  }
  return toValue(initializer, { constants, resolving: new Set([specName]) });
}

type Context = {
  constants: Map<string, ts.Expression>;
  resolving: Set<string>;
};

function toValue(node: ts.Expression, context: Context): unknown {
  if (
    ts.isAsExpression(node) ||
    ts.isSatisfiesExpression(node) ||
    ts.isTypeAssertionExpression(node) ||
    ts.isParenthesizedExpression(node)
  ) {
    return toValue(node.expression, context);
  }
  if (ts.isIdentifier(node)) {
    const initializer = context.constants.get(node.text);
    if (!initializer || context.resolving.has(node.text)) {
      throw unsupportedSyntax(node);
    }
    context.resolving.add(node.text);
    const value = toValue(initializer, context);
    context.resolving.delete(node.text);
    return value;
  }
  if (ts.isObjectLiteralExpression(node)) {
    const result: Record<string, unknown> = {};
    for (const property of node.properties) {
      let initializer: ts.Expression;
      if (ts.isPropertyAssignment(property)) {
        initializer = property.initializer;
      } else if (ts.isShorthandPropertyAssignment(property)) {
        initializer = property.name;
      } else {
        throw unsupportedSyntax(property);
      }
      // Avoids the special handling of keys such as `__proto__`
      Object.defineProperty(result, toPropertyName(property.name), {
        value: toValue(initializer, context),
        enumerable: true,
        writable: true,
        configurable: true,
      });
    }
    return result;
  }
  if (ts.isArrayLiteralExpression(node)) {
    return node.elements.map(element => toValue(element, context));
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
