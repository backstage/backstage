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

import { isBuiltin } from 'node:module';
import { OutputPlugin, PluginContext } from 'rollup';

type ProgramNode = ReturnType<PluginContext['parse']>;

const IDENTIFIER_PATTERN = /^[A-Za-z_$][\w$]*$/;

function isPackageImport(source: string) {
  return (
    !source.startsWith('.') &&
    !source.startsWith('/') &&
    !source.includes(':') &&
    !isBuiltin(source)
  );
}

// Import and export names are either identifiers or string literals
function getName(node: { type: string; name?: string; value?: unknown }) {
  return node.type === 'Identifier' ? String(node.name) : String(node.value);
}

// The Rollup parser adds source locations to all nodes, but the types only
// include them for the root node.
function getLocation(node: object) {
  const { start, end } = node as { start: number; end: number };
  return { start, end };
}

function formatExportName(name: string) {
  return IDENTIFIER_PATTERN.test(name) ? name : JSON.stringify(name);
}

// Reads a named export, falling back to a property of the default export.
// When Node.js imports a CommonJS module it only provides the named exports
// that it can detect, while the default export is always `module.exports`.
function readExport(namespace: string, name: string) {
  const key = JSON.stringify(name);
  return `(${key} in ${namespace} ? ${namespace}[${key}] : ${namespace}.default?.[${key}])`;
}

/**
 * Rewrites named imports and re-exports of packages in ES module output so
 * that they also work when the imported package is CommonJS.
 *
 * Node.js only provides the named exports of CommonJS modules that it can
 * detect by statically analyzing the source, which means that imports like
 * `import { get } from 'lodash'` fail at runtime. This plugin rewrites those
 * imports to read from the module namespace, with a fallback to the default
 * export. For example:
 *
 * ```js
 * import { get } from 'lodash';
 * // becomes
 * import * as __cjsInterop0 from 'lodash'; const get = ("get" in __cjsInterop0 ? ...);
 * ```
 *
 * The replacement is kept on the same lines as the original statement, which
 * keeps existing source maps valid.
 *
 * @internal
 */
export function cjsNamedImports(): OutputPlugin {
  return {
    name: 'backstage-cjs-named-imports',
    renderChunk(code, _chunk, options) {
      if (options.format !== 'es') {
        return null;
      }

      let counter = 0;
      const createNamespaceName = () => {
        let name;
        do {
          name = `__cjsInterop${counter++}`;
        } while (code.includes(name));
        return name;
      };

      const replacements = new Array<{
        start: number;
        end: number;
        text: string;
      }>();

      const ast: ProgramNode = this.parse(code);
      for (const node of ast.body) {
        if (node.type === 'ImportDeclaration') {
          const source = String(node.source.value);
          if (!isPackageImport(source) || node.attributes?.length) {
            continue;
          }
          const namedSpecifiers = node.specifiers.flatMap(s =>
            s.type === 'ImportSpecifier' ? [s] : [],
          );
          if (namedSpecifiers.length === 0) {
            continue;
          }
          const defaultSpecifier = node.specifiers.find(
            s => s.type === 'ImportDefaultSpecifier',
          );

          const namespace = createNamespaceName();
          const bindings = defaultSpecifier
            ? `${defaultSpecifier.local.name}, * as ${namespace}`
            : `* as ${namespace}`;
          const declarations = namedSpecifiers.map(
            s =>
              `${s.local.name} = ${readExport(namespace, getName(s.imported))}`,
          );

          replacements.push({
            ...getLocation(node),
            text: `import ${bindings} from ${JSON.stringify(
              source,
            )}; const ${declarations.join(', ')};`,
          });
        } else if (node.type === 'ExportNamedDeclaration' && node.source) {
          const source = String(node.source.value);
          if (
            !isPackageImport(source) ||
            node.attributes?.length ||
            node.specifiers.length === 0
          ) {
            continue;
          }

          const namespace = createNamespaceName();
          const declarations = node.specifiers.map(
            (s, index) =>
              `${namespace}_${index} = ${readExport(
                namespace,
                getName(s.local),
              )}`,
          );
          const exports = node.specifiers.map(
            (s, index) =>
              `${namespace}_${index} as ${formatExportName(
                getName(s.exported),
              )}`,
          );

          replacements.push({
            ...getLocation(node),
            text: `import * as ${namespace} from ${JSON.stringify(
              source,
            )}; const ${declarations.join(', ')}; export { ${exports.join(
              ', ',
            )} };`,
          });
        }
      }

      if (replacements.length === 0) {
        return null;
      }

      let output = code;
      for (const { start, end, text } of replacements.reverse()) {
        const original = output.slice(start, end);
        const lineBreaks = original.split('\n').length - 1;
        output = `${output.slice(0, start)}${text}${'\n'.repeat(
          lineBreaks,
        )}${output.slice(end)}`;
      }
      return { code: output, map: null };
    },
  };
}
