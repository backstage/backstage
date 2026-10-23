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
 * Thrown when the generated file can't be read statically, for example
 * because it has syntax errors or the `spec` export isn't a plain literal.
 */
export class GeneratedSpecSyntaxError extends Error {
  name = 'GeneratedSpecSyntaxError';
}

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
  const source = await fs.readFile(path, 'utf8');

  // The parser recovers from syntax errors, so check for them separately to
  // avoid reading a value from a file that wouldn't compile
  const [diagnostic] =
    ts.transpileModule(source, {
      fileName: path,
      reportDiagnostics: true,
    }).diagnostics ?? [];
  if (diagnostic) {
    const line =
      diagnostic.file && diagnostic.start !== undefined
        ? ` on line ${
            diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start)
              .line + 1
          }`
        : '';
    throw new GeneratedSpecSyntaxError(
      `Syntax error${line}: ${ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        ' ',
      )}`,
    );
  }

  const sourceFile = ts.createSourceFile(
    path,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  const constants = new Map<string, ts.Expression>();
  let specName: string | undefined;
  let specNode: ts.Node | undefined;

  for (const statement of sourceFile.statements) {
    if (ts.isVariableStatement(statement)) {
      const isConst = Boolean(
        statement.declarationList.flags & ts.NodeFlags.Const,
      );
      const isExported = statement.modifiers?.some(
        m => m.kind === ts.SyntaxKind.ExportKeyword,
      );
      for (const declaration of statement.declarationList.declarations) {
        if (!ts.isIdentifier(declaration.name)) {
          continue;
        }
        if (isConst && declaration.initializer) {
          constants.set(declaration.name.text, declaration.initializer);
        }
        if (isExported && declaration.name.text === 'spec') {
          specName = 'spec';
          specNode = declaration;
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
          specNode = element;
        }
      }
    }
  }

  if (!specName || !specNode) {
    return undefined;
  }
  const initializer = constants.get(specName);
  if (!initializer) {
    // The export exists but isn't a `const` with a value in this file
    throw unsupportedSyntax(specNode);
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
  if (ts.isIdentifier(name) || ts.isStringLiteral(name)) {
    return name.text;
  }
  if (ts.isNumericLiteral(name)) {
    // Numeric keys are converted to their canonical string form at runtime
    return String(Number(name.text));
  }
  throw unsupportedSyntax(name);
}

function unsupportedSyntax(node: ts.Node) {
  const { line } = node
    .getSourceFile()
    .getLineAndCharacterOfPosition(node.getStart());
  return new GeneratedSpecSyntaxError(
    `Unsupported syntax in the 'spec' export on line ${
      line + 1
    }, only plain JSON values are supported`,
  );
}
