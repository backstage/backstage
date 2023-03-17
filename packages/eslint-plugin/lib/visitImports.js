/*
 * Copyright 2023 The Backstage Authors
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

const { builtinModules } = require('module');
const getPackages = require('./getPackages');

/**
 * @typedef LocalImport
 * @type {object}
 * @property {'local'} type
 * @property {'value' | 'type'} kind
 * @property {import('estree').Node} node
 * @property {string} path
 */

/**
 * @typedef ImportDirective
 * @type {object}
 * @property {'directive'} type
 * @property {'value' | 'type'} kind
 * @property {import('estree').Node} node
 * @property {string} path
 */

/**
 * @typedef InternalImport
 * @type {object}
 * @property {'internal'} type
 * @property {'value' | 'type'} kind
 * @property {import('estree').Node} node
 * @property {string} path
 * @property {import('./getPackages').ExtendedPackage} package
 * @property {string} packageName
 */

/**
 * @typedef ExternalImport
 * @type {object}
 * @property {'external'} type
 * @property {'value' | 'type'} kind
 * @property {import('estree').Node} node
 * @property {string} path
 * @property {string} packageName
 */

/**
 * @typedef BuiltinImport
 * @type {object}
 * @property {'builtin'} type
 * @property {'value' | 'type'} kind
 * @property {import('estree').Literal} node
 * @property {string} path
 * @property {string} packageName
 */

/**
 * @callback ImportVisitor
 * @param {ConsideredNode} node
 * @param {ImportDirective | LocalImport | InternalImport | ExternalImport | BuiltinImport} import
 */

/**
 * @typedef ConsideredNode
 * @type {import('estree').ImportDeclaration | import('estree').ExportAllDeclaration | import('estree').ExportNamedDeclaration | import('estree').ImportExpression | import('estree').SimpleCallExpression}
 */

/**
 * @param {ConsideredNode} node
 * @returns {undefined | {path: string, node: import('estree').Literal, kind: 'type' | 'value'}}
 */
function getImportInfo(node) {
  /** @type {import('estree').Expression | import('estree').SpreadElement | undefined | null} */
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
    kind: anyNode.importKind ?? 'value',
  };
}

/**
 * @param visitor - Visitor callback
 * @param {import('eslint').Rule.RuleContext} context
 * @param {ImportVisitor} visitor
 */
module.exports = function visitImports(context, visitor) {
  const packages = getPackages(context.getCwd());
  if (!packages) {
    return;
  }

  /**
   * @param {ConsideredNode} node
   */
  function visit(node) {
    const info = getImportInfo(node);
    if (!info) {
      return;
    }

    if (info.path[0] === '.') {
      return visitor(node, { type: 'local', ...info });
    }

    if (info.path.startsWith('directive:')) {
      return visitor(node, { type: 'directive', ...info });
    }

    const pathParts = info.path.split('/');

    // Check for match with plain name, then namespaced name
    let packageName;
    let subPath;
    if (info.path[0] === '@') {
      packageName = pathParts.slice(0, 2).join('/');
      subPath = pathParts.slice(2).join('/');
    } else {
      packageName = pathParts[0];
      subPath = pathParts.slice(1).join('/');
    }
    const pkg = packages?.map.get(packageName);
    if (!pkg) {
      if (
        packageName.startsWith('node:') ||
        builtinModules.includes(packageName)
      ) {
        return visitor(node, {
          type: 'builtin',
          kind: info.kind,
          node: info.node,
          path: subPath,
          packageName,
        });
      }

      return visitor(node, {
        type: 'external',
        kind: info.kind,
        node: info.node,
        path: subPath,
        packageName,
      });
    }

    return visitor(node, {
      type: 'internal',
      kind: info.kind,
      node: info.node,
      path: subPath,
      package: pkg,
      packageName,
    });
  }

  return {
    ImportDeclaration: visit,
    ExportAllDeclaration: visit,
    ExportNamedDeclaration: visit,
    ImportExpression: visit,
    CallExpression: visit,
  };
};
