/*
 * Copyright 2025 The Backstage Authors
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

// @ts-check

const { builtinModules } = require('node:module');
const getPackages = require('./getPackages');

/** @typedef {Extract<Parameters<import('oxlint/plugins-dev').RuleTester['run']>[1], {createOnce: unknown}>} OxlintRule */
/** @typedef {ReturnType<OxlintRule['createOnce']>} OxlintVisitor */
/** @typedef {'ImportDeclaration' | 'ExportAllDeclaration' | 'ExportNamedDeclaration' | 'ImportExpression' | 'CallExpression'} ImportNodeType */
/** @typedef {Parameters<NonNullable<OxlintVisitor[ImportNodeType]>>[0]} ConsideredNode */

/**
 * @callback ImportVisitor
 * @param {ConsideredNode} node
 * @param {any} imp
 */

/**
 * @param {ConsideredNode} node
 * @returns {undefined | {path: string, node: {value: string, range: [number, number]}, kind: 'type' | 'value'}}
 */
function getImportInfo(node) {
  let pathNode;

  if (node.type === 'CallExpression') {
    if (
      node.callee.type === 'Identifier' &&
      node.callee.name == 'require' &&
      node.arguments.length === 1
    ) {
      pathNode = node.arguments[0];
    }
  } else {
    pathNode = node.source;
  }

  if (pathNode?.type !== 'Literal') {
    return undefined;
  }
  if (typeof pathNode.value !== 'string') {
    return undefined;
  }

  /** @type {any} */
  const anyNode = node;
  return {
    path: pathNode.value,
    node: pathNode,
    kind: anyNode.importKind ?? anyNode.exportKind ?? 'value',
  };
}

/**
 * Classify an import using workspace package metadata.
 *
 * @param {ConsideredNode} node
 * @param {ReturnType<typeof getPackages>} packages
 */
function classifyImport(node, packages) {
  const info = getImportInfo(node);
  if (!info || !packages) {
    return undefined;
  }

  if (info.path[0] === '.') {
    return { type: 'local', ...info };
  }
  if (info.path.startsWith('directive:')) {
    return { type: 'directive', ...info };
  }

  const pathParts = info.path.split('/');
  const packageName =
    info.path[0] === '@' ? pathParts.slice(0, 2).join('/') : pathParts[0];
  const subPath =
    info.path[0] === '@'
      ? pathParts.slice(2).join('/')
      : pathParts.slice(1).join('/');
  const pkg = packages.map.get(packageName);
  if (!pkg) {
    const type =
      packageName.startsWith('node:') || builtinModules.includes(packageName)
        ? 'builtin'
        : 'external';
    return {
      type,
      kind: info.kind,
      node: info.node,
      path: subPath,
      packageName,
    };
  }

  return {
    type: 'internal',
    kind: info.kind,
    node: info.node,
    path: subPath,
    package: pkg,
    packageName,
  };
}

/**
 * Visits imports using Oxlint's per-file context.
 *
 * @param {{cwd: string}} context
 * @param {ImportVisitor} visitor
 */
module.exports = function visitImports(context, visitor) {
  /** @type {ReturnType<typeof getPackages>} */
  let packages;

  /** @param {ConsideredNode} node */
  function visit(node) {
    const imp = classifyImport(node, packages);
    if (imp) {
      visitor(node, imp);
    }
  }

  return {
    Program() {
      packages = getPackages(context.cwd);
    },
    ImportDeclaration: visit,
    ExportAllDeclaration: visit,
    ExportNamedDeclaration: visit,
    ImportExpression: visit,
    CallExpression: visit,
  };
};
