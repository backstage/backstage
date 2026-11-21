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

// PROTOTYPE: reads a frontend manifest from the emitted type declarations of
// a package rather than from its source. It relies on the `literals` of the
// plugin and extension types, which record the literal values that they were
// created with.

import { existsSync } from 'node:fs';
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

class TypeReadError extends Error {}

const EXTENSIONS = ['.d.ts', '.ts', '.tsx'];

function resolveRelative(specifier: string, containingFile: string) {
  if (!specifier.startsWith('.')) {
    return undefined;
  }
  const base = resolvePath(dirname(containingFile), specifier);
  const withoutJs = base.replace(/\.(m|c)?jsx?$/, '');
  const candidates = [
    ...EXTENSIONS.map(ext => `${withoutJs}${ext}`),
    ...EXTENSIONS.map(ext => joinPath(base, `index${ext}`)),
  ];
  const found = candidates.find(c => existsSync(c));
  return found
    ? ({
        resolvedFileName: found,
        extension: found.endsWith('.d.ts') ? ts.Extension.Dts : ts.Extension.Ts,
        isExternalLibraryImport: false,
      } as ts.ResolvedModuleFull)
    : undefined;
}

function createProgram(rootNames: string[]) {
  const options: ts.CompilerOptions = {
    noEmit: true,
    noLib: true,
    types: [],
    skipLibCheck: false,
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
  };
  const host = ts.createCompilerHost(options, true);
  // Only relative imports are followed, so that the dependencies of the
  // package don't have to be loaded. Their types stay unresolved, which is
  // fine since only the shape of the type arguments is read.
  host.resolveModuleNameLiterals = (literals, containingFile) =>
    literals.map(literal => ({
      resolvedModule: resolveRelative(literal.text, containingFile),
    }));
  return ts.createProgram({ rootNames, options, host });
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
    ) as { apiRefId?: unknown; deps?: unknown } | undefined;
    if (!callback || typeof callback.apiRefId !== 'string') {
      throw new TypeReadError('the API ref ID is not a literal');
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
    // The route ref of a param can't be matched with the plugin routes,
    // since the types of route refs don't identify them.
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
 * `literals` that plugins and extensions record, except for the plugin routes
 * that route refs are, which the types don't identify.
 */
export function readFrontendManifestFromTypes(options: {
  /** The path of the declaration file of the entry point. */
  entryPoint: string;
}): { manifest: FrontendFeatureManifest } | { skipped: string } {
  const program = createProgram([options.entryPoint]);
  const checker = program.getTypeChecker();
  const sourceFile = program.getSourceFile(options.entryPoint);
  const moduleSymbol = sourceFile && checker.getSymbolAtLocation(sourceFile);
  let symbol = moduleSymbol?.exports?.get(
    ts.InternalSymbolName.Default as ts.__String,
  );
  for (
    let i = 0;
    symbol && symbol.flags & ts.SymbolFlags.Alias && i < 20;
    i++
  ) {
    symbol = checker.getAliasedSymbol(symbol);
  }
  const declaration = symbol?.declarations?.find(
    (d): d is ts.VariableDeclaration => ts.isVariableDeclaration(d),
  );
  if (!declaration?.type) {
    return { skipped: 'the entry point has no default export with a type' };
  }

  let manifest: FrontendFeatureManifest;
  let extensionIds: string[];
  let extensionTypes: { [id: string]: ts.TypeNode };
  let pluginIf: unknown;
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
    manifest = {
      manifestVersion: FRONTEND_MANIFEST_VERSION,
      type: 'plugin',
      pluginId,
      ...(title !== undefined ? { title } : {}),
      deferrable: false,
      routes: Object.keys(
        readMembers(asTypeLiteral(routes, 'the routes'), t => t),
      ),
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
      return readExtension(id, type, manifest.pluginId);
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
