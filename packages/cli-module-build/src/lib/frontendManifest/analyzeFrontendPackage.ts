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

import { statSync } from 'node:fs';
import {
  dirname,
  join as joinPath,
  relative as relativePath,
  resolve as resolvePath,
  sep,
} from 'node:path';
import { ts } from 'ts-morph';
import {
  FRONTEND_MANIFEST_VERSION,
  FrontendExtensionManifest,
  FrontendFeatureManifest,
} from './types';

/**
 * The version of the analysis. Bump it whenever the analysis changes in a
 * way that changes its results, which invalidates cached results.
 */
export const ANALYZER_VERSION = 2;

/** The entry points that can hold a plugin that is deferred. */
export const DEFERRABLE_ENTRY_POINTS = ['.', './alpha'];

const FRONTEND_PLUGIN_API = '@backstage/frontend-plugin-api';

type AttachTo = { id: string; input: string };

type BlueprintSupport = {
  type: 'page' | 'sub-page';
  kind: string;
  attachTo: unknown;
};

/**
 * The blueprints whose extensions can be deferred, and how their params map
 * to the outputs of the extension. These are all from
 * `@backstage/frontend-plugin-api`, since the outputs of a blueprint can
 * only be known without running it if its factory is known.
 */
const CORE_BLUEPRINTS: { [name: string]: BlueprintSupport } = {
  PageBlueprint: {
    type: 'page',
    kind: 'page',
    attachTo: { id: 'app/routes', input: 'routes' },
  },
  SubPageBlueprint: {
    type: 'sub-page',
    kind: 'sub-page',
    attachTo: { relative: { kind: 'page' }, input: 'pages' },
  },
};

const MAKE_OPTIONS = ['name', 'attachTo', 'disabled', 'if', 'params'];

// The options of makeWithOverrides that can be deferred. A config schema
// only adds config that is applied once the plugin has loaded, while inputs
// and outputs would change what the stand-in of the extension provides.
const MAKE_WITH_OVERRIDES_OPTIONS = [
  'name',
  'attachTo',
  'disabled',
  'if',
  'configSchema',
  'factory',
];

// Options of createFrontendPlugin that don't affect deferred loading
const IGNORED_PLUGIN_OPTIONS = ['icon', 'info', 'featureFlags'];

const SCRIPT_EXTENSIONS: Array<[string, ts.Extension]> = [
  ['.ts', ts.Extension.Ts],
  ['.tsx', ts.Extension.Tsx],
  ['.d.ts', ts.Extension.Dts],
  ['.js', ts.Extension.Js],
  ['.jsx', ts.Extension.Jsx],
];

/** The result of analyzing one entry point of a package. */
export type EntryPointAnalysis =
  | { manifest: FrontendFeatureManifest }
  | {
      /** Why the entry point has no manifest. It is loaded with the app. */
      skipped: string;
    };

/** The result of analyzing a frontend plugin package. */
export interface FrontendPackageAnalysis {
  entryPoints: { [entryPoint: string]: EntryPointAnalysis };
}

class AnalysisError extends Error {}

type Target =
  | { type: 'node'; node: ts.Expression; key: string }
  | { type: 'external'; module: string; name: string; from: ts.Node };

type FeatureInfo = {
  type: 'plugin' | 'module';
  pluginId: string;
  title?: string;
  routes: Map<string, string>;
  externalRoutes: Map<string, string>;
  extensions: Array<{ node: ts.Expression }>;
  ifNode?: ts.Node;
};

function isFile(path: string) {
  try {
    return statSync(path).isFile();
  } catch {
    return false;
  }
}

function getScriptExtension(path: string): ts.Extension | undefined {
  // .d.ts is listed before .ts so that it wins
  return [...SCRIPT_EXTENSIONS]
    .sort(([a], [b]) => b.length - a.length)
    .find(([ext]) => path.endsWith(ext))?.[1];
}

/**
 * Resolves relative imports only. Imports of other packages are left
 * unresolved, which keeps the program small. Values imported from other
 * packages are therefore only known by their module and export name.
 */
function resolveRelativeImport(
  specifier: string,
  containingFile: string,
): ts.ResolvedModuleFull | undefined {
  if (!specifier.startsWith('./') && !specifier.startsWith('../')) {
    return undefined;
  }
  const base = resolvePath(dirname(containingFile), specifier);
  const withoutJs = base.replace(/\.(m|c)?jsx?$/, '');
  const candidates = [
    base,
    ...SCRIPT_EXTENSIONS.map(([ext]) => `${withoutJs}${ext}`),
    ...SCRIPT_EXTENSIONS.map(([ext]) => joinPath(base, `index${ext}`)),
  ];
  for (const candidate of candidates) {
    const extension = getScriptExtension(candidate);
    if (extension && isFile(candidate)) {
      return {
        resolvedFileName: candidate,
        extension,
        isExternalLibraryImport: false,
      };
    }
  }
  return undefined;
}

const COMPILER_OPTIONS: ts.CompilerOptions = {
  noEmit: true,
  noLib: true,
  types: [],
  allowJs: true,
  jsx: ts.JsxEmit.Preserve,
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  skipLibCheck: true,
};

function createProgram(rootNames: string[]): ts.Program {
  const host = ts.createCompilerHost(COMPILER_OPTIONS, true);
  host.resolveModuleNameLiterals = (literals, containingFile) =>
    literals.map(literal => ({
      resolvedModule: resolveRelativeImport(literal.text, containingFile),
    }));
  return ts.createProgram({ rootNames, options: COMPILER_OPTIONS, host });
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

function getModuleSpecifier(node: ts.Node | undefined): string | undefined {
  if (node && ts.isStringLiteral(node)) {
    return node.text;
  }
  return undefined;
}

function isBareSpecifier(specifier: string) {
  return !specifier.startsWith('.') && !specifier.startsWith('/');
}

/** Reads the module and name of an import of another package. */
function readExternalImport(
  declaration: ts.Declaration,
): { module: string; name: string } | undefined {
  let module: string | undefined;
  let name: string | undefined;
  if (ts.isImportSpecifier(declaration)) {
    module = getModuleSpecifier(
      declaration.parent.parent.parent.moduleSpecifier,
    );
    name = (declaration.propertyName ?? declaration.name).text;
  } else if (ts.isImportClause(declaration)) {
    module = getModuleSpecifier(declaration.parent.moduleSpecifier);
    name = 'default';
  } else if (ts.isNamespaceImport(declaration)) {
    module = getModuleSpecifier(declaration.parent.parent.moduleSpecifier);
    name = '*';
  } else if (ts.isExportSpecifier(declaration)) {
    module = getModuleSpecifier(declaration.parent.parent.moduleSpecifier);
    name = (declaration.propertyName ?? declaration.name).text;
  }
  if (module === undefined || name === undefined || !isBareSpecifier(module)) {
    return undefined;
  }
  return { module, name };
}

function extensionId(
  kind: string | undefined,
  pluginId: string,
  name: string | undefined,
) {
  const namePart = name ? `${pluginId}/${name}` : pluginId;
  return kind ? `${kind}:${namePart}` : namePart;
}

function isPlainObject(value: unknown): value is { [key: string]: unknown } {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isAttachedTo(
  attachTo: FrontendExtensionManifest['attachTo'],
  target: AttachTo,
) {
  return (
    !Array.isArray(attachTo) &&
    attachTo.id === target.id &&
    attachTo.input === target.input
  );
}

class PackageAnalyzer {
  readonly #packageDir: string;
  readonly #program: ts.Program;
  readonly #checker: ts.TypeChecker;

  constructor(packageDir: string, rootNames: string[]) {
    this.#packageDir = packageDir;
    this.#program = createProgram(rootNames);
    this.#checker = this.#program.getTypeChecker();
  }

  #location(node: ts.Node): string {
    const sourceFile = node.getSourceFile();
    const { line } = sourceFile.getLineAndCharacterOfPosition(
      node.getStart(sourceFile),
    );
    const path = relativePath(this.#packageDir, sourceFile.fileName)
      .split(sep)
      .join('/');
    return `${path}:${line + 1}`;
  }

  #fail(message: string, node: ts.Node): never {
    throw new AnalysisError(`${message} (${this.#location(node)})`);
  }

  #keyOf(node: ts.Node) {
    return `${node.getSourceFile().fileName}:${node.getStart()}`;
  }

  /**
   * Follows identifiers, imports and namespace imports to the expression or
   * import of another package that they refer to.
   */
  #resolve(expr: ts.Expression, depth = 0): Target {
    if (depth > 50) {
      this.#fail('the value is too deeply nested to be read', expr);
    }
    const node = unwrap(expr);
    if (ts.isIdentifier(node)) {
      const symbol =
        ts.isShorthandPropertyAssignment(node.parent) &&
        node.parent.name === node
          ? this.#checker.getShorthandAssignmentValueSymbol(node.parent)
          : this.#checker.getSymbolAtLocation(node);
      if (!symbol) {
        this.#fail(`'${node.text}' can't be resolved`, node);
      }
      return this.#resolveSymbol(symbol, node, depth);
    }
    if (
      ts.isPropertyAccessExpression(node) &&
      ts.isIdentifier(node.expression)
    ) {
      const object = this.#resolve(node.expression, depth + 1);
      if (object.type === 'external' && object.name === '*') {
        return {
          type: 'external',
          module: object.module,
          name: node.name.text,
          from: node,
        };
      }
    }
    return { type: 'node', node, key: this.#keyOf(node) };
  }

  #resolveSymbol(symbol: ts.Symbol, from: ts.Node, depth: number): Target {
    let current = symbol;
    for (let i = 0; current.flags & ts.SymbolFlags.Alias; i++) {
      const declaration = current.declarations?.[0];
      const next = this.#checker.getImmediateAliasedSymbol(current);
      if (!next || !next.declarations?.length || i > 50) {
        const external = declaration && readExternalImport(declaration);
        if (external) {
          return { type: 'external', ...external, from };
        }
        this.#fail(`'${current.name}' can't be resolved`, from);
      }
      current = next;
    }

    const declaration = current.valueDeclaration ?? current.declarations?.[0];
    let initializer: ts.Expression | undefined;
    if (declaration && ts.isVariableDeclaration(declaration)) {
      const isConst =
        (ts.getCombinedNodeFlags(declaration) & ts.NodeFlags.Const) !== 0;
      if (!isConst || !ts.isIdentifier(declaration.name)) {
        this.#fail(`'${current.name}' must be declared with const`, from);
      }
      initializer = declaration.initializer;
    } else if (declaration && ts.isExportAssignment(declaration)) {
      initializer = declaration.expression;
    }
    if (!declaration || !initializer) {
      this.#fail(`'${current.name}' is not a constant value`, from);
    }

    const target = this.#resolve(initializer, depth + 1);
    // A declaration is the identity of the value it holds, so that two
    // references to it are known to be the same value
    if (target.type === 'node' && target.node === unwrap(initializer)) {
      return { ...target, key: this.#keyOf(declaration) };
    }
    return target;
  }

  /** Reads a value that must be a literal, or a constant holding one. */
  #evaluate(expr: ts.Expression, what: string, depth = 0): unknown {
    if (depth > 50) {
      this.#fail(`${what} is too deeply nested to be read`, expr);
    }
    const target = this.#resolve(expr, depth);
    if (target.type === 'external') {
      this.#fail(
        `${what} is imported from '${target.module}', so its value can't be read`,
        target.from,
      );
    }
    const node = target.node;
    if (ts.isStringLiteralLike(node)) {
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
    if (ts.isTemplateExpression(node)) {
      let result = node.head.text;
      for (const span of node.templateSpans) {
        const value = this.#evaluate(span.expression, what, depth + 1);
        if (
          typeof value !== 'string' &&
          typeof value !== 'number' &&
          typeof value !== 'boolean'
        ) {
          this.#fail(`${what} is not a literal value`, span.expression);
        }
        result += String(value) + span.literal.text;
      }
      return result;
    }
    if (ts.isObjectLiteralExpression(node)) {
      const result: { [key: string]: unknown } = {};
      for (const [key, value] of this.#readObject(node, what)) {
        result[key] = this.#evaluate(value, what, depth + 1);
      }
      return result;
    }
    if (ts.isArrayLiteralExpression(node)) {
      return node.elements.map(element => {
        if (ts.isSpreadElement(element) || ts.isOmittedExpression(element)) {
          this.#fail(`${what} is not a literal value`, element);
        }
        return this.#evaluate(element, what, depth + 1);
      });
    }
    if (ts.isPropertyAccessExpression(node)) {
      const object = this.#evaluate(node.expression, what, depth + 1);
      if (isPlainObject(object) && Object.hasOwn(object, node.name.text)) {
        return object[node.name.text];
      }
    }
    if (
      ts.isElementAccessExpression(node) &&
      ts.isStringLiteralLike(node.argumentExpression)
    ) {
      const object = this.#evaluate(node.expression, what, depth + 1);
      const key = node.argumentExpression.text;
      if (isPlainObject(object) && Object.hasOwn(object, key)) {
        return object[key];
      }
    }
    return this.#fail(`${what} is not a literal value`, node);
  }

  #evaluateString(expr: ts.Expression, what: string): string {
    const value = this.#evaluate(expr, what);
    if (typeof value !== 'string') {
      this.#fail(`${what} must be a string`, expr);
    }
    return value;
  }

  /** Reads the properties of an object literal, keyed by name. */
  #readObject(
    node: ts.ObjectLiteralExpression,
    what: string,
  ): Map<string, ts.Expression> {
    const properties = new Map<string, ts.Expression>();
    for (const property of node.properties) {
      if (ts.isShorthandPropertyAssignment(property)) {
        properties.set(property.name.text, property.name);
        continue;
      }
      if (
        ts.isPropertyAssignment(property) &&
        (ts.isIdentifier(property.name) ||
          ts.isStringLiteralLike(property.name) ||
          ts.isNumericLiteral(property.name))
      ) {
        properties.set(property.name.text, property.initializer);
        continue;
      }
      this.#fail(`${what} must only have plain properties`, property);
    }
    return properties;
  }

  /**
   * Reads the options of makeWithOverrides, where the factory may be a
   * method. Any other function-valued option is left for the caller to
   * reject by name.
   */
  #readOverrideOptions(expr: ts.Expression): Map<string, ts.Expression> {
    const target = this.#resolve(expr);
    if (target.type !== 'node' || !ts.isObjectLiteralExpression(target.node)) {
      this.#fail('the extension options must be an object literal', expr);
    }
    const options = new Map<string, ts.Expression>();
    for (const property of target.node.properties) {
      if (
        ts.isMethodDeclaration(property) &&
        ts.isIdentifier(property.name) &&
        property.name.text === 'factory'
      ) {
        if (property.asteriskToken) {
          this.#fail(
            'the factory must return the result of originalFactory, not yield it',
            property,
          );
        }
        // The method is treated like a function expression with the same
        // parameters and body
        options.set('factory', property as unknown as ts.Expression);
        continue;
      }
      if (ts.isPropertyAssignment(property) && ts.isIdentifier(property.name)) {
        options.set(property.name.text, property.initializer);
        continue;
      }
      if (ts.isShorthandPropertyAssignment(property)) {
        options.set(property.name.text, property.name);
        continue;
      }
      this.#fail(
        'the extension options must only have plain properties',
        property,
      );
    }
    return options;
  }

  /**
   * Reads the params that a makeWithOverrides factory passes to the original
   * factory. The factory must do nothing but return
   * `originalFactory({ ... })`, so that the params are all that it adds.
   */
  #readOriginalFactoryParams(factoryExpr: ts.Expression): ts.Expression {
    const factory: ts.Node = ts.isMethodDeclaration(factoryExpr)
      ? factoryExpr
      : unwrap(factoryExpr);
    if (
      !ts.isMethodDeclaration(factory) &&
      !ts.isArrowFunction(factory) &&
      !ts.isFunctionExpression(factory)
    ) {
      this.#fail('the factory must be a function', factoryExpr);
    }
    if (
      (ts.isMethodDeclaration(factory) || ts.isFunctionExpression(factory)) &&
      (factory.asteriskToken || factory.modifiers?.length)
    ) {
      this.#fail('the factory must be a plain function', factory);
    }
    if (ts.isArrowFunction(factory) && factory.modifiers?.length) {
      this.#fail('the factory must be a plain function', factory);
    }
    const [originalParam] = factory.parameters;
    if (!originalParam || !ts.isIdentifier(originalParam.name)) {
      this.#fail(
        'the factory must take the original factory as a plain parameter',
        factory,
      );
    }

    let returned: ts.Expression | undefined;
    const body = factory.body;
    if (body && ts.isBlock(body)) {
      const [statement, ...rest] = body.statements;
      if (
        rest.length === 0 &&
        statement &&
        ts.isReturnStatement(statement) &&
        statement.expression
      ) {
        returned = statement.expression;
      }
    } else if (body) {
      returned = body;
    }
    const call = returned && unwrap(returned);
    if (
      !call ||
      !ts.isCallExpression(call) ||
      !ts.isIdentifier(call.expression) ||
      call.expression.text !== originalParam.name.text ||
      call.arguments.length !== 1
    ) {
      this.#fail(
        `the factory must only return ${originalParam.name.text}(params), with no other statements or arguments`,
        factory,
      );
    }
    return call.arguments[0];
  }

  #resolveObject(
    expr: ts.Expression,
    what: string,
  ): Map<string, ts.Expression> {
    const target = this.#resolve(expr);
    if (target.type !== 'node' || !ts.isObjectLiteralExpression(target.node)) {
      this.#fail(`${what} must be an object literal`, expr);
    }
    return this.#readObject(target.node, what);
  }

  /** Reads a map of route refs, keyed by name, with the identity of each. */
  #readRefs(expr: ts.Expression, what: string): Map<string, string> {
    const refs = new Map<string, string>();
    for (const [name, value] of this.#resolveObject(expr, what)) {
      const target = this.#resolve(value);
      refs.set(
        name,
        target.type === 'node' ? target.key : `${target.module}#${target.name}`,
      );
    }
    return refs;
  }

  /** Returns the key of the value that an expression refers to. */
  #keyOfValue(expr: ts.Expression): string {
    const target = this.#resolve(expr);
    return target.type === 'node'
      ? target.key
      : `${target.module}#${target.name}`;
  }

  /** Reads the plugin or module that is the default export of an entry. */
  readFeature(path: string): FeatureInfo | { skipped: string } {
    const sourceFile = this.#program.getSourceFile(path);
    if (!sourceFile) {
      return { skipped: `the entry point ${path} could not be read` };
    }
    const moduleSymbol = this.#checker.getSymbolAtLocation(sourceFile);
    const defaultSymbol =
      moduleSymbol &&
      this.#checker
        .getExportsOfModule(moduleSymbol)
        .find(symbol => symbol.escapedName === 'default');
    if (!defaultSymbol) {
      return { skipped: 'the entry point has no default export' };
    }

    try {
      const target = this.#resolveSymbol(defaultSymbol, sourceFile, 0);
      const call = target.type === 'node' ? target.node : undefined;
      const callee =
        call && ts.isCallExpression(call)
          ? this.#resolve(call.expression)
          : undefined;
      if (
        !call ||
        !ts.isCallExpression(call) ||
        callee?.type !== 'external' ||
        callee.module !== FRONTEND_PLUGIN_API ||
        !['createFrontendPlugin', 'createFrontendModule'].includes(callee.name)
      ) {
        return {
          skipped: `the default export is not a direct call to createFrontendPlugin or createFrontendModule from ${FRONTEND_PLUGIN_API}`,
        };
      }
      const [optionsArg] = call.arguments;
      if (!optionsArg) {
        this.#fail(`${callee.name} is called without options`, call);
      }
      const options = this.#resolveObject(optionsArg, 'the plugin options');

      const pluginIdExpr = options.get('pluginId');
      if (!pluginIdExpr) {
        this.#fail('the plugin options have no pluginId', optionsArg);
      }
      const info: FeatureInfo = {
        type: callee.name === 'createFrontendPlugin' ? 'plugin' : 'module',
        pluginId: this.#evaluateString(pluginIdExpr, 'the plugin ID'),
        routes: new Map(),
        externalRoutes: new Map(),
        extensions: [],
      };

      for (const [name, value] of options) {
        if (name === 'pluginId' || IGNORED_PLUGIN_OPTIONS.includes(name)) {
          continue;
        } else if (name === 'title') {
          info.title = this.#evaluateString(value, 'the plugin title');
        } else if (name === 'routes') {
          info.routes = this.#readRefs(value, 'the plugin routes');
        } else if (name === 'externalRoutes') {
          info.externalRoutes = this.#readRefs(
            value,
            'the plugin external routes',
          );
        } else if (name === 'if') {
          info.ifNode = value;
        } else if (name === 'extensions') {
          const list = this.#resolve(value);
          if (list.type !== 'node' || !ts.isArrayLiteralExpression(list.node)) {
            this.#fail('the plugin extensions must be an array literal', value);
          }
          for (const element of list.node.elements) {
            if (ts.isSpreadElement(element)) {
              this.#fail(
                'the plugin extensions must not use spread syntax',
                element,
              );
            }
            const resolved = this.#resolve(element);
            if (resolved.type !== 'node') {
              this.#fail(
                `the extension is imported from '${resolved.module}', so it can't be read`,
                element,
              );
            }
            info.extensions.push({ node: resolved.node });
          }
        } else {
          this.#fail(`the plugin option '${name}' is not supported`, value);
        }
      }
      return info;
    } catch (error) {
      if (error instanceof AnalysisError) {
        return { skipped: error.message };
      }
      throw error;
    }
  }

  /** Reads the call that creates an extension and its blueprint, if any. */
  #readExtensionCall(node: ts.Expression) {
    if (!ts.isCallExpression(node)) {
      this.#fail('the extension is not created by a call', node);
    }
    const callee = unwrap(node.expression);
    const [optionsArg] = node.arguments;
    if (!optionsArg) {
      this.#fail('the extension is created without options', node);
    }
    // The options are read once the call is known to be supported, since
    // reading fails for options with functions
    const readOptions = () =>
      this.#resolveObject(optionsArg, 'the extension options');
    if (ts.isPropertyAccessExpression(callee)) {
      return {
        call: node,
        method: callee.name.text,
        blueprint: this.#resolve(callee.expression),
        blueprintName: callee.expression.getText(),
        optionsArg,
        readOptions,
      };
    }
    return {
      call: node,
      method: undefined,
      blueprint: this.#resolve(callee),
      blueprintName: callee.getText(),
      optionsArg,
      readOptions,
    };
  }

  #readAttachTo(
    value: unknown,
    pluginId: string,
    node: ts.Node,
  ): FrontendExtensionManifest['attachTo'] {
    const readSpec = (spec: unknown): AttachTo => {
      if (isPlainObject(spec) && typeof spec.input === 'string') {
        if (typeof spec.id === 'string') {
          return { id: spec.id, input: spec.input };
        }
        const relative = spec.relative;
        if (
          isPlainObject(relative) &&
          (relative.kind === undefined || typeof relative.kind === 'string') &&
          (relative.name === undefined || typeof relative.name === 'string')
        ) {
          return {
            id: extensionId(
              relative.kind as string | undefined,
              pluginId,
              relative.name as string | undefined,
            ),
            input: spec.input,
          };
        }
      }
      return this.#fail(
        'the attachment point must be an object with an id or a relative extension, and an input',
        node,
      );
    };
    return Array.isArray(value) ? value.map(readSpec) : readSpec(value);
  }

  /** Reads an extension of a plugin that is to be deferred. */
  #readExtension(
    extension: FeatureInfo['extensions'][number],
    info: FeatureInfo,
  ): FrontendExtensionManifest {
    const { pluginId } = info;
    const { method, blueprint, blueprintName, optionsArg, readOptions, call } =
      this.#readExtensionCall(extension.node);
    // APIs are created when the app starts, so a plugin that provides one is
    // always loaded with the app.
    if (
      blueprint.type === 'external' &&
      blueprint.module === FRONTEND_PLUGIN_API &&
      blueprint.name === 'ApiBlueprint'
    ) {
      this.#fail(
        'the plugin provides an API, and plugins that provide APIs are loaded with the app',
        call,
      );
    }
    const support =
      blueprint.type === 'external' && blueprint.module === FRONTEND_PLUGIN_API
        ? CORE_BLUEPRINTS[blueprint.name]
        : undefined;
    if (!method || !support) {
      this.#fail(
        `the extension is created with '${blueprintName}${
          method ? `.${method}` : ''
        }', but only extensions made with ${Object.keys(CORE_BLUEPRINTS).join(
          ', ',
        )} can be deferred`,
        call,
      );
    }
    const withOverrides =
      method === 'makeWithOverrides' && support.type === 'page';
    if (method !== 'make' && !withOverrides) {
      this.#fail(
        `the extension is created with '${blueprintName}.${method}', but only '${blueprintName}.make' can be deferred`,
        call,
      );
    }
    const options = withOverrides
      ? this.#readOverrideOptions(optionsArg)
      : readOptions();
    const allowedOptions = withOverrides
      ? MAKE_WITH_OVERRIDES_OPTIONS
      : MAKE_OPTIONS;
    for (const [name, value] of options) {
      if (!allowedOptions.includes(name)) {
        this.#fail(`the extension option '${name}' is not supported`, value);
      }
    }
    const ifExpr = options.get('if');
    if (ifExpr) {
      this.#fail(`the extension uses an 'if' predicate`, ifExpr);
    }

    const nameExpr = options.get('name');
    const name = nameExpr
      ? this.#evaluateString(nameExpr, 'the extension name')
      : undefined;
    const disabledExpr = options.get('disabled');
    const disabled = disabledExpr
      ? this.#evaluate(disabledExpr, 'the disabled option')
      : false;
    if (typeof disabled !== 'boolean') {
      this.#fail('the disabled option must be a boolean', disabledExpr!);
    }
    const attachToExpr = options.get('attachTo');
    const attachTo = this.#readAttachTo(
      attachToExpr
        ? this.#evaluate(attachToExpr, 'the attachment point')
        : support.attachTo,
      pluginId,
      attachToExpr ?? call,
    );

    const result: FrontendExtensionManifest = {
      id: extensionId(support.kind, pluginId, name),
      kind: support.kind,
      attachTo,
      disabled,
    };

    const factoryExpr = options.get('factory');
    const paramsExpr = withOverrides
      ? factoryExpr && this.#readOriginalFactoryParams(factoryExpr)
      : options.get('params');
    if (!paramsExpr) {
      this.#fail(
        withOverrides
          ? 'the extension has no factory'
          : 'the extension has no params',
        call,
      );
    }
    const params = this.#resolveObject(paramsExpr, 'the extension params');
    const readString = (key: string, required: boolean) => {
      const value = params.get(key);
      if (!value) {
        if (required) {
          this.#fail(`the '${key}' param is missing`, paramsExpr);
        }
        return undefined;
      }
      return this.#evaluateString(value, `the '${key}' param`);
    };
    const routeRefExpr = params.get('routeRef');
    const routeRefKey = routeRefExpr && this.#keyOfValue(routeRefExpr);
    const routeRefName = routeRefKey
      ? Array.from(info.routes).find(([, key]) => key === routeRefKey)?.[0]
      : undefined;

    if (support.type === 'page') {
      const title = readString('title', false);
      return {
        ...result,
        page: {
          path: readString('path', true)!,
          ...(title !== undefined ? { title } : {}),
          ...(routeRefName ? { routeRefName } : {}),
        },
      };
    }

    // A sub-page, which renders an element in its parent page
    if (routeRefExpr && !routeRefName) {
      this.#fail(
        `the 'routeRef' param is not one of the plugin routes`,
        routeRefExpr,
      );
    }
    const iconExpr = params.get('icon');
    if (iconExpr) {
      this.#fail(
        `the 'icon' param is an element, which can't be stored in a manifest`,
        iconExpr,
      );
    }
    return {
      ...result,
      element: {
        data: {
          'core.routing.path': readString('path', true),
          'core.title': readString('title', true),
        },
        ...(routeRefName ? { routeRefName } : {}),
      },
    };
  }

  createManifest(info: FeatureInfo): FrontendFeatureManifest {
    const manifest: FrontendFeatureManifest = {
      manifestVersion: FRONTEND_MANIFEST_VERSION,
      type: info.type,
      pluginId: info.pluginId,
      ...(info.title !== undefined ? { title: info.title } : {}),
      deferrable: false,
      routes: Array.from(info.routes.keys()),
      externalRoutes: Array.from(info.externalRoutes.keys()),
      extensions: [],
    };
    if (info.type === 'module') {
      return { ...manifest, notDeferrableReason: 'modules are never deferred' };
    }

    try {
      if (info.ifNode) {
        this.#fail(`the plugin uses an 'if' predicate`, info.ifNode);
      }
      manifest.extensions = info.extensions.map(extension =>
        this.#readExtension(extension, info),
      );
    } catch (error) {
      if (error instanceof AnalysisError) {
        return { ...manifest, notDeferrableReason: error.message };
      }
      throw error;
    }

    const reason = findNotDeferrableReason(manifest.extensions);
    return reason
      ? { ...manifest, notDeferrableReason: reason }
      : { ...manifest, deferrable: true };
  }
}

/** Checks the rules for deferring a plugin, given its extensions. */
function findNotDeferrableReason(
  extensions: FrontendExtensionManifest[],
): string | undefined {
  if (extensions.length === 0) {
    return 'the plugin has no extensions';
  }
  for (const extension of extensions) {
    if (extension.page) {
      if (
        !isAttachedTo(extension.attachTo, {
          id: 'app/routes',
          input: 'routes',
        })
      ) {
        return `the page '${extension.id}' does not attach to app/routes`;
      }
    } else if (Array.isArray(extension.attachTo)) {
      return `the extension '${extension.id}' attaches to more than one extension`;
    }
  }
  // Only rendering a page or element loads a deferred plugin, so a plugin
  // without one would never be loaded.
  if (!extensions.some(e => e.page || e.element)) {
    return 'the plugin has no page or element that would load it';
  }
  return undefined;
}

/**
 * Analyzes the source code of a frontend plugin package without running it,
 * and creates a manifest for each of its entry points that has a plugin or
 * module as its default export.
 *
 * @remarks
 *
 * The analysis fails closed: any value that can't be read as a literal, or
 * any extension that isn't created in a supported way, makes the plugin not
 * deferrable, with the reason and source location in the manifest.
 */
export function analyzeFrontendPackage(options: {
  /** The directory of the package. */
  packageDir: string;
  /**
   * The source entry points of the package, for example
   * `{ mount: './alpha', path: 'src/alpha.ts' }`.
   */
  entryPoints: Array<{ mount: string; path: string }>;
}): FrontendPackageAnalysis {
  const entryPoints = options.entryPoints
    .filter(entry => DEFERRABLE_ENTRY_POINTS.includes(entry.mount))
    .map(entry => ({
      ...entry,
      file: resolvePath(options.packageDir, entry.path),
    }))
    .filter(entry => getScriptExtension(entry.file));

  const analyzer = new PackageAnalyzer(
    options.packageDir,
    entryPoints.map(entry => entry.file),
  );

  const result: FrontendPackageAnalysis = { entryPoints: {} };
  for (const entry of entryPoints) {
    const info = analyzer.readFeature(entry.file);
    result.entryPoints[entry.mount] =
      'skipped' in info ? info : { manifest: analyzer.createManifest(info) };
  }
  return result;
}
