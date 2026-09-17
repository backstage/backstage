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

import { Node, Project, SourceFile, Type, ts } from 'ts-morph';

/** Information about a discovered translation ref. */
export interface TranslationRefInfo {
  /** The ref ID, e.g. 'org' */
  id: string;
  /** The package name, e.g. '@backstage/plugin-org' */
  packageName: string;
  /** The subpath export where this ref is accessible, e.g. './alpha' or '.' */
  exportPath: string;
  /** The exported symbol name, e.g. 'orgTranslationRef' */
  exportName: string;
  /** Flattened message map: key -> default message string */
  messages: Record<string, string>;
}

/**
 * Given a ts-morph SourceFile, finds all exported TranslationRef symbols
 * and extracts their id and messages from the type system.
 */
export function extractTranslationRefsFromSourceFile(
  sourceFile: SourceFile,
  packageName: string,
  exportPath: string,
): TranslationRefInfo[] {
  const results: TranslationRefInfo[] = [];

  for (const exportSymbol of sourceFile.getExportSymbols()) {
    const declarations = exportSymbol.getDeclarations();
    if (declarations.length === 0) {
      continue;
    }

    const declaration = declarations[0];
    const exportType = declaration.getType();

    const refInfo = extractTranslationRefFromType(exportType, declaration);
    if (!refInfo) {
      continue;
    }

    results.push({
      ...refInfo,
      packageName,
      exportPath,
      exportName: exportSymbol.getName(),
    });
  }

  return results;
}

/**
 * Checks whether a type is a TranslationRef by inspecting the $$type
 * property on the target type, then extracts the id and messages from
 * the type arguments of the generic instantiation.
 */
function extractTranslationRefFromType(
  type: Type<ts.Type>,
  declaration: Node,
): Pick<TranslationRefInfo, 'id' | 'messages'> | undefined {
  // Check the $$type property on the uninstantiated (target) type
  const resolvedType = type.getTargetType() ?? type;
  const $$typeProperty = resolvedType
    .getProperties()
    .find(p => p.getName() === '$$type');
  if (!$$typeProperty) {
    return undefined;
  }
  const $$typeDecl = $$typeProperty.getValueDeclaration();
  if (!$$typeDecl) {
    return undefined;
  }
  if (!$$typeDecl.getText().includes("'@backstage/TranslationRef'")) {
    return undefined;
  }

  // The type is TranslationRef<TId, TMessages> - extract the type arguments
  const typeArgs = type.getTypeArguments();
  if (typeArgs.length < 2) {
    return undefined;
  }

  const [idType, messagesType] = typeArgs;

  if (!idType.isStringLiteral()) {
    return undefined;
  }
  const id = idType.getLiteralValueOrThrow() as string;

  // Extract messages from the TMessages type argument
  const messages: Record<string, string> = {};
  for (const messageProp of messagesType.getProperties()) {
    const key = messageProp.getName();
    // Resolve the property type in the context of the declaration
    const propType = messageProp.getTypeAtLocation(declaration);
    if (propType.isStringLiteral()) {
      messages[key] = propType.getLiteralValueOrThrow() as string;
    }
  }

  if (Object.keys(messages).length === 0) {
    return undefined;
  }

  return { id, messages };
}

/**
 * Creates a ts-morph Project using the target repo's tsconfig.json.
 */
export function createTranslationProject(tsconfigPath: string): Project {
  return new Project({
    tsConfigFilePath: tsconfigPath,
    skipAddingFilesFromTsConfig: true,
  });
}
