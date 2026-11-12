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

import { readFileSync, statSync } from 'node:fs';
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
  ManifestValueType,
} from './types';
import {
  AnalysisError,
  ELEMENT_VALUE,
  FactoryEvaluator,
  FactoryOutputs,
  FactoryValue,
  describeValue,
  isSameValue,
} from './evaluateFactory';

const FRONTEND_PLUGIN_API = '@backstage/frontend-plugin-api';

type AttachTo = { id: string; input: string };

/** The parts of a blueprint that are read from its source code. */
type BlueprintInfo = {
  kind: string;
  attachTo: unknown;
  /** The factory of the blueprint, which is evaluated for each extension */
  factory?: ts.FunctionLikeDeclaration;
  /** The keys of the config schema of the blueprint, if they can be read */
  configKeys: string[];
  /** The analyzer of the program that the blueprint is part of */
  analyzer: PackageAnalyzer;
};

/** How the config of an extension maps to the outputs of its stand-in. */
type ConfigMapping = {
  [configKey: string]: { dataRefId: string; type: ManifestValueType };
};

/** Resolves an import of another package to a file. */
export type ModuleResolver = (
  specifier: string,
  fromDir: string,
) => string | undefined;

const ROUTE_REF_DATA_ID = 'core.routing.ref';
const ROUTE_PATH_DATA_ID = 'core.routing.path';
const TITLE_DATA_ID = 'core.title';
const ELEMENT_DATA_ID = 'core.reactElement';
const APP_ROUTES = { id: 'app/routes', input: 'routes' };

// The config that the stand-in of a page applies, since the app creates it
// with PageBlueprint, keyed by the output that each key maps to
const PAGE_CONFIG: { [dataRefId: string]: string } = {
  [ROUTE_PATH_DATA_ID]: 'path',
  [TITLE_DATA_ID]: 'title',
};

// The values of the context that a factory is called with, other than the
// config. They are only known when the app runs.
const FACTORY_CONTEXT: { [key: string]: FactoryValue } = {
  node: { type: 'opaque', reason: 'the app node', typeOf: 'object' },
  inputs: { type: 'opaque', reason: 'the inputs of the extension' },
  apis: { type: 'opaque', reason: 'the APIs of the app', typeOf: 'object' },
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

const API_MAKE_OPTIONS = ['name', 'disabled', 'params'];
const API_PARAMS = ['api', 'deps', 'factory'];

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

/**
 * Creates and keeps the analyzers of other packages, which are used to read
 * the blueprints and API refs that a plugin imports.
 */
class AnalysisContext {
  readonly #analyzers = new Map<string, PackageAnalyzer>();
  readonly #resolveModule: ModuleResolver;

  constructor(resolveModule: ModuleResolver) {
    this.#resolveModule = resolveModule;
  }

  /** Returns the analyzer for the file that an import resolves to. */
  forImport(
    specifier: string,
    from: ts.Node,
  ): { analyzer: PackageAnalyzer; file: string } | undefined {
    const file = this.#resolveModule(
      specifier,
      dirname(from.getSourceFile().fileName),
    );
    if (!file || !getScriptExtension(file)) {
      return undefined;
    }
    let analyzer = this.#analyzers.get(file);
    if (!analyzer) {
      const packageRoot = findPackageRoot(file);
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      analyzer = new PackageAnalyzer(
        packageRoot?.dir ?? dirname(file),
        [file],
        this,
        packageRoot?.name,
      );
      this.#analyzers.set(file, analyzer);
    }
    return { analyzer, file };
  }
}

/** Finds the directory and name of the package that a file is part of. */
function findPackageRoot(
  file: string,
): { dir: string; name?: string } | undefined {
  for (let dir = dirname(file); dir !== dirname(dir); dir = dirname(dir)) {
    const packageJsonPath = joinPath(dir, 'package.json');
    if (isFile(packageJsonPath)) {
      try {
        const { name } = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
        return { dir, name: typeof name === 'string' ? name : undefined };
      } catch {
        return { dir };
      }
    }
  }
  return undefined;
}

function defaultResolveModule(
  specifier: string,
  fromDir: string,
): string | undefined {
  try {
    return require.resolve(specifier, { paths: [fromDir] });
  } catch {
    return undefined;
  }
}

class PackageAnalyzer {
  readonly #packageDir: string;
  readonly #program: ts.Program;
  readonly #checker: ts.TypeChecker;
  readonly #context: AnalysisContext;
  readonly #packageName?: string;

  constructor(
    packageDir: string,
    rootNames: string[],
    context: AnalysisContext,
    packageName?: string,
  ) {
    this.#packageDir = packageDir;
    this.#packageName = packageName;
    this.#program = createProgram(rootNames);
    this.#checker = this.#program.getTypeChecker();
    this.#context = context;
  }

  #location(node: ts.Node): string {
    const sourceFile = node.getSourceFile();
    const { line } = sourceFile.getLineAndCharacterOfPosition(
      node.getStart(sourceFile),
    );
    const path = relativePath(this.#packageDir, sourceFile.fileName)
      .split(sep)
      .join('/');
    // Locations in other packages start with the name of the package
    const prefix = this.#packageName ? `${this.#packageName}/` : '';
    return `${prefix}${path}:${line + 1}`;
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
  #readOriginalFactoryParams(
    factoryExpr: ts.Expression,
    what: string = 'the factory',
  ): ts.Expression {
    const factory: ts.Node = ts.isMethodDeclaration(factoryExpr)
      ? factoryExpr
      : unwrap(factoryExpr);
    if (
      !ts.isMethodDeclaration(factory) &&
      !ts.isArrowFunction(factory) &&
      !ts.isFunctionExpression(factory)
    ) {
      this.#fail(`${what} must be a function`, factoryExpr);
    }
    if (
      (ts.isMethodDeclaration(factory) || ts.isFunctionExpression(factory)) &&
      (factory.asteriskToken || factory.modifiers?.length)
    ) {
      this.#fail(`${what} must be a plain function`, factory);
    }
    if (ts.isArrowFunction(factory) && factory.modifiers?.length) {
      this.#fail(`${what} must be a plain function`, factory);
    }
    const [originalParam] = factory.parameters;
    if (!originalParam || !ts.isIdentifier(originalParam.name)) {
      this.#fail(
        `${what} must take the function that it calls as a plain parameter`,
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
        `${what} must only return ${originalParam.name.text}(params), with no other statements or arguments`,
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

  /** Finds the value that a module exports under a name. */
  #resolveExport(file: string, name: string, from: ts.Node): Target {
    const sourceFile = this.#program.getSourceFile(file);
    const moduleSymbol =
      sourceFile && this.#checker.getSymbolAtLocation(sourceFile);
    const symbol =
      moduleSymbol &&
      this.#checker
        .getExportsOfModule(moduleSymbol)
        .find(exported => exported.escapedName === name);
    if (!sourceFile || !symbol) {
      throw new AnalysisError(
        `'${name}' is not exported by ${file}, so it can't be read (${this.#location(
          from,
        )})`,
      );
    }
    return this.#resolveSymbol(symbol, sourceFile, 0);
  }

  /** Reads a blueprint that another package exports. */
  readExportedBlueprint(file: string, name: string, from: ts.Node) {
    const target = this.#resolveExport(file, name, from);
    if (target.type === 'external') {
      return this.#readBlueprint(target, name);
    }
    return this.#readBlueprintCall(target.node, name);
  }

  /** Reads the ID of an API ref that another package exports. */
  readExportedApiRefId(file: string, name: string, from: ts.Node) {
    const target = this.#resolveExport(file, name, from);
    if (target.type === 'external') {
      return this.#readApiRefId(target, name);
    }
    return this.#readRefCall(target.node, name, 'an API ref');
  }

  #forImport(target: Extract<Target, { type: 'external' }>, what: string) {
    const imported = this.#context.forImport(target.module, target.from);
    if (!imported) {
      this.#fail(
        `${what} is imported from '${target.module}', which can't be resolved`,
        target.from,
      );
    }
    return imported;
  }

  /**
   * Follows identifiers, imports of other packages and properties of object
   * literals to the expression that a value is created with, along with the
   * analyzer of the program that the expression is part of.
   */
  #resolveAcross(
    expr: ts.Expression,
    depth = 0,
  ): { analyzer: PackageAnalyzer; node: ts.Expression } {
    if (depth > 20) {
      this.#fail('the value is too deeply nested to be read', expr);
    }
    return this.#resolveTargetAcross(this.#resolve(expr), depth);
  }

  #resolveTargetAcross(
    target: Target,
    depth: number,
  ): { analyzer: PackageAnalyzer; node: ts.Expression } {
    if (target.type === 'external') {
      const { analyzer, file } = this.#forImport(target, `'${target.name}'`);
      return analyzer.#resolveTargetAcross(
        analyzer.#resolveExport(file, target.name, target.from),
        depth + 1,
      );
    }
    const node = target.node;
    if (ts.isPropertyAccessExpression(node)) {
      const object = this.#resolveAcross(node.expression, depth + 1);
      if (ts.isObjectLiteralExpression(object.node)) {
        const value = object.analyzer
          .#readObject(object.node, `'${node.expression.getText()}'`)
          .get(node.name.text);
        if (value) {
          return object.analyzer.#resolveAcross(value, depth + 1);
        }
      }
    }
    return { analyzer: this, node };
  }

  #readBlueprint(target: Target, name: string): BlueprintInfo {
    if (target.type === 'node') {
      return this.#readBlueprintCall(target.node, name);
    }
    const { analyzer, file } = this.#forImport(
      target,
      `the '${name}' blueprint`,
    );
    return analyzer.readExportedBlueprint(file, target.name, target.from);
  }

  /**
   * Reads the kind, default attachment point, config keys and factory of a
   * blueprint from the options of its createExtensionBlueprint call.
   */
  #readBlueprintCall(node: ts.Node, name: string): BlueprintInfo {
    const call = ts.isCallExpression(node) ? node : undefined;
    const callee = call && unwrap(call.expression);
    let calleeName: string | undefined;
    if (callee && ts.isIdentifier(callee)) {
      calleeName = callee.text;
    } else if (callee && ts.isPropertyAccessExpression(callee)) {
      calleeName = callee.name.text;
    }
    if (!call || calleeName !== 'createExtensionBlueprint') {
      this.#fail(
        `the '${name}' blueprint is not created by a call to createExtensionBlueprint`,
        node,
      );
    }
    const [optionsArg] = call.arguments;
    const options = optionsArg && this.#resolve(optionsArg);
    if (
      !options ||
      options.type !== 'node' ||
      !ts.isObjectLiteralExpression(options.node)
    ) {
      this.#fail(
        `the options of the '${name}' blueprint must be an object literal`,
        call,
      );
    }
    const properties = new Map<string, ts.Expression>();
    let factory: ts.FunctionLikeDeclaration | undefined;
    for (const property of options.node.properties) {
      if (ts.isSpreadAssignment(property)) {
        this.#fail(
          `the options of the '${name}' blueprint must not use spread syntax`,
          property,
        );
      }
      if (
        ts.isMethodDeclaration(property) &&
        ts.isIdentifier(property.name) &&
        property.name.text === 'factory'
      ) {
        factory = property;
      } else if (
        ts.isPropertyAssignment(property) &&
        (ts.isIdentifier(property.name) ||
          ts.isStringLiteralLike(property.name))
      ) {
        properties.set(property.name.text, property.initializer);
      } else if (ts.isShorthandPropertyAssignment(property)) {
        properties.set(property.name.text, property.name);
      }
    }
    const factoryExpr = properties.get('factory');
    if (factoryExpr) {
      const resolved = this.#resolve(factoryExpr);
      if (
        resolved.type === 'node' &&
        (ts.isFunctionExpression(resolved.node) ||
          ts.isArrowFunction(resolved.node))
      ) {
        factory = resolved.node;
      }
    }

    // The keys of the config schema are read if it is an object literal.
    // Config with other keys loads the plugin when the app starts.
    let configKeys = new Array<string>();
    const configSchemaExpr = properties.get('configSchema');
    const configSchema = configSchemaExpr && this.#resolve(configSchemaExpr);
    if (
      configSchema?.type === 'node' &&
      ts.isObjectLiteralExpression(configSchema.node)
    ) {
      configKeys = configSchema.node.properties.flatMap(property =>
        property.name &&
        (ts.isIdentifier(property.name) ||
          ts.isStringLiteralLike(property.name))
          ? [property.name.text]
          : [],
      );
    }

    const kindExpr = properties.get('kind');
    const attachToExpr = properties.get('attachTo');
    if (!kindExpr || !attachToExpr) {
      this.#fail(`the '${name}' blueprint has no kind or attachTo`, call);
    }
    return {
      kind: this.#evaluateString(
        kindExpr,
        `the kind of the '${name}' blueprint`,
      ),
      attachTo: this.#evaluate(
        attachToExpr,
        `the attachment point of the '${name}' blueprint`,
      ),
      factory,
      configKeys,
      analyzer: this,
    };
  }

  /** Runs the factory of a blueprint of this program without running it. */
  evaluateFactory(factory: ts.FunctionLikeDeclaration, args: FactoryValue[]) {
    return FactoryEvaluator.run(
      {
        location: node => this.#location(node),
        readDataRefId: callee => {
          const { analyzer, node } = this.#resolveAcross(callee);
          return analyzer.#readRefCall(
            node,
            `'${callee.getText()}'`,
            'an extension data ref',
          );
        },
        resolveGenerator: callee => this.#resolveGenerator(callee),
      },
      factory,
      args,
    );
  }

  /** Finds the generator function that a factory delegates to. */
  #resolveGenerator(callee: ts.Expression): ts.FunctionLikeDeclaration {
    const node = unwrap(callee);
    let symbol = ts.isIdentifier(node)
      ? this.#checker.getSymbolAtLocation(node)
      : undefined;
    for (let i = 0; symbol && symbol.flags & ts.SymbolFlags.Alias; i++) {
      const next = this.#checker.getImmediateAliasedSymbol(symbol);
      symbol = i > 50 || !next?.declarations?.length ? undefined : next;
    }
    const declaration = symbol?.valueDeclaration;
    let fn: ts.Node | undefined = declaration;
    if (declaration && ts.isVariableDeclaration(declaration)) {
      fn = declaration.initializer && unwrap(declaration.initializer);
    }
    if (
      fn &&
      (ts.isFunctionDeclaration(fn) || ts.isFunctionExpression(fn)) &&
      fn.asteriskToken &&
      fn.body
    ) {
      return fn;
    }
    return this.#fail(
      `the factory delegates to '${callee.getText()}', which is not a generator function that can be read`,
      callee,
    );
  }

  #readApiRefId(target: Target, what: string): string {
    if (target.type === 'node') {
      return this.#readRefCall(target.node, what, 'an API ref');
    }
    const { analyzer, file } = this.#forImport(target, what);
    return analyzer.readExportedApiRefId(file, target.name, target.from);
  }

  /**
   * Reads the ID of an API ref or extension data ref, which is created with
   * either `createApiRef({ id })` or `create...Ref().with({ id })`.
   */
  #readRefCall(node: ts.Node, what: string, kind: string): string {
    let optionsArg: ts.Expression | undefined;
    if (ts.isCallExpression(node)) {
      const callee = unwrap(node.expression);
      if (
        ts.isPropertyAccessExpression(callee) &&
        callee.name.text === 'with' &&
        ts.isCallExpression(unwrap(callee.expression))
      ) {
        optionsArg = node.arguments[0];
      } else if (
        (ts.isIdentifier(callee) && callee.text === 'createApiRef') ||
        (ts.isPropertyAccessExpression(callee) &&
          callee.name.text === 'createApiRef')
      ) {
        optionsArg = node.arguments[0];
      }
    }
    if (!optionsArg) {
      this.#fail(`${what} is not ${kind} with an ID that can be read`, node);
    }
    const idExpr = this.#resolveObject(
      optionsArg,
      `the options of ${what}`,
    ).get('id');
    if (!idExpr) {
      this.#fail(`${what} has no ID`, optionsArg);
    }
    return this.#evaluateString(idExpr, `the ID of ${what}`);
  }

  #readCommonOptions(
    options: Map<string, ts.Expression>,
    allowedOptions: string[],
  ) {
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
    return { name, disabled };
  }

  /**
   * Reads an API extension. The manifest only records the IDs of the API
   * ref and of its dependencies, so that the app can register the API with a
   * factory that loads the plugin when the API is first used.
   */
  #readApiExtension(
    options: Map<string, ts.Expression>,
    blueprint: BlueprintInfo,
    info: FeatureInfo,
    call: ts.Node,
  ): FrontendExtensionManifest {
    const { name, disabled } = this.#readCommonOptions(
      options,
      API_MAKE_OPTIONS,
    );
    const paramsExpr = options.get('params');
    if (!paramsExpr) {
      this.#fail('the extension has no params', call);
    }
    const target = this.#resolve(paramsExpr);
    const paramsObjectExpr =
      target.type === 'node' && ts.isObjectLiteralExpression(target.node)
        ? target.node
        : this.#readOriginalFactoryParams(paramsExpr, 'the params callback');
    const params = this.#resolveObject(paramsObjectExpr, 'the API params');
    for (const [key, value] of params) {
      if (!API_PARAMS.includes(key)) {
        this.#fail(`the API param '${key}' is not supported`, value);
      }
    }
    const apiExpr = params.get('api');
    if (!apiExpr) {
      this.#fail('the API params have no api', paramsObjectExpr);
    }
    const deps: { [name: string]: string } = {};
    const depsExpr = params.get('deps');
    if (depsExpr) {
      for (const [depName, depExpr] of this.#resolveObject(
        depsExpr,
        'the API deps',
      )) {
        deps[depName] = this.#readApiRefId(
          this.#resolve(depExpr),
          `the '${depName}' dependency`,
        );
      }
    }
    return {
      id: extensionId(blueprint.kind, info.pluginId, name),
      kind: blueprint.kind,
      attachTo: this.#readAttachTo(blueprint.attachTo, info.pluginId, call),
      disabled,
      api: {
        apiRefId: this.#readApiRefId(this.#resolve(apiExpr), 'the API ref'),
        deps,
      },
    };
  }

  /**
   * Reads the value of a param. A param that isn't a literal is still
   * passed to the factory, since it might only be used for the element.
   */
  #readParam(key: string, expr: ts.Expression): FactoryValue {
    try {
      return {
        type: 'known',
        value: this.#evaluate(expr, `the '${key}' param`),
      };
    } catch (error) {
      if (!(error instanceof AnalysisError)) {
        throw error;
      }
      return {
        type: 'opaque',
        reason: error.message,
        typeOf: this.#typeOfParam(expr),
        source: expr,
      };
    }
  }

  /** Finds what `typeof` returns for a param, if it can be known. */
  #typeOfParam(expr: ts.Expression): string | undefined {
    let node: ts.Expression = unwrap(expr);
    try {
      const target = this.#resolve(expr);
      if (target.type === 'node') {
        node = target.node;
      }
    } catch (error) {
      if (!(error instanceof AnalysisError)) {
        throw error;
      }
    }
    if (ts.isArrowFunction(node) || ts.isFunctionExpression(node)) {
      return 'function';
    }
    if (
      ts.isObjectLiteralExpression(node) ||
      ts.isArrayLiteralExpression(node) ||
      ts.isJsxElement(node) ||
      ts.isJsxSelfClosingElement(node) ||
      ts.isJsxFragment(node)
    ) {
      return 'object';
    }
    const type = this.#checker.getTypeAtLocation(expr);
    if (type.flags & (ts.TypeFlags.Any | ts.TypeFlags.Unknown)) {
      return undefined;
    }
    if (type.getCallSignatures().length > 0) {
      return 'function';
    }
    if (type.flags & ts.TypeFlags.StringLike) {
      return 'string';
    }
    if (type.flags & ts.TypeFlags.NumberLike) {
      return 'number';
    }
    if (type.flags & ts.TypeFlags.BooleanLike) {
      return 'boolean';
    }
    if (type.flags & ts.TypeFlags.Object) {
      return 'object';
    }
    return undefined;
  }

  /**
   * Finds the outputs of an extension by evaluating the factory of its
   * blueprint with its params, first without config, and then with a value
   * of each config key on its own. A key that doesn't change the outputs is
   * only used for the element, and a key that sets one output to its value
   * is applied by the stand-in of the extension. Config with any other key
   * loads the plugin when the app starts.
   */
  #readOutputs(
    blueprint: BlueprintInfo,
    blueprintName: string,
    params: FactoryValue,
    extraConfigKeys: string[],
  ) {
    const factory = blueprint.factory;
    if (!factory) {
      throw new AnalysisError(
        `the factory of the '${blueprintName}' blueprint can't be read`,
      );
    }
    const readKeys = new Set<string>();
    const run = (config: Map<string, FactoryValue>) => {
      const configValue: FactoryValue = {
        type: 'record',
        get: key => {
          readKeys.add(key);
          return config.get(key) ?? { type: 'known', value: undefined };
        },
      };
      const context: FactoryValue = {
        type: 'record',
        get: key =>
          key === 'config'
            ? configValue
            : FACTORY_CONTEXT[key] ?? {
                type: 'unknown',
                reason: `the '${key}' value of the factory context`,
              },
      };
      return blueprint.analyzer.evaluateFactory(factory, [params, context]);
    };
    const changes = (
      base: FactoryOutputs,
      outputs: FactoryOutputs,
    ): Array<[string, FactoryValue | undefined]> =>
      Array.from(new Set([...base.keys(), ...outputs.keys()]))
        .filter(id => {
          const a = base.get(id);
          const b = outputs.get(id);
          return !a || !b || !isSameValue(a, b);
        })
        .map(id => [id, outputs.get(id)]);

    const base = run(new Map());
    if ('failure' in base) {
      throw new AnalysisError(
        `the factory of the '${blueprintName}' blueprint can't be read for the extension: ${base.failure}`,
      );
    }

    const configOutputs: ConfigMapping = {};
    const loadedConfig = new Array<string>();
    const keys = new Set([
      ...blueprint.configKeys,
      ...readKeys,
      ...extraConfigKeys,
    ]);
    for (const key of keys) {
      const values: Array<[FactoryValue, ManifestValueType?]> = [
        [{ type: 'config', key, valueType: 'string' }, 'string'],
        [{ type: 'config', key, valueType: 'number' }, 'number'],
        [{ type: 'config', key, valueType: 'object' }],
        [{ type: 'known', value: true }],
        [{ type: 'known', value: false }],
      ];
      let loaded = true;
      const mappings = new Array<{
        dataRefId: string;
        type: ManifestValueType;
      }>();
      for (const [value, type] of values) {
        const result = run(new Map([[key, value]]));
        const changed =
          'failure' in result ? [] : changes(base.outputs, result.outputs);
        if ('failure' in result || changed.length > 0) {
          loaded = false;
        }
        const [change] = changed;
        if (
          type &&
          changed.length === 1 &&
          change[1] &&
          isSameValue(change[1], value)
        ) {
          mappings.push({ dataRefId: change[0], type });
        }
      }
      if (loaded) {
        loadedConfig.push(key);
        continue;
      }
      // A key can map to an output for values of more than one type, in
      // which case the type of the output without config is preferred
      const [first] = mappings;
      if (first) {
        const output = base.outputs.get(first.dataRefId);
        const outputType =
          output?.type === 'known' ? typeof output.value : undefined;
        configOutputs[key] =
          mappings.find(
            m => m.dataRefId === first.dataRefId && m.type === outputType,
          ) ?? first;
      }
    }

    // The keys are evaluated one at a time, so the keys that the stand-in
    // applies are checked together as well
    const mapped = Object.entries(configOutputs);
    if (mapped.length > 1) {
      const combined = run(
        new Map(
          mapped.map(([key, { type }]) => [
            key,
            { type: 'config', key, valueType: type as 'string' | 'number' },
          ]),
        ),
      );
      const expected = new Map(base.outputs);
      for (const [key, { dataRefId, type }] of mapped) {
        expected.set(dataRefId, {
          type: 'config',
          key,
          valueType: type as 'string' | 'number',
        });
      }
      if (
        'failure' in combined ||
        changes(expected, combined.outputs).length > 0
      ) {
        for (const [key] of mapped) {
          delete configOutputs[key];
        }
      }
    }

    return { outputs: base.outputs, configOutputs, loadedConfig };
  }

  /** Reads an extension of a plugin that is to be deferred. */
  #readExtension(
    extension: FeatureInfo['extensions'][number],
    info: FeatureInfo,
  ): FrontendExtensionManifest {
    const { pluginId } = info;
    const { method, blueprint, blueprintName, optionsArg, readOptions, call } =
      this.#readExtensionCall(extension.node);
    if (!method || !['make', 'makeWithOverrides'].includes(method)) {
      this.#fail(
        `the extension is created with '${blueprintName}${
          method ? `.${method}` : ''
        }', but only extensions made with the make or makeWithOverrides method of a blueprint can be deferred`,
        call,
      );
    }
    const blueprintInfo = this.#readBlueprint(blueprint, blueprintName);

    if (
      blueprint.type === 'external' &&
      blueprint.module === FRONTEND_PLUGIN_API &&
      blueprint.name === 'ApiBlueprint'
    ) {
      if (method !== 'make') {
        this.#fail(
          `the API is created with 'ApiBlueprint.${method}', but only 'ApiBlueprint.make' can be deferred`,
          call,
        );
      }
      return this.#readApiExtension(readOptions(), blueprintInfo, info, call);
    }

    const withOverrides = method === 'makeWithOverrides';
    const options = withOverrides
      ? this.#readOverrideOptions(optionsArg)
      : readOptions();
    const { name, disabled } = this.#readCommonOptions(
      options,
      withOverrides ? MAKE_WITH_OVERRIDES_OPTIONS : MAKE_OPTIONS,
    );
    const attachToExpr = options.get('attachTo');
    const attachTo = this.#readAttachTo(
      attachToExpr
        ? this.#evaluate(attachToExpr, 'the attachment point')
        : blueprintInfo.attachTo,
      pluginId,
      attachToExpr ?? call,
    );

    const overrideConfigKeys = new Array<string>();
    const configSchemaExpr = options.get('configSchema');
    if (configSchemaExpr) {
      overrideConfigKeys.push(
        ...this.#resolveObject(configSchemaExpr, 'the config schema').keys(),
      );
    }

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
    const paramValues = new Map<string, FactoryValue>();
    for (const [key, value] of this.#resolveObject(
      paramsExpr,
      'the extension params',
    )) {
      paramValues.set(key, this.#readParam(key, value));
    }
    const { outputs, configOutputs, loadedConfig } = this.#readOutputs(
      blueprintInfo,
      blueprintName,
      {
        type: 'record',
        get: key => paramValues.get(key) ?? { type: 'known', value: undefined },
      },
      overrideConfigKeys,
    );

    if (outputs.get(ELEMENT_DATA_ID) !== ELEMENT_VALUE) {
      this.#fail(
        `the extension doesn't output an element that would load the plugin`,
        call,
      );
    }
    const isPage = isAttachedTo(attachTo, APP_ROUTES);
    const data: { [dataRefId: string]: unknown } = {};
    let routeRefName: string | undefined;
    for (const [id, value] of outputs) {
      if (id === ELEMENT_DATA_ID) {
        continue;
      }
      if (
        id === ROUTE_REF_DATA_ID &&
        value.type === 'opaque' &&
        value.source &&
        ts.isExpression(value.source as ts.Node)
      ) {
        const key = this.#keyOfValue(value.source as ts.Expression);
        routeRefName = Array.from(info.routes).find(
          ([, routeKey]) => routeKey === key,
        )?.[0];
        // A page can use a route ref that isn't one of the plugin routes,
        // which the stub then doesn't output.
        if (!routeRefName && !isPage) {
          this.#fail(
            `the route ref of the extension is not one of the plugin routes`,
            value.source as ts.Node,
          );
        }
        continue;
      }
      if (value.type !== 'known') {
        throw new AnalysisError(
          `the '${id}' output of the extension can't be read without running it: ${describeValue(
            value,
          )}`,
        );
      }
      if (value.value !== undefined) {
        data[id] = value.value;
      }
    }

    const result: FrontendExtensionManifest = {
      id: extensionId(blueprintInfo.kind, pluginId, name),
      kind: blueprintInfo.kind,
      attachTo,
      disabled,
    };

    // Pages that attach to app/routes are created with PageBlueprint by the
    // app, which applies their path and title config.
    if (isPage) {
      const path = data[ROUTE_PATH_DATA_ID];
      const title = data[TITLE_DATA_ID];
      if (typeof path !== 'string') {
        this.#fail('the page has no path', paramsExpr);
      }
      for (const id of Object.keys(data)) {
        if (!PAGE_CONFIG[id]) {
          this.#fail(
            `the page outputs '${id}', which the stand-in of the page can't output`,
            call,
          );
        }
      }
      for (const [key, output] of Object.entries(configOutputs)) {
        if (PAGE_CONFIG[output.dataRefId] !== key) {
          this.#fail(
            `the '${key}' config of the page sets its '${output.dataRefId}' output, which the stand-in of the page can't do`,
            call,
          );
        }
      }
      return {
        ...result,
        page: {
          path,
          ...(typeof title === 'string' ? { title } : {}),
          ...(routeRefName ? { routeRefName } : {}),
        },
      };
    }

    return {
      ...result,
      element: {
        data,
        ...(routeRefName ? { routeRefName } : {}),
        ...(Object.keys(configOutputs).length > 0 ? { configOutputs } : {}),
        ...(loadedConfig.length > 0 ? { loadedConfig } : {}),
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
    if (Array.isArray(extension.attachTo)) {
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
  /**
   * Resolves imports of other packages, which is used to read the blueprints
   * and API refs that the plugin imports. Defaults to Node module resolution.
   */
  resolveModule?: ModuleResolver;
}): FrontendPackageAnalysis {
  const entryPoints = options.entryPoints
    .map(entry => ({
      ...entry,
      file: resolvePath(options.packageDir, entry.path),
    }))
    .filter(entry => getScriptExtension(entry.file));

  const analyzer = new PackageAnalyzer(
    options.packageDir,
    entryPoints.map(entry => entry.file),
    new AnalysisContext(options.resolveModule ?? defaultResolveModule),
  );

  const result: FrontendPackageAnalysis = { entryPoints: {} };
  for (const entry of entryPoints) {
    const info = analyzer.readFeature(entry.file);
    result.entryPoints[entry.mount] =
      'skipped' in info ? info : { manifest: analyzer.createManifest(info) };
  }
  return result;
}
