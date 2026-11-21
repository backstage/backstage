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

// Reads a frontend manifest from the emitted type declarations of a package
// rather than from its source. It relies on the `literals` of the plugin and
// extension types, which record the literal values that they were created
// with. The declarations are only parsed, and never type checked, so the
// dependencies of the package don't have to be available.

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join as joinPath, resolve as resolvePath } from 'node:path';
import { ts } from 'ts-morph';
import {
  APP_ROUTES,
  CORE_BLUEPRINTS,
  CORE_BLUEPRINTS_PACKAGE,
  ReadBlueprintParams,
} from './coreBlueprints';
import {
  FRONTEND_MANIFEST_VERSION,
  FrontendExtensionManifest,
  FrontendFeatureManifest,
} from './types';

/** An error that means that the types can't be read as a manifest. */
class TypeReadError extends Error {}

function parseDeclarationFile(path: string) {
  return ts.createSourceFile(
    path,
    readFileSync(path, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
}

/**
 * Resolves a relative import or re-export of a declaration file. Imports of
 * packages are not followed.
 */
function resolveRelative(
  specifier: string,
  containingFile: string,
): string | undefined {
  if (!specifier.startsWith('.')) {
    return undefined;
  }
  const base = resolvePath(dirname(containingFile), specifier);
  const withoutJs = base.replace(/\.(m|c)?jsx?$/, '');
  const found = [`${withoutJs}.d.ts`, joinPath(base, 'index.d.ts')].find(path =>
    existsSync(path),
  );
  if (!found) {
    throw new Error(
      `Unable to find the declaration file for '${specifier}', which is imported from ${containingFile}`,
    );
  }
  return found;
}

function hasExportModifier(node: ts.VariableStatement) {
  return node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword);
}

type ModuleLookup = {
  /** The module and name pairs that are being resolved, to detect cycles. */
  trail: string[];
};

function followSpecifier(
  specifier: ts.Expression,
  containingFile: string,
  name: string,
  lookup: ModuleLookup,
): ts.VariableDeclaration | undefined {
  if (!ts.isStringLiteralLike(specifier)) {
    throw new TypeReadError('a module specifier is not a string literal');
  }
  const path = resolveRelative(specifier.text, containingFile);
  if (!path) {
    throw new TypeReadError(
      `the default export comes from '${specifier.text}', but only relative imports are followed`,
    );
  }
  return findExportedVariable(path, name, lookup);
}

/**
 * Finds the variable that a module exports with a name, following relative
 * imports and re-exports. Returns undefined if the module has no such export.
 */
function findExportedVariable(
  path: string,
  exportName: string,
  lookup: ModuleLookup,
): ts.VariableDeclaration | undefined {
  const key = `${path}#${exportName}`;
  if (lookup.trail.includes(key)) {
    throw new TypeReadError(`the export '${exportName}' is circular`);
  }
  const next = { trail: [...lookup.trail, key] };
  const file = parseDeclarationFile(path);

  for (const statement of file.statements) {
    if (
      exportName === 'default' &&
      ts.isExportAssignment(statement) &&
      !statement.isExportEquals
    ) {
      if (!ts.isIdentifier(statement.expression)) {
        throw new TypeReadError('the default export is not a variable');
      }
      return findLocalVariable(file, statement.expression.text, next);
    }
    if (ts.isVariableStatement(statement) && hasExportModifier(statement)) {
      const declaration = statement.declarationList.declarations.find(
        d => ts.isIdentifier(d.name) && d.name.text === exportName,
      );
      if (declaration) {
        return declaration;
      }
    }
    if (
      ts.isExportDeclaration(statement) &&
      !statement.isTypeOnly &&
      statement.exportClause &&
      ts.isNamedExports(statement.exportClause)
    ) {
      const specifier = statement.exportClause.elements.find(
        e => !e.isTypeOnly && e.name.text === exportName,
      );
      if (specifier) {
        const local = (specifier.propertyName ?? specifier.name).text;
        return statement.moduleSpecifier
          ? followSpecifier(statement.moduleSpecifier, path, local, next)
          : findLocalVariable(file, local, next);
      }
    }
  }

  // Star exports don't include the default export
  if (exportName !== 'default') {
    for (const statement of file.statements) {
      if (
        ts.isExportDeclaration(statement) &&
        !statement.isTypeOnly &&
        !statement.exportClause &&
        statement.moduleSpecifier
      ) {
        const found = followSpecifier(
          statement.moduleSpecifier,
          path,
          exportName,
          next,
        );
        if (found) {
          return found;
        }
      }
    }
  }
  return undefined;
}

/** Finds a variable that is declared or imported in a module by its local name. */
function findLocalVariable(
  file: ts.SourceFile,
  name: string,
  lookup: ModuleLookup,
): ts.VariableDeclaration {
  for (const statement of file.statements) {
    if (ts.isVariableStatement(statement)) {
      const declaration = statement.declarationList.declarations.find(
        d => ts.isIdentifier(d.name) && d.name.text === name,
      );
      if (declaration) {
        return declaration;
      }
    }
    const clause = ts.isImportDeclaration(statement)
      ? statement.importClause
      : undefined;
    if (clause && !clause.isTypeOnly) {
      let imported: string | undefined;
      if (clause.name?.text === name) {
        imported = 'default';
      } else if (
        clause.namedBindings &&
        ts.isNamedImports(clause.namedBindings)
      ) {
        const element = clause.namedBindings.elements.find(
          e => !e.isTypeOnly && e.name.text === name,
        );
        imported = (element?.propertyName ?? element?.name)?.text;
      }
      if (imported !== undefined) {
        const found = followSpecifier(
          (statement as ts.ImportDeclaration).moduleSpecifier,
          file.fileName,
          imported,
          lookup,
        );
        if (!found) {
          throw new TypeReadError(
            `'${imported}' is not exported by the module that '${name}' is imported from`,
          );
        }
        return found;
      }
    }
  }
  throw new TypeReadError(`unable to find the declaration of '${name}'`);
}

/** Reads a literal type node, which is a string, number, boolean or undefined. */
function readLiteral(node: ts.TypeNode): unknown {
  if (node.kind === ts.SyntaxKind.UndefinedKeyword) {
    return undefined;
  }
  if (ts.isLiteralTypeNode(node)) {
    const literal = node.literal;
    if (ts.isStringLiteral(literal)) return literal.text;
    if (ts.isNumericLiteral(literal)) return Number(literal.text);
    if (literal.kind === ts.SyntaxKind.TrueKeyword) return true;
    if (literal.kind === ts.SyntaxKind.FalseKeyword) return false;
  }
  if (ts.isTypeLiteralNode(node)) {
    return readMembers(node, readLiteral);
  }
  throw new TypeReadError(`the type '${node.getText()}' is not a literal`);
}

function memberName(member: ts.TypeElement): string | undefined {
  return member.name &&
    (ts.isIdentifier(member.name) || ts.isStringLiteralLike(member.name))
    ? member.name.text
    : undefined;
}

function readMembers<T>(
  node: ts.TypeLiteralNode,
  read: (type: ts.TypeNode, name: string, optional: boolean) => T,
): { [name: string]: T } {
  const result: { [name: string]: T } = {};
  for (const member of node.members) {
    const name = memberName(member);
    if (!name || !ts.isPropertySignature(member) || !member.type) {
      throw new TypeReadError('the type has members that can not be read');
    }
    result[name] = read(member.type, name, Boolean(member.questionToken));
  }
  return result;
}

const MODULE_TYPES = ['FrontendModule', 'OverridableFrontendModule'];

/** The name of the type that a type reference or import type refers to. */
function referencedTypeName(node: ts.TypeNode): string | undefined {
  let name: ts.EntityName | undefined;
  if (ts.isImportTypeNode(node)) {
    name = node.qualifier;
  } else if (ts.isTypeReferenceNode(node)) {
    name = node.typeName;
  }
  return name && (ts.isIdentifier(name) ? name.text : name.right.text);
}

function typeArguments(node: ts.TypeNode): readonly ts.TypeNode[] {
  if (
    (ts.isImportTypeNode(node) || ts.isTypeReferenceNode(node)) &&
    node.typeArguments
  ) {
    return node.typeArguments;
  }
  throw new TypeReadError(
    'the default export is not a plugin type with type arguments',
  );
}

function asTypeLiteral(node: ts.TypeNode | undefined, what: string) {
  if (!node || !ts.isTypeLiteralNode(node)) {
    throw new TypeReadError(`${what} is not an object type`);
  }
  return node;
}

/** Reads a union of string literals, or a single one, as a list. */
function readStringUnion(node: ts.TypeNode, what: string): string[] {
  if (node.kind === ts.SyntaxKind.NeverKeyword) {
    return [];
  }
  const types = ts.isUnionTypeNode(node) ? node.types : [node];
  return types.map(type => {
    const value = readLiteral(type);
    if (typeof value !== 'string') {
      throw new TypeReadError(`${what} is not a union of string literals`);
    }
    return value;
  });
}

/** Reads a tuple of string literals. */
function readStringTuple(node: ts.TypeNode, what: string): string[] {
  const inner =
    ts.isTypeOperatorNode(node) &&
    node.operator === ts.SyntaxKind.ReadonlyKeyword
      ? node.type
      : node;
  if (!ts.isTupleTypeNode(inner)) {
    throw new TypeReadError(`${what} is not known`);
  }
  return inner.elements.map(element => {
    const value = ts.isNamedTupleMember(element)
      ? undefined
      : readLiteral(element);
    if (typeof value !== 'string') {
      throw new TypeReadError(`${what} is not known`);
    }
    return value;
  });
}

/**
 * Reads the ID that a route ref was created with, which `createRouteRef`
 * records in the type of the route ref as an intersection with `{ I: "id" }`.
 */
function readRouteRefId(node: ts.TypeNode): string | undefined {
  if (!ts.isIntersectionTypeNode(node)) {
    return undefined;
  }
  for (const type of node.types) {
    if (!ts.isTypeLiteralNode(type)) {
      continue;
    }
    for (const member of type.members) {
      if (memberName(member) === 'I' && ts.isPropertySignature(member)) {
        const id = member.type && readLiteral(member.type);
        return typeof id === 'string' ? id : undefined;
      }
    }
  }
  return undefined;
}

/**
 * Finds the name of the plugin route that a route ref param is, matching the
 * ID that the route ref was created with to the IDs of the plugin routes. A
 * page whose route ref has no ID is assumed to use the root route of the
 * plugin, like the page itself does when it has one.
 */
function findRouteRefName(options: {
  refId: string | undefined;
  routeIds: { [name: string]: string | undefined };
  blueprint: { type: string; routeRefIsPluginRoute?: boolean };
}): string | undefined {
  const { refId, routeIds, blueprint } = options;
  let name: string | undefined;
  if (refId !== undefined) {
    const names = Object.keys(routeIds).filter(n => routeIds[n] === refId);
    if (names.length > 1) {
      throw new TypeReadError(
        `the route ref ID '${refId}' is used by more than one plugin route`,
      );
    }
    name = names[0];
  } else if (blueprint.type === 'page') {
    name = Object.hasOwn(routeIds, 'root') ? 'root' : undefined;
  } else {
    throw new TypeReadError(
      `the route ref of the extension has no ID, so it can't be matched with the plugin routes`,
    );
  }
  if (name === undefined && blueprint.routeRefIsPluginRoute) {
    throw new TypeReadError(
      `the route ref of the extension is not one of the plugin routes`,
    );
  }
  return name;
}

function extensionId(
  kind: string | undefined,
  pluginId: string,
  name: string | undefined,
) {
  const namePart = name ? `${pluginId}/${name}` : pluginId;
  return kind ? `${kind}:${namePart}` : namePart;
}

function readAttachTo(
  value: unknown,
  pluginId: string,
): { id: string; input: string } {
  const spec = value as any;
  if (spec && typeof spec === 'object' && typeof spec.input === 'string') {
    if (typeof spec.id === 'string') {
      return { id: spec.id, input: spec.input };
    }
    const relative = spec.relative;
    if (
      relative &&
      typeof relative === 'object' &&
      (relative.kind === undefined || typeof relative.kind === 'string') &&
      (relative.name === undefined || typeof relative.name === 'string')
    ) {
      return {
        id: extensionId(relative.kind, pluginId, relative.name),
        input: spec.input,
      };
    }
  }
  throw new TypeReadError(
    'the attachment point must be an object with an id or a relative extension, and an input',
  );
}

/** Reads a type that must be a literal, or `undefined` if it's missing. */
function readOptionalLiteral(node: ts.TypeNode | undefined, what: string) {
  if (!node) {
    return undefined;
  }
  try {
    return readLiteral(node);
  } catch (error) {
    if (error instanceof TypeReadError) {
      throw new TypeReadError(`${what} is not a literal`);
    }
    throw error;
  }
}

/** Finds the core blueprint that an extension declares it was made with. */
function findBlueprint(identity: unknown, kind: unknown) {
  const prefix = `${CORE_BLUEPRINTS_PACKAGE}#`;
  const name =
    typeof identity === 'string' && identity.startsWith(prefix)
      ? identity.slice(prefix.length)
      : undefined;
  const blueprint =
    name !== undefined && Object.hasOwn(CORE_BLUEPRINTS, name)
      ? CORE_BLUEPRINTS[name]
      : undefined;
  if (!blueprint || blueprint.kind !== kind) {
    throw new TypeReadError(
      `the extension is not made with a blueprint that is supported for deferred loading`,
    );
  }
  return { name: name!, blueprint };
}

function readExtension(
  id: string,
  type: ts.TypeNode,
  pluginId: string,
  routeIds: { [name: string]: string | undefined },
): FrontendExtensionManifest {
  // OverridableExtensionDefinition<{ kind, name, params, literals, ... }>
  const [definition] = typeArguments(type);
  const members = readMembers(
    asTypeLiteral(definition, `the type of '${id}'`),
    t => t,
  );
  const kind = readOptionalLiteral(members.kind, 'the extension kind');
  const name = readOptionalLiteral(members.name, 'the extension name');
  if (name !== undefined && typeof name !== 'string') {
    throw new TypeReadError('the extension name must be a string');
  }
  if (!members.literals) {
    throw new TypeReadError(
      `the extension '${id}' has no recorded literals, so it is not made with the make method of a blueprint`,
    );
  }
  const literals = readMembers(
    asTypeLiteral(members.literals, `the literals of '${id}'`),
    t => t,
  );
  const { name: blueprintName, blueprint } = findBlueprint(
    readOptionalLiteral(literals.blueprint, 'the blueprint identity'),
    kind,
  );
  if (extensionId(blueprint.kind, pluginId, name) !== id) {
    throw new TypeReadError(`the ID of the extension '${id}' doesn't match`);
  }
  if (readOptionalLiteral(literals.if, `the 'if' predicate`) !== undefined) {
    throw new TypeReadError(`the extension uses an 'if' predicate`);
  }
  const disabled =
    readOptionalLiteral(literals.disabled, 'the disabled option') ?? false;
  if (typeof disabled !== 'boolean') {
    throw new TypeReadError('the disabled option must be a boolean');
  }
  const attachToValue = readOptionalLiteral(
    literals.attachTo,
    'the attachment point',
  );

  if (blueprint.type === 'api') {
    if (attachToValue !== undefined) {
      throw new TypeReadError(
        `the extension option 'attachTo' is not supported`,
      );
    }
    const callback = readOptionalLiteral(
      literals.paramsCallback,
      'the API params',
    ) as
      | { apiRefId?: unknown; apiIsPromise?: unknown; deps?: unknown }
      | undefined;
    if (!callback || typeof callback.apiRefId !== 'string') {
      throw new TypeReadError('the API ref ID is not a literal');
    }
    // A deferred plugin provides its APIs as promises until it is loaded
    if (callback.apiIsPromise !== true) {
      throw new TypeReadError(
        `the API ref '${callback.apiRefId}' must be declared as a promise, as in createApiRef<Promise<MyApi>>(), since a deferred plugin provides its APIs as promises until it is loaded`,
      );
    }
    const deps: { [name: string]: string } = {};
    for (const [depName, depId] of Object.entries(
      (callback.deps ?? {}) as object,
    )) {
      if (typeof depId !== 'string') {
        throw new TypeReadError(`the '${depName}' dependency is not a literal`);
      }
      deps[depName] = depId;
    }
    return {
      id,
      kind: blueprint.kind,
      attachTo: readAttachTo(blueprint.attachTo, pluginId),
      disabled,
      api: { apiRefId: callback.apiRefId, deps },
    };
  }

  const attachTo = readAttachTo(attachToValue ?? blueprint.attachTo, pluginId);
  if (
    blueprint.type === 'page' &&
    (attachTo.id !== APP_ROUTES.id || attachTo.input !== APP_ROUTES.input)
  ) {
    throw new TypeReadError(
      `the page is not attached to ${APP_ROUTES.id}, so it can't be deferred`,
    );
  }

  if (!members.literals || !literals.paramKeys || !literals.params) {
    throw new TypeReadError('the extension has no params');
  }
  if (
    readOptionalLiteral(literals.paramsCallback, 'the params') !== undefined
  ) {
    throw new TypeReadError('the extension params must be an object');
  }
  const paramKeys = readStringUnion(literals.paramKeys, 'the param names');
  const literalParams = readLiteral(literals.params) as {
    [key: string]: unknown;
  };
  const params: ReadBlueprintParams = {};
  for (const key of paramKeys) {
    const spec = Object.hasOwn(blueprint.params, key)
      ? blueprint.params[key]
      : undefined;
    if (!spec) {
      throw new TypeReadError(
        `the '${key}' param of the '${blueprintName}' blueprint is not supported for deferred loading`,
      );
    }
    if (spec.type === 'string') {
      const value = literalParams[key];
      if (typeof value !== 'string') {
        throw new TypeReadError(`the '${key}' param is not a string literal`);
      }
      params[key as 'path' | 'title'] = value;
    }
    if (spec.type === 'routeRef') {
      const routeRef = literalParams[key] as { id?: unknown } | undefined;
      params.routeRefName = findRouteRefName({
        refId: typeof routeRef?.id === 'string' ? routeRef.id : undefined,
        routeIds,
        blueprint,
      });
    }
  }
  for (const [key, spec] of Object.entries(blueprint.params)) {
    if (spec.required && !paramKeys.includes(key)) {
      throw new TypeReadError(`the extension has no '${key}' param`);
    }
  }

  return {
    id,
    kind: blueprint.kind,
    attachTo,
    disabled,
    ...blueprint.createManifest(params),
  };
}

/** Checks the rules for deferring a plugin, given its extensions. */
function findNotDeferrableReason(
  extensions: FrontendExtensionManifest[],
): string | undefined {
  if (extensions.length === 0) {
    return 'the plugin has no extensions';
  }
  for (const extension of extensions) {
    if (Array.isArray(extension.attachTo)) {
      return `the extension '${extension.id}' attaches to more than one extension`;
    }
  }
  if (!extensions.some(e => e.page || e.element)) {
    return 'the plugin has no page or element that would load it';
  }
  return undefined;
}

/**
 * Reads the manifest of the plugin that is the default export of an entry
 * point declaration file. Everything comes from the types, using the
 * `literals` that plugins and extensions record. A route ref is matched with
 * the plugin routes by the ID that it was created with.
 *
 * @throws If the declaration file of the entry point, or a file that it
 * imports, doesn't exist.
 */
export function readFrontendManifestFromTypes(options: {
  /** The path of the declaration file of the entry point. */
  entryPoint: string;
}): { manifest: FrontendFeatureManifest } | { skipped: string } {
  if (!existsSync(options.entryPoint)) {
    throw new Error(
      `No declaration file found at ${options.entryPoint}, be sure to run yarn tsc to generate .d.ts files before packaging`,
    );
  }

  let declaration: ts.VariableDeclaration | undefined;
  try {
    declaration = findExportedVariable(options.entryPoint, 'default', {
      trail: [],
    });
  } catch (error) {
    if (error instanceof TypeReadError) {
      return { skipped: error.message };
    }
    throw error;
  }
  if (!declaration?.type) {
    return { skipped: 'the entry point has no default export with a type' };
  }

  if (MODULE_TYPES.includes(referencedTypeName(declaration.type) ?? '')) {
    return {
      skipped: 'the entry point is a module, and modules are never deferred',
    };
  }

  let manifest: FrontendFeatureManifest;
  let extensionIds: string[];
  let extensionTypes: { [id: string]: ts.TypeNode };
  let pluginIf: unknown;
  let routeIds: { [name: string]: string | undefined };
  try {
    const [routes, externalRoutes, extensions, pluginLiterals] = typeArguments(
      declaration.type,
    );
    if (!pluginLiterals) {
      throw new TypeReadError(
        'the default export has no recorded literals, so it is not created with createFrontendPlugin',
      );
    }
    const literals = readMembers(
      asTypeLiteral(pluginLiterals, 'the plugin literals'),
      t => t,
    );
    const pluginId = readOptionalLiteral(literals.pluginId, 'the plugin ID');
    if (typeof pluginId !== 'string') {
      throw new TypeReadError('the plugin options have no pluginId');
    }
    const title = readOptionalLiteral(literals.title, 'the plugin title');
    if (title !== undefined && typeof title !== 'string') {
      throw new TypeReadError('the plugin title must be a string');
    }
    try {
      pluginIf = readOptionalLiteral(literals.if, `the 'if' predicate`);
    } catch {
      pluginIf = true;
    }
    if (!literals.extensionIds) {
      throw new TypeReadError('the plugin extensions are not known');
    }
    extensionIds = readStringTuple(
      literals.extensionIds,
      'the order of the plugin extensions',
    );
    extensionTypes = readMembers(
      asTypeLiteral(extensions, 'the extensions'),
      t => t,
    );
    routeIds = readMembers(asTypeLiteral(routes, 'the routes'), readRouteRefId);
    manifest = {
      manifestVersion: FRONTEND_MANIFEST_VERSION,
      type: 'plugin',
      pluginId,
      ...(title !== undefined ? { title } : {}),
      deferrable: false,
      routes: Object.keys(routeIds),
      externalRoutes: Object.keys(
        readMembers(
          asTypeLiteral(externalRoutes, 'the external routes'),
          t => t,
        ),
      ),
      extensions: [],
    };
  } catch (error) {
    if (error instanceof TypeReadError) {
      return { skipped: error.message };
    }
    throw error;
  }

  try {
    if (pluginIf !== undefined) {
      throw new TypeReadError(`the plugin uses an 'if' predicate`);
    }
    manifest.extensions = extensionIds.map(id => {
      const type = Object.hasOwn(extensionTypes, id)
        ? extensionTypes[id]
        : undefined;
      if (!type) {
        throw new TypeReadError(`the type of the extension '${id}' is missing`);
      }
      return readExtension(id, type, manifest.pluginId, routeIds);
    });
  } catch (error) {
    if (error instanceof TypeReadError) {
      return {
        manifest: { ...manifest, notDeferrableReason: error.message },
      };
    }
    throw error;
  }
  const reason = findNotDeferrableReason(manifest.extensions);
  return {
    manifest: reason
      ? { ...manifest, notDeferrableReason: reason }
      : { ...manifest, deferrable: true },
  };
}
