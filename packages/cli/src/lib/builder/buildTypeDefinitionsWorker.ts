/*
 * Copyright 2022 The Backstage Authors
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
import type ts from 'typescript';

/**
 * NOTE: This is a worker thread function that is stringified and executed
 *       within a `worker_threads.Worker`. Everything in this function must
 *       be self-contained.
 *       Using TypeScript is fine as it is transpiled before being stringified.
 */
export async function buildTypeDefinitionsWorker(
  workerData: any,
  sendMessage: (message: any) => void,
) {
  try {
    require('@microsoft/api-extractor');
  } catch (error) {
    throw new Error(
      'Failed to resolve @microsoft/api-extractor, it must best installed ' +
        'as a dependency of your project in order to use experimental type builds',
    );
  }

  const { dirname, join } = require('path');
  const { entryPoints, workerConfigs, typescriptCompilerFolder } = workerData;

  const { readFileSync, writeFileSync } = require('fs');

  const apiExtractor = require('@microsoft/api-extractor');
  const { Extractor, ExtractorConfig, CompilerState } = apiExtractor;

  const ts: typeof import('typescript') = require('typescript');
  const {
    transform: transformImportPathRewrite,
  } = require('ts-transform-import-path-rewrite');

  /**
   * All of this monkey patching below is because MUI has these bare package.json file as a method
   * for making TypeScript accept imports like `@material-ui/core/Button`, and improve tree-shaking
   * by declaring them side effect free.
   *
   * The package.json lookup logic in api-extractor really doesn't like that though, as it enforces
   * that the 'name' field exists in all package.json files that it discovers. This below is just
   * making sure that we ignore those file package.json files instead of crashing.
   */
  const {
    PackageJsonLookup,
    // eslint-disable-next-line import/no-extraneous-dependencies
  } = require('@rushstack/node-core-library/lib/PackageJsonLookup');

  const old = PackageJsonLookup.prototype.tryGetPackageJsonFilePathFor;
  PackageJsonLookup.prototype.tryGetPackageJsonFilePathFor =
    function tryGetPackageJsonFilePathForPatch(path: string) {
      if (
        path.includes('@material-ui') &&
        !dirname(path).endsWith('@material-ui')
      ) {
        return undefined;
      }
      return old.call(this, path);
    };

  const transformSourceFile = (
    fileName: string,
    transformer: ts.TransformerFactory<ts.SourceFile>,
  ) => {
    const sourceFile = ts.createSourceFile(
      fileName,
      readFileSync(fileName, 'utf-8'),
      ts.ScriptTarget.ES2019,
      /* setParentNodes */ true,
    );

    const {
      transformed: [transformedSourceFile],
    } = ts.transform(sourceFile, [transformer]);

    writeFileSync(
      fileName,
      ts
        .createPrinter({ newLine: ts.NewLineKind.LineFeed })
        .printFile(transformedSourceFile),
    );
  };

  const removeUnusedImports = (definitionFile: string) => {
    const findUsedIdentifiers = (
      sf: ts.SourceFile,
      ctx: ts.TransformationContext,
    ) => {
      const result = new Set<string>();
      const visitor = (node: ts.Node): ts.VisitResult<ts.Node> => {
        if (ts.isIdentifier(node)) {
          result.add(node.getText());
        }

        if (!ts.isImportDeclaration(node)) {
          return ts.visitEachChild(node, visitor, ctx);
        }

        return undefined;
      };

      ts.visitNode(sf, visitor);
      return result;
    };

    const importIdentifiers = (declaration: ts.ImportDeclaration) => {
      if (!declaration.importClause) {
        return [];
      }

      const result = [];

      if (declaration.importClause.name) {
        result.push(declaration.importClause.name.getText());
      }

      if (declaration.importClause.namedBindings) {
        if (ts.isNamespaceImport(declaration.importClause.namedBindings)) {
          result.push(declaration.importClause.namedBindings.name.getText());
        } else {
          result.push(
            ...declaration.importClause.namedBindings.elements.map(el =>
              el.name.getText(),
            ),
          );
        }
      }

      return result;
    };

    const filterName = (
      name: ts.Identifier | undefined,
      usedIdentifiers: Set<string>,
    ) => {
      if (!name || usedIdentifiers.has(name.getText())) {
        return name;
      }

      return undefined;
    };

    const filterNamedBindings = (
      namedBindings: ts.NamedImportBindings | undefined,
      usedIdentifiers: Set<string>,
      ctx: ts.TransformationContext,
    ) => {
      if (!namedBindings) {
        return namedBindings;
      }

      if (ts.isNamespaceImport(namedBindings)) {
        return usedIdentifiers.has(namedBindings.name.getText())
          ? namedBindings
          : undefined;
      }

      return ctx.factory.createNamedImports(
        namedBindings.elements.filter(el =>
          usedIdentifiers.has(el.name.getText()),
        ),
      );
    };

    const stripImports = (
      sf: ts.SourceFile,
      usedIdentifiers: Set<string>,
      ctx: ts.TransformationContext,
    ) => {
      const visitor = (node: ts.Node): ts.VisitResult<ts.Node> => {
        if (ts.isImportDeclaration(node)) {
          if (
            !importIdentifiers(node).some(identifier =>
              usedIdentifiers.has(identifier),
            )
          ) {
            return undefined;
          }
        }

        if (ts.isImportClause(node)) {
          return ctx.factory.updateImportClause(
            node,
            node.isTypeOnly,
            filterName(node.name, usedIdentifiers),
            filterNamedBindings(node.namedBindings, usedIdentifiers, ctx),
          );
        }

        return ts.visitEachChild(node, visitor, ctx);
      };

      return ts.visitNode(sf, visitor);
    };

    transformSourceFile(
      definitionFile,
      (ctx: ts.TransformationContext): ts.Transformer<ts.SourceFile> => {
        return (sf: ts.SourceFile) => {
          const usedIdentifiers = findUsedIdentifiers(sf, ctx);

          return stripImports(sf, usedIdentifiers, ctx);
        };
      },
    );
  };

  const shouldAddSuffix = (packageName: string) => {
    if (!/@backstage\/[a-z-]+/i.test(packageName)) {
      return false;
    }

    const pkg = require(join(packageName, 'package.json'));

    // Suffix any package which includes "alpha" in the package
    // output, on the assumption that this means the package is
    // building an alpha type definition file and trimming alpha
    // types from the main file.
    return !!pkg.files.includes('alpha');
  };

  const transformBackstageImports = (definitionFile: string, suffix: string) =>
    transformSourceFile(
      definitionFile,
      transformImportPathRewrite({
        rewrite: (importPath: string) =>
          shouldAddSuffix(importPath) ? `${importPath}/${suffix}` : importPath,
      }),
    );

  let compilerState;
  for (const { extractorOptions, targetTypesDir } of workerConfigs) {
    const extractorConfig = ExtractorConfig.prepare(extractorOptions);

    if (!compilerState) {
      compilerState = CompilerState.create(extractorConfig, {
        additionalEntryPoints: entryPoints,
      });
    }

    const extractorResult = Extractor.invoke(extractorConfig, {
      compilerState,
      localBuild: false,
      typescriptCompilerFolder,
      showVerboseMessages: false,
      showDiagnostics: false,
      messageCallback: (message: any) => {
        message.handled = true;
        sendMessage({ message, targetTypesDir });
      },
    });

    removeUnusedImports(extractorConfig.publicTrimmedFilePath);
    transformBackstageImports(extractorConfig.untrimmedFilePath, 'alpha');
    // We don't currently package files into a beta directory, so the best thing
    // we can do for now is import from /alpha in beta type definition files.
    transformBackstageImports(extractorConfig.betaTrimmedFilePath, 'alpha');

    if (!extractorResult.succeeded) {
      throw new Error(
        `Type definition build completed with ${extractorResult.errorCount} errors` +
          ` and ${extractorResult.warningCount} warnings`,
      );
    }
  }
}
