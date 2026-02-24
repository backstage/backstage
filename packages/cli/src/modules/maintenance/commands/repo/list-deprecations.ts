/*
 * Copyright 2020 The Backstage Authors
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

import chalk from 'chalk';
import { ESLint } from 'eslint';
import { OptionValues } from 'commander';
import { relative as relativePath } from 'node:path';
import { PackageGraph } from '@backstage/cli-node';
import { targetPaths } from '@backstage/cli-common';
import * as ts from 'typescript';

// We import the deprecation plugin rule since we need to inject our custom context.report
const deprecationPlugin = require('eslint-plugin-deprecation');

export async function command(opts: OptionValues) {
  const packages = await PackageGraph.listTargetPackages();

  // Create lookup for quickly finding which package a file belongs to
  // Sort by length to match the most specific package dir first
  const sortedPackages = [...packages].sort(
    (a, b) => b.dir.length - a.dir.length,
  );
  const getPackageDir = (filePath: string) => {
    // Basic backslash to forward slash normalization
    const normalizedPath = filePath.replace(/\\/g, '/');
    for (const pkg of sortedPackages) {
      const pkgNormalized = pkg.dir.replace(/\\/g, '/');
      if (
        normalizedPath.startsWith(`${pkgNormalized}/`) ||
        normalizedPath === pkgNormalized
      ) {
        return pkg.dir;
      }
    }
    return undefined;
  };

  const deprecationFilterPlugin: ESLint.Plugin = {
    rules: {
      'filter-deprecation': {
        meta: deprecationPlugin.rules.deprecation.meta,
        create(context: any) {
          const customContext = Object.create(context);
          Object.defineProperty(customContext, 'report', {
            value: function (descriptor: any) {
              const services = context.parserServices;
              if (services?.program) {
                const tc = services.program.getTypeChecker();
                const tsNode = services.esTreeNodeToTSNodeMap.get(
                  descriptor.node,
                );

                if (tsNode) {
                  let symbol = tc.getSymbolAtLocation(tsNode);
                  if (symbol && (symbol.flags & ts.SymbolFlags.Alias) !== 0) {
                    symbol = tc.getAliasedSymbol(symbol);
                  }

                  let declFile: string | undefined = undefined;
                  if (symbol?.valueDeclaration) {
                    declFile = symbol.valueDeclaration.getSourceFile().fileName;
                  } else if (
                    symbol?.declarations &&
                    symbol.declarations.length > 0
                  ) {
                    declFile = symbol.declarations[0].getSourceFile().fileName;
                  }

                  if (declFile) {
                    // Only list deprecations from imported code (outside the current package)
                    const sourceFile = context.getPhysicalFilename
                      ? context.getPhysicalFilename()
                      : context.getFilename();

                    const sourcePkg = getPackageDir(sourceFile);
                    const declPkg = getPackageDir(declFile);

                    // If they belong to the same package, it's local code - do not report
                    if (sourcePkg && declPkg && sourcePkg === declPkg) {
                      return;
                    }
                  }
                }
              }
              context.report(descriptor);
            },
            writable: true,
            configurable: true,
          });

          return deprecationPlugin.rules.deprecation.create(customContext);
        },
      },
    },
  };

  const eslint = new ESLint({
    cwd: targetPaths.dir,
    overrideConfig: {
      plugins: ['deprecation-filter'],
      rules: {
        'deprecation-filter/filter-deprecation': 'error',
      },
      parserOptions: {
        project: [targetPaths.resolveRoot('tsconfig.json')],
      },
    },
    plugins: {
      'deprecation-filter': deprecationFilterPlugin,
    },
    extensions: ['jsx', 'ts', 'tsx', 'mjs', 'cjs'],
  });

  const { stderr } = process;
  if (stderr.isTTY) {
    stderr.write('Initializing TypeScript...');
  }

  const deprecations = [];
  for (const [index, pkg] of packages.entries()) {
    const results = await eslint.lintFiles(pkg.dir);
    for (const result of results) {
      for (const message of result.messages) {
        if (message.ruleId !== 'deprecation-filter/filter-deprecation') {
          continue;
        }

        const path = relativePath(targetPaths.rootDir, result.filePath);
        deprecations.push({
          path,
          message: message.message,
          line: message.line,
          column: message.column,
        });
      }
    }

    if (stderr.isTTY) {
      stderr.clearLine(0);
      stderr.cursorTo(0);
      stderr.write(`Scanning packages ${index + 1}/${packages.length}`);
    }
  }

  if (stderr.isTTY) {
    stderr.clearLine(0);
    stderr.cursorTo(0);
  }

  if (opts.json) {
    console.log(JSON.stringify(deprecations, null, 2));
  } else {
    for (const d of deprecations) {
      const location = `${d.path}:${d.line}:${d.column}`;
      const wrappedMessage = d.message.replace(/\r?\n\s*/g, ' ');
      console.log(`${location} - ${chalk.yellow(wrappedMessage)}`);
    }
  }

  if (deprecations.length > 0) {
    process.exit(1);
  }
}
